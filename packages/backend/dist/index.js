"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const moralis_1 = __importDefault(require("moralis"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, cors_1.default)());
moralis_1.default.start({ apiKey: process.env.MORALIS_API_KEY });
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
// ens
// nft
app.get('/playerENS', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { address, chain } = req.query;
        const address = process.env.WALLET_ADDRESS;
        if (typeof address === 'string') {
            const response = yield moralis_1.default.EvmApi.resolve.resolveAddress({
                address,
            });
            if (response !== null) { // Check if response is not null
                const ENS = response.toJSON();
                res.send(ENS);
            }
            else {
                res.status(404).send('Address not found');
            }
        }
        else {
            res.status(400).send('Invalid address');
        }
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
app.get("/playerNfts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address, chain } = req.query;
        if (typeof address === 'string' && typeof chain === 'string') {
            const response = yield moralis_1.default.EvmApi.nft.getWalletNFTs({
                address: address,
                chain: chain,
            });
            if (response !== null) {
                const playerNfts = response.toJSON();
                res.send(playerNfts.result);
            }
            else {
                res.status(404).send('Address not found');
            }
        }
        else {
            res.status(400).send('Invalid address or chain');
        }
    }
    catch (e) {
        res.send(e);
    }
}));
