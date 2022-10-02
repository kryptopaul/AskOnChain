import { createGlobalState } from "react-hooks-global-state";

const { setGlobalState, useGlobalState } = createGlobalState({
    // Related to the current account
    currentAccount: "",
    accountUsername: "",
    isLoggedIn: false,

    // Controls for the "Did you know?" alert
    totalQuestions: "",
    displayTotalHellosAlert: 'flex',

    // Responsible for ask a question modal
    displayModal: false,
    currentlyVisitedAddress: "",
    currentlyVisitedUsername: ""
})

export { setGlobalState, useGlobalState };