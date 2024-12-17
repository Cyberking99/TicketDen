import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertDate(timestamp: any) {
  console.log(timestamp)
  const date = new Date(timestamp * 1000);
  
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
}

export function convertDateToTimestamp(dateString: any) {
  const date = new Date(dateString);
  
  const timestamp = Math.floor(date.getTime() / 1000);

  return timestamp;
}

export function convertTimeToTimestamp(time: any) {
  const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
  const match = time.match(timeRegex);

  if (!match) {
      throw new Error("Invalid time format. Use HH:mm (24-hour format).");
  }
  
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  
  return hours * 3600 + minutes * 60;
}

export async function fetchImage(imageMetaData: any) {
  try {
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${imageMetaData}`);
    const data = await response.json();
    
    return data.image;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
};

export function stringToSlug(inputString: any) {
  const slug = inputString
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
      
  const timestamp = Math.floor(Date.now() / 1000);

  return `${slug}-${timestamp}`;
}