"use client"

import { useState } from 'react'
import { Header } from '../components/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// Mock data for admin dashboard
const mockAnalytics = {
  totalEvents: 10,
  totalTicketsSold: 150,
  totalRevenue: '5.5 ETH',
}

const mockTickets = [
  { id: 1, eventName: 'Summer Music Festival', buyer: '0x1234...5678', tokenId: '12345' },
  { id: 2, eventName: 'Tech Conference 2023', buyer: '0x9876...5432', tokenId: '67890' },
  { id: 3, eventName: 'Art Exhibition', buyer: '0x2468...1357', tokenId: '13579' },
]

export default function AdminDashboard() {
  const [analytics] = useState(mockAnalytics)
  const [tickets] = useState(mockTickets)

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{analytics.totalEvents}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Tickets Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{analytics.totalTicketsSold}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{analytics.totalRevenue}</p>
            </CardContent>
          </Card>
        </div>
        <h2 className="text-xl font-bold mb-4">Ticket Management</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Name</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Token ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.eventName}</TableCell>
                <TableCell>{ticket.buyer}</TableCell>
                <TableCell>{ticket.tokenId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  )
}

