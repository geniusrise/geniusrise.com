import React from "react"
import PropTypes from "prop-types"
import { Cell, Grid } from "styled-css-grid"
import { Config } from "../../config"
import { is4K, l } from "../../utils"

import styles from "./task.module.css"
import { Card, Content } from "react-bulma-components"

function Task(props: Config) {
    const models = props.models
    console.log(props)

    return (
        <div className={styles.container}>
            <Grid columns={is4K ? 8 : l ? 3 : 1} gap="20px" className={styles.taskGrid}>
                {" "}
                {/* Adjust the number of columns and gap as needed */}
                {models.map((model, index) => (
                    <Cell key={index} className={styles.modelCard}>
                        <Card className={styles.card}>
                            <Card.Header className={styles.cardHeader}>
                                <Card.Header.Title>
                                    <Content>
                                        <h2>{model.name}</h2>
                                    </Content>
                                </Card.Header.Title>
                            </Card.Header>
                            <Card.Content className={styles.cardContent}>
                                <Content>
                                    {/* <h2>{model.name}</h2> */}
                                    {/* <div> */}
                                    <strong>Use Cases:</strong>
                                    <ul>
                                        {model.usecases.map((usecase, idx) => (
                                            <li key={idx}>{usecase}</li>
                                        ))}
                                    </ul>
                                    {/* </div> */}
                                </Content>
                            </Card.Content>
                            <Card.Footer className={styles.cardFooter}>
                                <Card.Footer.Item>Explore</Card.Footer.Item>
                                <Card.Footer.Item>Deploy</Card.Footer.Item>
                            </Card.Footer>
                        </Card>
                    </Cell>
                ))}
            </Grid>
        </div>
    )
}

export default Task
