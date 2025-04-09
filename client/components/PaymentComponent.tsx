'use client'

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

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
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState('');

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);
          
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
          setContract(contract);
          
          const accounts = await provider.send("eth_requestAccounts", []);
          setAccount(accounts[0]);
          
          // Get initial balance
          const balance = await contract.getBalance(accounts[0]);
          setBalance(ethers.formatEther(balance));
        } catch (err) {
          console.error('Error initializing:', err);
          setError('Failed to connect to wallet');
        }
      } else {
        setError('Please install MetaMask');
      }
    };

    init();
  }, []);

  const handleBuyTokens = async () => {
    if (!contract || !amount) return;
    
    try {
      setLoading(true);
      setError('');
      
      const amountInWei = ethers.parseEther(amount);
      const tx = await contract.deposit(amountInWei);
      await tx.wait();
      
      // Update balance after purchase
      const newBalance = await contract.getBalance(account);
      setBalance(ethers.formatEther(newBalance));
      
      setAmount('');
    } catch (err) {
      console.error('Purchase error:', err);
      setError('Failed to purchase tokens');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Buy Edu Tokens</h2>
      
      <div className="mb-4">
        <p className="text-gray-600">Your Token Balance: {balance} EDU</p>
        <p className="text-gray-600">Connected Account: {account.slice(0, 6)}...{account.slice(-4)}</p>
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
          disabled={loading || !amount}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Buy Edu Tokens'}
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