import React, { useState } from "react"
import { taskConfig } from "../../config"

import styles from "./settings.module.css"
import { Cell, Grid } from "styled-css-grid"
import { Button, Content } from "react-bulma-components"

interface Props {
    taskType: string
    callback: (obj: any) => void
    visible: boolean
}

// Type guard to check if 'type' property exists
function hasTypeField(value: any): value is { type: string | string[]; default?: any; items?: any } {
    return value.hasOwnProperty("type")
}

function toTitleCase(input: string): string {
    return input
        .split("_") // Split by underscore
        .map(
            part =>
                part
                    .toLowerCase() // Convert to lower case
                    .replace(/^\w/, c => c.toUpperCase()) // Capitalize the first letter
        )
        .join(" ") // Join the parts with spaces
}

const Settings: React.FC<Props> = ({ taskType, callback, visible }) => {
    // const [formState, setFormState] = useState<any>({})
    // const config = taskType === "api" ? taskConfig.api : taskType === "bulk" ? taskConfig.bulk : taskConfig.fine_tune

    const buildInitialState = (properties: any) => {
        const state: any = {}
        Object.entries(properties).forEach(([key, value]) => {
            if (hasTypeField(value) && value.hasOwnProperty("default")) {
                // If the default value is an object, use JSON.stringify to convert it to a string
                state[key] = typeof value.default === "object" ? JSON.stringify(value.default, null, 2) : value.default
            }
        })
        return state
    }

    const config = taskType === "api" ? taskConfig.api : taskType === "bulk" ? taskConfig.bulk : taskConfig.fine_tune
    const [formState, setFormState] = useState<any>(buildInitialState(config.properties))

    const handleChange = (key: string, value: any) => {
        setFormState((prevState: any) => ({
            ...prevState,
            [key]: value,
        }))
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        console.log(formState)
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
                    {Object.entries(config.properties).map(([key, value]) => {
                        if (!hasTypeField(value)) {
                            console.warn(`Skipping field '${key}' due to incompatible type.`)
                            return null // Skip rendering this field
                        }

                        const inputType = Array.isArray(value.type)
                            ? value.type.includes("boolean")
                                ? "checkbox"
                                : "text"
                            : value.type === "boolean"
                            ? "checkbox"
                            : value.type === "integer"
                            ? "number"
                            : "text"

                        const inputTypeClass =
                            inputType === "checkbox" ? styles.checkboxInput : inputType === "number" ? styles.numberInput : styles.textInput

                        return (
                            <Cell key={key} className={styles.formElement} center>
                                <label>
                                    {toTitleCase(key)}
                                    {inputType === "checkbox" ? (
                                        <input
                                            type={inputType}
                                            className={inputTypeClass}
                                            checked={formState[key]}
                                            onChange={e => handleChange(key, e.target.checked)}
                                        />
                                    ) : (
                                        <input
                                            type={inputType}
                                            className={inputTypeClass}
                                            value={formState[key] || ""}
                                            onChange={e => handleChange(key, e.target.value)}
                                        />
                                    )}
                                </label>
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

export default Settings
