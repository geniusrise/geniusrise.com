import axios, { AxiosResponse } from 'axios';

interface Deployment {
    uuid: string;
    is_deleted: boolean;
    created_at: string;
    modified_at: string;
    name: string;
    status: string;
    replicas: number;
    labels: object;
    annotations: object;
    namespace: string;
    pods: object;
    task: string;
}

interface DeploymentCreate {
    task: object;  // Detailed structure as per TaskConfig definition in Swagger
}

interface DeploymentUpdate {
    replicas: number;
}

interface DeploymentIdentifier {
    identifier: string;
}

const apiClient = () => axios.create({
    baseURL: 'http://localhost:8000/api/v1/deployments',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${globalThis.accessToken}`
    },
    withCredentials: false
});

// List Deployments
async function listDeployments(): Promise<AxiosResponse<Deployment[]>> {
    try {
        const response = await apiClient().get<Deployment[]>('/');
        console.debug('listDeployments response:', response);
        return response;
    } catch (error) {
        console.error('Error in listDeployments:', error);
        throw error;
    }
}

// Create Deployment
async function createDeployment(deploymentData: DeploymentCreate): Promise<AxiosResponse<Deployment>> {
    try {
        const response = await apiClient().post<Deployment>('/', deploymentData);
        console.debug('createDeployment response:', response);
        return response;
    } catch (error) {
        console.error('Error in createDeployment:', error);
        throw error;
    }
}

// Read Deployment
async function readDeployment(identifier: string): Promise<AxiosResponse<Deployment>> {
    try {
        const response = await apiClient().get<Deployment>(`/${identifier}`);
        console.debug('readDeployment response:', response);
        return response;
    } catch (error) {
        console.error('Error in readDeployment:', error);
        throw error;
    }
}

// Update Deployment
async function updateDeployment(identifier: string, deploymentData: DeploymentUpdate): Promise<AxiosResponse<Deployment>> {
    try {
        const response = await apiClient().put<Deployment>(`/${identifier}`, deploymentData);
        console.debug('updateDeployment response:', response);
        return response;
    } catch (error) {
        console.error('Error in updateDeployment:', error);
        throw error;
    }
}

// Delete Deployment
async function deleteDeployment(deploymentData: DeploymentIdentifier): Promise<AxiosResponse<void>> {
    try {
        const response = await apiClient().delete<void>(`/${deploymentData.identifier}`);
        console.debug('deleteDeployment response:', response);
        return response;
    } catch (error) {
        console.error('Error in deleteDeployment:', error);
        throw error;
    }
}

// Deployment Logs
async function getDeploymentLogs(identifier: string): Promise<AxiosResponse<string>> {
    try {
        const response = await apiClient().get<string>(`/${identifier}/logs`);
        console.debug('getDeploymentLogs response:', response);
        return response;
    } catch (error) {
        console.error('Error in getDeploymentLogs:', error);
        throw error;
    }
}

// Deployment Metrics
async function getDeploymentMetrics(identifier: string): Promise<AxiosResponse<object>> {
    try {
        const response = await apiClient().get<object>(`/${identifier}/metrics`);
        console.debug('getDeploymentMetrics response:', response);
        return response;
    } catch (error) {
        console.error('Error in getDeploymentMetrics:', error);
        throw error;
    }
}

export { listDeployments, createDeployment, readDeployment, updateDeployment, deleteDeployment, getDeploymentLogs, getDeploymentMetrics };
export type { Deployment, DeploymentCreate, DeploymentUpdate, DeploymentIdentifier };
