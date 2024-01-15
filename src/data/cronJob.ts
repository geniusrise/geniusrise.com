import axios, { AxiosResponse } from "axios"

interface CronJob {
    uuid: string
    is_deleted: boolean
    created_at: string
    modified_at: string
    name: string
    schedule: string
    status: string
    labels: object
    annotations: object
    namespace: string
    pods: object
    task: string
}

interface CronJobCreate {
    task: object // Detailed structure as per TaskConfig definition in Swagger
}

interface CronJobIdentifier {
    identifier: string
    cloud: string
}

const url = "https://api.geniusrise.com/api/v1/cronjobs"

const apiClient = () =>
    axios.create({
        baseURL: url,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${globalThis.accessToken}`,
        },
        withCredentials: false,
    })

// List CronJobs
async function listCronJobs(): Promise<AxiosResponse<CronJob[]> | null> {
    try {
        const response = await apiClient().get<CronJob[]>("")
        console.debug("listCronJobs response:", response)
        return response
    } catch (error) {
        console.error("Error in listCronJobs:", error)
        return null
    }
}

// Create CronJob
async function createCronJob(cronJobData: CronJobCreate): Promise<AxiosResponse<CronJob> | null> {
    try {
        const response = await apiClient().post<CronJob>("/", cronJobData)
        console.debug("createCronJob response:", response)
        return response
    } catch (error) {
        console.error("Error in createCronJob:", error)
        return null
    }
}

// Read CronJob
async function readCronJob(identifier: string, cloud: string): Promise<AxiosResponse<CronJob> | null> {
    try {
        const response = await apiClient().get<CronJob>(`/${identifier}/${cloud}/get`)
        console.debug("readCronJob response:", response)
        return response
    } catch (error) {
        console.error("Error in readCronJob:", error)
        return null
    }
}

// Update CronJob
async function updateCronJob(identifier: string, cronJobData: CronJobIdentifier): Promise<AxiosResponse<CronJob> | null> {
    try {
        const response = await apiClient().put<CronJob>(`/${identifier}`, cronJobData)
        console.debug("updateCronJob response:", response)
        return response
    } catch (error) {
        console.error("Error in updateCronJob:", error)
        return null
    }
}

// Delete CronJob
async function deleteCronJob(cronJobData: CronJobIdentifier): Promise<AxiosResponse<void> | null> {
    try {
        const response = await apiClient().delete<void>(`/${cronJobData.identifier}/${cronJobData.cloud}/delete`)
        console.debug("deleteCronJob response:", response)
        return response
    } catch (error) {
        console.error("Error in deleteCronJob:", error)
        return null
    }
}

// CronJob Logs
async function getCronJobLogs(identifier: string, cloud: string): Promise<AxiosResponse<string> | null> {
    try {
        const response = await apiClient().get<string>(`/${identifier}/${cloud}/logs`)
        console.debug("getCronJobLogs response:", response)
        return response
    } catch (error) {
        console.error("Error in getCronJobLogs:", error)
        return null
    }
}

export { listCronJobs, createCronJob, readCronJob, updateCronJob, deleteCronJob, getCronJobLogs }
export type { CronJob, CronJobCreate, CronJobIdentifier }
