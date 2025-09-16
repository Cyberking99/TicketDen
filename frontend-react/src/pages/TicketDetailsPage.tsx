import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { useAccount, useReadContract } from 'wagmi';
import { Button } from '../components/ui/button';
import { convertDate, convertTime } from '@/lib/utils';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { wagmiContractConfig } from '../lib/wagmiContractConfig';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface Ticket {
  eventId: string;
  location: string;
  ticketPrice: string;
  tokenId: string;
  purchaseDate: string;
  time: string;
}

// Define the proper structure of event data from your smart contract
interface EventDetails {
  0: string;    // eventId or other field
  1: string;    // event name
  2: string;    // another field
  3: string;    // description
  4: string;    // another field
  5: string;    // IPFS hash
  6: string;    // another field
  7: string;    // date
  8: string;    // time
  // Add more fields as needed based on your contract structure
}

const TicketDetailsPage = () => {
  const location = useLocation();
  const { address, isConnected } = useAccount();
  // const client = usePublicClient()
  const { ticketId } = useParams<{ ticketId: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    console.log(`Fetching ticket details for ID: ${ticketId}`);
    console.log(location.state.ticket);
    setTicket(location.state.ticket);
  }, [location.state.ticket, ticketId]);

  const { data: eventDetails, isLoading, isError, error } = useReadContract({
    ...wagmiContractConfig,
    functionName: 'events',
    args: [ticket?.eventId],
  }) as { data: EventDetails | undefined; isLoading: boolean; isError: boolean; error: Error | null };
  
  useEffect(() => {
    console.log(eventDetails)
    if (eventDetails) {
      console.log('Fetched tickets processed:', eventDetails);
    }
  }, [eventDetails, isLoading, isError, error]);

  if (!isConnected) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 uppercase">My Tickets</h1>
        <p>Please connect your wallet to view your tickets.</p>
        <ConnectButton />
      </main>
    );
  }

  if (!ticket) {
    return <div>Loading ticket details...</div>;
  }

  if (!eventDetails && !isLoading) {
    return <div>Loading event details...</div>;
  }

  if (isError) {
    return <div>Error loading event details: {(error as Error).message}</div>;
  }

  // Create formatted QR code data as readable text
  const qrCodeData = `${eventDetails ? (eventDetails[1].toUpperCase() as string) : 'LOADING'} EVENT TICKET

    Event: ${eventDetails ? (eventDetails[1] as string) : 'Loading...'}
    Date: ${eventDetails ? convertDate(eventDetails[7] as string) : 'Loading...'}
    Time: ${eventDetails ? convertTime(eventDetails[8] as string) : 'Loading...'}
    Price: ${ticket ? (Number(ticket.ticketPrice) / 10e18).toFixed(4) : '0'} ETH
    Ticket Holder: ${address}
    Location: ${ticket?.location || 'N/A'}
    
    This QR code is your ticket to the event. Please present it at the entrance for scanning. Enjoy the event!
  `;

console.log(qrCodeData);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Ticket Details</h1>
      {isLoading ? (
      <Card className="mb-8">
        <CardHeader>
          <Skeleton width="80%" height={20} />
          <Skeleton width="80%" height={20} />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Skeleton width="80%" height={20} />
              <Skeleton width="80%" height={20} />
              <Skeleton width="80%" height={20} />
            </div>
            <div>
              <Skeleton width="80%" height={20} />
              <Skeleton width="80%" height={20} />
              <Skeleton width="80%" height={20} />
              <Skeleton width="80%" height={20} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center">
            <Skeleton width="80%" height={20} />
            <Skeleton width="80%" height={20} />
          </div>
        </CardFooter>
      </Card>
      ) : (
        <Card className="mb-8">
          <div className="relative w-full pt-[50%]">
          <img
            src={`https://gateway.pinata.cloud/ipfs/${eventDetails ? (eventDetails[5] as string) : ''}`}
            alt={`${eventDetails ? (eventDetails[1] as string) : ''} banner`}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
        <CardHeader>
          <CardTitle>{eventDetails ? (eventDetails[1] as string) : "Loading..."}</CardTitle>
          <CardDescription>{eventDetails ? convertDate(eventDetails[7] as string) : "Loading..."}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Event Information</h2>
              <p><strong>Venue:</strong> {ticket?.location || 'N/A'}</p>
              <p><strong>Description:</strong> {eventDetails ? (eventDetails[3] as string) : "Loading..."}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Ticket Information</h2>
              <p><strong>Price:</strong> {ticket ? (Number(ticket.ticketPrice) / 10e18).toFixed(4) : '0'} ETH</p>
              <p><strong>Event Date:</strong> {eventDetails ? convertDate(eventDetails[7] as string) : "Loading..."}</p>
              <p><strong>Event Time:</strong> {eventDetails ? convertTime(eventDetails[8] as string) : "Loading..."}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center">
            <QRCodeSVG value={qrCodeData} size={200} />
            <p className="mt-2 text-sm text-gray-500">Show this QR code at the event entrance</p>
          </div>
        </CardFooter>
      </Card>
      )}
      <div className="flex justify-between">
        <Link to="/my-tickets">
          <Button variant="outline">Back to My Tickets</Button>
        </Link>
        {/* <Button>Transfer Ticket</Button> */}
      </div>
    </div>
  );
};

export default TicketDetailsPage;