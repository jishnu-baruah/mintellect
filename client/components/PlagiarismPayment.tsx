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
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [transactionStatus, setTransactionStatus] = useState<'pending' | 'success' | 'error' | null>(null);
  const [debugInfo, setDebugInfo] = useState('');

  const initializeContract = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not found');
    }

    try {
      // Check if we're on the correct network
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      console.log('Current chain ID:', currentChainId);
      setDebugInfo(`Current chain ID: ${currentChainId}`);
      
      if (currentChainId !== NETWORK_CONFIG.chainId) {
        console.log('Switching network...');
        setDebugInfo('Switching network...');
        try {
          // First try to switch to the network
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: NETWORK_CONFIG.chainId }],
          });
          console.log('Network switched successfully');
          setDebugInfo('Network switched successfully');
        } catch (switchError: any) {
          console.error('Switch error:', switchError);
          setDebugInfo(`Switch error: ${JSON.stringify(switchError)}`);
          
          // If the network is not added, add it
          if (switchError.code === 4902) {
            // Show network details to user before adding
            const networkDetails = `
              Network Name: ${NETWORK_CONFIG.chainName}
              Chain ID: ${NETWORK_CONFIG.chainId} (656476)
              RPC URL: ${NETWORK_CONFIG.rpcUrls[0]}
              Block Explorer: ${NETWORK_CONFIG.blockExplorerUrls[0]}
              Currency: ${NETWORK_CONFIG.nativeCurrency.symbol}
            `;
            
            console.log('Network details:', networkDetails);
            setDebugInfo(`Network details: ${networkDetails}`);
            
            // Add a delay to prevent spam filtering
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Create a new network params object with the exact format MetaMask expects
            const networkParams = {
              chainId: NETWORK_CONFIG.chainId,
              chainName: NETWORK_CONFIG.chainName,
              nativeCurrency: {
                name: NETWORK_CONFIG.nativeCurrency.name,
                symbol: NETWORK_CONFIG.nativeCurrency.symbol,
                decimals: NETWORK_CONFIG.nativeCurrency.decimals
              },
              rpcUrls: NETWORK_CONFIG.rpcUrls,
              blockExplorerUrls: NETWORK_CONFIG.blockExplorerUrls
            };
            
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [networkParams],
              });
              console.log('Network added successfully');
              setDebugInfo('Network added successfully');
            } catch (addError: any) {
              console.error('Error adding network:', addError);
              setDebugInfo(`Add network error: ${JSON.stringify(addError)}`);
              
              if (addError.code === 4001) {
                throw new Error('Please approve the network addition in MetaMask to continue.');
              } else if (addError.code === -32602) {
                throw new Error('Invalid network parameters. Please try again.');
              } else if (addError.code === -32603) {
                throw new Error('Network addition failed. Please try again later.');
              } else {
                throw new Error(`Failed to add EDU Chain network: ${addError.message || 'Unknown error'}`);
              }
            }
          } else {
            throw new Error(`Failed to switch to EDU Chain network: ${switchError.message || 'Unknown error'}`);
          }
        }
      }

      // Create provider and get signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      
      const signer = await provider.getSigner();
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      
      // Create contract instance
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contract);
      
      // Get balance using the token contract
      const tokenContract = new ethers.Contract(
        EDU_TOKEN_ADDRESS,
        [
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "account",
                "type": "address"
              }
            ],
            "name": "balanceOf",
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
            "name": "symbol",
            "outputs": [
              {
                "internalType": "string",
                "name": "",
                "type": "string"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "decimals",
            "outputs": [
              {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          }
        ],
        provider
      );

      try {
        // First verify the contract exists
        console.log('Verifying contract existence...');
        setDebugInfo('Verifying contract existence...');
        
        const code = await provider.getCode(CONTRACT_ADDRESS);
        if (code === '0x') {
          console.error('No contract found at address:', CONTRACT_ADDRESS);
          setDebugInfo(`No contract found at address: ${CONTRACT_ADDRESS}`);
          throw new Error('Contract not found on this network');
        }
        
        console.log('Contract exists at address:', CONTRACT_ADDRESS);
        setDebugInfo(`Contract exists at address: ${CONTRACT_ADDRESS}`);
        
        // Get the balance using the getBalance function
        console.log('Getting balance...');
        setDebugInfo('Getting balance...');
        
        const balance = await contract.getBalance(accounts[0]);
        console.log('Raw balance:', balance.toString());
        setDebugInfo(`Raw balance: ${balance.toString()}`);
        
        const formattedBalance = ethers.formatEther(balance);
        setBalance(formattedBalance);
        console.log('Formatted balance:', formattedBalance);
        setDebugInfo(`Formatted balance: ${formattedBalance}`);
      } catch (balanceError) {
        console.error('Error getting balance:', balanceError);
        setDebugInfo(`Balance error: ${JSON.stringify(balanceError)}`);
        // Don't throw here, just set balance to 0
        setBalance('0');
      }
      
      return { provider, contract, account: accounts[0] };
    } catch (err) {
      console.error('Error initializing contract:', err);
      setDebugInfo(`Initialization error: ${JSON.stringify(err)}`);
      throw err;
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await initializeContract();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to connect to wallet';
        setError(errorMessage);
        onPaymentError(errorMessage);
        setDebugInfo(`Error: ${errorMessage}`);
      }
    };

    init();
  }, [onPaymentError]);

  const handleBuyTokens = async () => {
    if (!contract || !provider) {
      const errorMessage = 'Contract not initialized. Please try again.';
      setError(errorMessage);
      onPaymentError(errorMessage);
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setTransactionStatus('pending');
      setTransactionHash('');
      setDebugInfo('Starting transaction...');
      
      // 0.000062 EDU Token for one plagiarism check
      const amountInWei = ethers.parseUnits('0.000062', 18); // 0.000062 EDU token with 18 decimals
      console.log('Amount in wei:', amountInWei.toString());
      setDebugInfo(`Amount in wei: ${amountInWei.toString()}`);
      
      console.log('Sending transaction...');
      setDebugInfo('Sending transaction...');
      
      // Call the deposit function directly
      const tx = await contract.deposit(amountInWei);
      console.log('Transaction sent:', tx.hash);
      setTransactionHash(tx.hash);
      setDebugInfo(`Transaction sent: ${tx.hash}`);
      
      console.log('Waiting for transaction...');
      setDebugInfo('Waiting for transaction...');
      const receipt = await tx.wait();
      console.log('Transaction receipt:', receipt);
      setDebugInfo(`Transaction receipt: ${JSON.stringify(receipt)}`);
      
      if (receipt.status === 1) {
        console.log('Transaction successful');
        setTransactionStatus('success');
        setDebugInfo('Transaction successful');
        
        // Update balance after transaction
        const newBalance = await contract.getBalance(account);
        setBalance(ethers.formatEther(newBalance));
        console.log('New balance:', ethers.formatEther(newBalance));
        setDebugInfo(`New balance: ${ethers.formatEther(newBalance)}`);
        
        onPaymentSuccess();
      } else {
        console.error('Transaction failed');
        setTransactionStatus('error');
        setError('Transaction failed');
        onPaymentError('Transaction failed');
        setDebugInfo('Transaction failed');
      }
    } catch (err) {
      console.error('Purchase error:', err);
      setTransactionStatus('error');
      const errorMessage = err instanceof Error ? err.message : 'Failed to purchase tokens';
      setError(errorMessage);
      onPaymentError(errorMessage);
      setDebugInfo(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Purchase Plagiarism Check</h2>
      
      <div className="mb-4">
        <p className="text-gray-600">Your Token Balance: {balance} EDU</p>
        <p className="text-gray-600">Connected Account: {account.slice(0, 6)}...{account.slice(-4)}</p>
        <p className="text-sm text-gray-500 mt-2">Cost: 0.000062 EDU Token per check</p>
        <p className="text-xs text-gray-400 mt-1">Using EDU Chain Testnet Network</p>
        <p className="text-xs text-gray-400 mt-1">Token Contract: {EDU_TOKEN_ADDRESS.slice(0, 6)}...{EDU_TOKEN_ADDRESS.slice(-4)}</p>
        <p className="text-xs text-gray-400 mt-1">Note: EDU is both the gas token and governance token for the network</p>
      </div>

      <button
        onClick={handleBuyTokens}
        disabled={loading || !contract}
        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Buy EDU Token for Plagiarism Check'}
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
          <p>Connected Account: {account || 'Not connected'}</p>
          <p>Current Balance: {balance} EDU</p>
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