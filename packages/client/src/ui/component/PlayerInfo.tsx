import axios from "axios";
import { useState, useEffect } from 'react';
import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "../../MUDContext";

import useNftList from "../../library/NftList";

interface PlayerInfoProps {
    _walletAddress: string | null;
    _ens: string | null;
}

function PlayerInfo({ _walletAddress, _ens }: PlayerInfoProps) {
    const {
        components: {
            PlayerIsInMap, PlayerIconUrl, PlayerMapId, PlayerCoordinates,
            PlayerPointBalance, PlayerQuest, PlayerIsMovable
        },
        systemCalls: { SetPlayerInfo },
        network: {playerEntity},
    } = useMUD();

    const nftList = useNftList(_walletAddress);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    const [showImageSelection, setShowImageSelection] = useState(false);

    const playerComponents = {
        PlayerIsInMap: useComponentValue(PlayerIsInMap, playerEntity),
        PlayerMapId: useComponentValue(PlayerMapId, playerEntity),
        PlayerIconUrl: useComponentValue(PlayerIconUrl, playerEntity),
        PlayerCoordinates: useComponentValue(PlayerCoordinates, playerEntity),
        PlayerPointBalance: useComponentValue(PlayerPointBalance, playerEntity),
        PlayerQuest: useComponentValue(PlayerQuest, playerEntity),
        PlayerIsMovable: useComponentValue(PlayerIsMovable, playerEntity),
    };

    const handleSetPlayerInfo = async () => {
        if (_ens) {
            setShowImageSelection(true);
        } else {
            alert("ENS is necessary for creating a game account");
        }
    };

    const handleImageSelect = (imageUrl: string) => {
        setSelectedImageUrl(imageUrl);
        setShowImageSelection(false);
    };

    useEffect(() => {
        if (!playerComponents.PlayerIconUrl && selectedImageUrl) {
          SetPlayerInfo(_ens as string, selectedImageUrl);
        }
    }, [playerComponents.PlayerIconUrl, selectedImageUrl, _ens, SetPlayerInfo]);

    const ProfileItem = ({label, value}: {label: string, value: string | JSX.Element | number | boolean}) => (
        <div className="player-each-info">
            <div className="profile-item">{label}:</div>
            <div className="profile-value">{value}</div>
        </div>
    );

    return (
        <div className="gameinfo-card">
            {playerComponents.PlayerIsInMap ? (
                <>
                    <ProfileItem label="PlayerIsInMap" value={playerComponents.PlayerIsInMap.value ? "Yes" : "No"} />
                    <ProfileItem label="MapId" value={playerComponents.PlayerMapId?.value || "not set"} />
                    <ProfileItem label="profile-icon" value={playerComponents.PlayerIconUrl ? (<img src={playerComponents.PlayerIconUrl.value} width={50} alt="" />) : "not set"} />
                    <ProfileItem label="Coordinates" value={`${playerComponents.PlayerCoordinates?.x || "not set"} ${playerComponents.PlayerCoordinates?.y || ""}`} />
                    <ProfileItem label="PointBalance" value={playerComponents.PlayerPointBalance?.value || "not set"} />
                    <ProfileItem label="Quest" value={playerComponents.PlayerQuest?.value || "not set"} />
                    <ProfileItem label="IsMovable" value={playerComponents.PlayerIsMovable?.value || "not set"} />
                </>
            ) : (
                <>
                    <div className="creategameaccount-area">
                        <button onClick={handleSetPlayerInfo}>Create Game Account</button>
                    </div>
                    {showImageSelection && (
                        <div className="image-selection-container">
                            <div className="image-selection">
                                {nftList.map((nftUrl, index) => (
                                    <img
                                        key={index}
                                        src={nftUrl}
                                        width={70}
                                        alt=""
                                        onClick={() => handleImageSelect(nftUrl)}
                                        className={nftUrl === selectedImageUrl ? "selected" : ""}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default PlayerInfo;
