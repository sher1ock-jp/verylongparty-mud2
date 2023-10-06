// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { 
    MapId,
    SquareCoordinates,
    SquareStopQualification,
    SquareQuest,
    SquareQuestPoint,
    SquareIconUrl,
    SquareDescription,
    SquareCreator,
    SquareCreatorEns,
    SquareCreatorIconUrl,
    NextSquareCoordinates
} from "../codegen/Tables.sol";
import { getUniqueEntity } from "@latticexyz/world/src/modules/uniqueentity/getUniqueEntity.sol";

contract SquareSystem is System {

    function CreateSquare(
        uint32 _squareMapId,
        uint32 _createdX,
        uint32 _createdY,
        uint32 _prevX,
        uint32 _prevY,
        string memory  _creatorEns,
        string memory _creatorIconUrl,
        string memory _squareIconUrl,
        string memory _squareDescription,
        address _squareStopQualification,
        address _squareQuest,
        uint32 _squareQuestPoint
    ) public {
        // Square.setCoordinateX(_squareMapId, _createdX);
        // Square.setCoordinateY(_squareMapId, _createdY);
        // Square.setStopQualification(_squareMapId, _squareStopQualification);
        // Square.setQuest(_squareMapId, _squareQuest);
        // Square.setQuestPoint(_squareMapId, _squareQuestPoint);
        // Square.setIconUrl(_squareMapId, _squareIconUrl);
        // Square.setDescription(_squareMapId, _squareDescription);
        // Square.setCreator(_squareMapId, _msgSender());
        // Square.setCreatorEns(_squareMapId, _creatorEns);
        // Square.setCreatorIconUrl(_squareMapId, _creatorIconUrl);

        bytes32 squareKey = getUniqueEntity();
        MapId.set(squareKey, _squareMapId);
        SquareCoordinates.set(squareKey, _createdX, _createdY);
        SquareStopQualification.set(squareKey, _squareStopQualification);
        SquareQuest.set(squareKey, _squareQuest);
        SquareQuestPoint.set(squareKey, _squareQuestPoint);
        SquareIconUrl.set(squareKey, _squareIconUrl);
        SquareDescription.set(squareKey, _squareDescription);
        SquareCreator.set(squareKey, _msgSender());
        SquareCreatorEns.set(squareKey, _creatorEns);
        SquareCreatorIconUrl.set(squareKey, _creatorIconUrl);

        NextSquareCoordinates.pushNextX(_squareMapId, _prevX, _prevY, _createdX);
        NextSquareCoordinates.pushNextY(_squareMapId, _prevX, _prevY, _createdY);
    }
}
