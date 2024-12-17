import TicketDenABI from "../../ABIs/TicketDen.json";

const wagmiContractConfig = {
  address: import.meta.env.VITE_TICKET_DEN_SCA,
  abi: TicketDenABI,
};

export { wagmiContractConfig };