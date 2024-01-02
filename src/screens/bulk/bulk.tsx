import React, { useState, useCallback, useContext, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import axios from "axios"
import { useDropzone } from "react-dropzone"

import styles from "./bulk.module.css"
import { Model } from "../../config"
import { Cell, Grid } from "styled-css-grid"
import SyntaxHighlighter from "react-syntax-highlighter"
import { solarizedDark, shadesOfPurple } from "react-syntax-highlighter/dist/esm/styles/hljs"
import { Button, Content } from "react-bulma-components"
import Settings from "../settings/settings"
import { withAuthenticator } from "@aws-amplify/ui-react"
import AWS from 'aws-sdk'
import { SupportContentContext } from "../../support/support"
import banners from "../../data/banners.json"
import { generateName } from "../../utils"
import { createJob } from "../../data/job"

interface BulkProps {
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

const Bulk: React.FC<BulkProps> = ({ model }) => {
    const [backgroundImage, setBackgroundImage] = useState('')

    const [files, setFiles] = useState<File[]>([])
    const [s3BucketUrl, setS3BucketUrl] = useState<string>(generateS3BucketUrl())
    const [settingsVisible, setSettingsVisibile] = useState(false)
    const [customModel, setCustomModel] = useState(model.model_name)
    const isModelCustom = model.model_name === null

    const [progress, setProgress] = useState(0)
    const [progressBarVisible, setProgressBarVisible] = useState(false)
    const [deployed, setDeployed] = useState(false)

    const [config, setConfig] = useState<object>({
        name: model.apiClass.replace("API", "Bulk"),
        pod_size: "m",
        input_s3_folder: s3BucketUrl,
        output_s3_folder: s3BucketUrl,
    })
    const [modelSettings, setModelSettings] = useState(model.bulkDeploy)

    const handleChange = (key: string, value: any) => {
        setConfig((prevState: any) => ({
            ...prevState,
            [key]: value,
        }))
    }

    // Initialize S3 bucket URL on component mount
    React.useEffect(() => {
        setBackgroundImage(`../../vector-autumn-foliage-banner/${getRandomImage()}`)
    }, [])

    AWS.config.update({
        region: 'ap-south-1',
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        // credentials: new AWS.CognitoIdentityCredentials({
        //     IdentityPoolId: 'ap-south-1_m1rTttoqg',
        // }),
    })

    const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        params: { Bucket: 'geniusrise-prod-input' },
    })

    const { setSupportContent } = useContext(SupportContentContext)

    useEffect(() => {
        setSupportContent({
            heading: "Deploy a bulk job",
            content: "This page allows you to deploy this machine learning model as a bulk job. Select from a range of pod sizes to optimize performance and resource utilization. Once deployed, you can view your job on the dashboard. Additionally, you can access and modify advanced settings like model parameters through the 'Configure Settings' option. The most optimum values are already pre-filled out. Please follow the instructions below to structure your input data.",
            examplesTitle: "Data Format",
            examples: [
                "For CSV, TSV, XLS, XLSX each file should contain the following columns: " + model.inputs.map(i => i.name).join(", "),
                "For JSONL each line should contain a JSON with fields: " + model.inputs.map(i => i.name).join(", "),
                "For JSON, YAML each file should contain these fields: " + model.inputs.map(i => i.name).join(", "),
                "For huggingface, parquet, sqlite etc, the dataset should contain these fields: " + model.inputs.map(i => i.name).join(", "),
                "You may upload multiple files",
                "You may upload directories with arbitrary nesting",
                "You may also use the generated S3 link to upload files via an external system like backend or spark"
            ],
            usecasesTitle: "Sizes:",
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

    const uploadFilesToS3 = async () => {
        if (files.length === 0) {
            return
        }

        setProgressBarVisible(true)
        let totalUploaded = 0

        try {
            const uploadPromises = files.map(file => {
                const uploadParams = {
                    Bucket: 'geniusrise-prod-input',
                    Key: `${s3BucketUrl}${file.name}`,
                    Body: file,
                }

                return s3.upload(uploadParams)
                    .on('httpUploadProgress', (evt) => {
                        // Update progress
                        totalUploaded += evt.loaded
                        const progressPercentage = (totalUploaded / files.reduce((acc, file) => acc + file.size, 0)) * 100
                        setProgress(Math.min(100, progressPercentage))
                    })
                    .promise()
            })

            await Promise.all(uploadPromises)
            console.log('Files uploaded successfully.')
            handleLaunch()
        } catch (error) {
            console.error('Error uploading files: ', error)
        } finally {
        }
    }

    // Handle file drop
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(acceptedFiles)
    }, [])

    // Set up the dropzone for drag and drop file upload
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/json': ['.jsonl', '.json'], // JSON and JSON Lines format
            'text/csv': ['.csv'],                    // CSV files
            'application/parquet': ['.parquet'],     // Parquet files
            'application/xml': ['.xml'],             // XML files
            'application/x-yaml': ['.yaml'],         // YAML files
            'text/tab-separated-values': ['.tsv'],   // TSV files
            'application/vnd.ms-excel': ['.xls'],    // Excel files
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], // Excel files
            'application/octet-stream': ['.sqlite', '.feather'], // Binary file types
            'image/jpeg': ['.jpeg', '.jpg'],         // JPEG images
            'image/png': ['.png'],                   // PNG images
        }
    })

    const handleLaunch = () => {
        setProgressBarVisible(true)
        setProgress(0)

        createJob({
            task: {
                name: ("geniusbulk--" + generateName() + "--" + model.name.toLowerCase().replaceAll(" ", "-")).substring(0, 60),
                deployment_config: {
                    ...config
                },
                method: model.bulkMethod,
                method_args: {
                    model_name: customModel,
                    ...modelSettings
                }
            }
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
                            <h2>Bulk inference</h2>
                            Upload data to run a inference using a model as a bulk job.
                            Each file should contain the following fields:
                            <ol>
                                {model.inputs.map(i => <li><p>{i.name} (type: {i.type})</p></li>)}
                            </ol>
                        </Content>
                    </Cell>
                    <Cell className={styles.supportedFormats}>
                        <p>Supported formats</p>
                        <Grid columns={3}>
                            {model.bulk_formats.map(b => {
                                return (
                                    <Cell center middle>
                                        {b}
                                    </Cell>
                                )
                            })}
                        </Grid>
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
                    {Object.entries(config).map(([key, value]) => {

                        return (
                            <Cell key={key} className={styles.formElement} center>
                                <label>
                                    {toTitleCase(key)}
                                    {(
                                        <input
                                            type={"text"}
                                            className={styles.textInput}
                                            value={value === null ? "" : value}
                                            onChange={e => handleChange(key, e.target.value)}
                                        />
                                    )}
                                </label>
                            </Cell>
                        )
                    })}
                </Grid>
                <div {...getRootProps()} className={styles.filesDrop}>
                    <input {...getInputProps()} />
                    {isDragActive ? <p>Drop the files here ...</p> : <button>{(files.length === 0) ? "Click to select files or folders or drag them here" : files.map(f => <p>{f.name}</p>)}</button>}
                </div>
                <div className={styles.s3Drop}>
                    <p>Alternatively, you can upload files directly to the following S3 bucket:</p>
                </div>
                <Grid columns={20} className={styles.s3Location}>
                    <Cell width={19} center middle>
                        <p>{"s3://geniusrise-prod-input/" + s3BucketUrl}</p>
                    </Cell>
                    <Cell width={1} center middle>
                        <span>📋</span>
                    </Cell>
                </Grid>
                <div className={styles.s3Code}>
                    <SyntaxHighlighter language="bash" style={solarizedDark} wrapLines={true} showLineNumbers={true}>
                        {`aws s3 cp \\\n  --recursive\\\n  ./<YOUR_DATA>\\\n  s3://geniusrise-prod-input/${s3BucketUrl}`}
                    </SyntaxHighlighter>
                </div>
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
                        <Button onClick={() => uploadFilesToS3()} disabled={progressBarVisible}>Submit Job</Button>
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
                            <h3>🎊 Your bulk job is deployed! Download from:</h3>
                            <pre>
                                <SyntaxHighlighter
                                    language="bash"
                                    style={shadesOfPurple}
                                    showLineNumbers={true}
                                    lineNumberStyle={{ minWidth: '3em', paddingRight: '10px', opacity: 0.5 }}
                                >
                                    {`aws s3 cp \\\n  --recursive\\\n  s3://geniusrise-prod-output/${s3BucketUrl} \\\n .`}
                                </SyntaxHighlighter>
                            </pre>
                        </Content>
                    </Cell>
                </Grid>
            </div>
            <Settings
                taskType="bulk"
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

export default withAuthenticator(Bulk)
