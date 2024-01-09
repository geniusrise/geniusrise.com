import React, { useContext, useEffect } from "react"
import { Button, Card, Container, Content, Form } from "react-bulma-components"
import { Model as ModelType } from "../../config"

import styles from "./model.module.css"
import { Cell, Grid } from "styled-css-grid"
import { l, xl } from "../../utils"
import { type } from "os"
import { Link } from "react-router-dom"
import { SupportContentContext } from "../../support/support"

import banners from "../../data/banners.json"

interface Props {
    model: ModelType
}

const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * banners.length)
    return banners[randomIndex]
}

function Model({ model }: Props) {
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

    return (
        <div className={styles.container}>
            <div
                className={styles.headerImage}
                style={{ backgroundImage: `url(../vector-autumn-foliage-banner/${getRandomImage()})`, backgroundSize: "cover" }}
            ></div>
            <div className={styles.modelTitle}>
                <Content>
                    <h1>{model.name}</h1>
                </Content>
            </div>
            <div className={styles.content}>
                <Grid columns={10}>
                    <Cell width={10}>
                        <Content>
                            <p>{model.description}</p>
                            {/* <div className={styles.modelName}>
                                <Grid columns={20}>
                                    <Cell width={19} center middle>
                                        <p>{model.model_name}</p>
                                    </Cell>
                                    <Cell width={1} center middle>
                                        <span>📋</span>
                                    </Cell>
                                </Grid>
                            </div> */}
                        </Content>
                    </Cell>
                </Grid>
                <Grid columns={xl ? 2 : 1}>
                    <Cell height={2} className={styles.tryForm}>
                        <h2>Try it out</h2>
                        {model.inputs.map((input: { name: string; type: string }) => {
                            if (input.type === "text") return <Form.Textarea placeholder={`Enter ${input.name} here`}></Form.Textarea>
                        })}
                        <Form.Control className={styles.tryFormButton}>
                            <Button>Submit</Button>
                        </Form.Control>
                        <Content className={styles.tryFormContent}>
                            <h3>Response</h3>
                            <code></code>
                        </Content>
                    </Cell>
                    <Cell>
                        <Content className={styles.examples}>
                            <strong>Example Tasks:</strong>
                            <ul>
                                {model.examples.map((example, idx) => (
                                    <li key={idx}>{example}</li>
                                ))}
                                {model.usecases.map((usecase, idx) => (
                                    <li key={idx}>{usecase}</li>
                                ))}
                            </ul>
                        </Content>
                    </Cell>
                    {/* <Cell>
                        <Content className={styles.usecases}>
                            <strong>Use Cases:</strong>
                            <ul>
                                {model.usecases.map((usecase, idx) => (
                                    <li key={idx}>{usecase}</li>
                                ))}
                            </ul>
                        </Content>
                    </Cell> */}
                </Grid>
                <Grid columns={2} className={styles.actions}>
                    <Cell center middle>
                        <Button>
                            <Link to={`/model/${model.name}/bulk`}>One-time Bulk Job</Link>
                        </Button>
                    </Cell>
                    <Cell center middle>
                        <Button>
                            <Link to={`/model/${model.name}/api`}>Deploy API on autoscale</Link>
                        </Button>
                    </Cell>
                </Grid>
            </div>
        </div>
    )
}

export default Model
