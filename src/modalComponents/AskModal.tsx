import { Modal} from '@mantine/core';
import { useGlobalState, setGlobalState } from '../state';
import { Login } from './Login';
import { Question } from './Question';
import { SameWallet } from './SameWallet';


export function AskModal() {
  const [loggedIn] = useGlobalState("isLoggedIn");
  const [opened, setOpened] = useGlobalState('displayModal');
  const [currentlyVisitedAddress] = useGlobalState("currentlyVisitedAddress");
  const [currentlyVisitedUsername] = useGlobalState("currentlyVisitedUsername");
  const [currentAccount] = useGlobalState("currentAccount");
  
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setGlobalState('displayModal', false)}
        title={loggedIn ? `Ask ${currentlyVisitedUsername} a question` : "Please login"}
      >
        {loggedIn ? (currentAccount == currentlyVisitedAddress) ? <SameWallet /> : <Question /> : <Login />}
      </Modal>
    </>
  );
}