// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import {
  MapId,
  MapCreator,
  MapName,
  SquareCoordinates,
  SquareIconUrl,
  SquareDescription
} from "../codegen/Tables.sol";
import { getUniqueEntity } from "@latticexyz/world/src/modules/uniqueentity/getUniqueEntity.sol";

contract MapSystem is System {

  function CreateGameMap(uint32 _mapId, string memory _gameMapName) public {
   
    bytes32 mapKey = getUniqueEntity();

    MapId.set(mapKey, uint32(_mapId));
    MapCreator.set(mapKey, _msgSender());
    MapName.set(mapKey, _gameMapName);

  }

  function CreateInitialSquare(uint32 _mapId) public {
    bytes32 squareKey = getUniqueEntity();
    MapId.set(squareKey, _mapId);
    SquareCoordinates.set(squareKey,0, 0);
    SquareIconUrl.set(squareKey, "https://i.gzn.jp/img/2018/01/15/google-gorilla-ban/00.jpg");
    SquareDescription.set(squareKey, "start square");

    // Square.setCoordinateX(_mapId, 1);
    // Square.setCoordinateY(_mapId, 1);
    // Square.setIconUrl(_mapId, "https://i.gzn.jp/img/2018/01/15/google-gorilla-ban/00.jpg");
    // Square.setDescription(_mapId, "start square");
  }

}
