/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { Button, Tabs } from "react-bulma-components"
import { Grid, Cell } from "styled-css-grid"

import { device, is4K } from "../../utils"
import logo from "../../assets/logo.png"
import styles from "./sidebar.module.css"
import { functions } from "../../config/navigation"
import { Auth } from 'aws-amplify';
import dark from "../../themes/dark"
import light from "../../themes/light"
import darkBlue from "../../themes/darkBlue"
import purple from "../../themes/purple"
import darkBlueN from "../../themes/darkBlueN"
import purpleN from "../../themes/purpleN"
import { getUser, updateUser } from "../../data/user"

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
    const [theme, setTheme] = useState(2)
    const [prevtheme, setPrevTheme] = useState(2)
    useTheme(theme)

    const [activeTab, setActiveTab] = useState("text") // Default tab is 'text'

    useEffect(() => {
        if (theme !== prevtheme) {
            try {
                // @ts-ignore
                updateUser(globalThis.user.username, { frontend_config: { "theme": theme } })
            } catch (error) { }
        }
    }, [theme])

    useEffect(() => {
        try {
            // @ts-ignore
            getUser(globalThis.user.username).then(u => {
                // @ts-ignore
                setPrevTheme(parseInt(u.data.frontend_config.theme))
                // @ts-ignore
                setTheme(parseInt(u.data.frontend_config.theme))
            })
        } catch (error) { }

    }, [globalThis.user])


    const renderFunctions = (category: string) => {
        return (
            <Grid columns={device === "smartphone" ? 1 : 2}>
                {functions[category].map((d: any) => {
                    return (
                        <Cell center middle>
                            <Link className={styles.sidebarLink} to={d.enabled ? d.link : "#"}>
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
                            <Link to="/" onClick={() => Auth.signOut()}>Logout</Link>
                        </div>
                    </Cell>
                    <Cell center middle>
                        <div className={styles.themeSwitcher}>
                            <Link to="/account">Account</Link>
                        </div>
                    </Cell>
                    <Cell center middle>
                        <div className={styles.themeSwitcher}>
                            <Link to="/billing">Billing</Link>
                        </div>
                    </Cell>
                    <Cell center middle>
                        <div className={styles.themeSwitcher} onClick={() => setTheme(theme < 5 ? theme + 1 : 0)}>
                            <p>Theme</p>
                        </div>
                    </Cell>
                </Grid>
            </div>
        </div>
    )
}

export default Sidebar
