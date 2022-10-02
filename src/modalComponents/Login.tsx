
import { setGlobalState } from "../state";
import { Button } from '@mantine/core';

export function Login() {


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
        } catch (error) {
          console.log(error)
        }
      }

    return(
        <div>
            <h2>Please login</h2>
            <Button onClick={connectWallet} color={'pink'}>Connect Wallet</Button>
        </div>
    )
}