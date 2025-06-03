import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  linkWithPopup,
  GithubAuthProvider,
  onAuthStateChanged,
  type User,
  type UserCredential,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

// Types
export interface AuthUser {
  id: string;
  email: string | null;
  email_confirmed_at: string | null;
  display_name?: string | null;
  github_username?: string | null;
  github_avatar?: string | null;
  isPaid?: boolean;
}

export interface AuthResult {
  user: AuthUser | null;
  error: { message: string; code?: string } | null;
}

// Helper function to convert Firebase User to AuthUser
function convertFirebaseUser(
  firebaseUser: User,
  firestoreData?: any
): AuthUser {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    email_confirmed_at: firebaseUser.emailVerified
      ? new Date().toISOString()
      : null,
    display_name: firebaseUser.displayName,
    github_username: firestoreData?.github_username,
    github_avatar: firestoreData?.github_avatar,
    isPaid: firestoreData?.isPaid ?? false,
  };
}

// Helper function to handle errors
function handleAuthError(error: any): { message: string; code?: string } {
  console.error("Auth error:", error);

  const errorMessages: Record<string, string> = {
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password must be at least 6 characters long.",
    "auth/user-not-found": "No account found with this email address.",
    "auth/wrong-password": "Incorrect password.",
    "auth/too-many-requests":
      "Too many failed attempts. Please try again later.",
    "auth/network-request-failed":
      "Network error. Please check your connection.",
    "auth/popup-closed-by-user": "Sign-in popup was closed.",
    "auth/popup-blocked": "Sign-in popup was blocked by your browser.",
    "auth/account-exists-with-different-credential":
      "An account already exists with this email but different sign-in method.",
    "auth/credential-already-in-use":
      "This GitHub account is already linked to another user.",
  };

  return {
    message:
      errorMessages[error.code] ||
      error.message ||
      "An unexpected error occurred.",
    code: error.code,
  };
}

// Sign up with email and password
export async function signUpWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    console.log("🔥 Starting email sign up...");

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("✅ User created successfully:", user.uid);

    // Send email verification
    try {
      await sendEmailVerification(user);
      console.log("📧 Verification email sent");
    } catch (emailError) {
      console.warn("⚠️ Failed to send verification email:", emailError);
    }

    // Create user profile in Firestore
    try {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        email_verified: user.emailVerified,
        display_name: user.displayName,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      console.log("✅ User profile created in Firestore");
    } catch (firestoreError) {
      console.warn("⚠️ Failed to create user profile:", firestoreError);
    }

    return {
      user: convertFirebaseUser(user),
      error: null,
    };
  } catch (error: any) {
    return {
      user: null,
      error: handleAuthError(error),
    };
  }
}

// Sign in with email and password
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    console.log("🔥 Starting email sign in...");

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("✅ Sign in successful:", user.uid);

    // Get additional user data from Firestore
    let authUser = convertFirebaseUser(user);

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        authUser = convertFirebaseUser(user, userData);
      }
    } catch (firestoreError) {
      console.warn(
        "⚠️ Failed to fetch user data from Firestore:",
        firestoreError
      );
    }

    return {
      user: authUser,
      error: null,
    };
  } catch (error: any) {
    return {
      user: null,
      error: handleAuthError(error),
    };
  }
}

// Sign in with GitHub
export async function signInWithGitHub(): Promise<AuthResult> {
  try {
    console.log("🔥 Starting GitHub sign in...");

    const provider = new GithubAuthProvider();
    provider.addScope("user:email");
    provider.addScope("read:user");

    const result = await signInWithPopup(auth, provider);
    const credential = GithubAuthProvider.credentialFromResult(result);
    const user = result.user;

    console.log("✅ GitHub sign in successful:", user.uid);

    let authUser = convertFirebaseUser(user);

    if (credential?.accessToken) {
      try {
        // Fetch GitHub user data
        const response = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `token ${credential.accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        });

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const githubData = await response.json();

        // Update user profile in Firestore
        const userData = {
          uid: user.uid,
          email: user.email,
          email_verified: user.emailVerified,
          display_name: githubData.name || githubData.login,
          github_username: githubData.login,
          github_avatar: githubData.avatar_url,
          github_access_token: credential.accessToken,
          updated_at: serverTimestamp(),
        };

        await setDoc(doc(db, "users", user.uid), userData, { merge: true });

        authUser = convertFirebaseUser(user, userData);

        console.log("✅ GitHub profile saved to Firestore");
      } catch (githubError) {
        console.warn("⚠️ Failed to fetch/save GitHub data:", githubError);
      }
    }

    return {
      user: authUser,
      error: null,
    };
  } catch (error: any) {
    return {
      user: null,
      error: handleAuthError(error),
    };
  }
}

// Link GitHub account to existing user
export async function linkGitHubAccount(): Promise<AuthResult> {
  try {
    console.log("🔥 Starting GitHub account linking...");

    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No user is currently signed in");
    }

    const provider = new GithubAuthProvider();
    provider.addScope("user:email");
    provider.addScope("read:user");

    const result = await linkWithPopup(currentUser, provider);
    const credential = GithubAuthProvider.credentialFromResult(result);
    const user = result.user;

    console.log("✅ GitHub account linked successfully");

    let authUser = convertFirebaseUser(user);

    if (credential?.accessToken) {
      try {
        // Fetch GitHub user data
        const response = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `token ${credential.accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        });

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const githubData = await response.json();

        // Update user profile in Firestore
        const userData = {
          github_username: githubData.login,
          github_avatar: githubData.avatar_url,
          github_access_token: credential.accessToken,
          updated_at: serverTimestamp(),
        };

        await setDoc(doc(db, "users", user.uid), userData, { merge: true });

        authUser = convertFirebaseUser(user, userData);

        console.log("✅ GitHub account info updated in Firestore");
      } catch (githubError) {
        console.warn("⚠️ Failed to fetch/save GitHub data:", githubError);
      }
    }

    return {
      user: authUser,
      error: null,
    };
  } catch (error: any) {
    return {
      user: null,
      error: handleAuthError(error),
    };
  }
}

// Sign out
export async function signOutUser(): Promise<{
  error: { message: string; code?: string } | null;
}> {
  try {
    console.log("🔥 Starting sign out...");
    await signOut(auth);
    console.log("✅ Sign out successful");
    return { error: null };
  } catch (error: any) {
    return { error: handleAuthError(error) };
  }
}

// Reset password
export async function resetPassword(
  email: string
): Promise<{ error: { message: string; code?: string } | null }> {
  try {
    console.log("🔥 Sending password reset email...");

    if (!email) {
      throw new Error("Email is required");
    }

    await sendPasswordResetEmail(auth, email);
    console.log("✅ Password reset email sent");
    return { error: null };
  } catch (error: any) {
    return { error: handleAuthError(error) };
  }
}

// Auth state listener
export function onAuthStateChange(
  callback: (user: AuthUser | null) => void
): () => void {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      let authUser = convertFirebaseUser(firebaseUser);

      // Try to get additional user data from Firestore
      try {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          authUser = convertFirebaseUser(firebaseUser, userData);
        }
      } catch (error) {
        console.warn("⚠️ Failed to fetch user data from Firestore:", error);
      }

      callback(authUser);
    } else {
      callback(null);
    }
  });
}
