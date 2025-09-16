"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAccount, useReadContract, usePublicClient } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { CalendarDays, DollarSign, TrendingUp, Ticket } from "lucide-react"
import { wagmiContractConfig } from "@/lib/wagmiContractConfig"
import ticketDenNFTAbi from "../../ABIs/TicketDenNFT.json"
import SingleEventAnalytics from '@/components/SingleEventPage'
import { parseAbiItem } from "viem"

interface EventData {
  id: number
  name: string
  date: string
  status: string
  ticketsSold: number
  ticketPrice: number
  revenue: string
  ticketContract: string
  buyers: { address: string; tickets: number }[]
}

const EventAnalyticsPage: React.FC = () => {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  const { data: fetchedEvents } = useReadContract({
    ...wagmiContractConfig,
    functionName: "getAllEvents",
  })

  const [events, setEvents] = useState<EventData[]>([])
  const [analytics, setAnalytics] = useState({
    totalEvents: 0,
    totalTicketsSold: 0,
    totalRevenue: "0 ETH",
    averageTicketPrice: "0 ETH",
    totalViews: 0,
    conversionRate: "0%",
  })

  useEffect(() => {
    const loadEvents = async () => {
      if (!isConnected || !fetchedEvents || !publicClient) return

      const myEvents = (fetchedEvents as any[]).filter((ev) => ev.creator === address)

      console.log(myEvents)

      const enriched: EventData[] = []
      let totalTickets = 0
      let totalRevenue = 0

      for (const ev of myEvents) {
        try {
          // Get tickets sold from the NFT contract
          const ticketsSold = await publicClient.readContract({
            address: ev.ticketContract as `0x${string}`,
            abi: ticketDenNFTAbi,
            functionName: "ticketsSold", // This exists in your TicketDenNFT contract
          })

          // Calculate revenue
          const revenueEth = (Number(ticketsSold) * Number(ev.ticketPrice)) / 1e18

          // Get unique buyers by fetching TicketPurchased events
          let logs: any[] = []
          try {
            logs = await publicClient.getLogs({
              address: ev.ticketContract as `0x${string}`,
              event: parseAbiItem("event TicketPurchased(address indexed buyer, uint256 indexed eventId, uint256 quantity)"),
              fromBlock: 0n,
              toBlock: "latest",
            })
            console.log("Fetched TicketPurchased logs:", logs)
          } catch (logError) {
            console.warn(`Could not fetch TicketPurchased logs for event ${ev.id}:`, logError)
            // Continue without buyer data if logs fail
          }

          // Count tickets per buyer
          const buyerMap: Record<string, number> = {}
          logs.forEach((log) => {
            console.log("TicketPurchased log:", log)
            
            // Check if this is actually a TicketPurchased event by verifying args exist
            if (log.args && log.args.buyer && log.args.ticketId !== undefined) {
              const buyer = log.args.buyer as string
              
              // For ERC1155, we need to get the balance for each buyer
              // Since we don't have quantity in the event, we'll count occurrences
              buyerMap[buyer] = (buyerMap[buyer] || 0) + 1
            }
          })

          // Alternative approach: Get buyers from the main TicketDen contract
          // This uses the userPurchases mapping to find who bought tickets for this event
          let alternativeBuyers: { address: string; tickets: number }[] = []
          
          try {
            // We could query the main contract for all users who purchased this event
            // But since we don't have a direct way to enumerate all users, 
            // we'll rely on the event logs approach first, then fall back to this
            
            // For now, if event logs don't work, we'll show empty buyer data
            // You might want to implement a getAllBuyers function in your contract
            
          } catch (stateError) {
            console.warn(`Could not fetch buyer state for event ${ev.id}:`, stateError)
          }

          // Use event logs data if available, otherwise use alternative approach
          const buyers = Object.entries(buyerMap).map(([addr, count]) => ({
            address: addr,
            tickets: count,
          })).concat(alternativeBuyers)

          // Determine event status based on current date
          const eventDate = new Date(Number(ev.date) * 1000)
          const now = new Date()
          let status = "upcoming"
          if (eventDate < now) {
            status = "completed"
          } else if (eventDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000) { // Within 24 hours
            status = "active"
          }

          enriched.push({
            id: Number(ev.id),
            name: ev.name,
            date: eventDate.toLocaleDateString(),
            status,
            ticketsSold: Number(ticketsSold),
            ticketPrice: Number(ev.ticketPrice) / 1e18,
            revenue: `${revenueEth.toFixed(4)} ETH`,
            ticketContract: ev.ticketContract,
            buyers,
          })

          totalTickets += Number(ticketsSold)
          totalRevenue += revenueEth
        } catch (error) {
          console.error(`Error processing event ${ev.id}:`, error)
          // Still add the event with basic data even if some calls fail
          enriched.push({
            id: Number(ev.id),
            name: ev.name,
            date: new Date(Number(ev.date) * 1000).toLocaleDateString(),
            status: "unknown",
            ticketsSold: 0,
            ticketPrice: Number(ev.ticketPrice) / 1e18,
            revenue: "0 ETH",
            ticketContract: ev.ticketContract,
            buyers: [],
          })
        }
      }

      setEvents(enriched)
      
      // Calculate analytics
      const avgTicketPrice = totalTickets > 0 ? totalRevenue / totalTickets : 0
      
      setAnalytics({
        totalEvents: enriched.length,
        totalTicketsSold: totalTickets,
        totalRevenue: `${totalRevenue.toFixed(4)} ETH`,
        averageTicketPrice: `${avgTicketPrice.toFixed(4)} ETH`,
        totalViews: 0, // This would need to be tracked off-chain
        conversionRate: "N/A", // This would need view data
      })
    }

    loadEvents()
  }, [isConnected, fetchedEvents, address, publicClient])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="secondary">Completed</Badge>
      case "active":
        return <Badge variant="default">Active</Badge>
      case "upcoming":
        return <Badge variant="outline">Upcoming</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

//   const getProgressPercentage = (sold: number, total: number) => {
//     if (!total) return 0
//     return Math.round((sold / total) * 100)
//   }
  

  if (selectedEventId) {
    return <SingleEventAnalytics eventId={selectedEventId} onBack={() => setSelectedEventId(null)} />
  }

  if (!isConnected) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Event Analytics</h1>
        <p>Please connect your wallet to view your event analytics.</p>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Event Analytics</h1>
        <Button>Export Report</Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalEvents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalTicketsSold}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalRevenue}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Ticket Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageTicketPrice}</div>
          </CardContent>
        </Card>
      </div>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Event Performance</CardTitle>
          <CardDescription>Detailed analytics for all your events</CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No events found. Create your first event to see analytics here.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tickets Sold</TableHead>
                  <TableHead>Ticket Price</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell>{event.date}</TableCell>
                    <TableCell>{getStatusBadge(event.status)}</TableCell>
                    <TableCell>{event.ticketsSold}</TableCell>
                    <TableCell>{event.ticketPrice.toFixed(4)} ETH</TableCell>
                    <TableCell>{event.revenue}</TableCell>
                    <TableCell>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedEventId(event.id.toString())}
                    >
                        View Analytics
                    </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Detailed Buyers Information */}
      {events.some(e => e.buyers.length > 0) && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Buyer Details</CardTitle>
            <CardDescription>Detailed information about ticket buyers for each event</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {events
                .filter(event => event.buyers.length > 0)
                .map((event) => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3">{event.name}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {event.buyers.map((buyer, i) => (
                        <div key={i} className="flex items-center justify-between bg-muted p-2 rounded">
                          <code className="text-sm">
                            {buyer.address.slice(0, 6)}...{buyer.address.slice(-4)}
                          </code>
                          <Badge variant="outline">{buyer.tickets} ticket{buyer.tickets !== 1 ? 's' : ''}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  )
}

export default EventAnalyticsPage