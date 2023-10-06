// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import {
    PlayerCoordinates,
    PlayerQuest,
    PlayerIsMovable,
    PlayerPointBalance,
    PlayerIsInMap,
    PlayerMapId,
    PlayerCoordinates,
    PlayerQuest
} from "../codegen/Tables.sol";
import { Memory } from "@latticexyz/store/src/Memory.sol";

contract PlaySystem is System {

    function MapJoin (uint32 _mapId) public {
        bytes32 playerEntity = bytes32(uint256(uint160(_msgSender())));
        PlayerIsInMap.set(playerEntity, true);
        PlayerMapId.set(playerEntity, _mapId);
        PlayerCoordinates.set(playerEntity, 0, 0);
    }

    function AdvanceThroughSquare(
        uint32 _newX,
        uint32 _newY,
        address _PlayerQuest
    ) public {
        bytes32 playerEntity = bytes32(uint256(uint160(_msgSender())));
        PlayerCoordinates.set(playerEntity, _newX, _newY);
        PlayerQuest.set(playerEntity, _PlayerQuest);
        PlayerIsMovable.set(playerEntity, true);
    }

    function QuestCompletion(uint32 _questPoint) public {
        bytes32 playerEntity = bytes32(uint256(uint160(_msgSender())));
        uint32 newPlayerPointBalance = PlayerPointBalance.get(playerEntity) + _questPoint;
        PlayerPointBalance.set(playerEntity, newPlayerPointBalance);
        PlayerIsMovable.set(playerEntity, false);
    }

    function MapExit () public {
        bytes32 playerEntity = bytes32(uint256(uint160(_msgSender())));
        PlayerIsInMap.set(playerEntity, false);
        PlayerMapId.set(playerEntity, 0); // 0 means not participating in any map
        PlayerCoordinates.set(playerEntity, 0, 0);
        PlayerIsMovable.set(playerEntity, false);
        if (PlayerQuest.get(playerEntity) != address(0)) {
            PlayerQuest.set(playerEntity, address(0));
        }
    }

}
