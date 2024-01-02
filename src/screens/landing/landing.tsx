import React, { useState } from 'react'

import styles from "./landing.module.css"
import { Cell, Grid } from 'styled-css-grid'
import logo from "../../assets/logo1.png"
import logoText from "../../assets/geniusrise_text_dark.png"
import { functions } from '../../config/navigation'
import { Link } from 'react-router-dom'
import { Content, Modal } from 'react-bulma-components'
import { device, s, m, xl } from "../../utils/responsive"
import { Authenticator, withAuthenticator } from "@aws-amplify/ui-react"

const Landing = () => {

    const [login, setLogin] = useState(false)

    return (
        <div className={styles.container}>
            <div className={styles.banner}>
                <Grid columns={device === "smartphone" ? 1 : device === "tablet" ? 1 : 10} className={styles.header}>
                    <Cell width={1}></Cell>
                    <Cell width={1} className={styles.logo} center middle><img src={logo}></img></Cell>
                    <Cell width={2} className={styles.logoText} center middle><img src={logoText}></img></Cell>
                    <Cell width={1}></Cell>
                    <Cell width={5} center middle>
                        <Grid columns={device === "smartphone" ? 3 : device === "tablet" ? 3 : 5} className={styles.headerElements}>
                            <Cell width={device === "smartphone" ? 0 : device === "tablet" ? 0 : 2}></Cell>
                            <Cell className={styles.headerElementRegister} center middle><Link to="/login">Sign up</Link></Cell>
                            <Cell className={styles.headerElementRegister} center middle><Link to="/TXTCLASS">Catalog</Link></Cell>
                        </Grid>
                    </Cell>
                </Grid>
                <div>
                </div>
                <div className={styles.heroheaderbanner}>
                    <h1>AI has landed</h1>
                    <h3>Build, experiment, deploy</h3>
                </div>
            </div>
            <div>
                <Grid columns={xl ? 3 : m ? 2 : 1} className={styles.heroTasks}>
                    <Cell className={styles.heroTask}>
                        <Content>
                            <h1>Text</h1>
                            <p>Empower your app with all of human knowledge.</p>
                            <Grid columns={m ? 3 : 2}>
                                {functions.text.map((f: any) => {
                                    return (
                                        <Cell center middle className={styles.gridElement}><Link to={f.function_name}>{f.name}</Link></Cell>
                                    )
                                })}
                                <Cell center middle className={styles.gridElementYour}>Your Model</Cell>
                            </Grid>
                        </Content>
                    </Cell>
                    <Cell className={styles.heroTask}>
                        <Content>
                            <h1>Vision</h1>
                            <p>Make your apps see the world and make sense of it.</p>
                            <Grid columns={m ? 3 : 2}>
                                {functions.vision.map((f: any) => {
                                    return (
                                        <Cell center middle className={styles.gridElement}><Link to="/TXTCLASS">{f.name}</Link></Cell>
                                    )
                                })}
                                <Cell center middle className={styles.gridElementYour}>Your Model</Cell>
                            </Grid>
                        </Content>
                    </Cell>
                    <Cell className={styles.heroTask}>
                        <Content>
                            <h1>Audio</h1>
                            <p>Enable your apps to interact with humans seamlessly.</p>
                            <Grid columns={m ? 3 : 2}>
                                {functions.audio.map((f: any) => {
                                    return (
                                        <Cell center middle className={styles.gridElement}><Link to="/TXTCLASS">{f.name}</Link></Cell>
                                    )
                                })}
                                <Cell center middle className={styles.gridElementYour}>Your Model</Cell>
                            </Grid>
                        </Content>
                    </Cell>
                </Grid>
                <Grid className={styles.heroTasks} columns={1}>
                    <Cell className={styles.heroTask}>
                        <Content>
                            <h1>Data</h1>
                            <p>Get access to various datasets with one click via our data partners.</p>
                            <Grid columns={m ? 3 : 2}>
                                <Cell center middle className={styles.gridElement}>Open datasets</Cell>
                                <Cell center middle className={styles.gridElement}>Premium datasets</Cell>
                                <Cell center middle className={styles.gridElement}>Scraped websites</Cell>
                                <Cell center middle className={styles.gridElement}>Data Connectors</Cell>
                                <Cell center middle className={styles.gridElementYour}>Custom requests</Cell>
                                <Cell center middle className={styles.gridElementYour}>Your Data</Cell>
                            </Grid>
                        </Content>
                    </Cell>
                </Grid>
                <Grid className={styles.heroTasks} columns={1}>
                    <Cell className={styles.heroTask}>
                        <Content>
                            <h1>Compute</h1>
                            <p>Deploy models anywhere.</p>
                            <Grid columns={m ? 3 : 2}>
                                <Cell center middle className={styles.gridElement}>E2E Networks</Cell>
                                <Cell center middle className={styles.gridElement}>Runpod</Cell>
                                <Cell center middle className={styles.gridElement}>AWS</Cell>
                                <Cell center middle className={styles.gridElement}>Azure</Cell>
                                <Cell center middle className={styles.gridElement}>Google Cloud</Cell>
                                <Cell center middle className={styles.gridElementYour}>Your Infrastructure</Cell>
                            </Grid>
                        </Content>
                    </Cell>
                </Grid>
                <Grid className={styles.heroTasks} columns={1}>
                    <Cell className={styles.heroTask}>
                        <Content>
                            <h1>Open Source</h1>
                            <p>Our framework and a large part of our libraries are Open Source.</p>
                            <Grid columns={m ? 3 : 2}>
                                <Cell center middle className={styles.gridElement}><Link to="https://geniusrise.ai" target="_blank" rel="noopener noreferrer">Framework</Link></Cell>
                                <Cell center middle className={styles.gridElement}><Link to="https://docs.geniusrise.ai" target="_blank" rel="noopener noreferrer">Documentation</Link></Cell>
                                <Cell center middle className={styles.gridElement}><Link to="https://github.com/geniusrise" target="_blank" rel="noopener noreferrer">Github</Link></Cell>
                            </Grid>
                        </Content>
                    </Cell>
                </Grid>
                <footer className={styles.footer}>
                    <div className={styles.herofooterbanner}>
                        <h1>The world is yours to build</h1>
                    </div>
                    <Grid columns={3} className={styles.footerGrid}>
                        <Cell center middle><Link to="https://github.com/geniusrise" target="_blank" rel="noopener noreferrer">GitHub</Link></Cell>
                        <Cell center middle><Link to="https://www.crunchbase.com/organization/geniusrise" target="_blank" rel="noopener noreferrer">Crunchbase</Link></Cell>
                        <Cell center middle><Link to="https://in.linkedin.com/company/geniusrise" target="_blank" rel="noopener noreferrer">LinkedIn</Link></Cell>
                        <Cell center middle><Link to="https://docs.geniusrise.ai" target="_blank" rel="noopener noreferrer">Documentation</Link></Cell>
                        <Cell center middle><Link to="https://huggingface.co/geniusrise" target="_blank" rel="noopener noreferrer">Huggingface</Link></Cell>
                        <Cell center middle><Link to="#">Privacy Policy</Link></Cell>
                    </Grid>
                </footer>
            </div>
        </div >
    )
}

export default Landing
