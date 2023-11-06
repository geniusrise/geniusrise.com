/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react"
import { Link } from "react-router-dom"

import { Button, Tabs } from "react-bulma-components"
import { Grid, Cell } from "styled-css-grid"

import { device, is4K } from "../../utils"
import logo from "../../assets/logo.png"
import styles from "./sidebar.module.css"
import { functions } from "../../config/navigation"

import dark from "../../themes/dark"
import light from "../../themes/light"
import darkBlue from "../../themes/darkBlue"
import purple from "../../themes/purple"
import darkBlueN from "../../themes/darkBlueN"
import purpleN from "../../themes/purpleN"

function useTheme(theme: number) {
    var t: any = darkBlue
    if (theme === 0) {
        t = darkBlue
    } else if (theme === 1) {
        t = light
    } else if (theme === 2) {
        t = dark
    } else if (theme === 3) {
        t = purple
    } else if (theme === 4) {
        t = darkBlueN
    } else if (theme === 5) {
        t = purpleN
    }

    for (const key in t) {
        // Update css variables in document's root element
        document.documentElement.style.setProperty(`--${key}`, t[key])
    }
}

const Sidebar = () => {
    const [theme, setTheme] = useState(3)
    useTheme(theme)

    const [activeTab, setActiveTab] = useState("text") // Default tab is 'text'

    const renderFunctions = (category: string) => {
        return (
            <Grid columns={device === "smartphone" ? 1 : 2}>
                {functions[category].map((d: any) => {
                    return (
                        <Cell center middle>
                            <Link className={styles.sidebarLink} to={d.link}>
                                {d.function_name}
                                {device === "smartphone" ? (
                                    <></>
                                ) : device === "tablet" ? (
                                    <></>
                                ) : device === "desktop" && is4K ? (
                                    <div className={styles.sidebarLinkName}>{d.name}</div>
                                ) : (
                                    <div className={styles.sidebarLinkName}>{d.name}</div>
                                )}
                            </Link>
                        </Cell>
                    )
                })}
            </Grid>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <div className={styles.logo}>
                    <img src={logo} alt="logo"></img>
                </div>
                <Grid columns={1}>
                    <Cell center middle>
                        <Link className={styles.commonLinks} to="/">
                            Dashboard <span className={styles.rightAlign}>🢧</span>
                        </Link>
                    </Cell>
                </Grid>
                <div className={styles.tabs}>
                    <Grid className={styles.tabGrid} columns={3}>
                        <Cell onClick={() => setActiveTab("text")} className={activeTab === "text" ? styles.activeTab : ""} center middle>
                            Text
                        </Cell>
                        <Cell onClick={() => setActiveTab("vision")} className={activeTab === "vision" ? styles.activeTab : ""} center middle>
                            Vision
                        </Cell>
                        <Cell onClick={() => setActiveTab("audio")} className={activeTab === "audio" ? styles.activeTab : ""} center middle>
                            Audio
                        </Cell>
                    </Grid>
                    {renderFunctions(activeTab)}
                </div>
                <Grid columns={4} className={styles.footer}>
                    <Cell center middle>
                        <div className={styles.themeSwitcher}>
                            <Link to="/logout">🔴</Link>
                        </div>
                        <p>Logout</p>
                    </Cell>
                    <Cell center middle>
                        <div className={styles.themeSwitcher}>
                            <Link to="/account">🤠</Link>
                        </div>
                        <p>Account</p>
                    </Cell>
                    <Cell center middle>
                        <div className={styles.themeSwitcher}>
                            <Link to="/billing">💵</Link>
                        </div>
                        <p>Billing</p>
                    </Cell>
                    <Cell center middle>
                        <div className={styles.themeSwitcher} onClick={() => setTheme(theme < 5 ? theme + 1 : 0)}>
                            <p>🖌️</p>
                        </div>
                        <p>Theme</p>
                    </Cell>
                </Grid>
            </div>
        </div>
    )
}

export default Sidebar
