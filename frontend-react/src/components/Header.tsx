import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo'
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function Header() {
  const { isConnected } = useAccount();
  // const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  // const { disconnect } = useDisconnect();
  // const queryClient = new QueryClient()

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          <Logo className="h-16 w-auto" />
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/events" className="text-gray-600 hover:text-gray-900">
            Events
          </Link>
          {mounted && isConnected && (
            <>
              <Link to="/create-event" className="text-gray-600 hover:text-gray-900">
                Create Event
              </Link>
              <Link to="/my-events" className="text-gray-600 hover:text-gray-900">
                My Events
              </Link>
              <Link to="/my-tickets" className="text-gray-600 hover:text-gray-900">
                My Tickets
              </Link>
            </>
          )}
          <ConnectButton />
        </div>
      </nav>
    </header>
  );
}

export default Header;

