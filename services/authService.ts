// services/authService.ts
import { auth } from '@/firebase/config';
import { UserProfile } from '@/types/auth';
import {
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    updateProfile,
    User,
} from 'firebase/auth';
import { getOrCreateUserProfile } from './userProfileService';

export async function signUpWithEmail(
    name: string,
    email: string,
    password: string
): Promise<{ firebaseUser: User; profile: UserProfile }> {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    if (name) {
        await updateProfile(cred.user, {
            displayName: name,
        });
    }

    const profile = await getOrCreateUserProfile(cred.user);

    return { firebaseUser: cred.user, profile };
}

export async function signInWithEmail(
    email: string,
    password: string
): Promise<{ firebaseUser: User; profile: UserProfile }> {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const profile = await getOrCreateUserProfile(cred.user);

    return { firebaseUser: cred.user, profile };
}

export async function signOutFirebase() {
    await firebaseSignOut(auth);
}

export function subscribeToAuthChanges(
    cb: (user: User | null) => void
) {
    const unsubscribe = onAuthStateChanged(auth, cb);
    return unsubscribe;
}
