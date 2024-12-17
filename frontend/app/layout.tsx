import './globals.css'
import { Inter } from 'next/font/google'
import { WagmiProvider } from 'wagmi'
import { config } from './wagmiConfig'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Blockchain Ticket Platform',
  description: 'Purchase and manage event tickets on the blockchain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiProvider config={config}>
          {children}
        </WagmiProvider>
      </body>
    </html>
  )
}

