import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
// import ticketDenNFTAbi from "../../ABIs/TicketDen.json";
// import exp from "constants";
import { parseAbiItem } from "viem";

interface BuyerInfo {
  address: string;
  tickets: number;
}

const BuyersList: React.FC<{ ticketContract: string }> = ({ ticketContract }) => {
  const publicClient = usePublicClient();
  const [buyers, setBuyers] = useState<BuyerInfo[]>([]);

  useEffect(() => {
    const fetchBuyers = async () => {
      if (!ticketContract) return;
    //   if (!publicClient) return null;

      // Fetch TicketMinted logs
      const logs = await publicClient!.getLogs({
        address: ticketContract as `0x${string}`,
        event: parseAbiItem("event TicketPurchased(address indexed buyer, uint256 indexed eventId, uint256 quantity)"),
        fromBlock: 0n, // adjust to deployment block if you know it
        toBlock: "latest",
      });

      // Count tickets per buyer
      const buyerMap: Record<string, number> = {};
      logs.forEach((log) => {
        const buyer = log.args.buyer as string;
        buyerMap[buyer] = (buyerMap[buyer] || 0) + 1;
      });

      // Convert to array
      const buyersArray = Object.entries(buyerMap).map(([address, tickets]) => ({
        address,
        tickets,
      }));

      setBuyers(buyersArray);
    };

    fetchBuyers();
  }, [ticketContract]);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Buyers Breakdown</h3>
      {buyers.length === 0 ? (
        <p>No tickets sold yet.</p>
      ) : (
        <table className="w-full text-sm border">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Buyer</th>
              <th className="p-2 text-right">Tickets</th>
            </tr>
          </thead>
          <tbody>
            {buyers.map((buyer, i) => (
              <tr key={i} className="border-b">
                <td className="p-2">{buyer.address}</td>
                <td className="p-2 text-right">{buyer.tickets}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BuyersList;
