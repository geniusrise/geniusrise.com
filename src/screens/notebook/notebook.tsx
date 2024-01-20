import React, { useState, useCallback, useContext, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import axios from "axios"
import { useDropzone } from "react-dropzone"

import styles from "./notebook.module.css"
import { Model } from "../../config"
import { Cell, Grid } from "styled-css-grid"
import SyntaxHighlighter from "react-syntax-highlighter"
import { shadesOfPurple } from "react-syntax-highlighter/dist/esm/styles/hljs"
import { Button, Content } from "react-bulma-components"
import { Settings, buildInitialState } from "../settings/settings"
import { withAuthenticator } from "@aws-amplify/ui-react"
import AWS from 'aws-sdk'
import { SupportContentContext } from "../../support/support"
import banners from "../../data/banners.json"
import { generateName } from "../../utils"
import { createJob } from "../../data/job"
import { createService, readService } from "../../data/service"
import Markdown from "react-markdown"

interface NotebookProps {
    model: Model
}

const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * banners.length)
    return banners[randomIndex]
}

const generateS3BucketUrl = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = `0${date.getMonth() + 1}`.slice(-2)
    const day = `0${date.getDate()}`.slice(-2)
    const randomUUID = uuidv4()
    return `year=${year}/month=${month}/day=${day}/${randomUUID}/`
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

