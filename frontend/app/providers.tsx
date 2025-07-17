"use client"

import React from "react"
import type { ReactNode } from "react"
import { WagmiProvider, createConfig } from "wagmi"
import { injected } from "wagmi/connectors"
import { opBNBTestnet } from "wagmi/chains"
import { http } from "viem"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const config = createConfig({
  chains: [opBNBTestnet],
  transports: {
    [opBNBTestnet.id]: http("https://opbnb-testnet-rpc.bnbchain.org"),
  },
  connectors: [
    injected(),
  ],
})

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
