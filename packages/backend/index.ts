import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import Moralis from 'moralis';
import { EvmChain } from "@moralisweb3/common-evm-utils";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors());

Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

// ens
// nft

app.get('/playerENS', async (req: Request, res: Response) => {
  
  try {
    // const { address, chain } = req.query;
    const address = process.env.WALLET_ADDRESS;

    if (typeof address === 'string') {
      const response = await Moralis.EvmApi.resolve.resolveAddress({
        address,
      });

      if (response !== null) { // Check if response is not null
        const ENS = response.toJSON();
        res.send(ENS);
      } else {
        res.status(404).send('Address not found');
      }
    } else {
      res.status(400).send('Invalid address');
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

app.get("/playerNfts", async (req: Request, res: Response) => {

  try {
    const { address, chain } = req.query;

    if (typeof address === 'string' && typeof chain === 'string') {
      const response = await Moralis.EvmApi.nft.getWalletNFTs({
        address: address,
        chain: chain,
      });

      if (response !== null) {
        const playerNfts = response.toJSON();
        res.send(playerNfts.result);
      } else {
        res.status(404).send('Address not found');
      }
    } else {
      res.status(400).send('Invalid address or chain');
    }
  } catch (e) {
    res.send(e);
  }
});
