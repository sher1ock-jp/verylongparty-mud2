// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import {MudTest} from "@latticexyz/store/src/MudTest.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

import {IWorld} from "../../src/codegen/world/IWorld.sol";
// import {SquareAvailable, SquareCreator, SquareInfo, NextSquare, SquareListInMap} from "../../src/codegen/Tables.sol";
// import {LibSquareCreate} from "../../src/library/LibSquareCreate.sol";


contract LibSquareCreateTest is MudTest {
  IWorld public world;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
    // vm.startPrank(worldAddress);
    // PlayerCommonStatus.set(
    //     address(1),
    //     true,
    //     0,
    //     "test.eth",
    //     "test.com"
    // );
    // vm.stopPrank();
  }

  function testCreateSquare() public {
    vm.startPrank(worldAddress);
    // LibSquareCreate.createSquare(
    //     1,
    //     1,
    //     1,
    //     "test.eth",
    //     "test.com",
    //     "test.com",
    //     "test.com",
    //     address(1),
    //     address(1),
    //     1,
    //     1,
    //     1
    // );
    // LibSquareCreate.createSquare(
    //     1,
    //     2,
    //     2,
    //     "test.eth",
    //     "test.com",
    //     "test.com",
    //     "test.com",
    //     address(1),
    //     address(1),
    //     1,
    //     1,
    //     1
    // );
    vm.stopPrank();
  }

}


