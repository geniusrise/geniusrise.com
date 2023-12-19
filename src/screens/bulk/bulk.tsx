import React, { useState, useCallback, useContext, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import axios from "axios"
import { useDropzone } from "react-dropzone"

import styles from "./bulk.module.css"
import { Model } from "../../config"
import { Cell, Grid } from "styled-css-grid"
import SyntaxHighlighter from "react-syntax-highlighter"
import { solarizedDark } from "react-syntax-highlighter/dist/esm/styles/hljs"
import { Button, Content } from "react-bulma-components"
import Settings from "../settings/settings"
import { withAuthenticator } from "@aws-amplify/ui-react"
import AWS from 'aws-sdk'
import { SupportContentContext } from "../../support/support"
import banners from "../../data/banners.json"

interface BulkProps {
    model: Model
}

const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * banners.length)
    return banners[randomIndex]
}

const Bulk: React.FC<BulkProps> = ({ model }) => {
    const [backgroundImage, setBackgroundImage] = useState('')

    const [files, setFiles] = useState<File[]>([])
    const [s3BucketUrl, setS3BucketUrl] = useState<string>("")
    const [settingsVisible, setSettingsVisibile] = useState(false)

    const [progress, setProgress] = useState(0)
    const [progressBarVisible, setProgressBarVisible] = useState(false)

    // Generate the S3 bucket URL
    const generateS3BucketUrl = useCallback(() => {
        const date = new Date()
        const year = date.getFullYear()
        const month = `0${date.getMonth() + 1}`.slice(-2)
        const day = `0${date.getDate()}`.slice(-2)
        const randomUUID = uuidv4()
        return `year=${year}/month=${month}/day=${day}/${randomUUID}/`
    }, [model.model_name])

    useEffect(() => {
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
            ],
            usecasesTitle: "Additional Instructions",
            useCases: [
                "You may upload multiple files",
                "You may upload directories with arbitrary nesting",
                "You may also use the generated S3 link to upload files via an external system like backend or spark"
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
        } catch (error) {
            console.error('Error uploading files: ', error)
        } finally {
            setProgressBarVisible(false)
        }
    }

    // Initialize S3 bucket URL on component mount
    React.useEffect(() => {
        setS3BucketUrl(generateS3BucketUrl())
    }, [generateS3BucketUrl])

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
                </Grid>
            </div>
            <Settings
                taskType="bulk"
                model={model}
                callback={x => {
                    setSettingsVisibile(!settingsVisible)
                    console.log(x)
                }}
                visible={settingsVisible}
            ></Settings>
        </>
    )
}

export default withAuthenticator(Bulk)
