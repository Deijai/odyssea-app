// services/userProfileService.ts
import type { User } from 'firebase/auth';
import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import {
    getDownloadURL,
    ref,
    uploadBytes,
} from 'firebase/storage';

import { db, storage } from '@/firebase/config';
import type { UserProfile } from '@/types/auth';

const USERS_COLLECTION = 'users';

function userDocRef(uid: string) {
    return doc(db, USERS_COLLECTION, uid);
}

// helper pra remover campos undefined (Firestore odeia undefined)
function sanitizeData<T extends Record<string, any>>(data: T): T {
    const copy: any = { ...data };
    Object.keys(copy).forEach((key) => {
        if (copy[key] === undefined) {
            delete copy[key];
        }
    });
    return copy;
}

export async function getOrCreateUserProfile(
    firebaseUser: User
): Promise<UserProfile> {
    const { uid, email, displayName, photoURL } = firebaseUser;

    const ref = userDocRef(uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
        const data = snap.data() as any;

        return {
            uid,
            email: data.email ?? email ?? '',
            displayName: data.displayName ?? displayName ?? '',
            avatarUrl: data.avatarUrl ?? undefined,
            bio: data.bio ?? '',
            homeCountry: data.homeCountry ?? '',
            createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
            updatedAt: data.updatedAt?.toMillis?.() ?? Date.now(),
        };
    }

    const profile: UserProfile = {
        uid,
        email: email ?? '',
        displayName: displayName ?? '',
        avatarUrl: photoURL ?? undefined,
        bio: '',
        homeCountry: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };

    const payload = sanitizeData({
        ...profile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    await setDoc(ref, payload);

    return profile;
}

export async function updateUserProfile(
    uid: string,
    data: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>
): Promise<UserProfile> {
    const refDoc = userDocRef(uid);

    const payload = sanitizeData({
        ...data,
        updatedAt: serverTimestamp(),
    });

    await updateDoc(refDoc, payload);

    const snap = await getDoc(refDoc);
    const updated = snap.data() as any;

    return {
        uid,
        displayName: updated.displayName,
        email: updated.email,
        avatarUrl: updated.avatarUrl ?? undefined,
        bio: updated.bio ?? '',
        homeCountry: updated.homeCountry ?? '',
        createdAt: updated.createdAt?.toMillis?.() ?? Date.now(),
        updatedAt: updated.updatedAt?.toMillis?.() ?? Date.now(),
    };
}

export async function uploadProfilePhotoAsync(
    uid: string,
    uri: string
): Promise<string> {
    const response = await fetch(uri);
    const blob = await response.blob();

    const imageRef = ref(storage, `profilePhotos/${uid}.jpg`);
    await uploadBytes(imageRef, blob);
    const downloadUrl = await getDownloadURL(imageRef);

    const payload = sanitizeData({
        avatarUrl: downloadUrl,
        updatedAt: serverTimestamp(),
    });

    await updateDoc(userDocRef(uid), payload);

    return downloadUrl;
}
