import axios, { AxiosResponse } from "axios"

interface User {
    // uuid: string;
    // password: string;
    // last_login: string | null;
    // created_at: string | null;
    // modified_at: string| null;
    is_superuser: boolean
    username: string
    first_name: string | null
    last_name: string | null
    frontend_config: object
    is_active: boolean
    email: string
    is_staff: boolean
    groups: number[]
    user_permissions: number[]
}

interface UserDelete {
    username: string
}

// Axios instance for API calls
const apiClient = () =>
    axios.create({
        baseURL: "https://api.geniusrise.com/api/v1/user",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${globalThis.accessToken}`,
        },
        withCredentials: false,
    })

// List Users
async function getUser(username: string): Promise<AxiosResponse<User[]>> {
    try {
        const response = await apiClient().get<User[]>(`/${username}`)
        console.debug("getUser response:", response)
        return response
    } catch (error) {
        console.error("Error in getUser:", error)
        throw error
    }
}

// Create User
async function createUser(userData: User): Promise<AxiosResponse<User>> {
    try {
        const response = await apiClient().post<User>("/", userData)
        console.debug("createUser response:", response)
        return response
    } catch (error) {
        console.error("Error in createUser:", error)
        throw error
    }
}

// Update User
async function updateUser(username: string, userData: User): Promise<AxiosResponse<User>> {
    try {
        const response = await apiClient().put<User>(`/${username}`, userData)
        console.debug("updateUser response:", response)
        return response
    } catch (error) {
        console.error("Error in updateUser:", error)
        throw error
    }
}

// Delete User
async function deleteUser(userData: UserDelete): Promise<AxiosResponse<void>> {
    try {
        const response = await apiClient().delete<void>("/", { data: userData })
        console.debug("deleteUser response:", response)
        return response
    } catch (error) {
        console.error("Error in deleteUser:", error)
        throw error
    }
}

export { getUser, createUser, updateUser, deleteUser }
export type { User, UserDelete }
