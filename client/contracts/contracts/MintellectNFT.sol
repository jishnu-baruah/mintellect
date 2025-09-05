// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MintellectNFT
 * @dev Optimized ERC721 contract for Mintellect platform with public minting
 * Features:
 * - Gas-optimized minting (<300k gas)
 * - Public minting with EDU token payment
 * - Base URI management for IPFS metadata
 * - Ownable access control
 * - ReentrancyGuard for security
 * - Simple uint256 counter for token IDs (more gas efficient than Counters library)
 */
contract MintellectNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _tokenIds = 0;
    string private _baseTokenURI;
    
    // Minting configuration
    uint256 public mintPrice = 0.01 ether; // Default price in EDU (1:1 with ETH for simplicity)
    bool public publicMintingEnabled = true;
    uint256 public maxTokensPerWallet = 10; // Anti-spam protection
    uint256 public maxTotalSupply = 10000; // Maximum total supply
    
    // Track minting per wallet
    mapping(address => uint256) public walletMintCount;
    
    // Events
    event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event PublicNFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI, uint256 price);
    event BaseURIUpdated(string oldURI, string newURI);
    event MintPriceUpdated(uint256 oldPrice, uint256 newPrice);
    event PublicMintingToggled(bool enabled);
    event MaxSupplyUpdated(uint256 oldMax, uint256 newMax);
    event MaxTokensPerWalletUpdated(uint256 oldMax, uint256 newMax);
    
    constructor() ERC721("MintellectNFT", "MINT") Ownable(msg.sender) {
        _baseTokenURI = "";
    }
    
    /**
     * @dev Public minting function - allows anyone to mint by paying the mint price
     * @param tokenURI IPFS CID or relative path (will be combined with baseURI)
     * @return tokenId The ID of the newly minted token
     */
    function mintPublic(string memory tokenURI) 
        public 
        payable 
        nonReentrant
        returns (uint256) 
    {
        require(publicMintingEnabled, "Public minting is disabled");
        require(msg.value >= mintPrice, "Insufficient payment");
        require(bytes(tokenURI).length > 0, "Token URI cannot be empty");
        require(_tokenIds < maxTotalSupply, "Maximum supply reached");
        require(walletMintCount[msg.sender] < maxTokensPerWallet, "Max tokens per wallet exceeded");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        // Update wallet mint count
        walletMintCount[msg.sender]++;
        
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        emit PublicNFTMinted(msg.sender, newTokenId, tokenURI, msg.value);
        return newTokenId;
    }
    
    /**
     * @dev Batch public minting - allows minting multiple NFTs in one transaction
     * @param tokenURIs Array of IPFS CIDs or relative paths
     * @return startTokenId The starting ID of the minted tokens
     */
    function batchMintPublic(string[] memory tokenURIs) 
        public 
        payable 
        nonReentrant
        returns (uint256 startTokenId) 
    {
        require(publicMintingEnabled, "Public minting is disabled");
        require(tokenURIs.length > 0, "Token URIs array cannot be empty");
        require(tokenURIs.length <= 5, "Maximum 5 tokens per batch");
        require(msg.value >= mintPrice * tokenURIs.length, "Insufficient payment");
        require(_tokenIds + tokenURIs.length <= maxTotalSupply, "Maximum supply would be exceeded");
        require(walletMintCount[msg.sender] + tokenURIs.length <= maxTokensPerWallet, "Max tokens per wallet would be exceeded");
        
        startTokenId = _tokenIds + 1;
        
        for (uint256 i = 0; i < tokenURIs.length; i++) {
            require(bytes(tokenURIs[i]).length > 0, "Token URI cannot be empty");
            
            _tokenIds++;
            uint256 newTokenId = _tokenIds;
            
            _safeMint(msg.sender, newTokenId);
            _setTokenURI(newTokenId, tokenURIs[i]);
            
            emit PublicNFTMinted(msg.sender, newTokenId, tokenURIs[i], mintPrice);
        }
        
        // Update wallet mint count
        walletMintCount[msg.sender] += tokenURIs.length;
        
        return startTokenId;
    }
    
    /**
     * @dev Admin minting function - original onlyOwner function
     * @param to Address to mint the NFT to
     * @param tokenURI IPFS CID or relative path (will be combined with baseURI)
     * @return tokenId The ID of the newly minted token
     */
    function mintNFT(address to, string memory tokenURI) 
        public 
        onlyOwner 
        returns (uint256) 
    {
        require(to != address(0), "Invalid recipient address");
        require(bytes(tokenURI).length > 0, "Token URI cannot be empty");
        require(_tokenIds < maxTotalSupply, "Maximum supply reached");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        emit NFTMinted(to, newTokenId, tokenURI);
        return newTokenId;
    }
    
    /**
     * @dev Batch mint multiple NFTs (gas efficient for multiple mints) - admin only
     * @param to Address to mint the NFTs to
     * @param tokenURIs Array of IPFS CIDs or relative paths
     * @return startTokenId The starting ID of the minted tokens
     */
    function batchMintNFT(address to, string[] memory tokenURIs) 
        public 
        onlyOwner 
        returns (uint256 startTokenId) 
    {
        require(to != address(0), "Invalid recipient address");
        require(tokenURIs.length > 0, "Token URIs array cannot be empty");
        require(tokenURIs.length <= 100, "Maximum 100 tokens per batch");
        require(_tokenIds + tokenURIs.length <= maxTotalSupply, "Maximum supply would be exceeded");
        
        startTokenId = _tokenIds + 1;
        
        for (uint256 i = 0; i < tokenURIs.length; i++) {
            require(bytes(tokenURIs[i]).length > 0, "Token URI cannot be empty");
            
            _tokenIds++;
            uint256 newTokenId = _tokenIds;
            
            _safeMint(to, newTokenId);
            _setTokenURI(newTokenId, tokenURIs[i]);
            
            emit NFTMinted(to, newTokenId, tokenURIs[i]);
        }
        
        return startTokenId;
    }
    
    /**
     * @dev Set the mint price for public minting
     * @param newPrice New mint price in wei
     */
    function setMintPrice(uint256 newPrice) public onlyOwner {
        require(newPrice > 0, "Mint price must be greater than 0");
        uint256 oldPrice = mintPrice;
        mintPrice = newPrice;
        emit MintPriceUpdated(oldPrice, newPrice);
    }
    
    /**
     * @dev Toggle public minting on/off
     * @param enabled Whether public minting should be enabled
     */
    function setPublicMintingEnabled(bool enabled) public onlyOwner {
        publicMintingEnabled = enabled;
        emit PublicMintingToggled(enabled);
    }
    
    /**
     * @dev Set maximum total supply
     * @param newMaxSupply New maximum total supply
     */
    function setMaxTotalSupply(uint256 newMaxSupply) public onlyOwner {
        require(newMaxSupply >= _tokenIds, "Max supply cannot be less than current supply");
        uint256 oldMax = maxTotalSupply;
        maxTotalSupply = newMaxSupply;
        emit MaxSupplyUpdated(oldMax, newMaxSupply);
    }
    
    /**
     * @dev Set maximum tokens per wallet
     * @param newMaxPerWallet New maximum tokens per wallet
     */
    function setMaxTokensPerWallet(uint256 newMaxPerWallet) public onlyOwner {
        require(newMaxPerWallet > 0, "Max tokens per wallet must be greater than 0");
        uint256 oldMax = maxTokensPerWallet;
        maxTokensPerWallet = newMaxPerWallet;
        emit MaxTokensPerWalletUpdated(oldMax, newMaxPerWallet);
    }
    
    /**
     * @dev Set the base URI for all tokens (optimized for IPFS)
     * @param baseURI The base URI (e.g., "ipfs://" or "https://gateway.pinata.cloud/ipfs/")
     */
    function setBaseURI(string memory baseURI) public onlyOwner {
        string memory oldURI = _baseTokenURI;
        _baseTokenURI = baseURI;
        emit BaseURIUpdated(oldURI, baseURI);
    }
    
    /**
     * @dev Get the current base URI
     * @return The current base URI
     */
    function getBaseURI() public view returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @dev Get the total number of tokens minted
     * @return The total number of tokens
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIds;
    }
    
    /**
     * @dev Get the next token ID that will be minted
     * @return The next token ID
     */
    function getNextTokenId() public view returns (uint256) {
        return _tokenIds + 1;
    }
    
    /**
     * @dev Get minting statistics for a wallet
     * @param wallet The wallet address to check
     * @return minted The number of tokens minted by this wallet
     * @return remaining The remaining tokens this wallet can mint
     */
    function getWalletMintStats(address wallet) public view returns (uint256 minted, uint256 remaining) {
        minted = walletMintCount[wallet];
        remaining = maxTokensPerWallet > minted ? maxTokensPerWallet - minted : 0;
    }
    
    /**
     * @dev Get contract configuration
     * @return price Current mint price
     * @return enabled Whether public minting is enabled
     * @return maxSupply Maximum total supply
     * @return maxPerWallet Maximum tokens per wallet
     * @return currentSupply Current total supply
     */
    function getMintingConfig() public view returns (
        uint256 price,
        bool enabled,
        uint256 maxSupply,
        uint256 maxPerWallet,
        uint256 currentSupply
    ) {
        return (mintPrice, publicMintingEnabled, maxTotalSupply, maxTokensPerWallet, _tokenIds);
    }
    
    /**
     * @dev Override _baseURI to use our custom base URI
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @dev Withdraw contract balance to owner
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Emergency function to recover stuck tokens (only owner)
     * @param tokenAddress The token contract address
     * @param to The address to send tokens to
     * @param amount The amount to recover
     */
    function emergencyRecoverERC20(
        address tokenAddress, 
        address to, 
        uint256 amount
    ) public onlyOwner {
        require(to != address(0), "Invalid recipient address");
        require(tokenAddress != address(0), "Invalid token address");
        
        // Transfer ERC20 tokens
        (bool success, ) = tokenAddress.call(
            abi.encodeWithSignature("transfer(address,uint256)", to, amount)
        );
        require(success, "ERC20 transfer failed");
    }
    
    /**
     * @dev Emergency function to recover stuck ETH (only owner)
     * @param to The address to send ETH to
     */
    function emergencyRecoverETH(address to) public onlyOwner {
        require(to != address(0), "Invalid recipient address");
        
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to recover");
        
        (bool success, ) = to.call{value: balance}("");
        require(success, "ETH transfer failed");
    }
}