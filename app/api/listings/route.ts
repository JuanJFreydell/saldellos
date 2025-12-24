import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Haversine formula to calculate distance between two coordinates in miles
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function POST(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    // Get parameters from request body
    const body = await request.json();
    const coordinates = body.coordinates;
    const radius = body.radius;

    // Validate required parameters
    if (!coordinates) {
      return NextResponse.json(
        { error: "coordinates parameter is required (format: lat,lng)" },
        { status: 400 }
      );
    }

    if (!radius) {
      return NextResponse.json(
        { error: "radius parameter is required (in miles)" },
        { status: 400 }
      );
    }

    // Parse coordinates
    const coordParts = coordinates.split(",");
    if (coordParts.length !== 2) {
      return NextResponse.json(
        { error: "Invalid coordinates format. Use: lat,lng" },
        { status: 400 }
      );
    }

    const centerLat = parseFloat(coordParts[0].trim());
    const centerLng = parseFloat(coordParts[1].trim());

    if (isNaN(centerLat) || isNaN(centerLng)) {
      return NextResponse.json(
        { error: "Invalid coordinates. Must be numbers." },
        { status: 400 }
      );
    }

    // Validate latitude and longitude ranges
    if (centerLat < -90 || centerLat > 90) {
      return NextResponse.json(
        { error: "Latitude must be between -90 and 90" },
        { status: 400 }
      );
    }

    if (centerLng < -180 || centerLng > 180) {
      return NextResponse.json(
        { error: "Longitude must be between -180 and 180" },
        { status: 400 }
      );
    }

    const radiusMiles = parseFloat(radius);
    if (isNaN(radiusMiles) || radiusMiles <= 0) {
      return NextResponse.json(
        { error: "Radius must be a positive number" },
        { status: 400 }
      );
    }

    // Fetch all listings metadata
    // Note: We fetch all and filter in code since Supabase doesn't have built-in geospatial functions
    // For production, consider using PostGIS extension in Supabase
    const { data: allListings, error: listingsError } = await supabaseAdmin
      .from("listings_meta_data")
      .select("*")
      .eq("status", "active"); // Only return active listings

    if (listingsError) {
      console.error("Error fetching listings:", listingsError);
      return NextResponse.json(
        { error: "Failed to fetch listings" },
        { status: 500 }
      );
    }

    if (!allListings || allListings.length === 0) {
      return NextResponse.json({ listings: [] }, { status: 200 });
    }

    // Filter listings within radius
    const listingsWithinRadius = allListings.filter((listing) => {
      if (!listing.coordinates) return false;

      const listingCoords = listing.coordinates.split(",");
      if (listingCoords.length !== 2) return false;

      const listingLat = parseFloat(listingCoords[0].trim());
      const listingLng = parseFloat(listingCoords[1].trim());

      if (isNaN(listingLat) || isNaN(listingLng)) return false;

      const distance = calculateDistance(
        centerLat,
        centerLng,
        listingLat,
        listingLng
      );

      return distance <= radiusMiles;
    });

    return NextResponse.json(
      { listings: listingsWithinRadius },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in getListings endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
