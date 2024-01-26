import React, { useContext, useEffect, useState } from "react"
import { Button, Card, Container, Content, Form } from "react-bulma-components"
import { Model as ModelType } from "../../config"
import styles from "./model.module.css"
import { Cell, Grid } from "styled-css-grid"
import { l, xl } from "../../utils"
import { Link } from "react-router-dom"
import { SupportContentContext } from "../../support/support"
import banners from "../../data/banners.json"
import cards from "../../config/model_cards.json"
import Markdown from "react-markdown"
import axios from "axios"

interface Props {
    model: ModelType
}

const getRandomImage = (): string => {
    const randomIndex = Math.floor(Math.random() * banners.length)
    return banners[randomIndex]
}

function Model({ model }: Props) {
    const [markdownContent, setMarkdownContent] = useState<string>("")
    const { setSupportContent } = useContext(SupportContentContext)

    useEffect(() => {
        setSupportContent({
            heading: model.name,
            content: "",
            examples: model.input_examples,
            useCases: [
                "Bulk job: upload a bunch of documents and perform inference on them. This option has the lowest cost and ideal for workloads that are not real-time.",
                "API: create an auto-scalable set of pods running this model, exposing an API. Ideal for integrating this model with your product on sandbox or production.",
                "Fine-tune: use your data to fine-tune a model for better and more relevant and customised performance for your tasks. We run the process end to end and ensure it is secure and cost effective.",
            ],
        })
    }, [model.name, model.description])

    useEffect(() => {
        // @ts-ignore
        const cardFileName = cards[model.model_name]
        axios
            .get(`/model_cards/${cardFileName}`)
            .then(response => setMarkdownContent(response.data))
            .catch(error => console.error("Error fetching markdown content:", error))
    }, [model.model_name])

    var modelRunString = Object.entries(model.apiDeploy)
        // @ts-ignore
        .map(([k, v]) => {
            return (
                "--" +
                v.name +
                "=" +
                v.default +
                ` \\
        `
            )
        })
        // @ts-ignore
        .reduce((mem, x) => mem + x, "")
    modelRunString = modelRunString.trim().slice(0, -1)

    var modelBulkRunString = Object.entries(model.bulkDeploy)
        // @ts-ignore
        .map(([k, v]) => {
            return (
                "--" +
                v.name +
                "=" +
                v.default +
                ` \\
        `
            )
        })
        // @ts-ignore
        .reduce((mem, x) => mem + x, "")
    modelBulkRunString = modelRunString.trim().slice(0, -1)

    return (
        <div className={styles.container}>
            <div className={styles.modelTitle}>
                <Content>
                    <h1>{model.name}</h1>
                </Content>
            </div>
            <div className={styles.content}>
                <Grid columns={10}>
                    <Cell width={7}>
                        <Markdown className={styles.markdown} children={markdownContent} />
                        <Markdown className={styles.markdown}>{`## Using genius CLI

### Install geniusrise

\`\`\`bash
# Maybe in a virtualenv
pip install geniusrise
pip install geniusrise-text
pip install geniusrise-audio
pip install geniusrise-vision
\`\`\`

### Launch API server

\`\`\`bash
genius ${model.apiClass} rise \\
    batch \\
        --input_s3_bucket my-bucket \\
        --input_s3_folder $(date +%Y-%m-%d)/input \\
    batch \\
        --output_s3_bucket my-bucket \\
        --output_s3_folder $(date +%Y-%m-%d)/output \\
    postgres \\
        --postgres_host 127.0.0.1 \\
        --postgres_port 5432 \\
        --postgres_user postgres \\
        --postgres_password postgres \\
        --postgres_database geniusrise\\
        --postgres_table state \\
    listen \\
        --model_name="${model.model_name}" \\
        ${modelRunString}
\`\`\`

### Or execute bulk inference

First copy your files to S3:

\`\`\`bash
aws s3 cp --recursive my_files/ s3://my-bucket/$(date +%Y-%m-%d)/input/
\`\`\`

Then run the job:

\`\`\`bash
genius ${model.apiClass.replace("API", "Bulk")} rise \\
    batch \\
        --input_s3_bucket my-bucket \\
        --input_s3_folder $(date +%Y-%m-%d)/input \\
    batch \\
        --output_s3_bucket my-bucket \\
        --output_s3_folder $(date +%Y-%m-%d)/output \\
    postgres \\
        --postgres_host 127.0.0.1 \\
        --postgres_port 5432 \\
        --postgres_user postgres \\
        --postgres_password postgres \\
        --postgres_database geniusrise\\
        --postgres_table state \\
    listen \\
        --model_name="${model.model_name}" \\
        ${modelBulkRunString}
\`\`\`

For more on how to run locally, refer to [docs.geniusrise.ai](https://docs.geniusrise.ai).
                        `}</Markdown>
                    </Cell>
                    <Cell width={3}>
                        <Grid columns={1} rows={3} className={styles.actions}>
                            <Cell center middle>
                                <Link to={`/model/${model.name}/notebook`}>
                                    <Button>
                                        <Markdown className={styles.markdown}>{`## Notebook

__Preconfigured Jupyter lab__:

Explore the model in a notebook.
`}</Markdown>
                                    </Button>
                                </Link>
                            </Cell>
                            <Cell center middle>
                                <Link to={`/model/${model.name}/bulk`}>
                                    <Button>
                                        <Markdown className={styles.markdown}>{`## Bulk inference

Upload excel, csv, images etc or

Upload to S3 and run the model.`}</Markdown>
                                    </Button>
                                </Link>
                            </Cell>
                            <Cell center middle>
                                <Link to={`/model/${model.name}/api`}>
                                    <Button>
                                        <Markdown className={styles.markdown}>{`## Inference API

**Inference APIs over model**:

Deploy a replica-set in any cloud.`}</Markdown>
                                    </Button>
                                </Link>
                            </Cell>
                        </Grid>
                    </Cell>
                </Grid>
            </div>
        </div>
    )
}

export default Model
