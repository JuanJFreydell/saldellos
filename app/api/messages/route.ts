import { NextResponse } from "next/server";

//---- GET MESSAGES ----
// gets conversationIDs by user
// gets messages by conversation ID
// Returns a JSON object of conversations{messages{}}

export async function GET(request: Request) {
  try {
    // TODO: Implement get messages functionality
    return NextResponse.json(
      { message: "Not implemented yet" },
      { status: 501 }
    );
  } catch (error) {
    console.error("Error in getMessages endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

//---- POST MESSAGES ----
// takes in a user and a listing.id as parameters.
// checks if the listing is active
// gets the user_id in the owner field of the listing
// checks if there are conversations between the user sending the message and the person listing
// the product that includes that lisitng_id,
// if so then it posts the message using that conversation_id,
// else creates a new conversation_id, and posts the message using that new conversation_id

export async function POST(request: Request) {
  try {
    // TODO: Implement post message functionality
    return NextResponse.json(
      { message: "Not implemented yet" },
      { status: 501 }
    );
  } catch (error) {
    console.error("Error in postMessage endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
