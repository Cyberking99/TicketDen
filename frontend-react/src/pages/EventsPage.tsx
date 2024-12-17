import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useReadContract } from 'wagmi'
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { wagmiContractConfig } from '../lib/wagmiContractConfig';
import { convertDate } from '@/lib/utils';

function EventsPage() {
  const navigate = useNavigate();

  const { data: fetchedEvents, isLoading, isError, error } = useReadContract({
    ...wagmiContractConfig,
    functionName: 'getAllEvents',
  });

  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (fetchedEvents) {
      console.log('Fetched events:', fetchedEvents);
      setEvents(fetchedEvents);
    }
  }, [fetchedEvents, isError, error]);

  const handleEventClick = (event: any) => {
    navigate(`/event/${event.slug}`, {
      state: { event: event },
    });
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 uppercase">All Events</h1>
      <section className="mb-8">
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
                      src={
                        event.imageCID && event.imageCID !== 'none'
                          ? `https://gateway.pinata.cloud/ipfs/${event.imageCID}`
                          : 'https://picsum.photos/200/300'
                      }
                      alt={`${event.name} flyer`}
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{event.name}</CardTitle>
                    <CardDescription>{convertDate(event.date.toString())}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Price: {event.ticketPrice.toString()/10e18} ETH</p>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    {/* <Link to={`/event/${event.id}`} className="w-full"> */}
                      <Button className="w-full">View Event</Button>
                    {/* </Link> */}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className='w-full'>No events available at the moment. Please check back later!</p>
            )}
            </div>
            </section>
    </main>
  );
}

export default EventsPage;

