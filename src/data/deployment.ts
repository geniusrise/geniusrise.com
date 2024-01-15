import axios, { AxiosResponse } from "axios"

interface Deployment {
    uuid: string
    is_deleted: boolean
    created_at: string
    modified_at: string
    name: string
    status: string
    replicas: number
    labels: object
    annotations: object
    namespace: string
    pods: object
    task: string
}

interface DeploymentCreate {
    task: object // Detailed structure as per TaskConfig definition in Swagger
}

interface DeploymentUpdate {
    replicas: number
    cloud: string
}

interface DeploymentIdentifier {
    identifier: string
    cloud: string
}

const url = "https://api.geniusrise.com/api/v1/deployments"

const apiClient = () =>
    axios.create({
        baseURL: url,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${globalThis.accessToken}`,
        },
        withCredentials: false,
    })

// List Deployments
async function listDeployments(): Promise<AxiosResponse<Deployment[]> | null> {
    try {
        const response = await apiClient().get<Deployment[]>("")
        console.debug("listDeployments response:", response)
        return response
    } catch (error) {
        console.error("Error in listDeployments:", error)
        return null
    }
}

// Create Deployment
async function createDeployment(deploymentData: DeploymentCreate): Promise<AxiosResponse<Deployment> | null> {
    try {
        const response = await apiClient().post<Deployment>("/", deploymentData)
        console.debug("createDeployment response:", response)
        return response
    } catch (error) {
        console.error("Error in createDeployment:", error)
        return null
    }
}

// Read Deployment
async function readDeployment(identifier: string, cloud: string): Promise<AxiosResponse<Deployment> | null> {
    try {
        const response = await apiClient().get<Deployment>(`/${identifier}/${cloud}/get`)
        console.debug("readDeployment response:", response)
        return response
    } catch (error) {
        console.error("Error in readDeployment:", error)
        return null
    }
}

// Update Deployment
async function updateDeployment(identifier: string, deploymentData: DeploymentUpdate): Promise<AxiosResponse<Deployment> | null> {
    try {
        const response = await apiClient().put<Deployment>(`/${identifier}`, deploymentData)
        console.debug("updateDeployment response:", response)
        return response
    } catch (error) {
        console.error("Error in updateDeployment:", error)
        return null
    }
}

// Delete Deployment
async function deleteDeployment(deploymentData: DeploymentIdentifier): Promise<AxiosResponse<void> | null> {
    try {
        const response = await apiClient().delete<void>(`/${deploymentData.identifier}/${deploymentData.cloud}/delete`)
        console.debug("deleteDeployment response:", response)
        return response
    } catch (error) {
        console.error("Error in deleteDeployment:", error)
        return null
    }
}

// Deployment Logs
async function getDeploymentLogs(identifier: string, cloud: string): Promise<AxiosResponse<string> | null> {
    try {
        const response = await apiClient().get<string>(`/${identifier}/${cloud}/logs`)
        console.debug("getDeploymentLogs response:", response)
        return response
    } catch (error) {
        console.error("Error in getDeploymentLogs:", error)
        return null
    }
}

export { listDeployments, createDeployment, readDeployment, updateDeployment, deleteDeployment, getDeploymentLogs }
export type { Deployment, DeploymentCreate, DeploymentUpdate, DeploymentIdentifier }
