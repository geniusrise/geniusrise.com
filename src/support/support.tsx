import { Button, Content } from "react-bulma-components"
import styles from "./support.module.css"

const Support = () => {
  return (
    <div className={styles.container}>
      <div className={styles.supportContent}>
        <div className={styles.supportHeader}>
          <h1>SUPPORT</h1>
        </div>
        <Content className={styles.content}> Hello! 👋</Content>
        <Button onSubmit={(x: any) => console.log(x)} className={styles.openTicket}>
          Open a ticket
        </Button>
      </div>
    </div>
  )
}

export { Support }
