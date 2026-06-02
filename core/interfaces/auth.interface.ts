import {IUser} from "./user.interface"

export interface ILoginPayload {
    email : string,
    password: string,
}

export interface ILoginResponse {
    authToken: string,
    user: IUser,
}

export interface IRegisterPayload {
    name: string,
    email: string,
    password: string,
}

export interface IRegisterResponse {
    authToken: string,
    user: IUser,
}

