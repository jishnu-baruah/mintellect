import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { PinataSDK } from "pinata"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function uploadToPinata(metadata: object): Promise<string> {
  const pinataJwt = process.env.NEXT_PUBLIC_PINATA_JWT;
  
  if (!pinataJwt) {
    console.error('Pinata JWT is missing. Please add NEXT_PUBLIC_PINATA_JWT to your environment variables.');
    throw new Error('Pinata JWT is missing. Please configure your environment variables.');
  }

  try {
    const pinata = new PinataSDK({
      pinataJwt: pinataJwt,
      pinataGateway: "gateway.pinata.cloud" // or your custom gateway
    });

    // Upload metadata as JSON
    const upload = await pinata.upload.public.json(metadata);
    
    // Return the IPFS gateway URL - handle different response formats
    const hash = (upload as any).IpfsHash || (upload as any).cid || (upload as any).hash;
    if (!hash) {
      throw new Error('No IPFS hash found in upload response');
    }
    return `https://gateway.pinata.cloud/ipfs/${hash}`;
  } catch (error) {
    console.error('Pinata upload error:', error);
    throw new Error(`Failed to upload to Pinata: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Upload file to Pinata IPFS
export async function uploadFileToPinata(file: File): Promise<string> {
  const pinataJwt = process.env.NEXT_PUBLIC_PINATA_JWT;
  
  if (!pinataJwt) {
    console.error('Pinata JWT is missing. Please add NEXT_PUBLIC_PINATA_JWT to your environment variables.');
    throw new Error('Pinata JWT is missing. Please configure your environment variables.');
  }

  try {
    const pinata = new PinataSDK({
      pinataJwt: pinataJwt,
      pinataGateway: "gateway.pinata.cloud"
    });

    // Upload file to IPFS
    const upload = await pinata.upload.public.file(file);
    
    // Return the IPFS gateway URL - handle different response formats
    const hash = (upload as any).IpfsHash || (upload as any).cid || (upload as any).hash;
    if (!hash) {
      throw new Error('No IPFS hash found in upload response');
    }
    return `https://gateway.pinata.cloud/ipfs/${hash}`;
  } catch (error) {
    console.error('Pinata file upload error:', error);
    throw new Error(`Failed to upload file to Pinata: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

// Enhanced file upload function with fallback
export async function uploadFile(file: File): Promise<string> {
  try {
    // Try Pinata first
    return await uploadFileToPinata(file);
  } catch (error) {
    console.warn('Pinata file upload failed, using local fallback:', error);
    // Fallback to local file URL
    return URL.createObjectURL(file);
  }
}
