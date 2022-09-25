import { Avatar, Text, Button, Paper } from '@mantine/core';

interface UserInfoActionProps {
  username: string | undefined;
  address: string | undefined;
}

export function UserDisplay({ username, address }: UserInfoActionProps) {
  return (
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

      <Button color="pink" fullWidth mt={'md'}>
        Ask
      </Button>
    </Paper>
  );
}