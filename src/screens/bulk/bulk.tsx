import React, { useState, useCallback } from "react"
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

interface BulkProps {
    model: Model
}

const Bulk: React.FC<BulkProps> = ({ model }) => {
    const [files, setFiles] = useState<File[]>([])
    const [s3BucketUrl, setS3BucketUrl] = useState<string>("")
    const [settingsVisible, setSettingsVisibile] = useState(false)

    // Generate the S3 bucket URL
    const generateS3BucketUrl = useCallback(() => {
        const date = new Date()
        const year = date.getFullYear()
        const month = `0${date.getMonth() + 1}`.slice(-2)
        const day = `0${date.getDate()}`.slice(-2)
        const randomUUID = uuidv4()
        return `s3://genisurise-prod-input/${model.model_name}/${year}/${month}/${day}/${randomUUID}/`
    }, [model.model_name])

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

    return (
        <div className={styles.container} hidden={settingsVisible}>
            <Grid columns={2}>
                <Cell>
                    <Content className={styles.contentHeading}>
                        <h2>Bulk inference</h2>
                        Upload data to run a inference using a model as a bulk job.
                        <p>You may upload a bunch of files:</p>
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
                {isDragActive ? <p>Drop the files here ...</p> : <button>Click to select files or folders or drag them here</button>}
            </div>
            <div className={styles.s3Drop}>
                <p>Alternatively, you can upload files directly to the following S3 bucket:</p>
            </div>
            <Grid columns={20} className={styles.s3Location}>
                <Cell width={19} center middle>
                    <p>{s3BucketUrl}</p>
                </Cell>
                <Cell width={1} center middle>
                    <span>📋</span>
                </Cell>
            </Grid>
            <div className={styles.s3Code}>
                <SyntaxHighlighter language="bash" style={solarizedDark} wrapLines={true} showLineNumbers={true}>
                    {`aws s3 cp \\\n  --recursive\\\n  ./<YOUR_DATA>\\\n  ${s3BucketUrl}`}
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
                    <Button>Submit Job</Button>
                </Cell>
            </Grid>
            <Settings
                taskType="bulk"
                callback={x => {
                    console.log(x)
                }}
                visible={settingsVisible}
            ></Settings>
        </div>
    )
}

export default Bulk
