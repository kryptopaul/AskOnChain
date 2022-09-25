import { Paper, Text } from "@mantine/core"



export function AnsweredQuestion(props: AnsweredQuestionProps) {


    const from = props.from;
    const question = props.question;
    const answer = props.answer;

    return(

            <Paper shadow="xl" p="xl" withBorder>
                <Text size={'xs'} style={{marginBottom: '5px'}}>From: {from}</Text>
                <Text size={'md'}>
                    {question}
                </Text>
                <Text size={'lg'}>
                    {answer}
                </Text>
            </Paper>


    )
}