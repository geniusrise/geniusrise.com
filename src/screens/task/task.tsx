import React, { useCallback, useContext, useEffect } from "react"
import PropTypes from "prop-types"
import { Cell, Grid } from "styled-css-grid"
import { Config, Model } from "../../config"
import { is4K, l, xl } from "../../utils"
import { useState } from "react"

import styles from "./task.module.css"
import { Button, Card, Content, Form } from "react-bulma-components"
import { Link } from "react-router-dom"
import { SupportContentContext } from "../../support/support"

import banners from "../../data/banners.json"

const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * banners.length)
    return banners[randomIndex]
}

function Task(props: Config) {
    const models: Model[] = props.models
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredList, setFilteredList] = useState<Model[]>(models)

    const { setSupportContent } = useContext(SupportContentContext)

    useEffect(() => {
        setSupportContent({
            heading: props.long_name,
            content: props.description,
            examples: props.examples,
            useCases: props.usecases,
        })
    }, [props.long_name, props.description, setSupportContent])

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
            <Grid columns={is4K ? 8 : xl ? 3 : 1} gap="20px" className={styles.taskGrid}>
                {" "}
                {/* Adjust the number of columns and gap as needed */}
                {filteredList.map((model, index) => {
                    const bgImage = getRandomImage()

                    return (
                        <Cell key={index} className={styles.modelCard}>
                            <Link to={`/model/${model.name}`}>
                                <Card className={styles.card}>
                                    <Card.Header
                                        className={styles.cardHeader}
                                        style={{ backgroundImage: `url(vector-autumn-foliage-banner/${bgImage})`, backgroundSize: "cover" }}
                                    >
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
                                    <Card.Footer
                                        className={styles.cardFooter}
                                        style={{ backgroundImage: `url(vector-autumn-foliage-banner/${bgImage})`, backgroundSize: "cover" }}
                                    ></Card.Footer>
                                </Card>
                            </Link>
                        </Cell>
                    )
                })}
            </Grid>
        </div>
    )
}

export default Task
