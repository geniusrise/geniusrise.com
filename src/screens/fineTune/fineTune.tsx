import React, { useState, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"
import axios from "axios"
import { useDropzone } from "react-dropzone"
import { withAuthenticator } from "@aws-amplify/ui-react"

import styles from "./fineTune.module.css"
import { Model } from "../../config"
import { Cell, Grid } from "styled-css-grid"
import SyntaxHighlighter from "react-syntax-highlighter"
import { solarizedDark } from "react-syntax-highlighter/dist/esm/styles/hljs"
import { Button, Content } from "react-bulma-components"
import Settings from "../settings/settings"

import banners from "../../data/banners.json"

interface FineTuneProps {
    model: Model
}

const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * banners.length)
    return banners[randomIndex]
}

const FineTune: React.FC<FineTuneProps> = ({ model }) => {
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
        <>
            <div className={styles.container} hidden={settingsVisible}>
                <div
                    className={styles.headerImage}
                    style={{ backgroundImage: `url(../../vector-autumn-foliage-banner/${getRandomImage()})`, backgroundSize: "cover" }}
                ></div>
                <Grid columns={2}>
                    <Cell>
                        <Content className={styles.contentHeading}>
                            <h2>FineTune a model</h2>
                            Upload data to fine-tune a model.
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
                <div className={styles.s3Drop}>
                    <p>You can upload files directly to the following S3 bucket:</p>
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
            </div>
            <Settings
                taskType="fineTune"
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

export default withAuthenticator(FineTune)
