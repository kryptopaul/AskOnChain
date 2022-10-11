import { Modal} from '@mantine/core';
import { useGlobalState, setGlobalState } from '../state';
import { Login } from './Login';
import { Question } from './Question';
import { SameWallet } from './SameWallet';
import { useAccount } from 'wagmi'


export function AskModal(props: RequestedAddress) {

  const { address } = useAccount()

  const [opened] = useGlobalState('displayModal');
  const [currentlyVisitedUsername] = useGlobalState("currentlyVisitedUsername");

  
  console.log('Requested: ' + props.address);
  console.log('Logged in as: ' + address);
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setGlobalState('displayModal', false)}
        title={address ? `Ask ${currentlyVisitedUsername} a question` : "Please login"}
        closeOnClickOutside={false}
      >
        {address ? (address === props.address) ? <SameWallet /> : <Question address={props.address} /> : <Login />}
      </Modal>
    </>
  );
}