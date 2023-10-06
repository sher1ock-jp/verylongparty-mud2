import React from "react";
import { useParams } from "react-router-dom";

import { useMUD } from "../../MUDContext";

import { 
  HasValue,
  runQuery,
  getComponentValue,
  Has,
} from "@latticexyz/recs";

interface ConfirmSquareProps {
  coordinateX: number;
  coordinateY: number;
}

function ConfirmSquare({ coordinateX, coordinateY }: ConfirmSquareProps) {

    const {
        components: {
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
        },
    } = useMUD();

    const { gameMapId = "1" } = useParams();
    const parsedGameMapId = parseInt(gameMapId, 10);

    const squareEntity = Array.from(runQuery(
        [Has(MapId),HasValue(SquareCoordinates, { x: coordinateX, y: coordinateY })]
    ));

    const stopQualification = getComponentValue(SquareStopQualification, squareEntity[0])?.value;
    const quest = getComponentValue(SquareQuest, squareEntity[0])?.value;
    const questPoint = getComponentValue(SquareQuestPoint, squareEntity[0])?.value;
    const description = getComponentValue(SquareDescription, squareEntity[0])?.value;
    const creator = getComponentValue(SquareCreator, squareEntity[0])?.value;
    const creatorEns = getComponentValue(SquareCreatorEns, squareEntity[0])?.value;
    const creatorIconUrl = getComponentValue(SquareCreatorIconUrl, squareEntity[0])?.value;
    
    return (
        <div className="confirm-square-content">
            <div className="square-item">
                coordinateX,Y:
            </div>
            <div className="square-value">
                {coordinateX},{coordinateY}
            </div>
            <div className="square-item">
                Creator:
            </div>
            <div className="square-value">
            {creatorEns ? creatorEns : creator}
            </div>
            <div className="square-item">
                Creator Icon:
            </div>
            <div className="square-value">
                {creatorIconUrl ? (
                <img src={creatorIconUrl} alt="Creator Icon" width={50} height={50} />
                ) : null}
            </div>
            <div className="square-item">
                Description:
            </div>
            <div className="square-value">
                {description ? description : "not set"}
            </div>
            <div className="square-item">
                Stop Qualification:
            </div>
            <div className="square-value">
                {stopQualification ? stopQualification : "not set"}
            </div>
            <div className="square-item">
                Quest:
            </div>
            <div className="square-value">
                {quest ? quest : "not set"}
            </div>
            <div className="square-item">
                Quest Point:
            </div>
            <div className="square-value">
                {questPoint ? questPoint : "not set"}
            </div>
        </div>
        );
    }

export default ConfirmSquare;
