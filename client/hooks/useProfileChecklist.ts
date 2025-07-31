import useSWR from 'swr';
import { useWallet } from '@/hooks/useWallet';

const fetcher = (url: string, walletAddress: string) =>
  fetch(url, { headers: { 'x-wallet': walletAddress } }).then(res => {
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch profile requirements');
    return res.json();
  });

export function useProfileChecklist() {
  const { walletAddress, walletConnected } = useWallet();
  const shouldFetch = walletConnected && walletAddress;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
  const { data, error, isLoading } = useSWR(
    shouldFetch ? [`${API_URL}/settings/profile/requirements`, walletAddress] : null,
    ([url, wallet]) => fetcher(url, wallet),
    { revalidateOnFocus: false }
  );

  return {
    checklist: data?.checklist || [],
    allComplete: data?.allComplete || false,
    loading: isLoading,
    error,
    isNewUser: data === null,
    walletConnected,
    walletAddress
  };
}

export function useProfileStatus() {
  const { walletAddress, walletConnected } = useWallet();
  const shouldFetch = walletConnected && walletAddress;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
  const swr = useSWR(
    shouldFetch ? [`${API_URL}/settings/profile/profile?wallet=${walletAddress}`, walletAddress] : null,
    ([url]) => fetch(url).then(res => res.json()),
    { revalidateOnFocus: false }
  );

  const data = swr?.data ?? {};
  const error = swr?.error ?? null;
  const isLoading = swr?.isLoading ?? false;

  return {
    profileComplete: data.allComplete ?? null,
    checking: isLoading,
    walletConnected: walletConnected ?? false,
    walletAddress: walletAddress ?? "",
    error: error
  };
}
