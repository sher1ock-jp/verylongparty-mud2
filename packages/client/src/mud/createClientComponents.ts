import { SetupNetworkResult } from "./setupNetwork";
import { overridableComponent } from "@latticexyz/recs";

export type ClientComponents = ReturnType<typeof createClientComponents>;

export function createClientComponents({ components }: SetupNetworkResult) {
  return {
    ...components,
    VeryMonPlayer: overridableComponent(components.VeryMonPlayer),
    VeryMonPosition: overridableComponent(components.VeryMonPosition),
    // add your client components or overrides here
  };
}
