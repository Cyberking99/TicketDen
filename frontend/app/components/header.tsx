"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function Header() {
  // Use wagmi hooks to handle account, connection, and disconnection logic
  const { isConnected, address } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  // Handle connecting with the first available connector
  const handleConnect = () => {
    // if (connectors.length > 0) {
    //   connect(connectors[0])
    // }
  }

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          BlockTix
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/events" className="text-gray-600 hover:text-gray-900">
            Events
          </Link>
          <Link href="/create-event" className="text-gray-600 hover:text-gray-900">
            Create Event
          </Link>
          {isConnected && (
            <Link href="/my-tickets" className="text-gray-600 hover:text-gray-900">
              My Tickets
            </Link>
          )}
          {isConnected ? (
            <>
              <Button variant="secondary" onClick={() => disconnect()}>
                Disconnect
              </Button>
              <span className="text-gray-600">{address}</span> {/* Display the connected address */}
            </>
          ) : (
            <Button onClick={handleConnect}>Connect Wallet</Button>
          )}
        </div>
      </nav>
    </header>
  )
}
