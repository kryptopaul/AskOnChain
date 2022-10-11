import { useParams } from "react-router-dom";
import { HeaderResponsive } from "../Header";
import { Container, SimpleGrid } from "@mantine/core";
import askonchain from "../utils/AskOnChain.json";
import { useState } from 'react';
import config from '../utils/config.json';
import { UserDisplay } from "../UserDisplay";
import { AnsweredQuestion } from "../AnsweredQuestion";
import { FooterSimple } from "../FooterSimple";
import { useContractReads } from 'wagmi'


export function Profile() {

    const { address } = useParams();
    

    const askonchainContract = {
        addressOrName: config.contractAddress,
        contractInteface: askonchain.abi
    }
    // eslint-disable-next-line no-empty-pattern
    const {} = useContractReads({
        contracts: [
            // Fetch Username and set State
            {
                ...askonchainContract,
                functionName: 'usernames',
                args: [address],
                contractInterface: askonchainContract.contractInteface,
                chainId: 5
            },
            {
                ...askonchainContract,
                functionName: 'getQuestionsByUserReceived',
                args: [address],
                contractInterface: askonchainContract.contractInteface,
                chainId: 5
            }
        ],
        onSuccess(data) {
            setUsername(data[0])
            renderAnsweredQuestions(data[1])    
        },
        onError(error) {
            console.log(error)
        }
    })

    const [username, setUsername] = useState("") as any;
    const [answeredQuestionsState , setAnsweredQuestionsState] = useState([] as AnsweredQuestionProps[]);



    const renderAnsweredQuestions = async (data:any) => {
        try {
            data.forEach((question:any) => {
                if (question.isAnswered) {
                    console.log(question);
                    setAnsweredQuestionsState((prev) => [...prev, {id: question.id.toNumber(), from: question.from, question: question.question, answer: question.answer}]);
                }
            })

            // Display newest first
            setAnsweredQuestionsState((prev) => prev.reverse());



        } catch(e) {
            console.log("Error: ", e);
        }
    }


    return (
        <>
        <HeaderResponsive links={[{link: '/', label: 'Dashboard'}]}/>
        <Container>
        <div>
            <h1>Profile</h1>
        </div>
        <UserDisplay address={address} username={username}/>
        
        <SimpleGrid cols={2} style={{marginTop: '10px'}} breakpoints={
            [
                {maxWidth: 600, cols: 1}
            ]
        }>
        {answeredQuestionsState.map((question) => {
            return <AnsweredQuestion key={question.id} id={question.id} question={question.question} answer={question.answer} from={question.from}/>
        })}
        </SimpleGrid>
        </Container>
        <FooterSimple links={[{link: '/', label: 'Dashboard'}]} />
        </>
    )
}