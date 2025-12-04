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
    const phase = searchParams.get("phase")
    const excludePhase = searchParams.get("excludePhase")

    let query = supabase
      .from("projects")
      .select("*", { count: "exact" })
      .eq("archived", archived)
      .order("name", { ascending: true })
      .range(offset, offset + limit - 1)

    // Add phase filter if provided (case-insensitive)
    if (phase) {
      query = query.ilike("phase", phase)
    }

    // Exclude specific phase if provided (case-insensitive)
    if (excludePhase) {
      query = query.not("phase", "ilike", excludePhase)
    }

    // Add search filter if provided
    if (search) {
      query = query.or(`name.ilike.%${search}%,job_number.ilike.%${search}%`)
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
