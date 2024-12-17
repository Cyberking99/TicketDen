"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Mock data for user tickets
const mockTickets = [
  { id: 1, eventName: 'Summer Music Festival', date: '2023-07-15', tokenId: '12345' },
  { id: 2, eventName: 'Tech Conference 2023', date: '2023-08-22', tokenId: '67890' },
]

export function UserTickets() {
  const [tickets] = useState(mockTickets)

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">My Tickets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id}>
            <CardHeader>
              <CardTitle>{ticket.eventName}</CardTitle>
              <CardDescription>{ticket.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>NFT Token ID: {ticket.tokenId}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

