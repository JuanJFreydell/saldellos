import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const adminClient = supabaseAdmin;

    // Fetch all categories
    const { data: categories, error: categoriesError } = await adminClient
      .from("listing_categories")
      .select("category_id, category_name")
      .order("category_name", { ascending: true });

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError);
      return NextResponse.json(
        { error: "Failed to fetch categories" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        categories: categories || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in getCategories endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

