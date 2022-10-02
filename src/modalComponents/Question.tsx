import {Input, Button} from '@mantine/core';
import { useState } from 'react';
import { useGlobalState } from '../state';
import { ethers } from "ethers";
import config from '../utils/config.json';
import askOnChain from '../utils/AskOnChain.json';

export function Question() {

    const [question, setQuestion] = useState("");
    const [currentlyVisitedAddress] = useGlobalState("currentlyVisitedAddress");
    const contractAddress = config.contractAddress;
    const contractABI = askOnChain.abi;

    const [loading , setLoading] = useState(false);

    const handleQuestionSubmission = async () => {
        if (question == "") {
            alert("Question cannot be empty");
            return;
        }

        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const askonchainContract = new ethers.Contract(contractAddress, contractABI, signer);
                console.log(`Submitting question ${question} to ${currentlyVisitedAddress}`);
                const data = await askonchainContract.submitQuestion(currentlyVisitedAddress, question);
                setLoading(true);
                await data.wait();
                console.log("Submitted!");
                setLoading(false);
            } else {
                console.log("Ethereum object doesn't exist!")
            }
        } catch(e) {
            console.log("Error: ", e);
            setLoading(false);
        }

    }

    return (
        <>
            <Input disabled={loading} placeholder="Question" onInput={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)} />
            <Button loading={loading} color={'pink'} style={{marginTop: '10px'}} onClick={handleQuestionSubmission} >Ask</Button>
        </>
    )
}