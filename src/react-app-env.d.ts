/// <reference types="react-scripts" />
interface Window {
    ethereum: any
}

interface PendingQuestionProps {
    id: number;
    from: string;
    question: string;
}

interface AnsweredQuestionProps {
    id: number;
    from: string;
    question: string;
    answer: string;
}

interface RequestedAddress {
    address: string | undefined;
}