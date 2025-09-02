// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MintellectNFT
 * @dev Optimized ERC721 contract for Mintellect platform
 * Features:
 * - Gas-optimized minting (<300k gas)
 * - Base URI management for IPFS metadata
 * - Ownable access control
 * - Simple uint256 counter for token IDs (more gas efficient than Counters library)
 */
contract MintellectNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds = 0;
    string private _baseTokenURI;
    
    // Events
    event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event BaseURIUpdated(string oldURI, string newURI);
    
    constructor() ERC721("MintellectNFT", "MINT") Ownable(msg.sender) {
        _baseTokenURI = "";
    }
    
    /**
     * @dev Mints a new NFT with optimized gas usage
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
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        emit NFTMinted(to, newTokenId, tokenURI);
        return newTokenId;
    }
    
    /**
     * @dev Batch mint multiple NFTs (gas efficient for multiple mints)
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
     * @dev Override _baseURI to use our custom base URI
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
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