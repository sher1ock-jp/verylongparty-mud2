import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  tables: {

    MapId: "uint32",
    MapCreator: "address",
    MapName: "string",
     
    SquareCoordinates: {
      schema: {
        x: "uint32",
        y: "uint32",
     },
    },
    
    SquareStopQualification: "address",
    SquareQuest: "address",
    SquareQuestPoint: "uint32",
    SquareIconUrl: "string",
    SquareDescription: "string",
    SquareCreator: "address",
    SquareCreatorEns: "string",
    SquareCreatorIconUrl: "string",

    NextSquareCoordinates:{
      keySchema: {
        mapId: "uint32",
        prevX: "uint32",
        prevY: "uint32",
      },
      schema: {
        nextX: "uint32[]",
        nextY: "uint32[]",
      },
    },

    PlayerIsInMap: "bool",
    // maybe no need
    PlayerEns: "string",
    PlayerIconUrl: "string",
    PlayerMapId: "uint32",
    PlayerCoordinates: {
      schema: {
        x: "uint32",
        y: "uint32",
      },
    },
    PlayerPointBalance: "uint32",
    PlayerQuest: "address",
    PlayerIsMovable: "bool",

    Encounter: {
      keySchema: {
        player: "bytes32",
      },
      schema: {
        exists: "bool",
        monster: "bytes32",
        catchAttempts: "uint256",
      },
    },
    EncounterTrigger: "bool",
    Encounterable: "bool",
    VeryMonMap: {
      keySchema: {},
      dataStruct: false,
      schema: {
        width: "uint32",
        height: "uint32",
        terrain: "bytes",
      },
    },
    MonsterCatchAttempt: {
      ephemeral: true,
      dataStruct: false,
      keySchema: {
        encounter: "bytes32",
      },
      schema: {
        result: "MonsterCatchResult",
      },
    },
    Monster: "MonsterType",
    Movable: "bool",
    Obstruction: "bool",
    OwnedBy: "bytes32",
    VeryMonPlayer: "bool",
    VeryMonPosition: {
      dataStruct: false,
      schema: {
        x: "uint32",
        y: "uint32",
      },
    },
  },

  enums: {
    MonsterCatchResult: ["Missed", "Caught", "Fled"],
    MonsterType: ["None", "Eagle", "Rat", "Caterpillar"],
    TerrainType: ["None", "TallGrass", "Boulder"],
  },

  modules: [
    {
      name: "UniqueEntityModule",
      root: true,
      args: [],
    },
  ],

});
