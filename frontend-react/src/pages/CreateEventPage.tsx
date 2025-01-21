/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from "ethers";
import { type BaseError, useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '../components/ui/label';
import { wagmiContractConfig } from '../lib/wagmiContractConfig';
import { convertDateToTimestamp, convertTimeToTimestamp, stringToSlug } from '@/lib/utils';

function CreateEventPage() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  if (!isConnected) {
    navigate("/");
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("Create Event");
  const { data: hash, error, writeContract } = useWriteContract();

  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [ticketSupply, setTicketSupply] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEventImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setEventName("");
    setEventLocation("");
    setEventDescription("");
    setEventDate("");
    setEventTime("");
    setTicketPrice("");
    setTicketSupply("");
    setEventImage(null);
  };

  const uploadImageToIPFS = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
        },
        body: formData,
      });

      const data = await response.json();
      return data.IpfsHash;
    } catch (error) {
      console.error('Error uploading image to IPFS:', error);
    }
  };

  const uploadMetadataToIPFS = async (metadata: any) => {
    const formData = new FormData();
    const blob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
    formData.append('file', blob, 'metadata.json');
  
    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
        },
        body: formData,
      });
  
      const data = await response.json();
      return data.IpfsHash;
    } catch (error) {
      console.error('Error uploading metadata to IPFS:', error);
      throw new Error('Metadata upload failed.');
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

    const handleEventSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
      setIsSubmitting(true);
      setButtonTitle("Uploading to IPFS...");
      event.preventDefault();
  
      try {
        if (!eventImage) {
          toast.error("Event image is required.");
          setIsSubmitting(false);
          return;
        }
  
        const imageCID = await uploadImageToIPFS(eventImage);
        const imageURL = `https://gateway.pinata.cloud/ipfs/${imageCID}`;
        console.log("Event Image URL:", imageURL);
  
        const metadata = {
          name: eventName,
          description: eventDescription,
          image: imageURL,
          attributes: [
            { trait_type: "Location", value: eventLocation },
            { trait_type: "Date", value: eventDate },
            { trait_type: "Time", value: eventTime },
            { trait_type: "Ticket Price", value: `${ticketPrice} ETH` },
            { trait_type: "Ticket Supply", value: ticketSupply },
          ],
        };
  
        setButtonTitle("Processing metadata...");
        const metadataCID = await uploadMetadataToIPFS(metadata);
        const metadataURL = `https://gateway.pinata.cloud/ipfs/${metadataCID}`;
        console.log("Metadata URL:", metadataURL);
  
        setButtonTitle("Creating Event...");
  
        const slug = stringToSlug(eventName);
  
        writeContract({
          ...wagmiContractConfig,
          functionName: 'createEvent',
          args: [
            eventName,
            slug,
            imageCID,
            metadataURL,
            imageURL,
            eventDescription,
            eventLocation,
            convertDateToTimestamp(eventDate),
            convertTimeToTimestamp(eventTime),
            ethers.utils.parseUnits(ticketPrice.toString(), 18),
            BigInt(ticketSupply),
          ],
        });
  
        if (isConfirming) {
          toast.info("Transaction is processing...");
        }
  
        if (isConfirmed) {
          setButtonTitle("Create Event");
          // toast.success("Event created successfully!");
          resetForm();
          setIsSubmitting(false);
        }
  
        if (error) {
          throw error;
        }
      } catch (error: any) {
        console.error("Error creating event:", error);
        toast.error(error.message || "Failed to create event.");
        setButtonTitle("Create Event");
        setIsSubmitting(false);
      }
    };

    useEffect(() => {
      if (isConfirmed) {
        toast.success('Event created successfully!');
        resetForm();
        setImagePreview(null);
        setButtonTitle("Create Event");
        setIsSubmitting(false);
      }
    }, [isConfirmed]);
  

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Create New Event</h1>
        <form onSubmit={handleEventSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
  <div>
    <Label htmlFor="eventName">Event Name</Label>
    <Input
      id="eventName"
      value={eventName}
      onChange={(e) => setEventName(e.target.value)}
      required
    />
  </div>

  <div>
    <Label htmlFor="eventLocation">Event Location</Label>
    <Input
      id="eventLocation"
      value={eventLocation}
      onChange={(e) => setEventLocation(e.target.value)}
      required
    />
  </div>

  <div className="col-span-2">
    <Label htmlFor="eventDescription">Event Description</Label>
    <Textarea
      id="eventDescription"
      value={eventDescription}
      onChange={(e) => setEventDescription(e.target.value)}
      required
    />
  </div>

  <div>
    <Label htmlFor="eventDate">Event Date</Label>
    <Input
      id="eventDate"
      type="date"
      value={eventDate}
      onChange={(e) => setEventDate(e.target.value)}
      required
    />
  </div>

  <div>
    <Label htmlFor="eventTime">Event Time</Label>
    <Input
      id="eventTime"
      type="time"
      value={eventTime}
      onChange={(e) => setEventTime(e.target.value)}
      required
    />
  </div>

  <div>
    <Label htmlFor="ticketPrice">Ticket Price (ETH)</Label>
    <Input
      id="ticketPrice"
      type="number"
      step="0.01"
      value={ticketPrice}
      onChange={(e) => setTicketPrice(e.target.value)}
      required
    />
  </div>

  <div>
    <Label htmlFor="ticketSupply">Ticket Supply</Label>
    <Input
      id="ticketSupply"
      type="number"
      value={ticketSupply}
      onChange={(e) => setTicketSupply(e.target.value)}
      required
    />
  </div>

  <div>
    <Label htmlFor="eventImage">Event Image</Label>
    <Input
      id="eventImage"
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      required
    />
  </div>
  <div>
    {imagePreview && (
      <div className="text-center">
        <img
          src={imagePreview}
          alt="Event Preview"
          className="text-center w-[200px] h-[200px] rounded-md"
        />
      </div>
    )}
  </div>
  <div className="col-span-2">
  <Button type="submit" disabled={isSubmitting} className="w-full">
    {buttonTitle}
  </Button>
  </div>

  {/* {hash && (
    <div className="mt-4 text-center">
      View Transaction On Explorer: <a href={`https://sepolia-blockscout.lisk.com/tx/${hash}`} target="_blank" rel="noopener noreferrer">View</a>
    </div>
  )} */}

  {/* {isConfirming && <div className="mt-4 text-center">Waiting for confirmation...</div>} */}
  {/* {isConfirmed && <div className="mt-4 text-center">Transaction confirmed.</div>} */}
  {isConfirming && (
        <div className="spinner">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      )}

  {error && (
    <div className="mt-4 text-center text-red-500">Error: {(error as BaseError).shortMessage || error.message}</div>
  )}
</form>

      </div>
    </main>
  );
}

export default CreateEventPage;
