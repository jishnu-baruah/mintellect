import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function uploadToPinata(metadata: object): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  const secretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;

  if (!apiKey || !secretApiKey) {
    console.error('Pinata API keys are missing. Please add NEXT_PUBLIC_PINATA_API_KEY and NEXT_PUBLIC_PINATA_SECRET_API_KEY to your environment variables.');
    throw new Error('Pinata API keys are missing. Please configure your environment variables.');
  }

  try {
    const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: apiKey,
        pinata_secret_api_key: secretApiKey,
      },
      body: JSON.stringify({
        pinataContent: metadata,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error('Pinata upload failed:', res.status, errorData);
      throw new Error(`Failed to upload to Pinata: ${res.status} ${errorData}`);
    }

    const data = await res.json();
    return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
  } catch (error) {
    console.error('Pinata upload error:', error);
    throw new Error(`Failed to upload to Pinata: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Fallback function for when Pinata is not available
export function createLocalMetadataUrl(metadata: object): string {
  const metadataString = JSON.stringify(metadata);
  const base64Metadata = btoa(metadataString);
  return `data:application/json;base64,${base64Metadata}`;
}

// Enhanced upload function with fallback
export async function uploadMetadata(metadata: object): Promise<string> {
  try {
    // Try Pinata first
    return await uploadToPinata(metadata);
  } catch (error) {
    console.warn('Pinata upload failed, using local fallback:', error);
    // Fallback to local metadata URL
    return createLocalMetadataUrl(metadata);
  }
}
