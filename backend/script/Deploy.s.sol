// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {Script, console} from "forge-std/Script.sol";
import "../lib/forge-std/src/console.sol";
import "../src/TicketDen.sol";

contract DeployScript is Script {
    TicketDen public ticketDen;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        ticketDen = new TicketDen();

        console.log("Contract Address: ", address(ticketDen));

        vm.stopBroadcast();
    }
}
