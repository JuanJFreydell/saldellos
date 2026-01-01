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

    // Get category_id from query parameters (optional, defaults to "para la venta")
    const { searchParams } = new URL(request.url);
    let categoryId = searchParams.get("category_id");

    // If no category_id provided, fetch "para la venta" category
    if (!categoryId) {
      const { data: categoryData, error: categoryError } = await adminClient
        .from("listing_categories")
        .select("category_id")
        .ilike("category_name", "para la venta")
        .single();

      if (categoryError || !categoryData) {
        return NextResponse.json(
          { error: "Category 'para la venta' not found" },
          { status: 404 }
        );
      }

      categoryId = categoryData.category_id;
    }

    // Fetch subcategories for the specified category
    const { data: subcategories, error: subcategoriesError } = await adminClient
      .from("listing_subcategories")
      .select("subcategory_id, subcategory_name")
      .eq("category_id", categoryId)
      .order("subcategory_name", { ascending: true });

    if (subcategoriesError) {
      console.error("Error fetching subcategories:", subcategoriesError);
      return NextResponse.json(
        { error: "Failed to fetch subcategories" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        subcategories: subcategories || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in getSubcategories endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

