import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { useAccount, useReadContract } from 'wagmi';
import { Button } from '../components/ui/button';
import { convertDate } from '@/lib/utils';
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

interface EventDetails {
  [key: number]: unknown;
}
const TicketDetailsPage = () => {
  const location = useLocation();

  const { address, isConnected } = useAccount();
  const { ticketId } = useParams<{ ticketId: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [event, setEvent] = useState<EventDetails | null>(null);

  useEffect(() => {
    console.log(`Fetching ticket details for ID: ${ticketId}`);
    console.log(location.state.ticket);
    setTicket(location.state.ticket);
  }, [location.state.ticket, ticketId]);

  const { data: eventDetails, isLoading, isError, error } = useReadContract({
    ...wagmiContractConfig,
    functionName: 'events',
    args: [ticket?.eventId],
  });
  
  useEffect(() => {
    console.log(eventDetails)
    if (eventDetails) {
      console.log('Fetched tickets processed:', eventDetails);
      setEvent(eventDetails as EventDetails);
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
  
  const qrCodeData = JSON.stringify({
    eventId: ticket?.eventId ? Number(ticket.eventId):0,
    eventDate: convertDate(event ? event[7]: ''),
    price: event?event[1]:'',
    userAddress: address,
  });

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
            src={`https://gateway.pinata.cloud/ipfs/${event?event[5]:''}`}
            alt={`${event?event[1]:''} banner`}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
        <CardHeader>
          <CardTitle>{event ? (event[1] as string) : "..."}</CardTitle>
          <CardDescription>{convertDate(event?event[7]:'')} <span className="text-black">at</span> {ticket?.time}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Event Information</h2>
              <p><strong>Venue:</strong> {ticket?.location}</p>
              <p><strong>Description:</strong> {event ? (event[3] as string) : "..."}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Ticket Information</h2>
              <p><strong>Price:</strong> {Number(ticket?.ticketPrice)/10e18} ETH</p>
              <p><strong>Token ID:</strong> {ticket?.tokenId}</p>
              <p><strong>Event Date:</strong> {ticket?.purchaseDate}</p>
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

