import { db, auth } from "./firebase"
import { doc, setDoc, getDoc } from "firebase/firestore"

/**
 * Test Firebase connectivity and permissions
 */
export async function testFirebaseConnection() {
  const results = {
    auth: false,
    firestore: false,
    userRepositories: false,
    error: null as string | null,
    details: {} as any,
  }

  try {
    // Test 1: Check if user is authenticated
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error("User not authenticated")
    }
    results.auth = true
    results.details.userId = currentUser.uid
    results.details.userEmail = currentUser.email

    console.log("✅ Firebase Auth: User authenticated", currentUser.uid)

    // Test 2: Test basic Firestore read
    try {
      const testDoc = doc(db, "test", "connection")
      await getDoc(testDoc)
      results.firestore = true
      console.log("✅ Firestore: Basic read access works")
    } catch (error: any) {
      console.error("❌ Firestore: Basic read failed", error)
      throw new Error(`Firestore read failed: ${error.message}`)
    }

    // Test 3: Test user_repositories collection access
    try {
      const userReposRef = doc(db, "user_repositories", currentUser.uid)

      // Try to read first
      const docSnap = await getDoc(userReposRef)
      console.log("✅ User Repositories: Read access works", docSnap.exists())

      // Try to write
      await setDoc(userReposRef, {
        userId: currentUser.uid,
        repositories: [],
        updated_at: new Date().toISOString(),
        test: true,
      })

      results.userRepositories = true
      console.log("✅ User Repositories: Write access works")
    } catch (error: any) {
      console.error("❌ User Repositories: Access failed", error)
      throw new Error(`User repositories access failed: ${error.code} - ${error.message}`)
    }
  } catch (error: any) {
    results.error = error.message
    results.details.errorCode = error.code
    results.details.errorMessage = error.message
    console.error("❌ Firebase test failed:", error)
  }

  return results
}

/**
 * Get detailed Firebase error information
 */
export function getFirebaseErrorDetails(error: any) {
  const errorInfo = {
    code: error.code || "unknown",
    message: error.message || "Unknown error",
    details: "",
    solution: "",
  }

  switch (error.code) {
    case "permission-denied":
      errorInfo.details = "Firestore security rules are blocking this operation"
      errorInfo.solution = "Check Firestore security rules for user_repositories collection"
      break
    case "unauthenticated":
      errorInfo.details = "User is not properly authenticated"
      errorInfo.solution = "Ensure user is signed in before accessing Firestore"
      break
    case "unavailable":
      errorInfo.details = "Firestore service is temporarily unavailable"
      errorInfo.solution = "Try again in a few moments"
      break
    case "failed-precondition":
      errorInfo.details = "Firestore operation failed due to precondition"
      errorInfo.solution = "Check document structure and field types"
      break
    default:
      errorInfo.details = "Unknown Firebase error"
      errorInfo.solution = "Check Firebase console and network connection"
  }

  return errorInfo
}
