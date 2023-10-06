import { useState, useEffect } from "react";
import { getAccount } from '@wagmi/core';
import { fetchEnsName } from '@wagmi/core';

const useWalletData = () => {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [ens, setEnsName] = useState<string | null>(null);

    const fetchAddressAndEns = async () => {
        const walletClientResult = await getAccount();
        if (walletClientResult) {
            const address = walletClientResult.address;
            if (address) {
                const formattedAddress = address.startsWith("0x") ? address : `0x${address}`;
                setWalletAddress(formattedAddress);

                const fetchedEnsName = await fetchEnsName({
                    address: address,
                });
                setEnsName(fetchedEnsName);
            } else {
                console.error("Wallet address is undefined.");
            }
        } else {
            console.error("Wallet client is null.");
        }
    };

    useEffect(() => {
        fetchAddressAndEns();
    }, []);

    return { walletAddress, ens };
};

export default useWalletData;
