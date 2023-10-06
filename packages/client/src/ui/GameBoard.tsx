import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PlayerMapActions from './component/PlayerMapActions';
import Squares from './component/Squares';
import SquareCreation from './component/SquareCreation';

import {useComponentValue, useEntityQuery } from "@latticexyz/react";
import{ ComponentValue, getComponentValueStrict, HasValue, Has, getComponentEntities, getEntityComponents } from "@latticexyz/recs"
import { encodeEntity, decodeEntity } from "@latticexyz/store-sync/recs";
import { useMUD } from "../MUDContext";
import {world} from "../mud/world";

const GameBoard = () => {

    // const {
    //     components: {SquareInfo, SquareListInMap, PositionComponent},
    //     // systemCalls: { createGameMap },
    //     // network: {singletonEntity},
    // } = useMUD();

    const navigate = useNavigate();

    return (
        <>  
            <div className="gameboard-background">
                <div className="game-board">
                    <Squares />
                </div>
                <div className="rightside-button-area">
                    <div className="player-transition-button-area">
                        <div>
                            <PlayerMapActions />
                        </div>
                    </div>
                    <button className="back-button" onClick={() => navigate("/")}>
                            Back
                    </button>
                </div>
                <div className="squarecreation-button-area">
                    <SquareCreation />
                </div>
            </div>
        </>
    );
};

export default GameBoard;