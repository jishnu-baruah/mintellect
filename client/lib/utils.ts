import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function uploadToPinata(metadata: object): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  const secretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;

  if (!apiKey || !secretApiKey) {
    throw new Error('Pinata API keys are missing in environment variables.');
  }

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
    throw new Error('Failed to upload to Pinata');
  }

  const data = await res.json();
  return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
}
