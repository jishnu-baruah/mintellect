import { ethers } from 'ethers';

export interface GasEstimate {
  gasLimit: bigint;
  gasPrice: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  totalCost: bigint;
  costInETH: string;
  costInEDU: string;
}

export interface GasEstimateOptions {
  gasMultiplier?: number; // Multiplier for gas limit (default: 1.2)
  maxGasPrice?: bigint; // Maximum gas price in wei
  priorityFeeMultiplier?: number; // Multiplier for priority fee (default: 1.1)
}

export class GasEstimator {
  private static readonly DEFAULT_GAS_MULTIPLIER = 1.2;
  private static readonly DEFAULT_PRIORITY_FEE_MULTIPLIER = 1.1;
  private static readonly MAX_GAS_PRICE_GWEI = 50; // 50 gwei max
  private static readonly MIN_GAS_PRICE_GWEI = 1; // 1 gwei min

  /**
   * Estimate gas for minting an NFT
   * Since mintNFT has onlyOwner modifier, we use a different approach
   */
  static async estimateMintGas(
    contract: ethers.Contract,
    to: string,
    tokenURI: string,
    options: GasEstimateOptions = {}
  ): Promise<GasEstimate> {
    try {
      // Since mintNFT is onlyOwner, we can't estimate it directly
      // Instead, we'll use a known gas limit for ERC721 minting
      const baseGasLimit = 300000n; // Known gas limit for ERC721 minting
      const gasMultiplier = options.gasMultiplier || this.DEFAULT_GAS_MULTIPLIER;
      const adjustedGasLimit = BigInt(Math.floor(Number(baseGasLimit) * gasMultiplier));

      // Get current gas price
      const feeData = await contract.runner?.provider?.getFeeData();
      if (!feeData) {
        throw new Error('Unable to get fee data from provider');
      }

      // Handle EIP-1559 vs legacy gas pricing
      let gasPrice: bigint;
      let maxFeePerGas: bigint | undefined;
      let maxPriorityFeePerGas: bigint | undefined;

      if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
        // EIP-1559 (Type 2) transaction
        const priorityFeeMultiplier = options.priorityFeeMultiplier || this.DEFAULT_PRIORITY_FEE_MULTIPLIER;
        maxPriorityFeePerGas = BigInt(Math.floor(Number(feeData.maxPriorityFeePerGas) * priorityFeeMultiplier));
        maxFeePerGas = (feeData.maxFeePerGas * BigInt(Math.floor(priorityFeeMultiplier * 100))) / 100n;
        
        // Use maxFeePerGas as the effective gas price for cost calculation
        gasPrice = maxFeePerGas;
      } else if (feeData.gasPrice) {
        // Legacy (Type 0) transaction
        gasPrice = feeData.gasPrice;
        
        // Apply max gas price limit if specified
        if (options.maxGasPrice) {
          gasPrice = gasPrice > options.maxGasPrice ? options.maxGasPrice : gasPrice;
        }
      } else {
        throw new Error('Unable to determine gas price');
      }

      // Apply gas price limits
      const maxGasPriceWei = ethers.parseUnits(this.MAX_GAS_PRICE_GWEI.toString(), 'gwei');
      const minGasPriceWei = ethers.parseUnits(this.MIN_GAS_PRICE_GWEI.toString(), 'gwei');
      
      if (gasPrice > maxGasPriceWei) {
        gasPrice = maxGasPriceWei;
        if (maxFeePerGas) maxFeePerGas = maxGasPriceWei;
      } else if (gasPrice < minGasPriceWei) {
        gasPrice = minGasPriceWei;
        if (maxFeePerGas) maxFeePerGas = minGasPriceWei;
      }

      // Calculate total cost
      const totalCost = adjustedGasLimit * gasPrice;
      const costInETH = ethers.formatEther(totalCost);
      const costInEDU = costInETH; // Assuming 1:1 ratio for EDU

      return {
        gasLimit: adjustedGasLimit,
        gasPrice,
        maxFeePerGas,
        maxPriorityFeePerGas,
        totalCost,
        costInETH,
        costInEDU,
      };
    } catch (error) {
      console.error('Gas estimation failed:', error);
      
      // Fallback to conservative estimates
      return this.getFallbackGasEstimate();
    }
  }

  /**
   * Get fallback gas estimate when estimation fails
   */
  private static getFallbackGasEstimate(): GasEstimate {
    const fallbackGasLimit = 300000n; // Conservative estimate
    const fallbackGasPrice = ethers.parseUnits('20', 'gwei'); // 20 gwei
    const totalCost = fallbackGasLimit * fallbackGasPrice;

    return {
      gasLimit: fallbackGasLimit,
      gasPrice: fallbackGasPrice,
      totalCost,
      costInETH: ethers.formatEther(totalCost),
      costInEDU: ethers.formatEther(totalCost),
    };
  }

  /**
   * Get optimized gas settings for different wallet types
   */
  static getOptimizedGasSettings(walletType: string): GasEstimateOptions {
    switch (walletType.toLowerCase()) {
      case 'metamask':
        return {
          gasMultiplier: 1.1, // MetaMask is usually accurate
          maxGasPrice: ethers.parseUnits('30', 'gwei'),
          priorityFeeMultiplier: 1.05,
        };
      case 'coinbase':
        return {
          gasMultiplier: 1.15, // Coinbase can be less accurate
          maxGasPrice: ethers.parseUnits('25', 'gwei'),
          priorityFeeMultiplier: 1.1,
        };
      case 'walletconnect':
        return {
          gasMultiplier: 1.2, // WalletConnect may need more buffer
          maxGasPrice: ethers.parseUnits('35', 'gwei'),
          priorityFeeMultiplier: 1.15,
        };
      default:
        return {
          gasMultiplier: 1.2,
          maxGasPrice: ethers.parseUnits('40', 'gwei'),
          priorityFeeMultiplier: 1.1,
        };
    }
  }

  /**
   * Format gas estimate for display
   */
  static formatGasEstimate(estimate: GasEstimate): {
    gasLimit: string;
    gasPrice: string;
    totalCost: string;
    isHighFee: boolean;
  } {
    const gasLimitFormatted = estimate.gasLimit.toString();
    const gasPriceGwei = ethers.formatUnits(estimate.gasPrice, 'gwei');
    const totalCostFormatted = parseFloat(estimate.costInEDU).toFixed(6);
    
    // Consider high fee if > 0.01 EDU
    const isHighFee = parseFloat(estimate.costInEDU) > 0.01;

    return {
      gasLimit: gasLimitFormatted,
      gasPrice: `${gasPriceGwei} gwei`,
      totalCost: `${totalCostFormatted} EDU`,
      isHighFee,
    };
  }

  /**
   * Check if gas price is reasonable
   */
  static isReasonableGasPrice(gasPrice: bigint): boolean {
    const gasPriceGwei = Number(ethers.formatUnits(gasPrice, 'gwei'));
    return gasPriceGwei >= this.MIN_GAS_PRICE_GWEI && gasPriceGwei <= this.MAX_GAS_PRICE_GWEI;
  }

  /**
   * Get gas price recommendations based on network conditions
   */
  static async getGasPriceRecommendations(provider: ethers.Provider): Promise<{
    slow: bigint;
    standard: bigint;
    fast: bigint;
  }> {
    try {
      const feeData = await provider.getFeeData();
      
      if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
        // EIP-1559 network
        const baseFee = feeData.maxFeePerGas - feeData.maxPriorityFeePerGas;
        const priorityFee = feeData.maxPriorityFeePerGas;
        
        return {
          slow: baseFee + (priorityFee * 50n) / 100n, // 50% of priority fee
          standard: baseFee + priorityFee,
          fast: baseFee + (priorityFee * 150n) / 100n, // 150% of priority fee
        };
      } else if (feeData.gasPrice) {
        // Legacy network
        const gasPrice = feeData.gasPrice;
        
        return {
          slow: (gasPrice * 80n) / 100n, // 80% of current price
          standard: gasPrice,
          fast: (gasPrice * 120n) / 100n, // 120% of current price
        };
      } else {
        throw new Error('Unable to get gas price data');
      }
    } catch (error) {
      console.error('Failed to get gas price recommendations:', error);
      
      // Fallback recommendations
      const fallbackPrice = ethers.parseUnits('20', 'gwei');
      return {
        slow: (fallbackPrice * 80n) / 100n,
        standard: fallbackPrice,
        fast: (fallbackPrice * 120n) / 100n,
      };
    }
  }
}
