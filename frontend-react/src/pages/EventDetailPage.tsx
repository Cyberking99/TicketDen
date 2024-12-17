import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { type BaseError, useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, WagmiConfig } from 'wagmi';
import { parseEther } from 'viem'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { wagmiContractConfig } from '../lib/wagmiContractConfig';
import TicketDenNFT from '../../ABIs/TicketDenNFT.json';
import { convertDate } from '@/lib/utils';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

function EventDetailPage() {
  const location = useLocation();
  // const { event } = location.state || {};

  const { id } = useParams<{ id: string }>();
  const { address, isConnected } = useAccount();
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const [event, setEvent] = useState(location.state.event);
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("Purchase Ticket");

  useEffect(() => {
    // console.log(location.state.event)
    setEvent(location.state.event);
  }, [id]);

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
  useWaitForTransactionReceipt({
    hash,
  })

  const { data: ticketSold, isLoading, isError, error: readError } = useReadContract({
    abi: TicketDenNFT,
    address: event.ticketContract,
    functionName: 'ticketsSold',
  });

    const [ticketsSold, setTicketsSold] = useState([]);
    
      useEffect(() => {
        if (ticketSold) {
          console.log('Fetched events:', ticketSold.toString()/10e18);
          setTicketsSold(ticketSold);
        }
      }, [ticketSold, isError, readError]);

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {

      const price = (event.ticketPrice.toString()/10e18)*quantity;
    
      // writeContract({
      //   abi: TicketDenNFT,
      //   address: event.ticketContract,
      //   functionName: 'purchaseTicket',
      //   args: [quantity],
      //   value: parseEther(price.toString())
      // })

      writeContract({
        ...wagmiContractConfig,
        functionName: 'purchaseEventTicket',
        args: [event.id, quantity],
        value: parseEther(price.toString())
      })

      console.log(TicketDenNFT, event.ticketContract, event.ticketPrice)
      console.log(`Purchasing ${quantity} ticket(s) for event ${id}`);
      // alert(`Purchase of ${quantity} ticket(s) initiated. Check your wallet to confirm the transaction.`);
    
    
          if(isConfirming) {
              toast.info("Transaction is processing...");
          }
    
          if(isConfirmed) {
            setIsSubmitting(false);
            toast.success("Ticket purchased successfully!");
            setSuccess(true);
            resetForm();
          }
    
          if(error) {
            toast.error((error as BaseError).shortMessage || error.message);
          }
    
        } catch (error) {
            setIsSubmitting(false);
            console.error("Error creating event:", error);
            toast.error("Failed to create event. Check console for details.");
        } finally {
            setIsSubmitting(false);
            setButtonTitle("Create Event");
        }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="overflow-hidden">
        <div className="relative w-full pt-[50%]">
          <img
            src={`https://gateway.pinata.cloud/ipfs/${event.imageCID}`}
            alt={`${event.name} banner`}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
        <CardHeader>
          <CardTitle className="text-3xl">{event.name}</CardTitle>
          <CardDescription>{convertDate(event.date.toString())}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">{event.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-semibold">Location</h3>
              <p>{event.location}</p>
            </div>
            <div>
              <h3 className="font-semibold">Available Tickets</h3>
              <p>{(Number(event.ticketSupply.toString()/10e18)-Number(ticketsSold?(ticketsSold.toString()/10e18):0)).toString()*10e18}</p>
            </div>
          </div>
          <p className="text-xl font-bold">Price: {event.ticketPrice.toString()/10e18} ETH / ticket</p>
        </CardContent>
        <CardFooter>
          {isConnected ? (
            <form onSubmit={handlePurchase} className="w-full space-y-4">
              <div>
                <Label htmlFor="quantity">Number of Tickets</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={event.availableTickets}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="max-w-[100px]"
                />
              </div>
              <div>
                <p className="mb-2">Total: {(parseFloat(event.ticketPrice.toString()/10e18) * quantity).toFixed(5)} ETH</p>
                <Button disabled={isPending} type="submit" className="w-full sm:w-auto">{isPending ? 'Purchasing...' : 'Purchase Tickets'}</Button>
              </div>
              {hash && <div>Transaction Hash: {hash}</div>}
              {isConfirming && <div>Waiting for confirmation...</div>}
              {isConfirmed && <div>Transaction confirmed.</div>}
              {error && (
                <div>Error: {(error as BaseError).shortMessage || error.message}</div>
              )}
            </form>
          ) : (
            <div className="w-full text-center">
              <p className="mb-4">Please connect your wallet to purchase tickets.</p>
              <Button disabled>Connect Wallet</Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default EventDetailPage;