import { Container, Title, Text, Input, Button, Notification, SimpleGrid } from '@mantine/core';
import {setGlobalState, useGlobalState} from './state';
import { ethers } from 'ethers';
import askonchain from './utils/AskOnChain.json';
import { Alert } from '@mantine/core';
import { IconAlertCircle, IconCheck } from '@tabler/icons';
import { useState, useEffect } from 'react';
import config from './utils/config.json';
import { useNavigate } from "react-router-dom";
import { PendingQuestion } from './PendingQuestion';
import { AnsweredQuestion } from './AnsweredQuestion';

export function MyProfile(){
    const navigate = useNavigate();

    const [usernameField, setUsernameField] = useState("");
    const [successNotification, setSuccessNotification] = useState({visibility: 'none', loading: false, title: "", message: ""});

    const contractAddress = config.contractAddress;
    const contractABI = askonchain.abi;

    const [displayTotalHellosAlert] = useGlobalState("displayTotalHellosAlert");
    const [totalQuestions] = useGlobalState("totalQuestions");
    const [currentAccount] = useGlobalState("currentAccount");
    const [accountUsername] = useGlobalState("accountUsername");

    useEffect(() => {
        fetchUsername();
        fetchUserQuestions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const logOut = async () => {
        try {
          const { ethereum } = window;
          if (ethereum) {
            setGlobalState("currentAccount", "");
            setGlobalState("isLoggedIn", false);
            setGlobalState("accountUsername", "");
          } else {
            console.log("Ethereum object doesn't exist!")
          }
        } catch (error) {
          console.log("Error: ", error);
        }
      }

    const fetchUsername = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const askonchainContract = new ethers.Contract(contractAddress, contractABI, signer);
                const data = await askonchainContract.usernames(currentAccount);
                console.log(data);
                setGlobalState("accountUsername", data);
            } else {
                console.log("Ethereum object doesn't exist!")
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }

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

    const fetchUserQuestions = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const askonchainContract = new ethers.Contract(contractAddress, contractABI, signer);
                console.log("Fetching user questions..." + currentAccount);
                const data = await askonchainContract.getQuestionsByUserReceived(currentAccount);
                console.log(data);

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
                console.log("Ethereum object doesn't exist!")
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    const [pendingQuestions, setPendingQuestions] = useState([] as PendingQuestionProps[]);
    const [answeredQuestions, setAnsweredQuestions] = useState([] as AnsweredQuestionProps[]);

    return(
        <Container style={{textAlign: 'left'}}>
            <Alert icon={<IconAlertCircle size={16} />} style={{textAlign: 'left', marginBottom: '20px', marginTop: '-50px', display: displayTotalHellosAlert}} title="Did you know?" color="pink" radius="xs" variant='filled' onClose={() => setGlobalState('displayTotalHellosAlert', 'none')} withCloseButton>
            {totalQuestions}
            </Alert>
            <Title>{accountUsername ? `Welcome back, ${accountUsername}!` : "Welcome!"}</Title>
            <Text>You're logged in as: {currentAccount}</Text>
            <Button color={"pink"} style={{marginTop: '10px'}} onClick={() => navigate(`/${currentAccount}`)}>View my profile</Button>
            <Button color={"pink"} style={{marginTop: '10px', marginLeft: '10px'}} onClick={logOut}>Log out</Button>
            <div style={{textAlign: 'left'}}>
            <Title order={2} style={{marginTop: '15px'}}>{accountUsername ? "Change your username!" : "Set your username to make your profile visible!"}</Title>
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