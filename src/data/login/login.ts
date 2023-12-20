import { Auth, Hub, Logger } from "aws-amplify"
import { createUser, getUser } from "../user"
import { useContext } from "react"

const start = async () => {
    try {
        const _user = await Auth.currentAuthenticatedUser()
        const _session = await Auth.currentSession()
        // @ts-ignore
        globalThis.accessToken = _session.accessToken.jwtToken
        globalThis.user = _user
        const user = await getUser(_user.username)
        globalThis.backendUser = user
    } catch (error) {
        try {
            const _user = await Auth.currentAuthenticatedUser()
            await createUser({
                is_superuser: false,
                username: _user.username,
                first_name: _user.attributes.given_name,
                last_name: _user.attributes.family_name,
                frontend_config: {},
                is_active: true,
                email: _user.attributes.email,
                is_staff: false,
                groups: [],
                user_permissions: [],
            })
        } catch (error) {}

        console.info("Could not determine user, probably not logged in")
    }
}

const logger = new Logger("Logger", "INFO")
const listener = async (data: any) => {
    try {
        switch (data.payload.event) {
            case "signIn":
                logger.info("======= SIGNED IN, WELCOME! ===========")
                logger.info(data.payload.data.username)
                logger.info(data.payload.data.attributes.given_name)
                logger.info(data.payload.data.attributes.family_name)
                logger.info(data.payload.data.attributes.email)
                logger.info("=======================================")
                try {
                    const _user = await Auth.currentAuthenticatedUser()
                    const _session = await Auth.currentSession()
                    // @ts-ignore
                    globalThis.accessToken = _session.accessToken.jwtToken

                    const user = await getUser(data.payload.data.username)
                    globalThis.backendUser = user
                    window.location.reload()
                } catch (error) {
                    await createUser({
                        is_superuser: false,
                        username: data.payload.data.username,
                        first_name: data.payload.data.attributes.given_name,
                        last_name: data.payload.data.attributes.family_name,
                        frontend_config: {},
                        is_active: true,
                        email: data.payload.data.attributes.email,
                        is_staff: false,
                        groups: [],
                        user_permissions: [],
                    })
                }
                break
            case "signUp":
                logger.info("======= SIGNED UP, WELCOME! 🎉 ===========")
                try {
                    const _user = await Auth.currentAuthenticatedUser()
                    const _session = await Auth.currentSession()
                    // @ts-ignore
                    globalThis.accessToken = _session.accessToken.jwtToken

                    const user = await getUser(data.payload.data.username)
                    globalThis.backendUser = user
                } catch (error) {
                    await createUser({
                        is_superuser: false,
                        username: data.payload.data.username,
                        first_name: data.payload.data.attributes.given_name,
                        last_name: data.payload.data.attributes.family_name,
                        frontend_config: {},
                        is_active: true,
                        email: data.payload.data.attributes.email,
                        is_staff: false,
                        groups: [],
                        user_permissions: [],
                    })
                }
                break
            case "signOut":
                logger.info("======= SIGNED OUT 👋 ===========")
                break
            case "signIn_failure":
                logger.info("======= SIGNING IN FAILED 😭 ===========")
                break
            default:
                logger.error("Something went wrong, look at data object", data)
        }
    } catch (error) {
        logger.error("Error in event listener:", error)
    }
}

export { listener, start }
