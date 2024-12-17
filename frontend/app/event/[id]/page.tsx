"use client"

import { useState } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Header } from '../../components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Mock event data (in a real app, you'd fetch this based on the event ID)
const mockEvent = {
  id: 1,
  name: 'Summer Music Festival',
  date: '2023-07-15',
  price: '0.1 ETH',
  image: '/placeholder.svg?height=400&width=800',
  description: 'Join us for an unforgettable summer music experience featuring top artists from around the world. Enjoy a day filled with great music, food, and memories that will last a lifetime.',
}

export default function EventPurchase() {
  const params = useParams()
  const [quantity, setQuantity] = useState(1)

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder for purchase logic
    console.log(`Purchasing ${quantity} ticket(s) for event ${params.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="overflow-hidden">
          <div className="relative w-full pt-[50%]">
            <Image
              src={mockEvent.image}
              alt={`${mockEvent.name} flyer`}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <CardHeader>
            <CardTitle className="text-3xl">{mockEvent.name}</CardTitle>
            <CardDescription>{mockEvent.date}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{mockEvent.description}</p>
            <p className="text-xl font-bold">Price: {mockEvent.price} per ticket</p>
          </CardContent>
          <CardFooter>
            <form onSubmit={handlePurchase} className="w-full space-y-4">
              <div>
                <Label htmlFor="quantity">Number of Tickets</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="max-w-[100px]"
                />
              </div>
              <div>
                <p className="mb-2">Total: {parseFloat(mockEvent.price) * quantity} ETH</p>
                <Button type="submit" className="w-full sm:w-auto">Purchase Tickets</Button>
              </div>
            </form>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

