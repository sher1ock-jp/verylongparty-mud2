// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import {MudTest} from "@latticexyz/store/src/MudTest.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

import {IWorld} from "../../src/codegen/world/IWorld.sol";
// import {PlayerInMapStatus, PlayerCommonStatus, PlayerCommonStatusData} from "../../src/codegen/Tables.sol";
// import {LibGameStart} from "../../src/library/LibGameStart.sol";


contract LibGameStartTest is MudTest {
  IWorld public world;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
    vm.startPrank(worldAddress);
    // PlayerCommonStatus.set(
    //     address(1),
    //     false,
    //     0,
    //     "test.eth",
    //     "test.com"
    // );
    // vm.stopPrank();
  }

  // function testFailPlayerTrue() public {
  //   vm.startPrank(worldAddress);
  //   require(!PlayerCommonStatus.getPlayerIsInMap(address(1)), "Player is already playing");
  //   PlayerCommonStatus.setPlayerIsInMap(address(1), true);
  //   vm.stopPrank();
  // }

  // function testPlayerInMapStatusSet(uint32 _gameMapId) public {
  //   vm.startPrank(worldAddress);
  //   PlayerInMapStatus.set(
  //     address(1),
  //     _gameMapId,
  //     1, // initial x coordinate
  //     1, // initial y coordinate
  //     address(100), // square one does not have quest
  //     false
  //   );
  //   vm.stopPrank();
  // }

  // function testJoinMap() public {
  //   vm.startPrank(worldAddress);
  //   uint32 _gameMapId = 1;
  //   LibGameStart.joinMap(_gameMapId);
  //   vm.stopPrank();
  // }
}


