import axios from "axios";
import { useState, useEffect } from 'react';

interface NftItem {
    metadata: string;
}

function useNftList(walletAddress: string | null): string[] {
    const [nftList, setNftList] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await axios.get("http://localhost:8000/playerNfts", {
                params: {
                  address: walletAddress,
                  chain: "0x89", // Mumbai
                },
              });
              const nftUrls = response.data.map((item: NftItem) => JSON.parse(item.metadata).image);
              setNftList(nftUrls);
            } catch (error) {
              console.error("Error fetching data:", error);
            }
        };

        if (walletAddress) {
            fetchData();
        }
    }, [walletAddress]);

    return nftList;
}

export default useNftList;
