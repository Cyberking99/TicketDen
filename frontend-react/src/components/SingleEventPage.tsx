"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAccount, useReadContract, usePublicClient } from "wagmi"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { 
  CalendarDays, 
  Users, 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  Clock, 
  Ticket, 
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react"
import { wagmiContractConfig } from "@/lib/wagmiContractConfig"
import ticketDenNFTAbi from "../../ABIs/TicketDenNFT.json"
import { parseAbiItem } from "viem"

interface EventDetails {
  id: number
  name: string
  slug: string
  description: string
  location: string
  imageCID: string
  date: string
  time: string
  ticketPrice: number
  ticketSupply: number
  ticketsSold: number
  revenue: string
  ticketContract: string
  creator: string
  status: string
  salesData: { date: string; tickets: number; revenue: number }[]
  buyers: { 
    address: string
    tickets: number
    purchaseDate: string
    transactionHash: string
  }[]
  analytics: {
    salesVelocity: string
    averageTicketsPerBuyer: number
    sellThroughRate: number
    peakSalesDay: string
    conversionMetrics: {
      uniqueVisitors: number
      purchases: number
      conversionRate: string
    }
  }
}

interface SingleEventAnalyticsProps {
  eventId: string
  onBack?: () => void
}

const SingleEventAnalytics: React.FC<SingleEventAnalyticsProps> = ({ 
  eventId, 
  onBack 
}) => {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()

  const { data: fetchedEvents } = useReadContract({
    ...wagmiContractConfig,
    functionName: "getAllEvents",
  })

  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadEventDetails = async () => {
      if (!isConnected || !fetchedEvents || !publicClient) return

      setLoading(true)
      setError(null)

      try {
        // Find the specific event
        const event = (fetchedEvents as any[]).find(
          ev => ev.id.toString() === eventId && ev.creator === address
        )

        if (!event) {
          setError("Event not found or you don't have permission to view this event.")
          setLoading(false)
          return
        }

        // Get detailed data from NFT contract
        const [ticketsSold, eventName, eventLocation, eventDate, eventTime, ticketPrice, ticketSupply] = await Promise.all([
          publicClient.readContract({
            address: event.ticketContract as `0x${string}`,
            abi: ticketDenNFTAbi,
            functionName: "ticketsSold",
          }),
          publicClient.readContract({
            address: event.ticketContract as `0x${string}`,
            abi: ticketDenNFTAbi,
            functionName: "eventName",
          }),
          publicClient.readContract({
            address: event.ticketContract as `0x${string}`,
            abi: ticketDenNFTAbi,
            functionName: "eventLocation",
          }),
          publicClient.readContract({
            address: event.ticketContract as `0x${string}`,
            abi: ticketDenNFTAbi,
            functionName: "eventDate",
          }),
          publicClient.readContract({
            address: event.ticketContract as `0x${string}`,
            abi: ticketDenNFTAbi,
            functionName: "eventTime",
          }),
          publicClient.readContract({
            address: event.ticketContract as `0x${string}`,
            abi: ticketDenNFTAbi,
            functionName: "ticketPrice",
          }),
          publicClient.readContract({
            address: event.ticketContract as `0x${string}`,
            abi: ticketDenNFTAbi,
            functionName: "ticketSupply",
          }),
        ])

        // Calculate revenue
        const revenueEth = (Number(ticketsSold) * Number(ticketPrice)) / 1e18

        // Get purchase events with transaction details
        let logs: any[] = []
        try {
          logs = await publicClient.getLogs({
            address: event.ticketContract as `0x${string}`,
            event: parseAbiItem("event TicketPurchased(address indexed buyer, uint256 indexed eventId, uint256 quantity)"),
            fromBlock: 0n,
            toBlock: "latest",
          })
            console.log("Fetched TicketPurchased logs:", logs)
        } catch (logError) {
          console.warn(`Could not fetch TicketPurchased logs:`, logError)
        }

        // Process buyer data and sales timeline
        const buyerMap: Record<string, { 
          tickets: number
          firstPurchase: Date
          transactionHash: string 
        }> = {}
        const salesByDay: Record<string, { tickets: number; revenue: number }> = {}

        for (const log of logs) {
          if (log.args && log.args.buyer && log.args.ticketId !== undefined) {
            const buyer = log.args.buyer as string
            const block = await publicClient.getBlock({ blockHash: log.blockHash })
            const purchaseDate = new Date(Number(block.timestamp) * 1000)
            const dayKey = purchaseDate.toISOString().split('T')[0]

            // Update buyer info
            if (!buyerMap[buyer]) {
              buyerMap[buyer] = {
                tickets: 0,
                firstPurchase: purchaseDate,
                transactionHash: log.transactionHash
              }
            }
            buyerMap[buyer].tickets += 1

            // Update daily sales
            if (!salesByDay[dayKey]) {
              salesByDay[dayKey] = { tickets: 0, revenue: 0 }
            }
            salesByDay[dayKey].tickets += 1
            salesByDay[dayKey].revenue += Number(ticketPrice) / 1e18
          }
        }

        // Convert to arrays for display
        const buyers = Object.entries(buyerMap).map(([addr, data]) => ({
          address: addr,
          tickets: data.tickets,
          purchaseDate: data.firstPurchase.toLocaleDateString(),
          transactionHash: data.transactionHash,
        }))

        const salesData = Object.entries(salesByDay)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, data]) => ({
            date,
            tickets: data.tickets,
            revenue: data.revenue,
          }))

        // Determine event status
        const eventDateObj = new Date(Number(eventDate) * 1000)
        const now = new Date()
        let status = "upcoming"
        if (eventDateObj < now) {
          status = "completed"
        } else if (eventDateObj.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
          status = "active"
        }

        // Calculate analytics
        const sellThroughRate = (Number(ticketsSold) / Number(ticketSupply)) * 100
        const averageTicketsPerBuyer = buyers.length > 0 ? Number(ticketsSold) / buyers.length : 0
        const peakSalesDay = salesData.reduce(
          (max, day) => day.tickets > max.tickets ? day : max,
          { date: "N/A", tickets: 0, revenue: 0 }
        )

        // Calculate sales velocity (tickets per day since first sale)
        const firstSaleDate = salesData[0]?.date
        const salesVelocity = firstSaleDate 
          ? (Number(ticketsSold) / Math.max(1, Math.ceil((now.getTime() - new Date(firstSaleDate).getTime()) / (24 * 60 * 60 * 1000)))).toFixed(1)
          : "0"

        const eventDetailsData: EventDetails = {
          id: Number(event.id),
          name: eventName as string,
          slug: event.slug,
          description: event.description,
          location: eventLocation as string,
          imageCID: event.imageCID,
          date: eventDateObj.toLocaleDateString(),
          time: new Date(Number(eventTime) * 1000).toLocaleTimeString(),
          ticketPrice: Number(ticketPrice) / 1e18,
          ticketSupply: Number(ticketSupply),
          ticketsSold: Number(ticketsSold),
          revenue: `${revenueEth.toFixed(4)} ETH`,
          ticketContract: event.ticketContract,
          creator: event.creator,
          status,
          salesData,
          buyers,
          analytics: {
            salesVelocity: `${salesVelocity} tickets/day`,
            averageTicketsPerBuyer: Number(averageTicketsPerBuyer.toFixed(1)),
            sellThroughRate: Number(sellThroughRate.toFixed(1)),
            peakSalesDay: peakSalesDay.date !== "N/A" ? new Date(peakSalesDay.date).toLocaleDateString() : "N/A",
            conversionMetrics: {
              uniqueVisitors: 0, // This would need off-chain tracking
              purchases: buyers.length,
              conversionRate: "N/A"
            }
          }
        }

        setEventDetails(eventDetailsData)
      } catch (err) {
        console.error("Error loading event details:", err)
        setError("Failed to load event details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadEventDetails()
  }, [isConnected, fetchedEvents, eventId, address, publicClient])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "active":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "upcoming":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />
    }
  }

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

  if (!isConnected) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Event Analytics</h1>
        <p>Please connect your wallet to view event analytics.</p>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading event details...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !eventDetails) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Error</h1>
          <p className="text-muted-foreground mb-4">{error || "Event not found"}</p>
          {onBack && (
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold">{eventDetails.name}</h1>
              {getStatusIcon(eventDetails.status)}
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                <span>{eventDetails.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{eventDetails.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{eventDetails.location}</span>
              </div>
              {getStatusBadge(eventDetails.status)}
            </div>
          </div>
        </div>
        {/* <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div> */}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventDetails.ticketSupply}</div>
            <div className="text-xs text-muted-foreground">
              {eventDetails.ticketSupply - eventDetails.ticketsSold} tickets remaining
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventDetails.ticketsSold}</div>
            <div className="text-xs text-muted-foreground">
              of {eventDetails.ticketSupply} available
            </div>
            <Progress 
              value={(eventDetails.ticketsSold / eventDetails.ticketSupply) * 100} 
              className="mt-2 h-1"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventDetails.revenue}</div>
            <div className="text-xs text-muted-foreground">
              {eventDetails.ticketPrice} ETH per ticket
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sell-through Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventDetails.analytics.sellThroughRate}%</div>
            <div className="text-xs text-muted-foreground">
              {eventDetails.analytics.salesVelocity}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm mt-1">{eventDetails.description || "No description provided"}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date & Time</label>
                    <p className="text-sm mt-1">{eventDetails.date} at {eventDetails.time}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Location</label>
                    <p className="text-sm mt-1">{eventDetails.location}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Contract Address</label>
                  <code className="text-xs bg-muted px-2 py-1 rounded block mt-1">
                    {eventDetails.ticketContract}
                  </code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle></CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative w-full pt-[50%]">
                    <img
                        src={`https://gateway.pinata.cloud/ipfs/${eventDetails.imageCID}`}
                        alt={`${eventDetails.name} banner`}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}

export default SingleEventAnalytics