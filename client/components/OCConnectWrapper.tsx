"use client"

import { ReactNode } from "react"
import { OCConnect } from "@opencampus/ocid-connect-js"

interface OCConnectWrapperProps {
  children: ReactNode
  opts: {
    redirectUri: string
    referralCode: string
  }
  sandboxMode: boolean
}

export default function OCConnectWrapper({ children, opts, sandboxMode }: OCConnectWrapperProps) {
  return (
    <OCConnect
      opts={{
        ...opts,
        redirectUri: "http://localhost:3001/redirect",
        referralCode: "PARTNER6",
      }}
      sandboxMode={sandboxMode}
    >
      {children}
    </OCConnect>
  );
}
