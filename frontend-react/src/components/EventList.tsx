import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const mockEvents = [
  { id: 1, name: 'Summer Music Festival', date: '2024-12-14', price: '0.1 ETH', image: 'https://picsum.photos/200/300' },
  { id: 2, name: 'Tech Conference 2024', date: '2024-12-15', price: '0.05 ETH', image: 'https://picsum.photos/200/300' },
  { id: 3, name: 'Art Exhibition', date: '2024-12-15', price: '0.03 ETH', image: 'https://picsum.photos/200/300' },
];

function EventList() {
  const [events] = useState(mockEvents);

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <Card key={event.id} className="flex flex-col">
            <div className="relative w-full pt-[56.25%]">
              <img
                src={event.image}
                alt={`${event.name} flyer`}
                className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
              />
            </div>
            <CardHeader>
              <CardTitle>{event.name}</CardTitle>
              <CardDescription>{event.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Price: {event.price}</p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Link to={`/event/${event.id}`} className="w-full">
                <Button className="w-full">View Event</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default EventList;

