import React, { useCallback, useEffect } from "react"
import PropTypes from "prop-types"
import { Cell, Grid } from "styled-css-grid"
import { Config, Model } from "../../config"
import { is4K, l } from "../../utils"
import { useState } from "react"

import styles from "./task.module.css"
import { Button, Card, Content, Form } from "react-bulma-components"

function Task(props: Config) {
    const models: Model[] = props.models
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredList, setFilteredList] = useState<Model[]>(models)

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredList(models)
        } else {
            const searchTerms = searchTerm.toLowerCase().split(" ")
            setFilteredList(models.filter(model => searchTerms.every(term => model.name.toLowerCase().includes(term))))
        }
    }, [searchTerm, models])

    const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value)
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.searchContainer}>
                <Form.Input value={searchTerm} onChange={handleSearchChange} className={styles.searchInput} placeholder="Search models..." />
            </div>
            <Grid columns={is4K ? 8 : l ? 3 : 1} gap="20px" className={styles.taskGrid}>
                {" "}
                {/* Adjust the number of columns and gap as needed */}
                {filteredList.map((model, index) => (
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
