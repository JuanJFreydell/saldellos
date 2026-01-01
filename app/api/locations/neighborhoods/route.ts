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

    // Get city_id from query parameters
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get("city_id");

    if (!cityId) {
      return NextResponse.json(
        { error: "city_id parameter is required" },
        { status: 400 }
      );
    }

    // Fetch neighborhoods for the specified city
    // Note: city_id in listing_neighborhoods is TEXT, so we compare as string
    const { data: neighborhoods, error: neighborhoodsError } = await adminClient
      .from("listing_neighborhoods")
      .select("neighborhood_id, neighborhood_name")
      .eq("city_id", cityId.toString())
      .order("neighborhood_name", { ascending: true });

    if (neighborhoodsError) {
      console.error("Error fetching neighborhoods:", neighborhoodsError);
      return NextResponse.json(
        { error: "Failed to fetch neighborhoods" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        neighborhoods: neighborhoods || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in getNeighborhoods endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

