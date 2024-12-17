"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Mock data for events
const mockEvents = [
  { id: 1, name: 'Summer Music Festival', date: '2023-07-15', price: '0.1 ETH', image: '/placeholder.svg?height=200&width=300' },
  { id: 2, name: 'Tech Conference 2023', date: '2023-08-22', price: '0.05 ETH', image: '/placeholder.svg?height=200&width=300' },
  { id: 3, name: 'Art Exhibition', date: '2023-09-10', price: '0.03 ETH', image: '/placeholder.svg?height=200&width=300' },
]

export function EventList() {
  const [events] = useState(mockEvents)

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <Card key={event.id} className="flex flex-col">
            <div className="relative w-full pt-[56.25%]">
              <Image
                src={event.image}
                alt={`${event.name} flyer`}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
              />
            </div>
            <CardHeader>
              <CardTitle>{event.name}</CardTitle>
              <CardDescription>{event.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Price: {event.price}</p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Link href={`/event/${event.id}`} className="w-full">
                <Button className="w-full">View Event</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}

