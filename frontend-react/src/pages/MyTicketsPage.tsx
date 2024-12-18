import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { wagmiContractConfig } from '../lib/wagmiContractConfig';
import { convertDate } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface Ticket {
  slug: string;
  name: string;
  date: bigint;
  imageCID: string;
}

const MyTicketsPage: React.FC = () => {
  const navigate = useNavigate();
  
  const { address, isConnected } = useAccount();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const { data: fetchedTickets, isLoading, isError, error } = useReadContract({
    ...wagmiContractConfig,
    functionName: 'getUserTickets',
    args: [address],
  } as const);
    
  useEffect(() => {
    if (fetchedTickets) {
      console.log('Fetched tickets processed:', fetchedTickets);
      setTickets(fetchedTickets as Ticket[]);
    }
  }, [fetchedTickets, isLoading, isError, error]);
    
  const handleEventClick = (ticket: Ticket) => {
    navigate(`/ticket/${ticket.slug}`, {
      state: { ticket: ticket },
    });
  };

  if (!isConnected) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 uppercase">My Tickets</h1>
        <p>Please connect your wallet to view your tickets.</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 uppercase">My Tickets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {isLoading ? (
        Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <div className="relative w-full pt-[56.25%]">
              <Skeleton className="absolute top-0 left-0 w-full h-full" />
            </div>
            <CardHeader>
              <Skeleton width="80%" height={20} />
              <Skeleton width="80%" height={20} />
            </CardHeader>
            <CardContent>
              <Skeleton width="80%" height={20} />
            </CardContent>
            <CardFooter>
              <Skeleton height={40} />
            </CardFooter>
          </Card>
        ))
      ) : tickets && tickets.length > 0 ? (
        tickets.map((ticket, index) => (
          <Card key={index}>
            <div className="relative w-full pt-[56.25%]">
              <img
                src={`https://gateway.pinata.cloud/ipfs/${ticket.imageCID}`}
                alt={`${ticket.name} flyer`}
                className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
              />
            </div>
            <CardHeader>
              <CardTitle>{ticket.name}</CardTitle>
              <CardDescription>{convertDate(ticket.date)}</CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleEventClick(ticket)}>View Details</Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <p className='w-full'>You have not purchased any ticket!</p>
      )}
      </div>
    </main>
  );
}

export default MyTicketsPage;

