import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { authOptions } from "../auth/[...nextauth]/route";

//---- GET MESSAGES ----
// gets conversationIDs by user
// gets messages by conversation ID
// Returns a JSON object of conversations{messages{}}

export async function GET(request: Request) {
  try {
    // 1. Authenticate user
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    // 2. Get user from database
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", session.user.email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.status !== "active") {
      return NextResponse.json(
        { error: "Account is not active" },
        { status: 403 }
      );
    }

    const userId = user.user_id.toString();

    // 3. Get all conversations where user is a participant
    const { data: conversations, error: conversationsError } = await supabaseAdmin
      .from("conversations")
      .select("*")
      .or(`participant_1.eq.${userId},participant_2.eq.${userId}`);

    if (conversationsError) {
      console.error("Error fetching conversations:", conversationsError);
      return NextResponse.json(
        { error: "Failed to fetch conversations" },
        { status: 500 }
      );
    }

    if (!conversations || conversations.length === 0) {
      return NextResponse.json({ conversations: [] }, { status: 200 });
    }

    // 4. For each conversation, get participant info, listing metadata, and messages
    // TypeScript: supabaseAdmin is guaranteed to be non-null here due to early return above
    const adminClient = supabaseAdmin!;
    
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conversation) => {
        // Get both participants' user_ids
        const participant1Id = conversation.participant_1;
        const participant2Id = conversation.participant_2;
        const otherParticipantId =
          participant1Id === userId ? participant2Id : participant1Id;

        // Get current user's info
        const currentUserInfo = {
          user_id: user.user_id,
          first_names: user.first_names,
          last_names: user.last_names,
        };

        // Get other participant's user info
        let otherParticipant = null;
        if (otherParticipantId) {
          const { data: participantData } = await adminClient
            .from("users")
            .select("user_id, first_names, last_names")
            .eq("user_id", otherParticipantId)
            .single();
          otherParticipant = participantData
            ? {
                user_id: participantData.user_id,
                first_names: participantData.first_names,
                last_names: participantData.last_names,
              }
            : null;
        }

        // Get listing metadata
        let listingMetadata = null;
        if (conversation.listing_id) {
          const { data: metadata } = await adminClient
            .from("listings_meta_data")
            .select("*")
            .eq("listing_id", conversation.listing_id)
            .single();
          listingMetadata = metadata;
        }

        // Get all messages for this conversation, ordered by time_sent
        const { data: messages, error: messagesError } = await adminClient
          .from("messages")
          .select("*")
          .eq("chat_id", conversation.conversation_id.toString())
          .order("time_sent", { ascending: true });

        if (messagesError) {
          console.error("Error fetching messages:", messagesError);
        }

        // Number messages by creation time (1, 2, 3, ...)
        const numberedMessages = (messages || []).map((message, index) => ({
          ...message,
          message_number: index + 1,
        }));

        return {
          conversation_id: conversation.conversation_id,
          listing_id: conversation.listing_id,
          participants: {
            current_user: currentUserInfo,
            other_participant: otherParticipant,
          },
          listing_metadata: listingMetadata,
          messages: numberedMessages,
        };
      })
    );

    return NextResponse.json(
      { conversations: conversationsWithDetails },
      { status: 200 }
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
