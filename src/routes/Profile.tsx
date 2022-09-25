import { useParams } from "react-router-dom";
import { HeaderResponsive } from "../Header";
import { Container, SimpleGrid } from "@mantine/core";
import { ethers } from "ethers";
import askonchain from "../utils/AskOnChain.json";
import {useState, useEffect} from 'react';
import config from '../utils/config.json';
import { UserDisplay } from "../UserDisplay";
import { AnsweredQuestion } from "../AnsweredQuestion";

export function Profile() {

    const { address } = useParams();
    const publicEndpoint = config.publicEndpoint;
    const contractAddress = config.contractAddress;
    const contractABI = askonchain.abi;

    const [username, setUsername] = useState("");
    const [answeredQuestionsState , setAnsweredQuestionsState] = useState([] as AnsweredQuestionProps[]);

    const fetchProfileInfo = async () => {
        try {
            const provider = new ethers.providers.JsonRpcProvider(publicEndpoint);
            const helloContract = new ethers.Contract(contractAddress, contractABI, provider);
            const username = await helloContract.usernames(address);
            console.log(username);
            setUsername(username);
        } catch(e) {
            console.log("Error: ", e);
        }
    }


    const fetchAnsweredQuestions = async () => {
        try {
            const provider = new ethers.providers.JsonRpcProvider(publicEndpoint);
            const helloContract = new ethers.Contract(contractAddress, contractABI, provider);
            const answeredQuestions = await helloContract.getQuestionsByUserReceived(address);
            console.log("Printing only answered questions:");

            answeredQuestions.forEach((question:any) => {
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

    useEffect(() => {
        fetchProfileInfo();
        fetchAnsweredQuestions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            return <AnsweredQuestion id={question.id} question={question.question} answer={question.answer} from={question.from}/>
        })}
        </SimpleGrid>
        </Container>
        </>
    )
}