// @ts-nocheck
import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"

import styles from "./dashboard.module.css"
import moment from "moment"
import { Cell, Grid } from "styled-css-grid"
import { Button, Card, Content } from "react-bulma-components"
import { deleteService, listServices, getServiceMetrics } from "../../data/service"

interface Props { }

function Dashboard(props: Props) {

    const [services, setServices] = useState([])
    const [update, setUpdate] = useState(1)
    // const [metrics, setMetrics] = useState([])


    useEffect(() => {
        if (services.length === 0) {
            listServices().then((x) => {
                const svcs = x.data.filter(x => !x.is_deleted).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                console.log(svcs)
                setServices(svcs)

                // svcs.map(s => getServiceMetrics(s.uuid).then(x => {
                //     if (x !== null) setMetrics(metrics + x.data)
                // }))
            })
        }
    }, [update])

    return <div className={styles.container}>
        <Card className={styles.card}>
            <div className={styles.cardHeader}>
                <h4>Pods</h4>
            </div>
            <Card.Content className={styles.cardContent}>
                <Grid columns={1}>
                    <Cell className={styles.servicesHeader}>
                        <Grid columns={13}>
                            <Cell width={2} center middle>Name</Cell>
                            <Cell width={2} center middle>Task Name</Cell>
                            <Cell center middle>Pod Size</Cell>
                            <Cell width={2} center middle>Pod Type</Cell>
                            <Cell width={2} center middle>IP Address</Cell>
                            <Cell center middle>Replicas</Cell>
                            <Cell width={2} center middle>Launched At</Cell>
                            <Cell center middle>Delete</Cell>
                        </Grid>
                    </Cell>
                    {services.map(s => {
                        return (
                            <Cell className={styles.servicesList}>
                                <Grid columns={13}>
                                    <Cell width={2} center middle>{s.name.split("--")[1]}</Cell>
                                    <Cell width={2} center middle>{(s.name.split("--")[2] || "").replaceAll("-", " ")}</Cell>
                                    <Cell center middle>{s.pod_size}</Cell>
                                    <Cell width={2} center middle>{s.class_name}</Cell>
                                    <Cell width={2} center middle>{s.cluster_ip || "0.0.0.0"}</Cell>
                                    <Cell center middle>{s.replicas || "1"}</Cell>
                                    <Cell width={2} center middle>{moment(s.created_at).format("lll")}</Cell>
                                    <Cell center middle><Button onClick={() => {
                                        console.log(s)
                                        deleteService({ identifier: s.uuid }).then(x => {
                                            setServices([])
                                            setUpdate(update + 1)
                                        })
                                    }}>Delete</Button></Cell>
                                </Grid>
                            </Cell>
                        )
                    })}
                </Grid>
            </Card.Content>
        </Card>
        {/* <Grid columns={2}>
            <Card className={styles.card}>
                <div className={styles.cardHeader}>
                    <h4>CPU</h4>
                </div>
            </Card>
            <Card className={styles.card}>
                <div className={styles.cardHeader}>
                    <h4>Memory</h4>
                </div>
            </Card>
        </Grid> */}
    </div >
}

export { Dashboard }
export type { Props }
