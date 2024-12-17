import Link from 'next/link'
import Image from 'next/image'
import { Header } from './components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

// Mock data for featured events
const featuredEvents = [
  { id: 1, name: 'Summer Music Festival', date: '2023-07-15', image: '/placeholder.svg?height=200&width=300' },
  { id: 2, name: 'Tech Conference 2023', date: '2023-08-22', image: '/placeholder.svg?height=200&width=300' },
  { id: 3, name: 'Art Exhibition', date: '2023-09-10', image: '/placeholder.svg?height=200&width=300' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to BlockTix</h1>
          <p className="text-xl mb-8">Secure, transparent, and easy event ticketing on the blockchain</p>
          <Link href="/events">
            <Button size="lg" variant="secondary">Explore Events</Button>
          </Link>
        </section>

        {/* Featured Events */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Featured Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredEvents.map((event) => (
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
                <CardFooter className="mt-auto">
                  <Link href={`/event/${event.id}`} className="w-full">
                    <Button className="w-full">View Event</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/events">
              <Button variant="outline">View All Events</Button>
            </Link>
          </div>
        </section>

        {/* Platform Information */}
        <section className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Why Choose BlockTix?</h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                <span>Secure and transparent ticketing using blockchain technology</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                <span>NFT-based tickets that can be easily transferred or resold</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                <span>Eliminate fraud and ticket scalping</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                <span>Easy event creation and management for organizers</span>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Connect your wallet to BlockTix</li>
              <li>Browse and select your desired event</li>
              <li>Purchase tickets securely using cryptocurrency</li>
              <li>Receive your ticket as an NFT in your wallet</li>
              <li>Show your NFT ticket at the event entrance</li>
            </ol>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12 bg-gray-200 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to experience the future of ticketing?</h2>
          <p className="text-xl mb-8">Join BlockTix today and revolutionize your event experience!</p>
          <Link href="/events">
            <Button size="lg">Get Started</Button>
          </Link>
        </section>
      </main>
    </div>
  )
}

