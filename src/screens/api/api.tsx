import React, { useState, useCallback } from "react"
import axios from "axios"
import { useDropzone } from "react-dropzone"
import { generateName } from "../../utils"

import styles from "./api.module.css"
import { Model } from "../../config"
import { Cell, Grid } from "styled-css-grid"
import SyntaxHighlighter from "react-syntax-highlighter"
import { solarizedDark } from "react-syntax-highlighter/dist/esm/styles/hljs"
import { Button, Content } from "react-bulma-components"
import Settings from "../settings/settings"
import { withAuthenticator } from "@aws-amplify/ui-react"

import banners from "../../data/banners.json"
import { createService } from "../../data/service"

interface APIProps {
    model: Model
}

const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * banners.length)
    return banners[randomIndex]
}

const API: React.FC<APIProps> = ({ model }) => {
    const [settingsVisible, setSettingsVisibile] = useState(false)
    const [config, setConfig] = useState({
        name: model.apiClass,
        replicas: 1,
        node_port: 0,
        port: 80,
        target_port: 3000,
        pod_size: "s"
    })

    return (
        <>
            <div className={styles.container} hidden={settingsVisible}>
                <div
                    className={styles.headerImage}
                    style={{ backgroundImage: `url(../../vector-autumn-foliage-banner/${getRandomImage()})`, backgroundSize: "cover" }}
                ></div>
                <Grid columns={2}>
                    <Cell>
                        <Content className={styles.contentHeading}>
                            <h2>API inference</h2>
                            Deploy an API instance or a cluster of instances.
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
                        <Button onClick={(e: any) => {
                            createService({
                                task: {
                                    name: generateName(),
                                    deployment_config: {
                                        name: model.apiClass,
                                        replicas: 1,
                                        node_port: 0,
                                        port: 80,
                                        target_port: 3000,
                                        pod_size: "s"
                                    },
                                    method: "listen",
                                    method_args: {
                                        model_name: model.model_name,
                                        ...model.apiDeploy
                                    }
                                }
                            })
                        }}>Create API</Button>
                    </Cell>
                </Grid>
            </div>
            <Settings
                taskType="api"
                model={model}
                callback={x => {
                    setSettingsVisibile(!settingsVisible)
                }}
                visible={settingsVisible}
            ></Settings>
        </>
    )
}

export default withAuthenticator(API)
