import { NextResponse } from "next/server";
import { getListingById } from "@/lib/getListingById";

export async function GET(request: Request) {
  try {
    // Get listing_id from query parameters
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get("listing_id");

    if (!listingId) {
      return NextResponse.json(
        { error: "listing_id parameter is required" },
        { status: 400 }
      );
    }

    const listing = await getListingById(listingId);

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(listing, { status: 200 });
  } catch (error) {
    console.error("Error in getListingById endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
