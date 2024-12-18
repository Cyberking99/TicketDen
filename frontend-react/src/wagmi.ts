import { getDefaultConfig } from '@rainbow-me/rainbowkit';

const lisk = {
    id: 4202,
    name: 'Lisk Sepolia Testnet',
    network: 'lisk-testnet',
    nativeCurrency: {
      name: 'Lisk',
      symbol: 'LSK',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://rpc.sepolia-api.lisk.com/'],
      },
      public: {
        http: ['https://rpc.sepolia-api.lisk.com/'],
      },
    },
    blockExplorers: {
      default: { name: 'Lisk Explorer', url: 'https://sepolia-blockscout.lisk.com/' },
    },
    testnet: true,
  };
  

export const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: 'f6944e67672a59c2ac32f0ec4777dfd8',
  chains: [
    lisk
  ],
});
