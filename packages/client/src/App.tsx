import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { EntryPoint } from "./verymon/EntryPoint";
import GameList from "./ui/GameList";
import GameBoard from "./ui/GameBoard";
import WalletConnect from "./ui/component/WalletConnect";
import PlayerInfo from "./ui/component/PlayerInfo";
import useWalletData from "./library/WalletData";
import "./App.css";

export const App = () => {
  
    const { walletAddress, ens } = useWalletData(); 

    return (
        <Router>
            <div className="profile-area">
                <div className="wallet-connect">
                    <WalletConnect />
                </div>
                <div className="gameinfo-position">
                    <PlayerInfo
                        _walletAddress={walletAddress}
                        _ens={ens}
                    />
                </div>
            </div>
            <div>
                <Routes>
                    <Route path="/" element={<GameList />} />
                    <Route path="/game-board/:gameMapId" element={<GameBoard />} />
                    <Route path="/verymon" element={<EntryPoint />} />
                </Routes>
            </div>
        </Router>
    );
};
