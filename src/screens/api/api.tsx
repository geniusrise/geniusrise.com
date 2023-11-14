import React, { useState, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"
import axios from "axios"
import { useDropzone } from "react-dropzone"

import styles from "./api.module.css"
import { Model } from "../../config"
import { Cell, Grid } from "styled-css-grid"
import SyntaxHighlighter from "react-syntax-highlighter"
import { solarizedDark } from "react-syntax-highlighter/dist/esm/styles/hljs"
import { Button, Content } from "react-bulma-components"
import Settings from "../settings/settings"
import { withAuthenticator } from "@aws-amplify/ui-react"

interface APIProps {
    model: Model
}

const API: React.FC<APIProps> = ({ model }) => {
    const [settingsVisible, setSettingsVisibile] = useState(false)

    return (
        <>
            <div className={styles.container} hidden={settingsVisible}>
                <Grid columns={2}>
                    <Cell>
                        <Content className={styles.contentHeading}>
                            <h2>API inference</h2>
                            Deploy an API instance or a cluister of instances.
                        </Content>
                    </Cell>
                </Grid>
                <Grid columns={2} className={styles.action}>
                    <Cell>
                        <Button
                            onClick={(e: any) => {
                                setSettingsVisibile(!settingsVisible)
                            }}
                        >
                            Configure Settings
                        </Button>
                    </Cell>
                    <Cell>
                        <Button>Create API</Button>
                    </Cell>
                </Grid>
            </div>
            <Settings
                taskType="api"
                callback={x => {
                    setSettingsVisibile(!settingsVisible)
                }}
                visible={settingsVisible}
            ></Settings>
        </>
    )
}

export default withAuthenticator(API)
