import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Extract email from LemonSqueezy webhook payload
    const email =
      body?.data?.attributes?.user_email || body?.meta?.custom_data?.email;
    if (!email) {
      return NextResponse.json(
        { error: "No email found in webhook payload" },
        { status: 400 }
      );
    }
    // Find user by email
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Update isPaid field for all matching users
    for (const userDoc of querySnapshot.docs) {
      await updateDoc(doc(db, "users", userDoc.id), { isPaid: true });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("LemonSqueezy webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
