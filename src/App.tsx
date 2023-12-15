import React from "react"
import "./App.css"
import "@fontsource/fira-sans"

import { Amplify } from "aws-amplify"
import { listener, start } from "./data/login/login"
import { Hub } from "aws-amplify"

import "./login.css"
import Everything from "./containers/everything/everything"
import config from "./aws-exports"
import { SupportContentProvider } from "./support/support"

const updatedAwsConfig = {
    ...config,
    oauth: {
        ...config.oauth,
        domain: process.env.REACT_APP_AWS_COGNITO_URL || "geniusrise.com",
        redirectSignIn: process.env.REACT_APP_BASE_URL || "https://geniusrise.com/",
        redirectSignOut: process.env.REACT_APP_BASE_URL || "https://geniusrise.com/",
    },
}

Amplify.configure(updatedAwsConfig)
Hub.listen("auth", listener)

function App() {
    start()

    return (
        <div className="App">
            <SupportContentProvider>
                <div className="appContent">
                    <Everything></Everything>
                </div>
            </SupportContentProvider>
        </div>
    )
}

export default App
