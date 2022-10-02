import { ethers } from "ethers";
import askOnChain from "../utils/AskOnChain.json";
import config from "../utils/config.json";

const contractAddress = config.contractAddress;
const contractABI = askOnChain.abi;

export async function ResolveUsername (address: string) {
    const publicEndpoint = config.publicEndpoint;
    const provider = new ethers.providers.JsonRpcProvider(publicEndpoint);
    const askonchainContract = new ethers.Contract(contractAddress, contractABI, provider);
    const username = await askonchainContract.usernames(address);
    return username;
}