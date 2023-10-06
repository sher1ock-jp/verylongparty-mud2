import { useMUD } from "../../MUDContext";
import { useParams } from 'react-router-dom';
import { useComponentValue } from "@latticexyz/react";

const PlayerMapActions = () => {
    const {
        components: {
            PlayerIsInMap,
            PlayerMapId,
        },
        systemCalls: {
            MapJoin,
            MapExit,
        },
        network: {
            playerEntity
        }
    } = useMUD();
    
    const { gameMapId = "1" } = useParams();

    const isInMap = useComponentValue(PlayerIsInMap, playerEntity);
    const currentMapId = useComponentValue(PlayerMapId, playerEntity);

    const handleMapJoin = () => {
        if (isInMap?.value) {
            console.log("Player is already in map");
            return;
        }
        MapJoin(parseInt(gameMapId));
    };

    const handleMapExit = () => {
        if (!isInMap?.value) {
            console.log("Player is already out of map");
            return;
        }

        if (currentMapId?.value !== parseInt(gameMapId)) {
            console.log("Player is not in this map");
            return;
        }
        
        MapExit();
    };

    return (
        <div>
            <button className="playerjoin-button" onClick={handleMapJoin}>MapJoin</button>
            <button className="playerexit-button" onClick={handleMapExit}>MapExit</button>
        </div>
    );
}

export default PlayerMapActions;
