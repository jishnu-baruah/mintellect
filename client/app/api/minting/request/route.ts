import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import contractArtifact from '../../../../lib/MintellectNFT_ABI.json';

// Extract the ABI from the artifact
const contractABI = contractArtifact.abi;

// Contract configuration
const CONTRACT_ADDRESS = "0x8df311Efb8160a4Cde6f13C47D0E4c21F949CbdD";
const RPC_URL = "https://rpc.open-campus-codex.gelato.digital";

export async function POST(request: NextRequest) {
  try {
    const { userAddress, tokenURI, documentName, trustScore } = await request.json();

    // Validate required fields
    if (!userAddress || !tokenURI) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: userAddress, tokenURI'
      }, { status: 400 });
    }

    // Validate Ethereum address
    if (!ethers.isAddress(userAddress)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid user address'
      }, { status: 400 });
    }

    // Check if private key is available
    if (!process.env.PRIVATE_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Minting service not configured. Please contact administrator.'
      }, { status: 503 });
    }

    console.log(`Minting NFT for user: ${userAddress}`);
    console.log(`Token URI: ${tokenURI}`);

    // Initialize provider and contract
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

    // Estimate gas for the minting transaction
    let gasEstimate;
    try {
      gasEstimate = await contract.mintNFT.estimateGas(userAddress, tokenURI);
      console.log(`Gas estimate: ${gasEstimate.toString()}`);
    } catch (error) {
      console.error('Gas estimation failed:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to estimate gas for minting'
      }, { status: 500 });
    }

    // Get current gas price
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice || ethers.parseUnits('20', 'gwei');

    // Prepare transaction
    const tx = await contract.mintNFT.populateTransaction(userAddress, tokenURI, {
      gasLimit: gasEstimate * 120n / 100n, // Add 20% buffer
      gasPrice: gasPrice
    });

    // Send transaction
    const txResponse = await wallet.sendTransaction(tx);
    console.log(`Transaction sent: ${txResponse.hash}`);

    // Wait for confirmation
    const receipt = await txResponse.wait();
    console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);

    // Extract token ID from events
    let tokenId = null;
    if (receipt.logs) {
      for (const log of receipt.logs) {
        try {
          const parsedLog = contract.interface.parseLog(log);
          if (parsedLog && parsedLog.name === 'NFTMinted') {
            tokenId = parsedLog.args.tokenId.toString();
            break;
          }
        } catch (e) {
          // Skip logs that can't be parsed
        }
      }
    }

    // If we couldn't extract token ID from events, get it from totalSupply
    if (!tokenId) {
      try {
        const totalSupply = await contract.totalSupply();
        tokenId = totalSupply.toString();
      } catch (error) {
        console.error('Failed to get total supply:', error);
      }
    }

    return NextResponse.json({
      success: true,
      transactionHash: txResponse.hash,
      tokenId: tokenId || 'unknown',
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      gasPrice: gasPrice.toString(),
      totalCost: (receipt.gasUsed * gasPrice).toString()
    });

  } catch (error: any) {
    console.error('Minting error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Minting failed'
    }, { status: 500 });
  }
}
