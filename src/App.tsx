import React from "react"
import "./App.css"
import "@fontsource/fira-sans"

import { Amplify } from "aws-amplify"
import { listener, start } from "./data/login/login"
import { Hub } from "aws-amplify"

import "./login.css"
import Everything from "./containers/everything/everything"
import config from "./aws-exports"

const updatedAwsConfig = {
    ...config,
    oauth: {
        ...config.oauth,
        domain: process.env.REACT_APP_AWS_COGNITO_URL || "login.geniusrise.com",
        redirectSignIn: process.env.REACT_APP_BASE_URL || "https://cloud.geniusrise.com/",
        redirectSignOut: process.env.REACT_APP_BASE_URL || "https://cloud.geniusrise.com/",
    },
}

Amplify.configure(updatedAwsConfig)
Hub.listen("auth", listener)

function App() {
    start()

    return (
        <div className="App">
            <div className="appContent">
                <Everything></Everything>
            </div>
        </div>
    )
}

export default App
