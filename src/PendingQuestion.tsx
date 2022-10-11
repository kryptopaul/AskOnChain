import { Paper, Text, Input, Button } from "@mantine/core"
import configFile from "./utils/config.json";
import { useState } from "react";
import askOnChain from "./utils/AskOnChain.json";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

export function PendingQuestion(props:PendingQuestionProps) {



    const id = props.id;
    const from = props.from;
    const question = props.question;
    

    const [answerField, setAnswerField] = useState("");
    const [loading, setLoading] = useState(false);

    const { config } = usePrepareContractWrite({
        addressOrName: configFile.contractAddress,
        contractInterface: askOnChain.abi,
        functionName: 'answerQuestion',
        args: [id, answerField],
        chainId: 5
      })

    const { data, write } = useContractWrite({...config,
        onError(error) {
            setLoading(false);
            alert("Error: " + error);
        },
        })

    // eslint-disable-next-line no-empty-pattern
    const {} = useWaitForTransaction({
        chainId: 5,
        hash: data?.hash,
        onSuccess(data) {
            setLoading(false);
            alert("Answer submitted successfully!");
            window.location.reload();
        },
        onError(error) {
            setLoading(false);
            alert("Error: " + error);
        }
    })

    const answerQuestion = async () => {
        // Validate first
        if (answerField === "") {
            alert("Please enter an answer to the question");
            return;
        }
        setLoading(true);
        write?.();

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