import { Title, Input, Button } from '@mantine/core';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

export function Registration() {

    return(
        <>
            <Title order={2}>You seem new here. Register to make your profile visible!</Title>
            <Input placeholder="Your username" style={{marginTop: '10px'}} />
            <Button style={{marginTop: '10px'}}>Register</Button>
        </>
    )

}