'use client'

import { useState, useEffect } from 'react';
import { useAccount, useNetwork, useSwitchNetwork, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import { parseUnits } from 'viem';

const CONTRACT_ADDRESS = '0x85ab510c1d219e207916a8c8a36a33ce56f3ef6e';
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Deposit",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getUserBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Open Campus Codex network configuration
const NETWORK_CONFIG = {
  chainId: '0xA045C', // 656476 in hex
  chainName: 'EDU Chain Testnet',
  nativeCurrency: {
    name: 'EDU Token',
    symbol: 'EDU',
    decimals: 18
  },
  rpcUrls: ['https://rpc.open-campus-codex.gelato.digital'],
  blockExplorerUrls: ['https://edu-chain-testnet.blockscout.com/']
};

// EDU Token contract address - verify this is the correct token
const EDU_TOKEN_ADDRESS = '0x85ab510c1d219e207916a8c8a36a33ce56f3ef6e';

interface PlagiarismPaymentProps {
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
}

export default function PlagiarismPayment({ onPaymentSuccess, onPaymentError }: PlagiarismPaymentProps) {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { chains, switchNetwork } = useSwitchNetwork();
  const [amount, setAmount] = useState('0.000062');
  const [transactionHash, setTransactionHash] = useState('');
  const [transactionStatus, setTransactionStatus] = useState<'pending' | 'success' | 'error' | null>(null);
  const [debugInfo, setDebugInfo] = useState('');
  const [error, setError] = useState('');

  // Read balance
  const { data: balance, refetch: refetchBalance } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getBalance',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });

  // Prepare deposit
  const { config, error: prepareError } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'deposit',
    args: [parseUnits(amount, 18)],
    enabled: !!address && !!amount,
  });

  const { write, data: txData, isLoading: isWriting, isSuccess: isWriteSuccess, error: writeError } = useContractWrite(config);

  // Wait for transaction
  const { isLoading: isTxLoading, isSuccess: isTxSuccess, isError: isTxError } = useWaitForTransaction({
    hash: txData?.hash,
    enabled: !!txData?.hash,
    onSuccess: () => {
      setTransactionStatus('success');
      setTransactionHash(txData?.hash || '');
      refetchBalance();
      onPaymentSuccess();
    },
    onError: () => {
      setTransactionStatus('error');
      setError('Transaction failed');
      onPaymentError('Transaction failed');
    },
  });

  // Network switching
  useEffect(() => {
    if (chain && chain.id !== parseInt(NETWORK_CONFIG.chainId, 16) && switchNetwork) {
      switchNetwork(parseInt(NETWORK_CONFIG.chainId, 16));
    }
  }, [chain, switchNetwork]);

  // Error handling
  useEffect(() => {
    if (prepareError) setError(prepareError.message);
    else if (writeError) setError(writeError.message);
    else setError('');
  }, [prepareError, writeError]);

  const handleBuyTokens = () => {
    setTransactionStatus('pending');
    setError('');
    if (write) write();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Purchase Plagiarism Check</h2>
      <div className="mb-4">
        <p className="text-gray-600">Your Token Balance: {balance ? (Number(balance) / 1e18).toFixed(4) : '0'} EDU</p>
        <p className="text-gray-600">Connected Account: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}</p>
        <p className="text-sm text-gray-500 mt-2">Cost: 0.000062 EDU Token per check</p>
        <p className="text-xs text-gray-400 mt-1">Using EDU Chain Testnet Network</p>
        <p className="text-xs text-gray-400 mt-1">Token Contract: {EDU_TOKEN_ADDRESS.slice(0, 6)}...{EDU_TOKEN_ADDRESS.slice(-4)}</p>
        <p className="text-xs text-gray-400 mt-1">Note: EDU is both the gas token and governance token for the network</p>
      </div>
      <button
        onClick={handleBuyTokens}
        disabled={isWriting || isTxLoading || !write}
        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {isWriting || isTxLoading ? 'Processing...' : 'Buy EDU Token for Plagiarism Check'}
      </button>
      {transactionStatus === 'pending' && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">Transaction pending...</p>
          {transactionHash && (
            <a 
              href={`${NETWORK_CONFIG.blockExplorerUrls[0]}/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-yellow-600 hover:underline"
            >
              View on Explorer
            </a>
          )}
        </div>
      )}
      {transactionStatus === 'success' && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">Transaction successful!</p>
          {transactionHash && (
            <a 
              href={`${NETWORK_CONFIG.blockExplorerUrls[0]}/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-600 hover:underline"
            >
              View on Explorer
            </a>
          )}
        </div>
      )}
      {error && (
        <div className="text-red-600 text-sm mt-2">
          {error}
        </div>
      )}
      {/* Debug information */}
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
        <p className="text-sm text-gray-600">Debug Info:</p>
        <div className="text-xs text-gray-500 mt-1 space-y-1">
          <p>Network: {NETWORK_CONFIG.chainName}</p>
          <p>Chain ID: {NETWORK_CONFIG.chainId}</p>
          <p>RPC URL: {NETWORK_CONFIG.rpcUrls[0]}</p>
          <p>Contract Address: {CONTRACT_ADDRESS}</p>
          <p>Token Address: {EDU_TOKEN_ADDRESS}</p>
          <p>Connected Account: {address || 'Not connected'}</p>
          <p>Current Balance: {balance ? (Number(balance) / 1e18).toFixed(4) : '0'} EDU</p>
          <p>Transaction Status: {transactionStatus || 'None'}</p>
          {transactionHash && (
            <p>Transaction Hash: {transactionHash}</p>
          )}
          <pre className="mt-2 overflow-auto max-h-32">
            {debugInfo}
          </pre>
        </div>
      </div>
    </div>
  );
} 