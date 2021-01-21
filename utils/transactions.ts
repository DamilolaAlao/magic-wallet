import { ethers, BigNumber, utils, Contract } from "ethers";
import { TokenWithBalance } from "../interfaces/tokens";
import IERC20ABI from "../abi/IERC20.abi.json";

/**
 * Ensures you are sending to a valid address and you're not sending to yourself
 * @param signer
 * @param address
 */
export const verifySend = async (
    signer: ethers.providers.JsonRpcSigner,
    address: string,
) => {
    if (!utils.isAddress(address)) {
        throw new Error("Destination is not valid");
    }

    const senderAdress = await signer.getAddress();
    if (senderAdress === address) {
        throw new Error("Don't send to yourself! ");
    }
};

/**
 * Send Eth amount from provider to address
 * @param provider
 * @param address
 * @param amount
 */
export const sendEth = async (
    provider: ethers.providers.Web3Provider,
    address: string,
    amount: BigNumber,
): Promise<ethers.providers.TransactionReceipt> => {
    // Check signer address for safety
    const signer = provider.getSigner();
    await verifySend(signer, address);

    // Submit transaction to the blockchain
    const tx = await signer.sendTransaction({
        to: address,
        value: amount,
    });

    // Wait for send success
    const receipt = await tx.wait();

    return receipt;
};

export const sendERC20 = async (
    provider: ethers.providers.Web3Provider,
    address: string,
    amount: BigNumber,
    token: TokenWithBalance,
): Promise<ethers.providers.TransactionReceipt> => {
    // Check signer address for safety
    const signer = provider.getSigner();
    await verifySend(signer, address);

    // Generate Contract with signer
    const contract = new Contract(token.address, IERC20ABI, signer);

    // Submit transaction to the blockchain
    const tx = await contract.transfer(address, amount);

    // Wait for send success
    const receipt = await tx.wait();

    return receipt;
};
