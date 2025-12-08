import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Pagination params
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "100")
    const offset = (page - 1) * limit

    // Filter params
    const archived = searchParams.get("archived") === "true"
    const search = searchParams.get("search")
    const state = searchParams.get("state")
    const excludeState = searchParams.get("excludeState")

    let query = supabase
      .from("projects")
      .select("*", { count: "exact" })
      .order("name", { ascending: true })
      .range(offset, offset + limit - 1)

    // Add state filter if provided (case-insensitive)
    if (state) {
      query = query.ilike("state", state)
    }

    // Exclude specific state if provided (case-insensitive)
    if (excludeState) {
      query = query.not("state", "ilike", excludeState)
    }

    // Add search filter if provided
    if (search) {
      query = query.or(`name.ilike.%${search}%,"job number".ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if (error) {
      console.error("Error fetching projects:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data,
      meta: {
        page,
        limit,
        total: count,
        totalPages: count ? Math.ceil(count / limit) : 0,
      },
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("projects")
      .insert(body)
      .select()
      .single()

    if (error) {
      console.error("Error creating project:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
