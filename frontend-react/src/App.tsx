import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import CreateEventPage from './pages/CreateEventPage';
import MyTicketsPage from './pages/MyTicketsPage';
import EventDetailPage from './pages/EventDetailPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

import { config } from './wagmi';
import { ToastContainer } from 'react-toastify';
import TicketDetailsPage from './pages/TicketDetailsPage';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 w-full">
        <ToastContainer />
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/create-event" element={<CreateEventPage />} />
            <Route path="/my-tickets" element={<MyTicketsPage />} />
            <Route path="/event/:id" element={<EventDetailPage />} />
            <Route path="/ticket/:ticketId" element={<TicketDetailsPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
      </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;