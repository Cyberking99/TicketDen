// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./TicketDenNFT.sol";

contract TicketDen is Ownable {

    struct Event {
        uint256 id;
        string name;
        string slug;
        string description;
        string location;
        string imageCID;
        string metadataURL;
        uint256 date;
        uint256 time;
        uint256 ticketPrice;
        uint256 ticketSupply;
        uint256 ticketsSold;
        address creator;
        address ticketContract;
    }

    uint256 private _eventIdCounter;
    mapping(uint256 => Event) public events;
    uint256 public totalEvents;

    struct Purchase {
        uint256 eventId;
        uint256 quantity;
    }
    mapping(address => Purchase[]) public userPurchases;
    
    struct PurchaseWithEvent {
        uint256 eventId;
        uint256 quantity;
        string name;
        string slug;
        string description;
        string location;
        string imageCID;
        uint256 date;
        uint256 time;
        uint256 ticketPrice;
        uint256 ticketsSold;
        address ticketContract;
    }

    mapping(address => mapping(uint256 => uint256)) public userTickets;

    event EventCreated(uint256 indexed eventId, string name, string imageCID, string metadataURL, address indexed creator, address ticketContract);
    event TicketPurchased(address indexed buyer, uint256 indexed eventId, uint256 quantity);

    constructor() Ownable(msg.sender) {}

    function createEvent(
        string memory name,
        string memory slug,
        string memory imageCID,
        string memory metadataURL,
        string memory imageURL,
        string memory description,
        string memory location,
        uint256 date,
        uint256 time,
        uint256 ticketPrice,
        uint256 ticketSupply
    ) external {
        require(date > block.timestamp, "Event date must be in the future.");
        require(ticketPrice > 0, "Ticket price must be greater than zero.");
        require(ticketSupply > 0, "Ticket supply must be greater than zero.");

        uint256 eventId = _eventIdCounter;

        TicketDenNFT ticketContract = new TicketDenNFT(name, location, ticketPrice, ticketSupply, date, time, metadataURL, imageURL);

        events[eventId] = Event({
            id: eventId,
            name: name,
            slug: slug,
            imageCID: imageCID,
            metadataURL: metadataURL,
            description: description,
            location: location,
            date: date,
            time: time,
            ticketPrice: ticketPrice,
            ticketSupply: ticketSupply,
            ticketsSold: 0,
            creator: msg.sender,
            ticketContract: address(ticketContract)
        });

        _eventIdCounter++;
        totalEvents++;

        emit EventCreated(eventId, name, imageCID, metadataURL, msg.sender, address(ticketContract));
    }

    function purchaseEventTicket(uint256 eventId, uint256 quantity) external payable {
        Event storage selectedEvent = events[eventId];

        require(selectedEvent.id == eventId, "Event does not exist");
        require(quantity > 0, "Must purchase at least one ticket");

        TicketDenNFT ticketContract = TicketDenNFT(selectedEvent.ticketContract);

        ticketContract.purchaseTicket{value: msg.value}(msg.sender, quantity);
        
        selectedEvent.ticketsSold += quantity;
        
        userPurchases[msg.sender].push(Purchase({
            eventId: eventId,
            quantity: quantity
        }));

        userTickets[msg.sender][eventId] += quantity;

        emit TicketPurchased(msg.sender, eventId, quantity);
    }

    function getAllEvents() external view returns (Event[] memory) {
        Event[] memory allEvents = new Event[](totalEvents);
        for (uint256 i = 0; i < totalEvents; i++) {
            allEvents[i] = events[i];
        }
        return allEvents;
    }

    function getMyEvents() external view returns (Event[] memory) {
        uint256 myEventCount = 0;
        
        for (uint256 i = 0; i < totalEvents; i++) {
            if (events[i].creator == msg.sender) {
                myEventCount++;
            }
        }

        Event[] memory myEvents = new Event[](myEventCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < totalEvents; i++) {
            if (events[i].creator == msg.sender) {
                myEvents[index] = events[i];
                index++;
            }
        }

        return myEvents;
    }

    function getMyPurchasedTickets() external view returns (PurchaseWithEvent[] memory) {
        uint256 purchaseCount = userPurchases[msg.sender].length;
        PurchaseWithEvent[] memory purchasedTickets = new PurchaseWithEvent[](purchaseCount);

        for (uint256 i = 0; i < purchaseCount; i++) {
            Purchase memory purchase = userPurchases[msg.sender][i];
            Event memory eventDetails = events[purchase.eventId];

            purchasedTickets[i] = PurchaseWithEvent({
                eventId: purchase.eventId,
                slug: eventDetails.slug,
                quantity: purchase.quantity,
                name: eventDetails.name,
                description: eventDetails.description,
                location: eventDetails.location,
                imageCID: eventDetails.imageCID,
                date: eventDetails.date,
                time: eventDetails.time,
                ticketPrice: eventDetails.ticketPrice,
                ticketsSold: eventDetails.ticketsSold,
                ticketContract: eventDetails.ticketContract
            });
        }

        return purchasedTickets;
    }

    function getUserTickets(address user) external view returns (PurchaseWithEvent[] memory) {
        if (user == address(0)) {
            user = msg.sender;
        }

        uint256 purchaseCount = userPurchases[user].length;
        PurchaseWithEvent[] memory purchasedTickets = new PurchaseWithEvent[](purchaseCount);

        for (uint256 i = 0; i < purchaseCount; i++) {
            Purchase memory purchase = userPurchases[user][i];
            Event memory eventDetails = events[purchase.eventId];

            purchasedTickets[i] = PurchaseWithEvent({
                eventId: purchase.eventId,
                slug: eventDetails.slug,
                quantity: purchase.quantity,
                name: eventDetails.name,
                description: eventDetails.description,
                location: eventDetails.location,
                imageCID: eventDetails.imageCID,
                date: eventDetails.date,
                time: eventDetails.time,
                ticketPrice: eventDetails.ticketPrice,
                ticketsSold: eventDetails.ticketsSold,
                ticketContract: eventDetails.ticketContract
            });
        }

        return purchasedTickets;
    }
}
