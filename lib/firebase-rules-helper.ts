/**
 * Firebase Security Rules Helper
 * This file contains the recommended Firestore security rules for the application
 */

export const RECOMMENDED_FIRESTORE_RULES = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to public collections
    match /topics/{document} {
      allow read: if true;
    }
    
    match /quizzes/{document} {
      allow read: if true;
    }
    
    match /questions/{document} {
      allow read: if true;
    }
    
    match /projects/{document} {
      allow read: if true;
    }
    
    match /definitions/{document} {
      allow read: if true;
    }
    
    // User-specific data - only authenticated users can access their own data
    match /user_repositories/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /quiz_results/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    match /user_progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /user_activity/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
`;

export const FIREBASE_SETUP_INSTRUCTIONS = `
To fix the Firebase permissions issues, please update your Firestore Security Rules:

1. Go to Firebase Console (https://console.firebase.google.com)
2. Select your project
3. Navigate to Firestore Database
4. Click on "Rules" tab
5. Replace the existing rules with the rules provided above
6. Click "Publish"

The new rules will:
- Allow public read access to topics, quizzes, questions, projects, and definitions
- Allow authenticated users to read/write their own user data
- Ensure proper security for user-specific collections
`;

export function logFirebaseSetupInstructions() {
  console.log("🔧 Firebase Setup Instructions:");
  console.log(FIREBASE_SETUP_INSTRUCTIONS);
  console.log("📋 Recommended Firestore Rules:");
  console.log(RECOMMENDED_FIRESTORE_RULES);
}
