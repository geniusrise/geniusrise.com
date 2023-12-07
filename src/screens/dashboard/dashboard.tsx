import React from "react"
import PropTypes from "prop-types"

import styles from "./dashboard.module.css"

interface Props {}

function Dashboard(props: Props) {
    return <div className={styles.container}>Dashboard</div>
}

export { Dashboard }
export type { Props }
