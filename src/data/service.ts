import axios, { AxiosResponse } from "axios"

interface Service {
    uuid: string
    is_deleted: boolean
    created_at: string
    modified_at: string
    name: string
    status: string
    cluster_ip: string
    ports: object
    replicas: number
    labels: object
    annotations: object
    namespace: string
    pods: object
    task: string
}

interface ServiceCreate {
    task: object // Detailed structure as per TaskConfig definition in Swagger
}

interface ServiceUpdate {
    replicas: number
    cloud: string
}

interface ServiceIdentifier {
    identifier: string
    cloud: string
}

const url = "https://api.geniusrise.com/api/v1/services"

const apiClient = () =>
    axios.create({
        baseURL: url,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${globalThis.accessToken}`,
        },
        withCredentials: false,
    })

// List Services
async function listServices(): Promise<AxiosResponse<Service[]> | null> {
    try {
        const response = await apiClient().get<Service[]>("")
        console.debug("listServices response:", response)
        return response
    } catch (error) {
        console.error("Error in listServices:", error)
        return null
    }
}

// Create Service
async function createService(serviceData: ServiceCreate): Promise<AxiosResponse<Service> | null> {
    try {
        const response = await apiClient().post<Service>("/1", serviceData)
        console.debug("createService response:", response)
        return response
    } catch (error) {
        console.error("Error in createService:", error)
        return null
    }
}

// Read Service
async function readService(identifier: string, cloud: string): Promise<AxiosResponse<Service> | null> {
    try {
        const response = await apiClient().get<Service>(`/${identifier}/${cloud}/get`)
        console.debug("readService response:", response)
        return response
    } catch (error) {
        console.error("Error in readService:", error)
        return null
    }
}

// Update Service
async function updateService(identifier: string, serviceData: ServiceUpdate): Promise<AxiosResponse<Service> | null> {
    try {
        const response = await apiClient().put<Service>(`/${identifier}`, serviceData)
        console.debug("updateService response:", response)
        return response
    } catch (error) {
        console.error("Error in updateService:", error)
        return null
    }
}

// Delete Service
async function deleteService(serviceData: ServiceIdentifier): Promise<AxiosResponse<void> | null> {
    try {
        const response = await apiClient().delete<void>(`/${serviceData.identifier}/${serviceData.cloud}/delete`)
        console.debug("deleteService response:", response)
        return response
    } catch (error) {
        console.error("Error in deleteService:", error)
        return null
    }
}

// Service Logs
async function getServiceLogs(identifier: string, cloud: string): Promise<AxiosResponse<string> | null> {
    try {
        const response = await apiClient().get<string>(`/${identifier}/${cloud}/logs`)
        console.debug("getServiceLogs response:", response)
        return response
    } catch (error) {
        console.error("Error in getServiceLogs:", error)
        return null
    }
}

export { listServices, createService, readService, updateService, deleteService, getServiceLogs }
export type { Service, ServiceCreate, ServiceUpdate, ServiceIdentifier }
