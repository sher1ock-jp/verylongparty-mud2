// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import {
  PlayerIsInMap,
  PlayerEns,
  PlayerIconUrl,
  PlayerMapId,
  PlayerCoordinates,
  PlayerPointBalance,
  PlayerIsMovable
}from "../codegen/Tables.sol";

contract PlayerInfoSystem is System {

  function PlayerInfoSet(string memory _playerEns, string memory _playerIconUrl) public {
    bytes32 playerEntity = bytes32(uint256(uint160(_msgSender())));
    PlayerIsInMap.set(playerEntity, false);
    PlayerEns.set(playerEntity, _playerEns);
    PlayerIconUrl.set(playerEntity, _playerIconUrl);
    PlayerPointBalance.set(playerEntity, 1000);
    PlayerIsMovable.set(playerEntity, false);
  }
}
