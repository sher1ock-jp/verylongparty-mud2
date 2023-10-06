import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {useComponentValue} from "@latticexyz/react";

import { useMUD } from "../../MUDContext";

import useNftList from "../../library/NftList";
import useWalletData from "../../library/WalletData";

const SquareCreation = () => {
  const {
    components: {PlayerEns, PlayerIconUrl},
    systemCalls: { CreateSquare },
    network: { playerEntity },
  } = useMUD();

  const { gameMapId = "1" } = useParams();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [createdX, setCreatedX] = useState("");
  const [createdY, setCreatedY] = useState("");
  const [prevX, setPrevX] = useState("");
  const [prevY, setPrevY] = useState("");
  const [squareIconUrl, setSquareIconUrl] = useState("");
  const [squareDescription, setSquareDescription] = useState("");
  const [squareStopQualification, setSquareStopQualification] = useState("");
  const [squareQuest, setSquareQuest] = useState("");
  const [squareQuestPoint, setSquareQuestPoint] = useState("");

  const { walletAddress} = useWalletData(); 
  const nftList = useNftList(walletAddress); 
  const creatorEns = useComponentValue(PlayerEns, playerEntity);
  const creatorIconUrl = useComponentValue(PlayerIconUrl, playerEntity);

  const handleSquareIconSelect = (imageUrl: string) => {
    setSquareIconUrl(imageUrl);
  };

  const handleSquareIconReset = () => {
    setSquareIconUrl("");
  };

  const handleSquareCreation = () => {
    if(!creatorEns || !creatorIconUrl){
        console.log("you should set playerInfo first");
        return;
    }else{
        CreateSquare(
            parseInt(gameMapId, 10),
            parseInt(createdX, 10),
            parseInt(createdY, 10),
            parseInt(prevX, 10),
            parseInt(prevY, 10),
            creatorEns.value,
            creatorIconUrl.value,
            squareIconUrl,
            squareDescription,
            squareStopQualification as `0x${string}`,
            squareQuest as `0x${string}`,
            parseInt(squareQuestPoint, 10)
            );
            setCreatedX("");
            setCreatedY("");
            setPrevX("");
            setPrevY("");
            setSquareIconUrl("");
            setSquareDescription("");
            setSquareStopQualification("");
            setSquareQuest("");
            setSquareQuestPoint("");
        
            setIsModalVisible(false);
    }
  };

  return (
    <div>
      <button className="squarecreation-button" onClick={() => setIsModalVisible(true)}>Create Square</button>
      {isModalVisible && (
        <div className="squarecreation-modal">
          <form onSubmit={handleSquareCreation} className="form-container">
            <div className="input-group">
                <input
                type="number"
                placeholder="Created X"
                value={createdX}
                onChange={(e) => setCreatedX(e.target.value)}
                required
                />
                <input
                type="number"
                placeholder="Created Y"
                value={createdY}
                onChange={(e) => setCreatedY(e.target.value)}
                required
                />
            </div>
            <div className="input-group">
                <input
                type="number"
                placeholder="Prev X"
                value={prevX}
                onChange={(e) => setPrevX(e.target.value)}
                required
                />
                <input
                type="number"
                placeholder="Prev Y"
                value={prevY}
                onChange={(e) => setPrevY(e.target.value)}
                required
                />
            </div>
            <div className="input-group">
              <div className="image-selection-container">
                <div className="image-selection">
                  {squareIconUrl ? (
                      <img
                          src={squareIconUrl}
                          width={70}
                          alt="Selected Square Icon"
                      />
                  ) : (
                      nftList.map((nftUrl, index) => (
                          <img
                              key={index}
                              src={nftUrl}
                              width={70}
                              alt="NFT Icon"
                              onClick={() => handleSquareIconSelect(nftUrl)}
                              className={nftUrl === squareIconUrl ? "selected" : ""}
                          />
                      ))
                  )}
                </div>
              </div>
            </div>
            <button onClick={handleSquareIconReset}>
              Reset Image Selection
            </button>
            <input
              type="text"
              placeholder="Square Description"
              value={squareDescription}
              onChange={(e) => setSquareDescription(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Square Stop Qualification  (option)"
              value={squareStopQualification}
              onChange={(e) => setSquareStopQualification(e.target.value)}
            />
            <input
              type="text"
              placeholder="Square Quest"
              value={squareQuest}
              onChange={(e) => setSquareQuest(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Square Quest Point"
              value={squareQuestPoint}
              onChange={(e) => setSquareQuestPoint(e.target.value)}
              required
            />
            <button type="submit">Create</button>
          </form>
          <button onClick={() => setIsModalVisible(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default SquareCreation;
