export type UserRole = "admin" | "user"

export interface IUser {
    id: number
    email: string
    name: string
    role: UserRole
    active: boolean
    createdAt: Date
    updatedAt: Date
}

export interface ILoginPayload {
    email: string
    password: string
}

export interface ILoginResponse {
    authToken: string
    user: IUser
}

export interface IRegisterPayload {
    name: string
    email: string
    password: string

}

export interface IRegisterResponse {
    authToken: string
    user: IUser
}