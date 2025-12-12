// services/tripMediaService.ts
import { storage } from '@/firebase/config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export async function uploadTripCoverAsync(
    userId: string,
    tripId: string,
    uri: string
): Promise<string> {
    const response = await fetch(uri);
    const blob = await response.blob();

    const imageRef = ref(storage, `tripCovers/${userId}/${tripId}.jpg`);
    await uploadBytes(imageRef, blob);
    const downloadUrl = await getDownloadURL(imageRef);

    return downloadUrl;
}
