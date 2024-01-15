import axios, { AxiosResponse } from "axios"

interface Job {
    uuid: string
    is_deleted: boolean
    created_at: string
    modified_at: string
    name: string
    status: string
    labels: object
    annotations: object
    namespace: string
    pods: object
    task: string
}

interface JobCreate {
    task: object // Detailed structure as per TaskConfig definition in Swagger
}

interface JobIdentifier {
    identifier: string
    cloud: string
}

const url = "https://api.geniusrise.com/api/v1/jobs"

const apiClient = () =>
    axios.create({
        baseURL: url,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${globalThis.accessToken}`,
        },
        withCredentials: false,
    })

// List Jobs
async function listJobs(): Promise<AxiosResponse<Job[]> | null> {
    try {
        const response = await apiClient().get<Job[]>("")
        console.debug("listJobs response:", response)
        return response
    } catch (error) {
        console.error("Error in listJobs:", error)
        return null
    }
}

// Create Job
async function createJob(jobData: JobCreate): Promise<AxiosResponse<Job> | null> {
    try {
        const response = await apiClient().post<Job>("/1", jobData)
        console.debug("createJob response:", response)
        return response
    } catch (error) {
        console.error("Error in createJob:", error)
        return null
    }
}

// Read Job
async function readJob(identifier: string, cloud: string): Promise<AxiosResponse<Job> | null> {
    try {
        const response = await apiClient().get<Job>(`/${identifier}/${cloud}/get`)
        console.debug("readJob response:", response)
        return response
    } catch (error) {
        console.error("Error in readJob:", error)
        return null
    }
}

// Update Job
async function updateJob(identifier: string, jobData: JobIdentifier): Promise<AxiosResponse<Job> | null> {
    try {
        const response = await apiClient().put<Job>(`/${identifier}`, jobData)
        console.debug("updateJob response:", response)
        return response
    } catch (error) {
        console.error("Error in updateJob:", error)
        return null
    }
}

// Delete Job
async function deleteJob(jobData: JobIdentifier): Promise<AxiosResponse<void> | null> {
    try {
        const response = await apiClient().delete<void>(`/${jobData.identifier}/${jobData.cloud}/delete`)
        console.debug("deleteJob response:", response)
        return response
    } catch (error) {
        console.error("Error in deleteJob:", error)
        return null
    }
}

// Job Logs
async function getJobLogs(identifier: string, cloud: string): Promise<AxiosResponse<string> | null> {
    try {
        const response = await apiClient().get<string>(`/${identifier}/${cloud}/logs`)
        console.debug("getJobLogs response:", response)
        return response
    } catch (error) {
        console.error("Error in getJobLogs:", error)
        return null
    }
}

export { listJobs, createJob, readJob, updateJob, deleteJob, getJobLogs }
export type { Job, JobCreate, JobIdentifier }
