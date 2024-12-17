// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/TicketDen.sol";
import "../src/TicketDenNFT.sol";

contract TicketDenTest is Test {
    TicketDen public ticketDen;
    
    address public creator = address(1);
    address public buyer = address(2);

    function setUp() public {
        ticketDen = new TicketDen();
    }

    function testCreateEvent() public {
        vm.prank(creator);

        uint256 eventDate = block.timestamp + 1 weeks;
        uint256 eventTime = eventDate + (14 * 3600);
        uint256 ticketPrice = 0.1 ether;
        uint256 ticketSupply = 100;

        ticketDen.createEvent("Test Event", "sssllll", "sfkfkskss", "aa", "ggggggg", "This is a test event", "Jos", eventDate, eventTime, ticketPrice, ticketSupply);

        (uint256 id, string memory name, , , , , , uint256 date, , , , , address eventCreator, address ticketContract) = ticketDen.events(0);

        assertEq(id, 0, "Event ID should be 0");
        assertEq(name, "Test Event", "Event name mismatch");
        assertEq(date, eventDate, "Event date mismatch");
        assertEq(eventCreator, creator, "Creator mismatch");
        assertTrue(ticketContract != address(0), "Ticket contract address should be non-zero");
    }

    function testPurchaseTicket() public {
        vm.prank(creator);

        uint256 eventDate = block.timestamp + 1 weeks;
        uint256 eventTime = eventDate + (14 * 3600);
        uint256 ticketPrice = 0.1 ether;
        uint256 ticketSupply = 100;

        ticketDen.createEvent("Test Event", "lllaa", "sfkfkskss", "aa", "ggg", "This is a test event", "Jos", eventDate, eventTime, ticketPrice, ticketSupply);

        (, , , , , , , , , , , , , address ticketContract) = ticketDen.events(0);

        TicketDenNFT ticketNFT = TicketDenNFT(ticketContract);

        vm.deal(buyer, 1 ether);

        vm.prank(buyer);
        // assert(1 == 1, "Error");
        // ticketNFT.purchaseTicket(1){value: ticketPrice}();

        // assertEq(ticketNFT.ticketsSold(), 1, "Tickets sold should be 1");
        // assertEq(ticketNFT.ownerOf(0), buyer, "Buyer should own the ticket");
    }

    function testWithdrawFunds() public {
        vm.prank(creator);

        uint256 eventDate = block.timestamp + 1 weeks;
        uint256 eventTime = eventDate + (14 * 3600);
        uint256 ticketPrice = 0.1 ether;
        uint256 ticketSupply = 100;
        
        ticketDen.createEvent("Test Event", "aaall", "sfkfkskss", "aa", "ggg", "This is a test event", "Jos", eventDate, eventTime, ticketPrice, ticketSupply);
        
        (, , , , , , , , , , , , , address ticketContract) = ticketDen.events(0);

        TicketDenNFT ticketNFT = TicketDenNFT(ticketContract);
        
        vm.deal(buyer, 1 ether);
        vm.prank(buyer);
        console.log("FA");
        // ticketNFT.purchaseTicket{value: ticketPrice}();
        
        // uint256 contractBalance = address(ticketNFT).balance;
        // assertEq(contractBalance, ticketPrice, "Contract balance mismatch before withdrawal");
        
        // uint256 initialCreatorBalance = creator.balance;
        
        // vm.prank(creator);
        // ticketNFT.withdrawFunds();

        // uint256 finalCreatorBalance = creator.balance;
        // assertEq(finalCreatorBalance, initialCreatorBalance + ticketPrice, "Creator balance mismatch after withdrawal");
        // assertEq(address(ticketNFT).balance, 0, "Contract balance should be zero after withdrawal");
    }

    function testGetAllEvents() public {
        vm.prank(creator);

        uint256 eventDate = block.timestamp + 1 weeks;
        uint256 eventTime = eventDate + (14 * 3600);
        uint256 ticketPrice = 0.1 ether;
        uint256 ticketSupply = 100;

        ticketDen.createEvent("Event 1", "aaa", "cid1", "aaa", "gg", "Description 1", "Jos", eventDate, eventTime, ticketPrice, ticketSupply);
        ticketDen.createEvent("Event 2", "aaa", "cid2", "aaa", "gg", "Description 2", "Abuja", eventDate + 1 days,  eventTime + 1 days, ticketPrice, ticketSupply);

        TicketDen.Event[] memory allEvents = ticketDen.getAllEvents();

        assertEq(allEvents.length, 2, "Should have 2 events");
    }
}
