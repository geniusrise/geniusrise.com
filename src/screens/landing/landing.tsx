import React from 'react'

import styles from "./landing.module.css"
import { Cell, Grid } from 'styled-css-grid'
import logo from "../../assets/logo1.png"
import logoText from "../../assets/geniusrise_text_dark.png"
import { functions } from '../../config/navigation'
import { Link } from 'react-router-dom'
import { Content } from 'react-bulma-components'
import { device } from "../../utils/responsive"

const Landing = () => {


    return (
        <div className={styles.container}>
            <Grid columns={device === "smartphone" ? 1 : device === "tablet" ? 1 : 10} className={styles.header}>
                <Cell width={1}></Cell>
                <Cell width={1} className={styles.logo} center middle><img src={logo}></img></Cell>
                <Cell width={2} className={styles.logoText} center middle><img src={logoText}></img></Cell>
                <Cell width={1}></Cell>
                <Cell width={5} center middle>
                    <Grid columns={device === "smartphone" ? 3 : device === "tablet" ? 3 : 5} className={styles.headerElements}>
                        <Cell width={device === "smartphone" ? 0 : device === "tablet" ? 0 : 3}></Cell>
                        {/* <Cell className={styles.headerElement} center middle>Models</Cell>
                        <Cell className={styles.headerElement} center middle>Data</Cell>
                        <Cell className={styles.headerElement} center middle>Compute</Cell> */}
                        <Cell className={styles.headerElementRegister} center middle><Link to="/TXTCLASS">Console</Link></Cell>
                    </Grid>
                </Cell>
            </Grid>
            <div>
                <div className={styles.heroheaderbanner}>
                    <h1>Build, experiment, deploy AI everywhere.</h1>
                </div>
                <Grid columns={device === "smartphone" ? 1 : device === "tablet" ? 1 : 3} className={styles.heroTasks}>
                    <Cell className={styles.heroTask}>
                        <Content>
                            <h1>Text</h1>
                            <p>Empower your app with all of human knowledge.</p>
                            <Grid columns={device === "smartphone" ? 2 : device === "tablet" ? 3 : 3}>
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
                            <Grid columns={device === "smartphone" ? 2 : device === "tablet" ? 3 : 3}>
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
                            <Grid columns={device === "smartphone" ? 2 : device === "tablet" ? 3 : 3}>
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
                            <Grid columns={device === "smartphone" ? 2 : device === "tablet" ? 3 : 3}>
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
                            <Grid columns={device === "smartphone" ? 2 : device === "tablet" ? 3 : 3}>
                                <Cell center middle className={styles.gridElement}>E2E Networks</Cell>
                                <Cell center middle className={styles.gridElement}>Runpod</Cell>
                                <Cell center middle className={styles.gridElement}>AWS</Cell>
                                <Cell center middle className={styles.gridElement}>Azure</Cell>
                                <Cell center middle className={styles.gridElement}>Google Cloud</Cell>
                                <Cell center middle className={styles.gridElementYour}>Your kubernetes</Cell>
                            </Grid>
                        </Content>
                    </Cell>
                </Grid>
                <div className={styles.herofooterbanner}>
                    <h1>What Will You Build?</h1>
                </div>
            </div>
        </div>
    )
}

export default Landing
