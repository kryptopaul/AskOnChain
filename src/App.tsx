import { Container ,Title, Text, Button } from '@mantine/core';
import { useEffect } from 'react';
import {setGlobalState, useGlobalState} from './state';
import { ethers } from "ethers";
import askonchain from './utils/AskOnChain.json';
import { HeaderResponsive } from './Header';
import { MyProfile } from './MyProfile';
import config from './utils/config.json';
import { FooterSimple } from './FooterSimple';

function App() {


  const [isLoggedIn] = useGlobalState("isLoggedIn");
  const contractAddress = config.contractAddress
  const contractABI = askonchain.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setGlobalState("currentAccount", accounts[0]);
        setGlobalState("isLoggedIn", true);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setGlobalState("currentAccount", accounts[0]);
      setGlobalState("isLoggedIn", true);
      fetchQuestionAmount();
    } catch (error) {
      console.log(error)
    }
  }


  const fetchQuestionAmount = async () => {
    try {
      const {ethereum} = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const questionCount = await contract.totalQuestions();
      setGlobalState("totalQuestions", `Our users have sent ${questionCount} questions in total!`);
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    checkIfWalletIsConnected();

    if(window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      })
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      })
  }

  }, [])

  function LoginPanel(){
    return (
      <div>
        <Container style={{textAlign: 'center', marginTop: '100px'}}>
        <Title order={1}>👋 Welcome to AskOnChain</Title>
        <Text>Your go-to platform for pseudonymous questions. </Text>
        <Button color={'pink'} onClick={connectWallet} style={{marginTop: '10px', marginRight: '10px'}}>Login</Button>

      </Container>
      </div>
    )
  }

  return (
    <>
        <HeaderResponsive links={[{link: '/', label: 'Dashboard'}]}/>
        {isLoggedIn ? <MyProfile/> : <LoginPanel/>}
        <FooterSimple links={[{link: '/', label: 'Dashboard'}]} />
    </>
  );
}

export default App;
