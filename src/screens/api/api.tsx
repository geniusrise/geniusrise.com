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
import { Settings, buildInitialState } from "../settings/settings"
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
    const [config, setConfig] = useState([
        {
            name: "name",
            description: "Unique identifier for the API deployment. This name is used to distinguish between different deployments.",
            default: model.apiClass,
        },
        {
            name: "replicas",
            description: "The number of pod replicas to deploy for load balancing and redundancy. Increasing replicas can enhance availability and parallel processing.",
            default: 1,
        },
        {
            name: "node_port",
            description: "The port on the cluster node where this service should be exposed. Useful for directing external traffic to your service.",
            default: 0,
        },
        {
            name: "port",
            description: "The port used by the service within the Kubernetes cluster. It directs internal traffic to your API.",
            default: 80,
        },
        {
            name: "target_port",
            description: "The port on the pod that receives traffic. This should match the port your application is listening on within the container.",
            default: 3000,
        },
        {
            name: "pod_size",
            description: "Defines the size of the pod, dictating its CPU, memory, and GPU resources. Choose a size based on the expected workload and performance requirements.",
            default: "m",
            options: [
                { label: " 🟢⚫⚫⚫ S - 0.25 VCPU, 1 GB RAM, 0.5GB GPU", value: "s" },
                { label: " 🟢🟢⚫⚫ M - 0.5 VCPU, 2 GB RAM, 1GB GPU", value: "m" },
                { label: " 🟢🟢🟢⚫ L - 1 VCPU, 4 GB RAM, 2GB GPU", value: "l" },
                { label: " 🟢🟢🟢🟢 XL - 2 VCPU, 8 GB RAM, 4GB GPU", value: "xl" },
                { label: " 🔥🟢🟢🟢 2XL - 4 VCPU, 16 GB RAM, 8GB GPU", value: "2xl" },
                { label: " 🔥🔥🟢🟢 4XL - 8 VCPU, 32 GB RAM, 16GB GPU", value: "4xl" },
                { label: " 🔥🔥🔥🟢 8XL - 16 VCPU, 64 GB RAM, 32GB GPU", value: "8xl" },
                { label: " 🔥🔥🔥🔥 16XL - 32 VCPU, 128 GB RAM, 64GB GPU", value: "16xl" },
            ],
        },
        {
            name: "cloud",
            description: "Selects the cloud to be deployed in. Select one according to your preference, usecase and cost requirements.",
            default: "e2e-delhi",
            options: [
                { label: "E2E Networks - Delhi-NCR", value: "e2e-delhi" },
                { label: "Amazon AWS - ap-south-1 (Mumbai)", value: "AWS-ap-south-1" },
                { label: "Microsoft Azure - Central India (Pune)", value: "azure-central-india" },
                { label: "E2E Networks - Mumbai (Coming Soon)", value: "e2e-delhi" },
                { label: "Amazon AWS - us-east-1 (N. Virginia) (Coming Soon)", value: "AWS-us-east-1" },
                { label: "Microsoft Azure - Central USA (Coming Soon)", value: "azure-central-us" },
                { label: "Google Cloud - asia-south1 (Coming Soon)", value: "gcp-asia-south1" },
                { label: "Google Cloud - northamerica-east1 (Coming Soon)", value: "gcp-us-east1" },
            ],
        },
    ]);
    const [modelSettings, setModelSettings] = useState(buildInitialState(model.apiDeploy))
    const [customModel, setCustomModel] = useState(model.model_name)
    const isModelCustom = model.model_name === null

    const [launched, setLaunched] = useState<any>({})
    const [launching, setLaunching] = useState(false)

    const [backgroundImage, setBackgroundImage] = useState('')
    const [progress, setProgress] = useState(0)
    const [progressBarVisible, setProgressBarVisible] = useState(false)

    const payload = JSON.stringify(model.api, null, 4)
    const [curlCommand, setCurlCommand] = useState(`curl -X POST <endpoint>${model.endpoint} \\
  - H "Content-Type: application/json" \\
  -u "<username (from settings)>:<password (from settings)>" \\
  -d '${payload}' | jq`)
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

    const handleChange = (name: string, value: any) => {
        setConfig(prevState =>
            prevState.map(configItem =>
                configItem.name === name ? { ...configItem, default: value } : configItem
            )
        );
    };

    useEffect(() => {
        if (launched && launched.uuid) {
            // Wait for a specified time before fetching the status
            const delay = 30000
            const timer = setTimeout(() => {
                readService(launched.uuid).then(x => {
                    const payload = JSON.stringify(model.api, null, 4)

                    const curl = `/ usr / bin / curl - X POST ${x.data.ip}${model.endpoint} \\
  -H "Content-Type: application/json" \\
  -u "${modelSettings.username}:${modelSettings.password}" \\
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

        const deploymentConfig = config.reduce((acc, item) => {
            acc[item.name] = item.default;
            return acc;
        }, {});

        createService({
            task: {
                name: ("genius--" + generateName() + "--" + model.name.toLowerCase().replaceAll(" ", "-")).replaceAll(".", "-").substring(0, 60),
                deployment_config: {
                    ...deploymentConfig
                },
                method: "listen",
                method_args: {
                    model_name: customModel,
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
                <Grid columns={1}>
                    <Cell>
                        <Content className={styles.contentHeading}>
                            <h2>API inference - {model.name}</h2>
                            Deploy an API instance or a cluster of instances.

                            <h2>API Invocation</h2>
                            This is how the API can be invoked after deployment:
                            <div className={styles.curl}>
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
                            </div>
                        </Content>
                    </Cell>
                </Grid>
                <Grid columns={2} className={styles.form}>
                    {isModelCustom ?
                        <Cell key="customModel" className={styles.formElement} center>
                            <label>
                                Custom Model Name
                                {(
                                    <input
                                        type={"text"}
                                        className={styles.textInput}
                                        value={customModel}
                                        onChange={e => setCustomModel(e.target.value)}
                                    />
                                )}
                            </label>
                        </Cell>
                        : <></>}
                    {config.map(({ name, description, default: defaultValue, options }) => (name === "name" || name.includes("port")) ? <></> : (
                        <Cell key={name} className={styles.formElement} center>
                            <label>
                                {toTitleCase(name)}
                                <div>{description}</div>
                                {options ?
                                    <select
                                        className={styles.selectInput}
                                        value={defaultValue}
                                        onChange={e => handleChange(name, e.target.value)}
                                    >
                                        {
                                            // @ts-ignore
                                            options.map((option: any) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                    </select>
                                    :
                                    <input
                                        type="text"
                                        className={styles.textInput}
                                        value={defaultValue}
                                        onChange={e => handleChange(name, e.target.value)}
                                    />
                                }
                            </label>
                        </Cell>
                    ))}
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
