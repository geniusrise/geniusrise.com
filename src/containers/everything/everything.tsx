import React, { useState, useEffect } from "react"
import { Grid, Cell } from "styled-css-grid"
import { Routes, Route } from "react-router-dom"

import styles from "./everything.module.css"
import "bulma/css/bulma.min.css"
import { Modal, Form } from "react-bulma-components"
import { device, is4K } from "../../utils"

import { Auth } from "aws-amplify"
import Sidebar from "../sidebar/sidebar"
import { Support } from "../../support/support"
import { functions } from "../../config/navigation"
import { config } from "../../config"
import Task from "../../screens/task/task"
import Model from "../../screens/model/model"
import Bulk from "../../screens/bulk/bulk"
import FineTune from "../../screens/fineTune/fineTune"
import API from "../../screens/api/api"
import { Dashboard } from "../../screens/dashboard/dashboard"
import Landing from "../../screens/landing/landing"
import Login from "../../screens/login/login"
import Notebook from "../../screens/notebook/notebook"
import style from "react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark"
// import { Autocomplete } from "../../components/autocomplete/autocomplete"

const Everything = () => {
    const [search, setSearch] = useState(false)

    const SearchModal = () => {
        const [value, setValue] = useState("Type something...")

        return (
            <Modal show={search} onClose={() => setSearch(false)}>
                <Modal.Content className={styles.searchModalContent}>
                    <div className={styles.searchbar}></div>
                </Modal.Content>
            </Modal>
        )
    }

    // TODO: ctrl-k menu
    // useEffect(() => {
    //   document.addEventListener("keydown", event => {
    //     if ((event.key === "k" && event.ctrlKey) || (event.key === "k" && event.ctrlKey && event.shiftKey)) {
    //       event.preventDefault()
    //       setSearch(true)
    //     }
    //   })
    //   return () => {}
    // }, [])

    let [loggedIn, setLoggedIn] = useState(false)
    useEffect(() => {
        try {
            Auth.currentAuthenticatedUser()
                .then(x => setLoggedIn(true))
                .catch(x => setLoggedIn(false))
        } catch {
            setLoggedIn(false)
        }
    }, [])

    const [fullWidth, setFullWidth] = useState(styles.fullWidth)

    return (
        <div className={styles.everything}>
            <div className={styles.something}>
                {/* {loggedIn ? <Sidebar></Sidebar> : <></>} */}
                <Sidebar></Sidebar>
                <Grid>
                    <Cell className={fullWidth}>
                        <Routes>
                            <Route key="/" path="/" element={loggedIn ? <Dashboard /> : <Landing />} />
                            <Route key="/login" path="/login" element={loggedIn ? <Dashboard /> : <Login />} />
                            {Object.entries(config).map(([taskKey, taskConfig], index) => (
                                <Route key={index} path={`/${taskKey}`} element={<Task props={taskConfig} wide={fullWidth === styles.fullWidth} />} />
                            ))}
                            {Object.entries(config).map(([taskKey, taskConfig], index) =>
                                taskConfig.models.map((model, index) => (
                                    <Route key={index} path={`/model/${model.name}/bulk`} element={<Bulk model={model} />} />
                                ))
                            )}
                            {Object.entries(config).map(([taskKey, taskConfig], index) =>
                                taskConfig.models.map((model, index) => (
                                    <Route key={index} path={`/model/${model.name}/api`} element={<API model={model} />} />
                                ))
                            )}
                            {Object.entries(config).map(([taskKey, taskConfig], index) =>
                                taskConfig.models.map((model, index) => (
                                    <Route key={index} path={`/model/${model.name}/notebook`} element={<Notebook model={model} />} />
                                ))
                            )}
                            {Object.entries(config).map(([taskKey, taskConfig], index) => (
                                <Route key={index} path={`/model/${taskConfig.short_name}/fine_tune`} element={<FineTune task={taskConfig} />} />
                            ))}
                            {Object.entries(config).map(([taskKey, taskConfig], index) =>
                                taskConfig.models.map((model, index) => (
                                    <Route key={index} path={`/model/${model.name}`} element={<Model model={model} />} />
                                ))
                            )}
                        </Routes>
                    </Cell>
                </Grid>
                {/* {loggedIn ? <Support></Support> : <></>} */}
                {/* <Support
                    widthCallback={(hide: boolean) => {
                        if (hide) {
                            setFullWidth(styles.content)
                        } else {
                            setFullWidth(styles.fullWidth)
                        }
                    }}
                ></Support> */}
                <SearchModal></SearchModal>
            </div>
        </div>
    )
}

export default Everything
