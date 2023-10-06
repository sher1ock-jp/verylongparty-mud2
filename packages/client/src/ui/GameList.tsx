import { 
    // useEntityQuery,
    // useComponentValue
} from "@latticexyz/react";
import { 
    Has,
    // getComponentValueStrict,
    HasValue,
    getComponentValue,
    runQuery,
    // getComponentEntities,
    // getEntityComponents,
    withValue,
    Entity
} from "@latticexyz/recs";
// import { decodeEntity } from "@latticexyz/store-sync/recs";
// import {world} from "../mud/world";
import { useMUD } from "../MUDContext";

import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import "../../src/App.css";

interface MapData {
    mapId: number;
    mapName: string;
    playerCount: number;
}

const GameList = () => {
    const navigate = useNavigate();

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [newMapName, setNewMapName] = useState("");
    const [mapData, setMapData] = useState<MapData[]>([]);

    const {
        components: { MapId, MapName, PlayerMapId },
        systemCalls: { CreateGameMap, CreateInitialSquare },
    } = useMUD();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let fetchedEntities: Entity[] = [];

                while (fetchedEntities.length === 0) {
                    try {

                        fetchedEntities = Array.from(
                            runQuery([Has(MapId), Has(MapName)])
                        );
                        // fetchedEntities = Array.from(getComponentEntities(MapId));

                        if (fetchedEntities.length === 0) {
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    } catch (error) {
                        console.error("Error fetching map data:", error);
                        break;
                    }
                }

                const newMapData = fetchedEntities.map((entity) => {
                    const MapIdValue = getComponentValue(MapId, entity);
                    const MapNameValue = getComponentValue(MapName, entity);

                    if (MapIdValue !== undefined && "value" in MapIdValue) {
                        const valueObject = withValue(PlayerMapId, MapIdValue);
                        const playerCount = runQuery([HasValue(...valueObject)]).size;

                        return {
                            mapId: MapIdValue.value,
                            mapName: MapNameValue?.value ?? "",
                            playerCount: playerCount,
                        };
                    }
                    return null;
                }).filter((map) => map !== null) as { mapId: number; mapName: string; playerCount: number }[];

                setMapData(newMapData);
            } catch (error) {
                console.error("Error fetching map data:", error);
            }
        };
        fetchData();
    }, []);

    const handleCreateGameMap = async () => {
        if (newMapName.trim() !== "") {
            try {
                const newMapId = mapData[mapData.length - 1].mapId + 1;
                await CreateGameMap(newMapId, newMapName);
                await CreateInitialSquare(newMapId);
                setNewMapName("");
                setIsPopupOpen(false);
            } catch (error) {
                console.log("error", error);
            }
        }
    };

    return (
        <>
            <div className="gamelist-background">
                <div className="create-game-map-button">
                    <button className="create-button" onClick={() => setIsPopupOpen(true)}>
                        Create Game Map
                    </button>
                </div>
                {isPopupOpen && (
                    <div className="popup">
                        <div className="popup-content">
                            <input
                                type="text"
                                placeholder="Enter map name"
                                value={newMapName}
                                onChange={(e) => setNewMapName(e.target.value)}
                            />
                            <button onClick={handleCreateGameMap}>Create</button>
                            <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
                        </div>
                    </div>
                )}
                <div className="gamelist">
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Map Name</th>
                                    <th>Player Count</th>
                                    <th>Explore</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mapData.map((map) => (
                                    <tr key={map.mapId}>
                                        <td>{map.mapName}</td>
                                        <td>{map.playerCount}</td>
                                        <td>
                                            <button
                                                className="explore-button"
                                                onClick={() => navigate(`/game-board/${map.mapId}`)}
                                            >
                                                Explore
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GameList;

// const {
//   components: { Counter },
//   systemCalls: { increment },
// } = useMUD();

// display loading state and GameList or GameBoard

// const gameMapQuery = [Has(GameMap)];
// console.log("gameMapQuery", gameMapQuery)
// console.log("gameMapQuery", gameMapQuery[0].component.schema)
// const matchingEntities = runQuery(gameMapQuery);
// for (const entity of matchingEntities) {
//     const componentValue = getComponentValue(GameMap, entity);
//     console.log("Component value for entity", entity, ":", componentValue?.gameMapName);
// }

// useEntityQuery([Has(GameMap)]).map((entity) => {
//     //const key = decodeEntity(GameMap.metadata.keySchema, entity);
//     console.log("entity", entity);
//     const value = getComponentValueStrict(GameMap, entity);
//     const key = decodeEntity(GameMap.metadata.keySchema, entity);
//     console.log("key", key);
//     console.log("value", value);
// });

// const aaa = getComponentEntities(GameMap);
// for (const entity of aaa) {
//     console.log("getComponentEntities",entity);
//     const bbb = getEntityComponents(world,entity);
//     console.log("getEntityComponents",bbb);
//   }

// const value = useComponentValue(
//     GameMap,
//     encodeEntity(GameMap.metadata.keySchema, { gameMapId: 1 })
//   );
// console.log("useComponentValue / encodeEntity", value);