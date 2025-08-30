'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { useWallet } from '@/hooks/useWallet'
import { LocalStorageCache } from './cache-manager'

interface UserProfile {
  firstName?: string
  lastName?: string
  email?: string
  institution?: string
  bio?: string
  avatarUrl?: string
  wallet?: string
  allComplete?: boolean
}

interface UserState {
  profile: UserProfile | null
  checklist: any[]
  isLoading: boolean
  isCached: boolean
  lastUpdated: number | null
}

type UserAction =
  | { type: 'SET_PROFILE'; payload: UserProfile }
  | { type: 'SET_CHECKLIST'; payload: any[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CACHED'; payload: boolean }
  | { type: 'UPDATE_LAST_UPDATED' }
  | { type: 'CLEAR_USER_DATA' }
  | { type: 'REFRESH_DATA' }

const initialState: UserState = {
  profile: null,
  checklist: [],
  isLoading: false,
  isCached: false,
  lastUpdated: null,
}

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'SET_PROFILE':
      return {
        ...state,
        profile: action.payload,
        lastUpdated: Date.now(),
      }
    case 'SET_CHECKLIST':
      return {
        ...state,
        checklist: action.payload,
        lastUpdated: Date.now(),
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }
    case 'SET_CACHED':
      return {
        ...state,
        isCached: action.payload,
      }
    case 'UPDATE_LAST_UPDATED':
      return {
        ...state,
        lastUpdated: Date.now(),
      }
    case 'CLEAR_USER_DATA':
      return initialState
    case 'REFRESH_DATA':
      return {
        ...state,
        isLoading: true,
        isCached: false,
      }
    default:
      return state
  }
}

interface UserContextType {
  state: UserState
  dispatch: React.Dispatch<UserAction>
  updateProfile: (profile: UserProfile) => void
  updateChecklist: (checklist: any[]) => void
  clearUserData: () => void
  refreshUserData: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState)
  const { walletAddress, walletConnected } = useWallet()

  // Load cached data on mount
  useEffect(() => {
    if (typeof window === 'undefined' || !walletAddress) return

    try {
      // Load cached profile
      const cachedProfile = LocalStorageCache.get(`profile-${walletAddress}`)
      if (cachedProfile) {
        dispatch({ type: 'SET_PROFILE', payload: cachedProfile })
        dispatch({ type: 'SET_CACHED', payload: true })
      }

      // Load cached checklist
      const cachedChecklist = LocalStorageCache.get(`checklist-${walletAddress}`)
      if (cachedChecklist) {
        dispatch({ type: 'SET_CHECKLIST', payload: cachedChecklist.checklist || [] })
      }
    } catch (error) {
      console.warn('Failed to load cached user data:', error)
    }
  }, [walletAddress])

  // Clear user data when wallet disconnects
  useEffect(() => {
    if (!walletConnected) {
      dispatch({ type: 'CLEAR_USER_DATA' })
    }
  }, [walletConnected])

  const updateProfile = (profile: UserProfile) => {
    dispatch({ type: 'SET_PROFILE', payload: profile })
  }

  const updateChecklist = (checklist: any[]) => {
    dispatch({ type: 'SET_CHECKLIST', payload: checklist })
  }

  const clearUserData = () => {
    dispatch({ type: 'CLEAR_USER_DATA' })
    // Clear localStorage cache
    if (typeof window !== 'undefined' && walletAddress) {
      LocalStorageCache.delete(`profile-${walletAddress}`)
      LocalStorageCache.delete(`checklist-${walletAddress}`)
    }
  }

  const refreshUserData = () => {
    dispatch({ type: 'REFRESH_DATA' })
  }

  const value: UserContextType = {
    state,
    dispatch,
    updateProfile,
    updateChecklist,
    clearUserData,
    refreshUserData,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
