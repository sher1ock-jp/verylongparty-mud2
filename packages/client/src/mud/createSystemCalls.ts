import { ClientComponents } from "./createClientComponents";
import { Has, HasValue, getComponentValue, runQuery } from "@latticexyz/recs";
import { uuid, awaitStreamValue } from "@latticexyz/utils";
import { SetupNetworkResult } from "./setupNetwork";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { MonsterCatchResult } from "../verymon/monsterCatchResult";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { playerEntity, worldContract, waitForTransaction }: SetupNetworkResult,
  { Encounter, VeryMonMap, MonsterCatchAttempt, Obstruction, VeryMonPlayer, VeryMonPosition }: ClientComponents
) {
  const CreateGameMap = async (_mapId: number, _gameMapName: string) => {
    const tx = await worldContract.write.CreateGameMap([_mapId, _gameMapName]);
    await waitForTransaction(tx);
  };

  const CreateInitialSquare = async (_mapId: number) => {
    const tx = await worldContract.write.CreateInitialSquare([_mapId]);
    await waitForTransaction(tx);
  };

  const SetPlayerInfo = async (_PlayerEns: string, _PlayerIconUrl: string) => {
    const tx = await worldContract.write.PlayerInfoSet([_PlayerEns, _PlayerIconUrl]);
    await waitForTransaction(tx);
  };

  const MapJoin = async (_mapId: number) => {
    const tx = await worldContract.write.MapJoin([_mapId]);
    await waitForTransaction(tx);
  };

  const MapExit = async () => {
    const tx = await worldContract.write.MapExit();
    await waitForTransaction(tx);
  };

  const CreateSquare = async (
      _squareMapId: number,
      _createdX: number,
      _createdY: number,
      _prevX: number,
      _prevY: number,
      _creatorEns: string,
      _creatorIconUrl: string,
      _squareIconUrl: string,
      _squareDescription: string,
      _squareStopQualification: `0x${string}`,
      _squareQuest: `0x${string}`,
      _squareQuestPoint: number
  ) => {
    const tx = await worldContract.write.CreateSquare([
      _squareMapId,
      _createdX,
      _createdY,
      _prevX,
      _prevY,
      _creatorEns,
      _creatorIconUrl,
      _squareIconUrl,
      _squareDescription,
      _squareStopQualification,
      _squareQuest,
      _squareQuestPoint
    ]);
    await waitForTransaction(tx);
  };

  /* verymon */
  const wrapPosition = (x: number, y: number) => {
    const mapConfig = getComponentValue(VeryMonMap, singletonEntity);
    if (!mapConfig) {
      throw new Error("mapConfig no yet loaded or initialized");
    }
    return [(x + mapConfig.width) % mapConfig.width, (y + mapConfig.height) % mapConfig.height];
  };

  const isObstructed = (x: number, y: number) => {
    return runQuery([Has(Obstruction), HasValue(VeryMonPosition, { x, y })]).size > 0;
  };

  const moveTo = async (inputX: number, inputY: number) => {
    if (!playerEntity) {
      throw new Error("no player");
    }
 
    const inEncounter = !!getComponentValue(Encounter, playerEntity);
    if (inEncounter) {
      console.warn("cannot move while in encounter");
      return;
    }
 
    const [x, y] = wrapPosition(inputX, inputY);
    if (isObstructed(x, y)) {
      // console.log("isObstructed", x, y);
      console.warn("cannot move to obstructed space");
      return;
    }
 
    const positionId = uuid();
    VeryMonPosition.addOverride(positionId, {
      entity: playerEntity,
      value: { x, y },
    });

    try {
      const tx = await worldContract.write.move([x, y]);
      await waitForTransaction(tx);
    } finally {
      VeryMonPosition.removeOverride(positionId);
    }
  };
 
  const moveBy = async (deltaX: number, deltaY: number) => {
    if (!playerEntity) {
      throw new Error("no player");
    }
 
    const playerPosition = getComponentValue(VeryMonPosition, playerEntity);
    if (!playerPosition) {
      console.warn("cannot moveBy without a player position, not yet spawned?");
      return;
    }
    await moveTo(playerPosition.x + deltaX, playerPosition.y + deltaY);
  };
 
  const spawn = async (inputX: number, inputY: number) => {
    if (!playerEntity) {
      throw new Error("no player");
    }
 
    const canSpawn = getComponentValue(VeryMonPlayer, playerEntity)?.value !== true;
    if (!canSpawn) {
      throw new Error("already spawned");
    }
 
    const [x, y] = wrapPosition(inputX, inputY);
    if (isObstructed(x, y)) {
      console.warn("cannot spawn on obstructed space");
      return;
    }
 
    const positionId = uuid();
    VeryMonPosition.addOverride(positionId, {
      entity: playerEntity,
      value: { x, y },
    });
    const playerId = uuid();
    VeryMonPlayer.addOverride(playerId, {
      entity: playerEntity,
      value: { value: true },
    });

    try {
      const tx = await worldContract.write.spawn([x, y]);
      await waitForTransaction(tx);
    } finally {
      VeryMonPosition.removeOverride(positionId);
      VeryMonPlayer.removeOverride(playerId);
    }
  };
 
  const throwBall = async () => {
    const player = playerEntity;
    if (!player) {
      throw new Error("no player");
    }
 
    const encounter = getComponentValue(Encounter, player);
    if (!encounter) {
      throw new Error("no encounter");
    }

    const tx = await worldContract.write.throwBall();
    await waitForTransaction(tx);
 
    const catchAttempt = getComponentValue(MonsterCatchAttempt, player);
    if (!catchAttempt) {
      throw new Error("no catch attempt found");
    }
 
    return catchAttempt.result as MonsterCatchResult;
  };

  const fleeEncounter = async () => {
    const tx = await worldContract.write.flee();
    await waitForTransaction(tx);
  };
 
  return {
    CreateGameMap,
    CreateInitialSquare,
    SetPlayerInfo,
    MapJoin,
    MapExit,
    CreateSquare,
    /* verymon */
    wrapPosition,
    isObstructed,
    moveTo,
    moveBy,
    spawn,
    throwBall,
    fleeEncounter,
  };
}
