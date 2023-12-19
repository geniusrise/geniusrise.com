import { AxiosResponse } from "axios"
import axios from "axios"

interface App {
    uuid: string
    created_at: string
    modified_at: string
    name: string
    description: string
    secret_key: string
    last_used: string
    is_active: boolean
    owner: string
}

interface AppDelete {
    secret_key: string
}

const apiClient = () =>
    axios.create({
        baseURL: `${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/user`,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${globalThis.accessToken}`,
        },
        withCredentials: false,
    })

// List Apps
async function getApp(): Promise<AxiosResponse<App[]>> {
    try {
        const response = await apiClient().get<App[]>("/app")
        console.debug("getApp response:", response)
        return response
    } catch (error) {
        console.error("Error in getApp:", error)
        throw error
    }
}

// Create App
async function createApp(appData: App): Promise<AxiosResponse<App>> {
    try {
        const response = await apiClient().post<App>("/app", appData)
        console.debug("createApp response:", response)
        return response
    } catch (error) {
        console.error("Error in createApp:", error)
        throw error
    }
}

// Update App
async function updateApp(appData: AppDelete): Promise<AxiosResponse<App>> {
    try {
        const response = await apiClient().put<App>("/app", appData)
        console.debug("updateApp response:", response)
        return response
    } catch (error) {
        console.error("Error in updateApp:", error)
        throw error
    }
}

// Delete App
async function deleteApp(appData: AppDelete): Promise<AxiosResponse<void>> {
    try {
        const response = await apiClient().delete<void>("/app", { data: appData })
        console.debug("deleteApp response:", response)
        return response
    } catch (error) {
        console.error("Error in deleteApp:", error)
        throw error
    }
}

export { getApp, createApp, updateApp, deleteApp }
export type { App, AppDelete }
