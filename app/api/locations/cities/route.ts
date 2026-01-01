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

    // Get country_id from query parameters
    const { searchParams } = new URL(request.url);
    const countryId = searchParams.get("country_id");

    if (!countryId) {
      return NextResponse.json(
        { error: "country_id parameter is required" },
        { status: 400 }
      );
    }

    // Fetch cities for the specified country
    // Note: country_id in listing_cities is TEXT, so we compare as string
    const { data: cities, error: citiesError } = await adminClient
      .from("listing_cities")
      .select("city_id, city_name")
      .eq("country_id", countryId.toString())
      .order("city_name", { ascending: true });

    if (citiesError) {
      console.error("Error fetching cities:", citiesError);
      return NextResponse.json(
        { error: "Failed to fetch cities" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        cities: cities || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in getCities endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

