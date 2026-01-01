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

    // Fetch all countries
    const { data: countries, error: countriesError } = await adminClient
      .from("countries")
      .select("country_id, country_name")
      .order("country_name", { ascending: true });

    if (countriesError) {
      console.error("Error fetching countries:", countriesError);
      return NextResponse.json(
        { error: "Failed to fetch countries" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        countries: countries || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in getCountries endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

