// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import {MudTest} from "@latticexyz/store/src/MudTest.sol";
import {getKeysWithValue} from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";
import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import {IWorld} from "../src/codegen/world/IWorld.sol";
// import {PlayerCommonStatus, PlayerCommonStatusData} from "../src/codegen/Tables.sol";


contract InitialSettingTest is MudTest {
    IWorld public world;

    function setUp() public override {
        super.setUp();
        world = IWorld(worldAddress);
    }

    function testInitialSetting() public {
        vm.startPrank(worldAddress);

   
        // string memory _playerEns = "test.eth";
        // string memory _playerIconUrl = "test.com";

        // world.PlayerInitialSet(_playerEns, _playerIconUrl);

        vm.stopPrank();

        // PlayerCommonStatus.setPlayerIsInMap(
        //     address(2),
        //     false
        // );

        // console.log("_playerEns %s, _playerUrl %s", PlayerCommonStatus.getPlayerEns(address(1)), PlayerCommonStatus.getPlayerIconUrl(address(1)));

             // PlayerCommonStatusData memory expectedPlayerCommonStatus = PlayerCommonStatusData({
        //     playerIsInMap: false,
        //     playerPointBalance: 0,
        //     playerEns: "test.eth",
        //     playerIconUrl: "test.com"
        // });

        // PlayerCommonStatusData memory actualPlayerCommonStatus = PlayerCommonStatus.get(address(0x123));
        // console.log("actualPlayerCommonStatus", actualPlayerCommonStatus.playerEns);

        // assertEq(1,1);
  }

}