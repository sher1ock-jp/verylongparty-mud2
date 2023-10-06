// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import { EncounterTrigger, VeryMonMap, Obstruction, VeryMonPosition } from "../src/codegen/Tables.sol";
import { TerrainType } from "../src/codegen/Types.sol";
import { VeryMonPositionToEntityKey } from "../src/systems/library/VeryMonPositionToEntityKey.sol";


contract PostDeploy is Script {
  function run(address worldAddress) external {
    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    // Start broadcasting transactions from the deployer account
    vm.startBroadcast(deployerPrivateKey);

    // ------------------ EXAMPLES ------------------

    IWorld world = IWorld(worldAddress);

    world.CreateGameMap(
      1,
      "testMap"
    );

    world.CreateInitialSquare(
      1
    );

    world.CreateSquare(
      1,
      2,
      2,
      1,
      1,
      "testEns",
      "testCreatorUrl",
      "testSquareUrl",
      "testDescription",
      address(1),
      address(2),
      100
    );

    TerrainType O = TerrainType.None;
    TerrainType T = TerrainType.TallGrass;
    TerrainType B = TerrainType.Boulder;
 
    TerrainType[20][20] memory map = [
      [O, O, O, O, O, O, T, O, O, O, O, O, O, O, O, O, O, O, O, O],
      [O, O, T, O, O, O, O, O, T, O, O, O, O, B, O, O, O, O, O, O],
      [O, T, T, T, T, O, O, O, O, O, O, O, O, O, O, T, T, O, O, O],
      [O, O, T, T, T, T, O, O, O, O, B, O, O, O, O, O, T, O, O, O],
      [O, O, O, O, T, T, O, O, O, O, O, O, O, O, O, O, O, T, O, O],
      [O, O, O, B, B, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O],
      [O, T, O, O, O, B, B, O, O, O, O, T, O, O, O, O, O, B, O, O],
      [O, O, T, T, O, O, O, O, O, T, O, B, O, O, T, O, B, O, O, O],
      [O, O, T, O, O, O, O, T, T, T, O, B, B, O, O, O, O, O, O, O],
      [O, O, O, O, O, O, O, T, T, T, O, B, T, O, T, T, O, O, O, O],
      [O, B, O, O, O, B, O, O, T, T, O, B, O, O, T, T, O, O, O, O],
      [O, O, B, O, O, O, T, O, T, T, O, O, B, T, T, T, O, O, O, O],
      [O, O, B, B, O, O, O, O, T, O, O, O, B, O, T, O, O, O, O, O],
      [O, O, O, B, B, O, O, O, O, O, O, O, O, B, O, T, O, O, O, O],
      [O, O, O, O, B, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O],
      [O, O, O, O, O, O, O, O, O, O, B, B, O, O, T, O, O, O, O, O],
      [O, O, O, O, T, O, O, O, T, B, O, O, O, T, T, O, B, O, O, O],
      [O, O, O, T, O, T, T, T, O, O, O, O, O, T, O, O, O, O, O, O],
      [O, O, O, T, T, T, T, O, O, O, O, T, O, O, O, T, O, O, O, O],
      [O, O, O, O, O, T, O, O, O, O, O, O, O, O, O, O, O, O, O, O]
    ];
 
    uint32 height = uint32(map.length);
    uint32 width = uint32(map[0].length);
    bytes memory terrain = new bytes(width * height);
 
    for (uint32 y = 0; y < height; y++) {
      for (uint32 x = 0; x < width; x++) {
        TerrainType terrainType = map[y][x];
        if (terrainType == TerrainType.None) continue;
 
        terrain[(y * width) + x] = bytes1(uint8(terrainType));
 
        bytes32 entity = VeryMonPositionToEntityKey(x, y);
        if (terrainType == TerrainType.Boulder) {
          VeryMonPosition.set(world, entity, x, y);
          Obstruction.set(world, entity, true);
        } else if (terrainType == TerrainType.TallGrass) {
          VeryMonPosition.set(world, entity, x, y);
          EncounterTrigger.set(world, entity, true);
        }
      }
    }
 
    VeryMonMap.set(world, width, height, terrain);

    // // Call increment on the world via the registered function selector
    // uint32 newValue = IWorld(worldAddress).increment();
    // console.log("Increment via IWorld:", newValue);

    vm.stopBroadcast();
  }
}