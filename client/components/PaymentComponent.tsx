'use client'

import { useState, useEffect } from 'react';
import { useAccount, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import { parseEther } from 'viem';

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
  }
];

export default function PaymentComponent() {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const { address } = useAccount();

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
    args: amount ? [parseEther(amount)] : undefined,
    enabled: !!address && !!amount,
  });

  const { write, data: txData, isLoading: isWriting, isSuccess: isWriteSuccess, error: writeError } = useContractWrite(config);

  // Wait for transaction
  const { isLoading: isTxLoading, isSuccess: isTxSuccess } = useWaitForTransaction({
    hash: txData?.hash,
    enabled: !!txData?.hash,
    onSuccess: () => {
      refetchBalance();
      setAmount('');
    },
  });

  useEffect(() => {
    if (prepareError) setError(prepareError.message);
    else if (writeError) setError(writeError.message);
    else setError('');
  }, [prepareError, writeError]);

  const handleBuyTokens = () => {
    if (write) write();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Buy Edu Tokens</h2>
      <div className="mb-4">
        <p className="text-gray-600">Your Token Balance: {balance ? (Number(balance) / 1e18).toFixed(4) : '0'} EDU</p>
        <p className="text-gray-600">Connected Account: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount (ETH)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="0.1"
            step="0.01"
          />
          <p className="mt-1 text-sm text-gray-500">1 ETH = 1000 EDU Tokens</p>
        </div>
        <button
          onClick={handleBuyTokens}
          disabled={isWriting || isTxLoading || !amount}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {isWriting || isTxLoading ? 'Processing...' : 'Buy Edu Tokens'}
        </button>
        {error && (
          <div className="text-red-600 text-sm mt-2">
            {error}
          </div>
        )}
      </div>
    </div>
  );
} 