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
    const { userAddress, tokenURI } = await request.json();

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

    console.log(`Estimating gas for user: ${userAddress}`);

    // Initialize provider and contract
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

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
    const maxFeePerGas = feeData.maxFeePerGas;
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;

    // Calculate total cost
    const totalCost = gasEstimate * gasPrice;

    return NextResponse.json({
      success: true,
      gasLimit: gasEstimate.toString(),
      gasPrice: gasPrice.toString(),
      maxFeePerGas: maxFeePerGas?.toString(),
      maxPriorityFeePerGas: maxPriorityFeePerGas?.toString(),
      totalCost: totalCost.toString(),
      totalCostInETH: ethers.formatEther(totalCost),
      totalCostInEDU: ethers.formatEther(totalCost) // Assuming 1:1 ratio
    });

  } catch (error: any) {
    console.error('Gas estimation error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Gas estimation failed'
    }, { status: 500 });
  }
}
