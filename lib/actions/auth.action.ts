"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    // Create session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: SESSION_DURATION * 1000, // milliseconds
    });

    // Set cookie in the browser
    cookieStore.set("session", sessionCookie, {
        maxAge: SESSION_DURATION,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
    });
}

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        // check if user exists in db
        const userRecord = await db.collection("users").doc(uid).get();
        if (userRecord.exists)
            return {
                success: false,
                message: "User already exists. Please sign in.",
            };

        // save user to db
        await db.collection("users").doc(uid).set({
            name,
            email,
            isVerified: false,
            isPro: false,
            provider: "email",
            createdAt: new Date().toISOString(),
            // profileURL,
            // resumeURL,
        });


        return {
            success: true,
            message: "Account created successfully. Please sign in.",
        };
    } catch (error: any) {
        console.error("Error creating user:", error);

        // Handle Firebase specific errors
        if (error.code === "auth/email-already-exists") {
            return {
                success: false,
                message: "This email is already in use",
            };
        }

        return {
            success: false,
            message: "Failed to create account. Please try again.",
        };
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord)
            return {
                success: false,
                message: "User does not exist. Create an account.",
            };


        // Update user record in Firestore with latest email verification status
        const userDoc = await db.collection("users").doc(uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();

            // Get the latest user info from Firebase Auth
            const userRecord = await auth.getUser(uid);

            // Update emailVerified status in Firestore if needed
            if (userData?.isVerified !== userRecord.emailVerified) {
                await db.collection("users").doc(uid).update({
                    isVerified: userRecord.emailVerified
                });
            }

            // Check if email is verified
            if (!userRecord.emailVerified) {
                return {
                    success: false,
                    message: "Please verify your email before signing in. Check your inbox for the verification link.",
                };
            }
        }

        await setSessionCookie(idToken);

        return {
            success: true,
            message: "Logged in successfully",
        }
    } catch (error: any) {
        console.log("");

        return {
            success: false,
            message: "Failed to log into account. Please try again.",
        };
    }
}

export async function oauthSignIn(params: OAuthSignInParams) {
    const { uid, name, email, photoURL, provider, idToken } = params;

    try {
        // Get user from Firestore or create if not exists
        const userDoc = await db.collection("users").doc(uid).get();

        if (!userDoc.exists) {
            // Create new user in Firestore
            await db.collection("users").doc(uid).set({
                name,
                email,
                photoURL,
                provider,
                isVerified: true, // OAuth providers verify emails by default
                isPro: false,
                createdAt: new Date().toISOString(),
            });
        } else {
            // Update existing user with latest info
            await db.collection("users").doc(uid).update({
                lastLogin: new Date().toISOString(),
                // Update provider if different
                ...(provider && { provider }),
                // Update photo URL if provided
                ...(photoURL && { photoURL }),
            });
        }

        // Set the session cookie
        await setSessionCookie(idToken);

        return {
            success: true,
            message: "Successfully signed in with " + provider,
        };
    } catch (error: any) {
        console.error("OAuth sign-in error:", error);
        return {
            success: false,
            message: "Failed to authenticate. Please try again.",
        };
    }
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    
    const sessionCookie = cookieStore.get("session")?.value || null;

    if(!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db
            .collection("users")
            .doc(decodedClaims.uid)
            .get();
        if (!userRecord.exists) return null;

        return {
            ...userRecord.data(),
            id: userRecord.id
        } as User
            
    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
        
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}

// Sign out user by clearing the session cookie
export async function signOut() {
    const cookieStore = await cookies();
  
    cookieStore.delete("session");
  }