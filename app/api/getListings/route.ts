import { NextResponse } from "next/server";

// Get listings by coordinates and radius, optional query parameter.
export async function GET(request: Request) {
  try {
    // TODO: Implement get listings by coordinates and radius
    return NextResponse.json(
      { message: "Not implemented yet" },
      { status: 501 }
    );
  } catch (error) {
    console.error("Error in getListings endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
