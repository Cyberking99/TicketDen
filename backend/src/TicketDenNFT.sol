// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract TicketDenNFT is ERC1155, Ownable {
    uint256 public ticketPrice;
    uint256 public ticketSupply;
    uint256 public ticketsSold;
    address public eventCreator;
    string public eventName;
    string public eventLocation;
    uint256 public eventDate;
    uint256 public eventTime;
    string public imageURL;

    uint256 private _ticketIdCounter;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => address[]) private ticketBuyers;
    mapping(address => bool) private hasPurchased;

    event TicketPurchased(uint256 indexed ticketId, address indexed buyer);

    constructor(
        string memory name,
        string memory location,
        uint256 price,
        uint256 supply,
        uint256 date,
        uint256 time,
        string memory metadataURL,
        string memory image
    ) ERC1155(metadataURL) Ownable(msg.sender) {
        ticketPrice = price;
        ticketSupply = supply;
        eventCreator = msg.sender;
        eventName = name;
        eventLocation = location;
        eventDate = date;
        eventTime = time;
        imageURL = image;

        _ticketIdCounter = 0;
    }

    function purchaseTicket(address receiver, uint256 quantity) external payable {
        require(ticketsSold + quantity <= ticketSupply, "Not enough tickets available");

        uint256 ticketId = _ticketIdCounter;
        _mint(receiver, ticketId, quantity, "");
        
        _tokenURIs[ticketId] = generateTokenURI(ticketId);

        ticketsSold += quantity;
        
        if (!hasPurchased[receiver]) {
            ticketBuyers[ticketId].push(receiver);
            hasPurchased[receiver] = true;
        }

        emit TicketPurchased(ticketId, receiver);
        _ticketIdCounter++;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    function withdrawFunds() external {
        require(msg.sender == eventCreator, "Only the event creator can withdraw funds");
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(eventCreator).transfer(balance);
    }

    function getTicketUsers(uint256 ticketId) external view returns (address[] memory) {
        return ticketBuyers[ticketId];
    }

    function generateTokenURI(uint256 ticketId) internal view returns (string memory) {
        string memory uniqueImage = string(abi.encodePacked(imageURL));
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Event Ticket #', uint2str(ticketId), '",',
                        '"description": "Ticket for ', eventName, '",',
                        '"location": "', eventLocation, '",',
                        '"date": "', uint2str(eventDate), '",',
                        '"image": "', uniqueImage, '"}'
                    )
                )
            )
        );
        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) return "0";
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + (j % 10)));
            j /= 10;
        }
        return string(bstr);
    }
}
