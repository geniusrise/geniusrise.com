// @ts-nocheck
import React, { useEffect, useState, useContext } from "react"
import PropTypes from "prop-types"

import styles from "./dashboard.module.css"
import moment from "moment"
import { Cell, Grid } from "styled-css-grid"
import { Button, Card, Content } from "react-bulma-components"
import { deleteService, listServices, getServiceMetrics } from "../../data/service"
import { SupportContentContext } from "../../support/support"
import { listJobs } from "../../data/job"

interface Props { }

function Dashboard(props: Props) {

    const [services, setServices] = useState([])
    const [update, setUpdate] = useState(1)
    // const [metrics, setMetrics] = useState([])

    const { setSupportContent } = useContext(SupportContentContext)

    useEffect(() => {
        setSupportContent({
            heading: "Dashboard",
            content: "This dashboard provides an overview of all active pods. You can view essential details about each pod, including its name, task name, size, type, IP address, number of replicas, and launch time. Manage your pods effectively by deleting any that are no longer needed.",
            examples: null,
            useCases: null,
        })
    }, [])

    useEffect(() => {
        if (services.length === 0) {
            listServices().then((x) => {
                const svcs = x.data.filter(x => !x.is_deleted).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                setServices(svcs)

                // svcs.map(s => getServiceMetrics(s.uuid).then(x => {
                //     if (x !== null) setMetrics(metrics + x.data)
                // }))

                listJobs().then(x => {
                    const jobs = x.data.filter(x => !x.is_deleted).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    setServices(svcs => svcs.concat(jobs))
                })
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
                        <Grid columns={15}>
                            <Cell width={3} center middle>Task Name</Cell>
                            <Cell center middle>Task Type</Cell>
                            <Cell width={2} center middle>Cloud</Cell>
                            <Cell center middle>Pod Size</Cell>
                            <Cell width={2} center middle>Pod Type</Cell>
                            <Cell width={2} center middle>IP Address</Cell>
                            <Cell center middle>Replicas</Cell>
                            <Cell width={2} center middle>Launched At</Cell>
                            <Cell center middle>Delete</Cell>
                        </Grid>
                    </Cell>
                    {services.map(s => {
                        const uniqueName = s.name.split("--")[1]
                        const taskName = (s.name.split("--")[2] || "").replaceAll("-", " ")
                        var taskType = (s.name.split("--")[0] || "").replaceAll("genius", "")
                        taskType = taskType ? taskType.toUpperCase() : "API"

                        return (
                            <Cell className={styles.servicesList}>
                                <Grid columns={15}>
                                    <Cell width={3} middle>{taskName}</Cell>
                                    <Cell center middle>{taskType}</Cell>
                                    <Cell width={2} center middle>{s.cloud.replaceAll("-", " ")}</Cell>
                                    <Cell center middle>{s.pod_size}</Cell>
                                    <Cell width={2} center middle>{s.class_name}</Cell>
                                    <Cell width={2} center middle>{s.cluster_ip}</Cell>
                                    <Cell center middle>{s.replicas || "1"}</Cell>
                                    <Cell width={2} center middle>{moment(s.created_at).fromNow()}</Cell>
                                    <Cell center middle><Button disabled={taskType !== "API"} onClick={() => {
                                        deleteService({ identifier: s.uuid, cloud: s.cloud }).then(x => {
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
