/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useReadContract } from 'wagmi'
import { Button } from '../components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { wagmiContractConfig } from '../lib/wagmiContractConfig';
import { convertDate } from '@/lib/utils';

interface Event {
  id: string;
  name: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  ticketContract: string;
  ticketPrice: number;
  imageCID: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const { data: fetchedEvents, isLoading, isError, error } = useReadContract({
    ...wagmiContractConfig,
    functionName: 'getAllEvents',
  });

  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (fetchedEvents) {
      console.log('Fetched events:', fetchedEvents);
      setEvents(fetchedEvents as Event[]);
    }
  }, [fetchedEvents, isError, error]);

  const handleEventClick = (event: any) => {
    navigate(`/event/${event.slug}`, {
      state: { event: event },
    });
  };

  return (
    <main className="w-full px-4 py-8">
      
      <section className="text-center py-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to TicketDen</h1>
        <p className="text-xl mb-8">Secure, transparent, and easy event ticketing on the blockchain</p>
        <Link to="/events">
          <Button size="lg" variant="secondary">Explore Events</Button>
        </Link>
      </section>
      
      <section className="mb-12">
        <div className="mb-4">
          <h2 className="text-center uppercase text-2xl font-bold mb-4">Recently Created Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="flex flex-col">
                  <div className="relative w-full pt-[56.25%]">
                    <Skeleton className="absolute top-0 left-0 w-full h-full" />
                  </div>
                  <CardHeader>
                    <Skeleton width="80%" height={20} />
                    <Skeleton width="60%" height={15} />
                  </CardHeader>
                  <CardFooter>
                    <Skeleton height={40} />
                  </CardFooter>
                </Card>
              ))
            ) : events && events.length > 0 ? (
              events.map((event, index) => (
                <Card key={index} className="flex flex-col" onClick={() => handleEventClick(event)}>
                  <div className="relative w-full pt-[56.25%]">
                    <img
                      src={`https://gateway.pinata.cloud/ipfs/${event.imageCID}`}
                      alt="event"
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{event.name}</CardTitle>
                    <CardDescription>{convertDate(event.date.toString())}</CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto">
                    <Button className="w-full">View Event</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className='w-full'>No events available at the moment. Please check back later!</p>
            )}
          </div>
          <div className="text-center mt-8">
            <Link to="/events">
              <Button variant="outline">View All Events</Button>
            </Link>
          </div>
        </div>
      </section>
      
      <section className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="max-w-7xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold mb-4">Why Choose TicketDen?</h2>
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
        </div>
        <div className="max-w-7xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Connect your wallet to TicketDen</li>
              <li>Browse and select your desired event</li>
              <li>Purchase tickets securely using cryptocurrency</li>
              <li>Receive your ticket as an NFT in your wallet</li>
              <li>Show your NFT ticket at the event entrance</li>
            </ol>
          </div>
          </div>
      </section>
      
      <section className="text-center py-12 bg-gray-200 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Ready to experience the future of ticketing?</h2>
        <p className="text-xl mb-8">Join TicketDen today and revolutionize your event experience!</p>
        <Link to="/events">
          <Button size="lg">Get Started</Button>
        </Link>
      </section>
    </main>
  );
}

export default HomePage;

