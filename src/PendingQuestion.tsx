import { Paper, Text, Input, Button } from "@mantine/core"
import { ethers } from "ethers";
import config from "./utils/config.json";
import { useState } from "react";
import askOnChain from "./utils/AskOnChain.json";

export function PendingQuestion(props:PendingQuestionProps) {

    const id = props.id;
    const from = props.from;
    const question = props.question;
    
    const contractAddress = config.contractAddress;
    const contractABI = askOnChain.abi;

    const [answerField, setAnswerField] = useState("");
    const [loading, setLoading] = useState(false);

    const answerQuestion = async () => {
        console.log("Answering question " + id);
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const askonchainContract = new ethers.Contract(contractAddress, contractABI, signer);
                console.log("Answering: " + answerField + " to question ID: " + id);
                const data = await askonchainContract.answerQuestion(id, answerField);
                setLoading(true);
                await data.wait();
                console.log("Answered!");
                setLoading(false);
            } else {
                console.log("Ethereum object doesn't exist!")
                setLoading(false);
            }
        } catch(e) {
            console.log("Error: ", e);
        }

    }

    return(

            <Paper shadow="xl" p="xl" withBorder>
                <Text size={'xs'} style={{marginBottom: '5px'}}>From: {from}</Text>
                <Text>
                    {question}
                </Text>
                <Input disabled={loading} placeholder="Answer" onInput={(e: React.ChangeEvent<HTMLInputElement>) => setAnswerField(e.target.value)} style={{marginTop: '5px'}} />
                <Button loading={loading} color={'pink'} onClick={answerQuestion} mt="md">Answer</Button>
            </Paper>


    )
}