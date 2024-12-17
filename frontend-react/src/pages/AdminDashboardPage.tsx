import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';

const mockAnalytics = {
  totalEvents: 10,
  totalTicketsSold: 150,
  totalRevenue: '5.5 ETH',
};

const mockTickets = [
  { id: 1, eventName: 'Summer Music Festival', buyer: '0x1234...5678', tokenId: '12345' },
  { id: 2, eventName: 'Tech Conference 2023', buyer: '0x9876...5432', tokenId: '67890' },
  { id: 3, eventName: 'Art Exhibition', date: '2023-09-10', buyer: '0x2468...1357', tokenId: '13579' },
];

function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState(mockAnalytics);
  const [tickets, setTickets] = useState(mockTickets);
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  
  const isAdmin = true;

  useEffect(() => {
    if (!isConnected || !isAdmin) {
      navigate('/');
    }
  }, [isConnected, isAdmin, navigate]);

  const handleRevokeTicket = (tokenId: string) => {
    console.log(`Revoking ticket with token ID: ${tokenId}`);
    setTickets(tickets.filter(ticket => ticket.tokenId !== tokenId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics.totalEvents}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Tickets Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics.totalTicketsSold}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics.totalRevenue}</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">Ticket Management</h2>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Token ID</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.eventName}</TableCell>
                  <TableCell>{ticket.buyer}</TableCell>
                  <TableCell>{ticket.tokenId}</TableCell>
                  <TableCell>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleRevokeTicket(ticket.tokenId)}
                    >
                      Revoke
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboardPage;

