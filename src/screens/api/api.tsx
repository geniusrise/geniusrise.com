// @ts-nocheck
import React, { useState, useCallback, useEffect, useContext } from "react"
import axios from "axios"
import { useDropzone } from "react-dropzone"
import { generateName } from "../../utils"

import styles from "./api.module.css"
import { Model } from "../../config"
import { Cell, Grid } from "styled-css-grid"
import SyntaxHighlighter from "react-syntax-highlighter"
import { shadesOfPurple } from "react-syntax-highlighter/dist/esm/styles/hljs"
import { Button, Content } from "react-bulma-components"
import Settings from "../settings/settings"
import { withAuthenticator } from "@aws-amplify/ui-react"
import { SupportContentContext } from "../../support/support"

import banners from "../../data/banners.json"
import { createService, readService } from "../../data/service"

interface APIProps {
    model: Model
}

function toTitleCase(input: string): string {
    return input
        .split("_") // Split by underscore
        .map(
            part =>
                part
                    .toLowerCase() // Convert to lower case
                    .replace(/^\w/, c => c.toUpperCase()) // Capitalize the first letter
        )
        .join(" ") // Join the parts with spaces
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
        pod_size: "m"
    })
    const [modelSettings, setModelSettings] = useState(model.apiDeploy)

    const [launched, setLaunched] = useState<any>({})
    const [launching, setLaunching] = useState(false)

    const [backgroundImage, setBackgroundImage] = useState('')
    const [progress, setProgress] = useState(0)
    const [progressBarVisible, setProgressBarVisible] = useState(false)

    const [curlCommand, setCurlCommand] = useState("")
    const [curlVisible, setCurlVisible] = useState(false)

    const { setSupportContent } = useContext(SupportContentContext)

    useEffect(() => {
        setSupportContent({
            heading: "Deploy as an API",
            content: "This page allows you to deploy this machine learning model as APIs. You can configure the deployment settings like replicas, ports, and pod size to suit your needs. Select from a range of pod sizes to optimize performance and resource utilization. Once deployed, you can view and test your API using the generated cURL command. The progress bar provides real-time feedback on the deployment status. Additionally, you can access and modify advanced settings like model parameters and authentication credentials through the 'Configure Settings' option. The most optimum values are already pre-filled out.",
            examplesTitle: "Sizes:",
            examples: [
                "s: 0.25 VCPU, 1 GB RAM, 0.5GB GPU",
                "m: 0.5 VCPU, 2 GB RAM, 1GB GPU",
                "l: 1 VCPU, 4 GB RAM, 2GB GPU",
                "xl: 2 VCPU, 8 GB RAM, 4GB GPU",
                "2xl: 4 VCPU, 16 GB RAM, 8GB GPU",
                "4xl: 8 VCPU, 32 GB RAM, 16GB GPU",
                "8xl: 16 VCPU, 64 GB RAM, 32GB GPU",
                "16xl: 32 VCPU, 128 GB RAM, 64GB GPU",
            ],
            useCases: null,
        })
    }, [])

    // Set background image only once on component mount
    useEffect(() => {
        setBackgroundImage(`../../vector-autumn-foliage-banner/${getRandomImage()}`)
    }, [])

    const handleChange = (key: string, value: any) => {
        setConfig((prevState: any) => ({
            ...prevState,
            [key]: value,
        }))
    }

    useEffect(() => {
        if (launched && launched.uuid) {
            // Wait for a specified time before fetching the status
            const delay = 30000
            const timer = setTimeout(() => {
                readService(launched.uuid).then(x => {
                    const payload = JSON.stringify(model.api, null, 2)

                    const curl = `/usr/bin/curl -X POST ${x.data.ip}${model.endpoint} \\
    -H "Content-Type: application/json" \\
    -u "${model.apiDeploy.username}:${model.apiDeploy.password}" \\
    -d '${payload}' | jq`

                    setCurlCommand(curl)
                    setCurlVisible(true)
                    setLaunching(false)
                })
            }, delay)

            // Clear the timer if the component unmounts
            return () => clearTimeout(timer)
        }
    }, [launched])

    const handleLaunch = () => {
        setLaunching(true)
        setProgressBarVisible(true)

        createService({
            task: {
                name: ("genius--" + generateName() + "--" + model.name.toLowerCase().replaceAll(" ", "-")).substring(0, 60),
                deployment_config: {
                    ...config
                },
                method: "listen",
                method_args: {
                    model_name: model.model_name,
                    ...modelSettings
                }
            }
        }).then(x => {
            setLaunched(x.data)
        })

        // Progress bar logic
        const interval = setInterval(() => {
            setProgress(oldProgress => {
                if (oldProgress === 100) {
                    clearInterval(interval)
                    return 100
                }
                return Math.min(oldProgress + 1, 100)
            })
        }, 300) // 1200 ms interval for 2 minutes duration
    }

    return (
        <>
            <div className={styles.container} hidden={settingsVisible}>
                <div
                    className={styles.headerImage}
                    style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}
                ></div>
                <Grid columns={2}>
                    <Cell>
                        <Content className={styles.contentHeading}>
                            <h2>API inference</h2>
                            Deploy an API instance or a cluster of instances.
                        </Content>
                    </Cell>
                </Grid>
                <Grid columns={2} className={styles.form}>
                    {Object.entries(config).map(([key, value]) => {

                        return (
                            <Cell key={key} className={styles.formElement} center>
                                <label>
                                    {toTitleCase(key)}
                                    {(
                                        <input
                                            type={"text"}
                                            className={styles.textInput}
                                            value={value}
                                            onChange={e => handleChange(key, e.target.value)}
                                        />
                                    )}
                                </label>
                            </Cell>
                        )
                    })}
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
                        <Button disabled={launching} onClick={(e: any) => handleLaunch()}>
                            {launching ? "Launching API..." : "Create API"}
                        </Button>
                    </Cell>
                    <Cell width={2}>
                        {progressBarVisible && (
                            <div className={styles.progressBar}>
                                <div className={styles.progress} style={{ width: `${progress}%` }}></div>
                            </div>
                        )}
                    </Cell>
                    <Cell width={2} className={styles.curl}>
                        <Content hidden={!curlVisible}>
                            <h3>🎊 Your API is deployed, try it out</h3>
                            <pre>
                                <SyntaxHighlighter
                                    language="bash"
                                    style={shadesOfPurple}
                                    showLineNumbers={true}
                                    lineNumberStyle={{ minWidth: '3em', paddingRight: '10px', opacity: 0.5 }}
                                >
                                    {curlCommand}
                                </SyntaxHighlighter>
                            </pre>
                        </Content>
                    </Cell>
                </Grid>
            </div>
            <Settings
                taskType="api"
                model={model}
                callback={x => {
                    setModelSettings(x)
                    setSettingsVisibile(!settingsVisible)
                }}
                visible={settingsVisible}
            ></Settings>
        </>
    )
}

export default withAuthenticator(API)
