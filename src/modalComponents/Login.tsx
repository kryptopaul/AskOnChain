import { Button } from '@mantine/core';
import { useConnect } from "wagmi";

export function Login() {

    const { connect, connectors, isLoading, pendingConnector } = useConnect()



    return(
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
        </div>
    )
}