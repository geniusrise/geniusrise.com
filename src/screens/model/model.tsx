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
                                <Button>
                                    <Link to={`/model/${model.name}/api`}>
                                        <Button>
                                            <Markdown className={styles.markdown}>{`## Inference API

**Inference APIs over model**:

Deploy a replica-set in any cloud.`}</Markdown>
                                        </Button>
                                    </Link>
                                </Button>
                            </Cell>
                        </Grid>
                    </Cell>
                </Grid>
            </div>
        </div>
    )
}

export default Model
