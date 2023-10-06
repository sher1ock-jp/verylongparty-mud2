import { defineComponent,Type } from "@latticexyz/recs";
import { useComponentValue } from "@latticexyz/react";
import { SyncState } from "@latticexyz/network";
import { VeryGameBoard } from "./VeryGameBoard";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { world } from "../mud/world";
import { useMUD } from "../MUDContext";
import { SyncStep } from "@latticexyz/store-sync";

export const EntryPoint = () => {

  const {
    components: { SyncProgress },
  } = useMUD();

  const syncProgress = useComponentValue(SyncProgress, singletonEntity, {
    message: "Connecting",
    percentage: 0,
    step: SyncStep.INITIALIZE,
    latestBlockNumber: 0n,
    lastBlockNumberProcessed: 0n, 
  });
    

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      {syncProgress.step === SyncStep.LIVE ? (
        <VeryGameBoard />
      ) : (
        <div>
          {syncProgress.message} ({Math.floor(syncProgress.percentage)}%)
        </div>
      )}
    </div>
  );
};
