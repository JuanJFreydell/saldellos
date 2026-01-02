import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    // Get the session to verify user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use email from session (more secure - no need for query parameter)
    const email = session.user.email;

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    // Fetch user from database
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      console.error("Error fetching user:", error);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user account is active
    if (data.status !== "active") {
      return NextResponse.json(
        { error: "Account is not active" },
        { status: 403 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in user API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

