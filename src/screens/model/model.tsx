import React from "react"
import { Button, Card, Container, Content, Form } from "react-bulma-components"
import { Model as ModelType } from "../../config"

import styles from "./model.module.css"
import { Cell, Grid } from "styled-css-grid"
import { l, xl } from "../../utils"

interface Props {
    model: ModelType
}

function Model({ model }: Props) {
    return (
        <div className={styles.container}>
            <div className={styles.modelTitle}>
                <Content>
                    <h1>{model.name}</h1>
                </Content>
            </div>
            <div className={styles.content}>
                <Content>
                    <p>{model.description}</p>
                    <div className={styles.modelName}>
                        {model.model_name}
                        <span>📋</span>
                    </div>
                </Content>
                <Grid columns={xl ? 2 : 1}>
                    <Cell height={2} className={styles.tryForm}>
                        <Form.Textarea placeholder="Enter text here"></Form.Textarea>
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
                            <strong>Examples:</strong>
                            <ul>
                                {model.examples.map((example, idx) => (
                                    <li key={idx}>{example}</li>
                                ))}
                            </ul>
                        </Content>
                    </Cell>
                    <Cell>
                        <Content className={styles.usecases}>
                            <strong>Use Cases:</strong>
                            <ul>
                                {model.usecases.map((usecase, idx) => (
                                    <li key={idx}>{usecase}</li>
                                ))}
                            </ul>
                        </Content>
                    </Cell>
                </Grid>
            </div>
        </div>
    )
}

export default Model
