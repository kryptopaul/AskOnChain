import { Container ,Title, Text, Button } from '@mantine/core';
import { HeaderResponsive } from './Header';
import { MyProfile } from './MyProfile';
import { FooterSimple } from './FooterSimple';
import { useAccount, useConnect } from 'wagmi'
import { Registration } from './Registration';


function App() {


  const { isConnected } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
  
  function LoginPanel(){
    return (
      <div>
        <Container style={{textAlign: 'center', marginTop: '100px'}}>
        <Title order={1}>👋 Welcome to AskOnChain</Title>
        <Text>Your go-to platform for pseudonymous questions. </Text>
   
        <div>
        {connectors.map((connector) => (
        <Button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
          style={{marginTop: '10px'}}
        >
          Login
          {!connector.ready && ' (unsupported)'}
          {isLoading &&
            connector.id === pendingConnector?.id &&
            ' (connecting)'}
        </Button>
      ))}

      {error && <div>{error.message}</div>}
    </div>

      </Container>
      </div>
    )
  }

  return (
    <>
        <HeaderResponsive links={[{link: '/', label: 'Dashboard'}]}/>
        {isConnected ? <MyProfile /> : <LoginPanel/>}
        {/* <Container>
        <Registration />
        </Container> */}
        <FooterSimple links={[{link: '/', label: 'Dashboard'}]} />
        
    </>
  );
}

export default App;
