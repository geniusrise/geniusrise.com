import React from "react"

interface Props {
    taskType: string
    callback: (obj: any) => void
    visible: boolean
}

// hidden={!props.visible}

const Settings = (props: Props) => {
    return <div>Settings</div>
}

export default Settings
