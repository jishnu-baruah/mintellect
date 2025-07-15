export enum UserTier {
  Free = "free",
  Premium = "premium",
}

export interface UserModel {
  _id: string
  ocid: string // On-Chain ID for blockchain integration
  name: string
  email?: string
  mail?: string
  walletAddress?: string
  userTier: UserTier
  credits: number
  avatar: string // URL to avatar image
  refreshToken?: string // Optional for authentication
}

