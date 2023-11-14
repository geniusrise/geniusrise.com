import React from "react"
import "./App.css"
import "@fontsource/fira-sans"

import { Amplify } from "aws-amplify"

import { withAuthenticator } from "@aws-amplify/ui-react"
import "./login.css"

import Everything from "./containers/everything/everything"

import config from "./aws-exports"

const updatedAwsConfig = {
    ...config,
    oauth: {
        ...config.oauth,
        domain: process.env.REACT_APP_AWS_COGNITO_URL,
        redirectSignIn: process.env.REACT_APP_BASE_URL,
        redirectSignOut: process.env.REACT_APP_BASE_URL,
    },
}

Amplify.configure(updatedAwsConfig)

function App() {
    return (
        <div className="App">
            <div className="appContent">
                <Everything></Everything>
            </div>
        </div>
    )
}

export default withAuthenticator(App)
// export default App
