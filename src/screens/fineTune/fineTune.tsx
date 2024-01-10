import React, { useState, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"
import axios from "axios"
import { useDropzone } from "react-dropzone"
import { withAuthenticator } from "@aws-amplify/ui-react"
import Markdown from "react-markdown"
import styles from "./fineTune.module.css"
import { Config, data_instructions } from "../../config"
import { Cell, Grid } from "styled-css-grid"
import SyntaxHighlighter from "react-syntax-highlighter"
import { shadesOfPurple } from "react-syntax-highlighter/dist/esm/styles/hljs"
import { Button, Content } from "react-bulma-components"

import banners from "../../data/banners.json"

interface FineTuneProps {
    task: Config
}

const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * banners.length)
    return banners[randomIndex]
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

const FineTune: React.FC<FineTuneProps> = ({ task }) => {
    const [files, setFiles] = useState<File[]>([])
    const [s3BucketUrl, setS3BucketUrl] = useState<string>("")
    const [settingsVisible, setSettingsVisibile] = useState(false)
    const [customModel, setCustomModel] = useState("")
    const [customData, setCustomData] = useState("")

    // Generate the S3 bucket URL
    const generateS3BucketUrl = useCallback(() => {
        const date = new Date()
        const year = date.getFullYear()
        const month = `0${date.getMonth() + 1}`.slice(-2)
        const day = `0${date.getDate()}`.slice(-2)
        const randomUUID = uuidv4()
        return `year=${year}/month=${month}/day=${day}/${randomUUID}/`
    }, [task.short_name])

    // Initialize S3 bucket URL on component mount
    React.useEffect(() => {
        setS3BucketUrl(generateS3BucketUrl())
    }, [generateS3BucketUrl])

    // Handle file drop
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(acceptedFiles)
    }, [])

    // Set up the dropzone for drag and drop file upload
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const [config, setConfig] = useState([
        {
            name: "name",
            description: "Unique identifier for the API deployment. This name is used to distinguish between different deployments.",
            default: task.models[0].apiClass,
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

    const handleChange = (name: string, value: any) => {
        setConfig(prevState =>
            prevState.map(configItem =>
                configItem.name === name ? { ...configItem, default: value } : configItem
            )
        );
    };

    return (
        <>
            <div className={styles.container} hidden={settingsVisible}>
                <div
                    className={styles.headerImage}
                    style={{ backgroundImage: `url(../../vector-autumn-foliage-banner/${getRandomImage()})`, backgroundSize: "cover" }}
                ></div>
                <Grid columns={5}>
                    <Cell width={4}>
                        <Content className={styles.contentHeading}>
                            <h1>Fine-Tune a model for: {task.long_name}</h1>
                            <Markdown className={styles.markdown}>
                                {
                                    // @ts-ignore
                                    data_instructions[task.short_name]
                                }
                            </Markdown>
                        </Content>
                    </Cell>
                </Grid>
                <Grid columns={2} className={styles.form}>
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
                    <Cell key="customModel" className={styles.formElement} center>
                        <label>
                            Model Name
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
                </Grid>
                <Markdown className={styles.markdown}>
                    {`## Data

### Either select a dataset from [huggingface](https://huggingface.co/datasets)`}
                </Markdown>
                <Grid columns={1}>
                    <Cell key="customModel" className={styles.formElement} center>
                        <label>
                            Huggingface dataset handle
                            <div>Input the name of the desired dataset. This name corresponds to the huggingface format: <SyntaxHighlighter style={shadesOfPurple}>repository_name/dataset_name</SyntaxHighlighter></div>
                            {(
                                <input
                                    type={"text"}
                                    className={styles.textInput}
                                    value={customData}
                                    onChange={e => setCustomData(e.target.value)}
                                />
                            )}
                        </label>
                    </Cell>
                    <Cell>
                        <Content className={styles.contentHeading}>
                            <h2>Or Upload Files From Browser</h2>
                        </Content>
                        <div {...getRootProps()} className={styles.filesDrop}>
                            <input {...getInputProps()} />
                            {isDragActive ? <p>Drop the files here ...</p> : <button>{(files.length === 0) ? "Click to select files or folders or drag them here" : files.map(f => <p>{f.name}</p>)}</button>}
                        </div>
                    </Cell>
                    <Cell>
                        <Markdown className={styles.markdown}>
                            ### OR upload data to S3
                        </Markdown>
                        <Grid columns={20} className={styles.s3Location}>
                            <Cell width={19} center middle>
                                <p>s3://geniusrise-prod-input/{s3BucketUrl}</p>
                            </Cell>
                            <Cell width={1} center middle>
                                <span>📋</span>
                            </Cell>
                        </Grid>
                        <div className={styles.s3Code}>
                            <SyntaxHighlighter language="bash" style={shadesOfPurple} wrapLines={true} showLineNumbers={true}>
                                {`aws s3 cp \\\n  --recursive\\\n  ./<YOUR_DATA>\\\n  s3://geniusrise-prod-input/${s3BucketUrl}`}
                            </SyntaxHighlighter>
                        </div>
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
                        <Button>Submit Job</Button>
                    </Cell>
                </Grid>
            </div >
            {/* <Settings
                taskType="fineTune"
                model={model}
                callback={x => {
                    setSettingsVisibile(!settingsVisible)
                }}
                visible={settingsVisible}
            ></Settings> */}
        </>
    )
}

export default withAuthenticator(FineTune)
