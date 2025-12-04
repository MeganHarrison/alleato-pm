import type { paths } from '@/lib/management-api-schema'
import { listTablesSql } from '@/lib/pg-meta'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import type { APIError, DatabaseTable, DatabaseColumn, DatabaseQueryResponse } from '@/app/api/types'
import createClient from 'openapi-fetch'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const client = createClient<paths>({
  baseUrl: 'https://api.supabase.com',
  headers: {
    Authorization: `Bearer ${process.env.SUPABASE_MANAGEMENT_API_TOKEN}`,
  },
})

// Function to get database schema
async function getDbSchema(projectRef: string) {
  const token = process.env.SUPABASE_MANAGEMENT_API_TOKEN
  if (!token) {
    throw new Error('Supabase Management API token is not configured.')
  }

  const sql = listTablesSql()

  const { data, error } = await client.POST('/v1/projects/{ref}/database/query', {
    params: {
      path: {
        ref: projectRef,
      },
    },
    body: {
      query: sql,
      read_only: true,
    },
  })

  if (error) {
    throw error
  }

  return (data || { result: [] }) as DatabaseQueryResponse
}

function formatSchemaForPrompt(schema: DatabaseQueryResponse) {
  let schemaString = ''
  if (schema?.result && Array.isArray(schema.result)) {
    schema.result.forEach((table: DatabaseTable) => {
      const columnInfo = table.columns.map((c: DatabaseColumn) => `${c.name} (${c.data_type})`)
      schemaString += `Table "${table.name}" has columns: ${columnInfo.join(', ')}.\n`
    })
  }
  return schemaString
}

export async function POST(request: Request) {
  try {
    const { prompt, projectRef } = await request.json()

    if (!prompt) {
      return NextResponse.json({ message: 'Prompt is required.' }, { status: 400 })
    }
    if (!projectRef) {
      return NextResponse.json({ message: 'projectRef is required.' }, { status: 400 })
    }

    // Implement your permission check here (e.g. check if the user is a member of the project)
    // In this example, everyone can access all projects
    const userHasPermissionForProject = Boolean(projectRef)

    if (!userHasPermissionForProject) {
      return NextResponse.json(
        { message: 'You do not have permission to access this project.' },
        { status: 403 }
      )
    }

    // 1. Get database schema
    const schema = await getDbSchema(projectRef)
    const formattedSchema = formatSchemaForPrompt(schema)

    // 2. Create a prompt for OpenAI
    const systemPrompt = `You are an expert SQL assistant. Given the following database schema, write a SQL query that answers the user's question. Return only the SQL query, do not include any explanations or markdown.\n\nSchema:\n${formattedSchema}`

    // 3. Call OpenAI to generate SQL using responses.create (plain text output)
    const response = await openai.responses.create({
      model: 'gpt-4.1',
      instructions: systemPrompt, // Use systemPrompt as instructions
      input: prompt, // User's question
    })

    const sql = response.output_text

    if (!sql) {
      return NextResponse.json(
        { message: 'Could not generate SQL from the prompt.' },
        { status: 500 }
      )
    }

    // 4. Return the generated SQL
    return NextResponse.json({ sql })
  } catch (error) {
    console.error('AI SQL generation error:', error)
    if (error instanceof Error) {
      const apiError = error as APIError
      const errorMessage = apiError.message || 'An unexpected error occurred.'
      const status = apiError.response?.status || 500
      return NextResponse.json({ message: errorMessage }, { status })
    }
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 })
  }
}
