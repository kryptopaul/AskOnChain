import { Container, Title, Text, Input, Button, Notification, SimpleGrid } from '@mantine/core';
import { setGlobalState } from './state';
import { ethers } from 'ethers';
import askonchain from './utils/AskOnChain.json';
import { Alert } from '@mantine/core';
import { IconAlertCircle, IconCheck } from '@tabler/icons';
import { useState } from 'react';
import config from './utils/config.json';
import { useNavigate } from "react-router-dom";
import { PendingQuestion } from './PendingQuestion';
import { AnsweredQuestion } from './AnsweredQuestion';
import { useAccount, useDisconnect, useContractReads } from 'wagmi';

export function MyProfile(){

    const { address } = useAccount()
    const { disconnect } = useDisconnect()

    const askonchainContract = {
        addressOrName: config.contractAddress,
        contractInteface: askonchain.abi
    }

    // eslint-disable-next-line no-empty-pattern
    const {} = useContractReads({
        contracts: [
            {
                ...askonchainContract,
                functionName: 'usernames',
                args: [address],
                contractInterface: askonchainContract.contractInteface,
            },
            {
                ...askonchainContract,
                functionName: 'getQuestionsByUserReceived',
                args: [address],
                contractInterface: askonchainContract.contractInteface,
            },
            {
                ...askonchainContract,
                functionName: 'totalQuestions',
                contractInterface: askonchainContract.contractInteface,
            }
        ],
        onSuccess(data) {
            setUsernameDisplayed(data[0])
            displayUserQuestions(data[1])
            setTotalQuestionsMessage(`Our users have asked ${data[2]} questions so far!`)
        },
    })
    

    const navigate = useNavigate();

    const [usernameField, setUsernameField] = useState("");
    const [successNotification, setSuccessNotification] = useState({visibility: 'none', loading: false, title: "", message: ""});
    const [usernameDisplayed, setUsernameDisplayed] = useState("") as any;

    const contractAddress = config.contractAddress;
    const contractABI = askonchain.abi;

    const [displayTotalHellosAlert, setDisplayTotalHellosAlert] = useState('flex');
    const [totalQuestionsMessage, setTotalQuestionsMessage] = useState("") as any;



    const setNewUsername = async () => {
        if (usernameField === "") {
            alert("Please enter a username");
            return;
        }
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const askonchainContract = new ethers.Contract(contractAddress, contractABI, signer);
                const transaction = await askonchainContract.setUsername(usernameField);
                setSuccessNotification({visibility: 'flex', loading: true, title: "Setting username...", message: "Please wait..."});
                await transaction.wait();
                console.log(`${usernameField} has been set as your username!`);
                setGlobalState("accountUsername", usernameField);
                setSuccessNotification({visibility: 'flex', loading: false, title: "Username set!", message: "Your username has been set successfully!"});
            } else {
                console.log("Ethereum object doesn't exist!")
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    const displayUserQuestions = async (data:any) => {

        if (data){        
        data.forEach((question: any) => {
                    console.log("ID:" + question[0].toNumber());
                    console.log("From: " + question[1]);
                    console.log("Question: " + question[2]);
                    console.log("Answered: " + question[4]);

                    //TODO: change indexes to text attributes

                    if (question.isAnswered === false) {

                        const propPayload: PendingQuestionProps = {
                            id: question[0].toNumber(),
                            from: question[1],
                            question: question[2],
                        }

                        setPendingQuestions((prev) => [...prev, propPayload]);
                    }
                    
                    if (question.isAnswered === true) {
                        const propPayload: AnsweredQuestionProps = {
                            id: question[0].toNumber(),
                            from: question[1],
                            question: question[2],
                            answer: question[3],
                        }

                        setAnsweredQuestions((prev) => [...prev, propPayload]);
                    }
                });
            // This is done to sort the questions from newest to oldest
            setPendingQuestions((prev) => prev.reverse());
            setAnsweredQuestions((prev) => prev.reverse());
        } else {
            console.log("Data is null!");
        }

    }

    const [pendingQuestions, setPendingQuestions] = useState([] as PendingQuestionProps[]);
    const [answeredQuestions, setAnsweredQuestions] = useState([] as AnsweredQuestionProps[]);

    return(
        <Container style={{textAlign: 'left'}}>
            <Alert icon={<IconAlertCircle size={16} />} style={{textAlign: 'left', marginBottom: '20px', marginTop: '-50px', display: displayTotalHellosAlert}} title="Did you know?" color="pink" radius="xs" variant='filled' onClose={() => setDisplayTotalHellosAlert('none')} withCloseButton>
            {totalQuestionsMessage}
            </Alert>
            <Title>{usernameDisplayed ? `Welcome back, ${usernameDisplayed}!` : "Welcome!"}</Title>
            <Text>You're logged in as: {address}</Text>
            <Button color={"pink"} style={{marginTop: '10px'}} onClick={() => navigate(`/${address}`)}>View my profile</Button>
            <Button color={"pink"} style={{marginTop: '10px', marginLeft: '10px'}} onClick={() => disconnect()}>Log out</Button>
            <div style={{textAlign: 'left'}}>
            <Title order={2} style={{marginTop: '15px'}}>{usernameDisplayed ? "Change your username!" : "Set your username to make your profile visible!"}</Title>
            <Input placeholder="Enter your username" onInput={(e: React.ChangeEvent<HTMLInputElement>) => setUsernameField(e.target.value)} style={{marginTop: '10px'}} />
            <Button color={"pink"} style={{marginTop: '10px'}} onClick={setNewUsername}>Set username</Button>
            </div>

            <Notification icon={<IconCheck size={20} />} loading={successNotification.loading} style={{marginTop:'15px', display: successNotification.visibility}} color="green" title={successNotification.title}>
                {successNotification.message}
            </Notification>
            <Title order={2} style={{marginTop: '15px'}}>Questions pending answers</Title>

            <SimpleGrid cols={2} style={{marginTop: '10px'}} breakpoints={
            [
                {maxWidth: 600, cols: 1}
            ]
        }>

            {pendingQuestions.map((question) => (
                <PendingQuestion key={question.id} id={question.id} from={question.from} question={question.question} />
            ))}

            </SimpleGrid>

            <Title order={2} style={{marginTop: '15px'}}>Questions answered</Title>

            <SimpleGrid cols={2} style={{marginTop: '10px'}} breakpoints={
            [
                {maxWidth: 600, cols: 1}
            ]
        }>

            {answeredQuestions.map((question) => (
                <AnsweredQuestion key={question.id} id={question.id} from={question.from} question={question.question} answer={question.answer} />
            ))}

            </SimpleGrid>

            
            

        </Container>
    )
}