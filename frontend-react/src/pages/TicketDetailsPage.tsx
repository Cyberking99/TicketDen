import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { convertDate } from '@/lib/utils';


const mockTicket = {
    id: '1',
    eventId: 'EVT001',
    eventName: 'Summer Music Festival',
    date: '2024-12-25',
    time: '14:00',
    venue: 'Central Park, New York',
    ticketType: 'VIP',
    price: '0.5 ETH',
    tokenId: '12345',
    eventDescription: 'Join us for an unforgettable summer music experience featuring top artists from around the world.',
    purchaseDate: '2023-05-01',
  };
const TicketDetailsPage = () => {
  const location = useLocation();

  const { ticketId } = useParams<{ ticketId: string }>();
  const [ticket, setTicket] = useState(mockTicket);

  useEffect(() => {
    console.log(`Fetching ticket details for ID: ${ticketId}`);
    // setTicket(location.state.ticket);
  }, [ticketId]);
  
  const qrCodeData = JSON.stringify({
    eventId: ticket.eventId?.toString()/10e18,
    eventDate: convertDate(ticket?.date),
    price: ticket.price?.toString()/10e18
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Ticket Details</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{ticket.eventName}</CardTitle>
          <CardDescription>{convertDate(ticket.date)} at {convertDate(ticket.time)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Event Information</h2>
              <p><strong>Venue:</strong> {ticket.location}</p>
              <p><strong>Description:</strong> {ticket.eventDescription}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Ticket Information</h2>
              <p><strong>Price:</strong> {ticket.price}</p>
              <p><strong>Token ID:</strong> {ticket.tokenId}</p>
              <p><strong>Purchase Date:</strong> {ticket.purchaseDate}</p>
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