const Notebook: React.FC<NotebookProps> = ({ model }) => {
    const [backgroundImage, setBackgroundImage] = useState('')

    const [customModel, setCustomModel] = useState(model.model_name)
    const isModelCustom = model.model_name === null
    const [customNotification, setCustomNotification] = useState("")
    const [password, setPassword] = useState("")

    const [progress, setProgress] = useState(0)
    const [progressBarVisible, setProgressBarVisible] = useState(false)
    const [deployed, setDeployed] = useState(false)

    const [launched, setLaunched] = useState<any>({})
    const [launching, setLaunching] = useState(false)

    const [notebookLink, setNotebookLink] = useState("")
    const [notebookVisible, setNotebookVisible] = useState(false)

    const [config, setConfig] = useState([
        {
            name: "name",
            description: "Unique identifier for the API deployment. This name is used to distinguish between different deployments.",
            default: "TextJupyterNotebook",
        },
        {
            name: "pod_size",
            description: "Defines the size of the pod, dictating its CPU, memory, and GPU resources. Choose a size based on the expected workload.",
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
            default: "azure-central-india",
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

    const handleChange = (name: string, value: any) => {
        setConfig(prevState =>
            prevState.map(configItem =>
                configItem.name === name ? { ...configItem, default: value } : configItem
            )
        );
    };

    // Initialize S3 bucket URL on component mount
    React.useEffect(() => {
        setBackgroundImage(`../../vector-autumn-foliage-banner/${getRandomImage()}`)
    }, [])

    const { setSupportContent } = useContext(SupportContentContext)

    useEffect(() => {
        setSupportContent({
            heading: "Launch a Jupyter Notebook",
            content: "This page allows you to launch a Jupyter Notebook inside a pod. Choose from a variety of pod sizes to balance performance and resource allocation efficiently. Once launched, the notebook can be accessed via the dashboard. You have the flexibility to adjust notebook settings and environment packages through the 'Configure Settings' option. Default settings are optimized for general use. Follow the instructions below for accessing and using your notebook.",
            examplesTitle: "Notebook Access Instructions",
            examples: [
                "Access the notebook through the dashboard link provided after deployment. Dont forget to ",
                "The notebook will have pre-installed libraries. Additional libraries can be installed as needed.",
                "Persistent storage options are available to save your work. After the notebook exits, your remaining files will be emailed to you to download.",
                "Direct integration with data sources is supported for seamless data import.",
                "Interactive visualizations and data analysis tools are readily available."
            ],
            usecasesTitle: "Pod Sizes:",
            useCases: [
                "s: 0.25 VCPU, 1 GB RAM, 0.5GB GPU",
                "m: 0.5 VCPU, 2 GB RAM, 1GB GPU",
                "l: 1 VCPU, 4 GB RAM, 2GB GPU",
                "xl: 2 VCPU, 8 GB RAM, 4GB GPU",
                "2xl: 4 VCPU, 16 GB RAM, 8GB GPU",
                "4xl: 8 VCPU, 32 GB RAM, 16GB GPU",
                "8xl: 16 VCPU, 64 GB RAM, 32GB GPU",
                "16xl: 32 VCPU, 128 GB RAM, 64GB GPU",
            ],
        })
    }, [])

    useEffect(() => {
        if (launched && launched.uuid) {
            // Wait for a specified time before fetching the status
            const delay = 240000
            const timer = setTimeout(() => {
                const deploymentConfig = config.reduce((acc, item) => {
                    // @ts-ignore
                    acc[item.name] = item.default;
                    return acc;
                }, {});

                // @ts-ignore
                readService(launched.uuid, deploymentConfig.cloud).then(x => {
                    // @ts-ignore
                    const url = `${x.data.ip}`

                    setNotebookLink(url)
                    setNotebookVisible(true)
                    setLaunching(false)
                })
            }, delay)

            // Clear the timer if the component unmounts
            return () => clearTimeout(timer)
        }
    }, [launched])

    const handleLaunch = () => {
        setProgressBarVisible(true)
        setProgress(0)

        const deploymentConfig = config.reduce((acc, item) => {
            // @ts-ignore
            acc[item.name] = item.default;
            return acc;
        }, {});

        createService({
            task: {
                name: ("geniusnb--" + generateName() + "--" + model.name.toLowerCase().replaceAll(" ", "-")).replaceAll(".", "-").substring(0, 60),
                deployment_config: {
                    ...deploymentConfig,
                    replicas: 1,
                    node_port: 0,
                    port: 80,
                    target_port: 3000,
                },
                method: "create",
                method_args: {
                    ...modelSettings,
                    model_name: customModel,
                    password: password,
                    notification_email: customNotification
                }
            }
        }).then(x => {
            x ? setLaunched(x.data) : console.log("")
        })

        // Progress bar logic
        const interval = setInterval(() => {
            setProgress(oldProgress => {
                if (oldProgress === 100) {
                    setDeployed(true)
                    clearInterval(interval)
                    return 100
                }
                return Math.min(oldProgress + 1, 100)
            })
        }, 2400) // 1200 ms interval for 2 minutes duration
    }

    return (
        <>
            <div className={styles.container}>
                <div
                    className={styles.headerImage}
                    style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}
                ></div>
                <Grid columns={2}>
                    <Cell>
                        <Content className={styles.contentHeading}>
                            <h2>Launch a notebook - {model.name}</h2>
                        </Content>
                    </Cell>
                </Grid>
                <Grid columns={2} className={styles.form}>
                    {isModelCustom ?
                        <Cell key="customModel" className={styles.formElement} center>
                            <label>
                                Custom Model Name
                                <div>Input the name of the desired model. This name corresponds to the huggingface format: <SyntaxHighlighter style={shadesOfPurple}>repository_name/model_name:optional_model_tag</SyntaxHighlighter></div>
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
                    {config.map(({ name, description, default: defaultValue, options }) => (name === "name" || name.includes("s3")) ? <></> : (
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
                    <Cell key="customNotification" className={styles.formElement} center>
                        <label>
                            Notification Email
                            <div>Input the email id to be notified once the notebook is closed:</div>
                            {(
                                <input
                                    type={"text"}
                                    className={styles.textInput}
                                    value={customNotification}
                                    onChange={e => setCustomNotification(e.target.value)}
                                />
                            )}
                        </label>
                    </Cell>
                    <Cell key="password" className={styles.formElement} center>
                        <label>
                            Password
                            <div>Input the password used to access the notebook:</div>
                            {(
                                <input
                                    type={"text"}
                                    className={styles.textInput}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            )}
                        </label>
                    </Cell>
                </Grid>
                <Grid columns={2} className={styles.action}>
                    <Cell width={2}>
                        <Button onClick={() => handleLaunch()} disabled={progressBarVisible}>Launch</Button>
                    </Cell>
                    <Cell width={2}>
                        {progressBarVisible && (
                            <div className={styles.progressBar}>
                                <div className={styles.progress} style={{ width: `${progress}%` }}></div>
                            </div>
                        )}
                    </Cell>
                    <Cell width={2} className={styles.curl}>
                        <Content hidden={!deployed}>
                            <h3>🎊 Your notebook is deployed!</h3>
                            <Markdown className={styles.markdown}>
                                {`Access your notebook here: [http://${notebookLink}](http://${notebookLink})`}
                            </Markdown>
                        </Content>
                    </Cell>
                </Grid>
            </div>
        </>
    )
}

export default withAuthenticator(Notebook)
