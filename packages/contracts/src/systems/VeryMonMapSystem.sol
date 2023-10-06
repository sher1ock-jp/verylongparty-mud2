// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { Encounter, EncounterData, Encounterable, EncounterTrigger, VeryMonMap, Monster, Movable, Obstruction, VeryMonPlayer, VeryMonPosition } from "../codegen/Tables.sol";
import { MonsterType } from "../codegen/Types.sol";
import { AddressToEntityKey } from "./library/AddressToEntityKey.sol";
import { VeryMonPositionToEntityKey } from "./library/VeryMonPositionToEntityKey.sol";
 
contract VeryMonMapSystem is System {
  function spawn(uint32 x, uint32 y) public {
    bytes32 player = AddressToEntityKey(address(_msgSender()));
    require(!VeryMonPlayer.get(player), "already spawned");
 
    // Constrain VeryMonPosition to map size, wrapping around if necessary
    (uint32 width, uint32 height, ) = VeryMonMap.get();
    x = (x + width) % width;
    y = (y + height) % height;

    // VeryMonPosition of Spawn
    bytes32 position = VeryMonPositionToEntityKey(x, y);
    require(!Obstruction.get(position), "this space is obstructed");
 
    VeryMonPlayer.set(player, true);
    VeryMonPosition.set(player, x, y);
    Movable.set(player, true);
    Encounterable.set(player, true);
  }
 
  function move(uint32 x, uint32 y) public {
    bytes32 player = AddressToEntityKey(_msgSender());
    require(Movable.get(player), "cannot move");
 
    require(!Encounter.getExists(player), "cannot move during an encounter");
 
    (uint32 fromX, uint32 fromY) = VeryMonPosition.get(player);
    require(distance(fromX, fromY, x, y) == 1, "can only move to adjacent spaces");
 
    // Constrain VeryMonPosition to map size, wrapping around if necessary
    (uint32 width, uint32 height, ) = VeryMonMap.get();
    x = (x + width) % width;
    y = (y + height) % height;
 
    bytes32 position = VeryMonPositionToEntityKey(x, y);
    require(!Obstruction.get(position), "this space is obstructed");
 
    VeryMonPosition.set(player, x, y);
 
    if (Encounterable.get(player) && EncounterTrigger.get(position)) {
      uint256 rand = uint256(keccak256(abi.encode(player, position, blockhash(block.number - 1), block.difficulty)));
      if (rand % 5 == 0) {
        startEncounter(player);
      }
    }
  }
 
  function distance(uint32 fromX, uint32 fromY, uint32 toX, uint32 toY) internal pure returns (uint32) {
    uint32 deltaX = fromX > toX ? fromX - toX : toX - fromX;
    uint32 deltaY = fromY > toY ? fromY - toY : toY - fromY;
    return deltaX + deltaY;
  }
 
  function startEncounter(bytes32 player) internal {
    bytes32 monster = keccak256(abi.encode(player, blockhash(block.number - 1), block.difficulty));
    MonsterType monsterType = MonsterType((uint256(monster) % uint256(type(MonsterType).max)) + 1);
    Monster.set(monster, monsterType);
    Encounter.set(player, EncounterData({ exists: true, monster: monster, catchAttempts: 0 }));
  }
}