import React, { useState, createContext, useContext, ReactNode } from "react"
import { Button, Content } from "react-bulma-components"
import styles from "./support.module.css"
import { Link } from "react-router-dom"

type SupportContent = {
    heading: string
    content: string
    examples?: string[]
    useCases?: string[]
    examplesTitle?: string
    usecasesTitle?: string
}

type SupportContentContextType = {
    supportContent: SupportContent
    setSupportContent: (content: SupportContent) => void
}

const defaultSupportContent: SupportContent = {
    heading: "Support",
    content: "Hello! 👋",
    examples: [],
    examplesTitle: "",
    useCases: [],
    usecasesTitle: ""
}

const defaultContextValue: SupportContentContextType = {
    supportContent: defaultSupportContent,
    setSupportContent: () => { },
}

const SupportContentContext = createContext<SupportContentContextType>(defaultContextValue)

type SupportContentProviderProps = {
    children: ReactNode
}

const SupportContentProvider: React.FC<SupportContentProviderProps> = ({ children }) => {
    const [supportContent, setSupportContent] = useState<SupportContent>(defaultSupportContent)

    return <SupportContentContext.Provider value={{ supportContent, setSupportContent }}>{children}</SupportContentContext.Provider>
}

const Support = () => {
    const { supportContent } = useContext(SupportContentContext)

    return (
        <div className={styles.container}>
            <div className={styles.supportContent}>
                <Content className={styles.content}>
                    <h1>{supportContent.heading}</h1>
                    <p>{supportContent.content}</p>
                    {supportContent.examples ? <h2>{supportContent.examplesTitle ? supportContent.examplesTitle : "Examples"}</h2> : <></>}
                    <ul>
                        {supportContent.examples?.map((example, index) => (
                            <li key={index}>{example}</li>
                        ))}
                    </ul>
                    {supportContent.useCases ? <h2>{supportContent.usecasesTitle ? supportContent.usecasesTitle : "Use Cases"}</h2> : <></>}
                    <ul>
                        {supportContent.useCases?.map((useCase, index) => (
                            <li key={index}>{useCase}</li>
                        ))}
                    </ul>
                </Content>
                <Button className={styles.docs}><Link to="https://docs.geniusrise.ai" target="_blank" rel="noopener noreferrer">Documentation</Link></Button>
            </div>
        </div>
    )
}

export { Support, SupportContentContext, SupportContentProvider }
