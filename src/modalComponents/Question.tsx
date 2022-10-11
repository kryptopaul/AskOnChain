import {Input, Button} from '@mantine/core';
import { useState } from 'react';
import configFile from '../utils/config.json';
import askOnChain from '../utils/AskOnChain.json';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

export function Question(props: RequestedAddress) {

    const [question, setQuestion] = useState("");




    const [loading , setLoading] = useState(false);

    const { config } = usePrepareContractWrite({
        addressOrName: configFile.contractAddress,
        contractInterface: askOnChain.abi,
        functionName: 'submitQuestion',
        chainId: 5,
        args: [props.address, question]
      })

    const { data, write } = useContractWrite({...config,
    onError(error) {

        setLoading(false);
        alert("Error: " + error);
        window.location.reload();
    }
    })
    // eslint-disable-next-line no-empty-pattern
    const {} = useWaitForTransaction({
        chainId: 5,
        hash: data?.hash,
        onSuccess(data) {
            setLoading(false);
            alert("Question asked successfully!");
            window.location.reload();
        },
        onError(error) {
            setLoading(false);
            alert("Error: " + error);
        }
    })

    const handleQuestionSubmission = async () => {
        if (question === "") {
            alert("Question cannot be empty");
            return;
        }
        try {
            write?.();
            setLoading(true);
        } catch (e) {
            setLoading(false);
            alert("Error: " + e);
        }
    }

    return (
        <>
            <Input disabled={loading} placeholder="Question" onInput={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)} />
            <Button loading={loading} color={'pink'} style={{marginTop: '10px'}} onClick={handleQuestionSubmission} >Ask</Button>
        </>
    )
}