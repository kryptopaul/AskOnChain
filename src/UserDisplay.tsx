import { Avatar, Text, Button, Paper } from '@mantine/core';
import { setGlobalState} from './state';
import {AskModal} from './modalComponents/AskModal';

interface UserInfoActionProps {
  username: string | undefined;
  address: string | undefined;
}

export function UserDisplay({ username, address }: UserInfoActionProps) {
  console.log('UserDisplay: ' + address);
  return (
    <>
    <AskModal address={address} />
    <Paper
      radius="md"
      withBorder
      p="lg"
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
      })}
    >
        <Avatar src={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"} size={120} radius={120} mx="auto" />
        
      <Text align="center" size="lg" weight={500} mt="md">
        {username}
      </Text>
      <Text align="center" color="dimmed" size="sm">
        {address}
      </Text>

      <Button color="pink" fullWidth mt={'md'} onClick={() => setGlobalState('displayModal', true)} >
        Ask
      </Button>
    </Paper>
    </>
  );
}