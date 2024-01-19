import React, { useState } from "react"
// import { taskConfig } from "../../config"

import styles from "./settings.module.css"
import { Cell, Grid } from "styled-css-grid"
import { Button, Content } from "react-bulma-components"
import Markdown from "react-markdown";

interface Model {
    apiDeploy: any;
    bulkDeploy: any;
}

interface Props {
    config: object
    callback: (obj: any) => void
    visible: boolean
}

function hasTypeField(value: any): value is { type: string; default?: any; description?: string; possible?: any[] } {
    return value.hasOwnProperty("type")
}

function toTitleCase(input: string): string {
    return input
        .split("_")
        .map(part => part.toLowerCase().replace(/^\w/, c => c.toUpperCase()))
        .join(" ")
}

const buildInitialState = (properties: any) => {
    const state: any = {}
    Object.entries(properties).forEach(([key, value]) => {
        if (hasTypeField(value) && value.hasOwnProperty("default")) {
            // @ts-ignore
            state[value.name] = typeof value.default === "object" && value.default !== null ? JSON.stringify(value.default, null, 2) : value.default
        }
    })
    return state
}

const Settings: React.FC<Props> = ({ config, callback, visible }) => {

    const [formState, setFormState] = useState<any>(buildInitialState(config))

    const handleChange = (key: string, value: any) => {
        setFormState((prevState: any) => ({
            ...prevState,
            [key]: value,
        }))
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        callback(formState)
    }

    return (
        <div className={styles.container} hidden={!visible}>
            <Grid columns={1}>
                <Cell middle>
                    <Content className={styles.contentHeading}>
                        <h2>Settings</h2>
                        The default settings reflect the best known parameters. Tweak them only if you know what you are doing.
                    </Content>
                </Cell>
            </Grid>
            <form onSubmit={handleSubmit}>
                <Grid columns={2} className={styles.form}>
                    {Object.entries(config).map(([key, value]) => {
                        // @ts-ignore
                        const inputType = value.type === "boolean" ? "checkbox"
                            // @ts-ignore
                            : value.type === "integer" ? "number"
                                : "text"

                        // @ts-ignore
                        const isDropDown = value.possible && Array.isArray(value.possible)

                        const inputTypeClass = inputType === "checkbox" ? styles.checkboxInput
                            : inputType === "number" ? styles.numberInput
                                : styles.textInput

                        // @ts-ignore
                        const formKey = value.name
                        return (
                            <Cell key={formKey} className={styles.formElement} center>
                                <label>
                                    {toTitleCase(formKey)}
                                </label>
                                <div className={styles.description}>
                                    <Markdown className={styles.markdown}>
                                        {value.description.toString()}
                                    </Markdown>
                                </div>
                                {isDropDown ? (
                                    <select
                                        className={styles.selectInput}
                                        value={formState[formKey]}
                                        onChange={e => handleChange(formKey, e.target.value)}
                                    >
                                        {
                                            // @ts-ignore
                                            value.possible.map((option: any) => (
                                                <option key={option} value={option}>
                                                    {option.toString()}
                                                </option>
                                            ))}
                                    </select>
                                ) : inputType === "checkbox" ? (
                                    <input
                                        type={inputType}
                                        className={inputTypeClass}
                                        checked={formState[formKey]}
                                        onChange={e => handleChange(formKey, e.target.checked)}
                                    />
                                ) : (
                                    <input
                                        type={inputType}
                                        className={inputTypeClass}
                                        value={formState[formKey]}
                                        onChange={e => handleChange(formKey, e.target.value)}
                                    />
                                )}
                            </Cell>
                        )
                    })}
                </Grid>
                <Button type="submit" className={styles.submitButton}>
                    Save Settings
                </Button>
            </form>
        </div>
    )
}

export { Settings, buildInitialState }
