import {API_URL} from "@/lib/api";
import type {
    ILoginPayload,
    ILoginResponse,
    IRegisterPayload,
    IRegisterResponse,
    IUser
} from "@/types/auth";

export async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const error = await res
            .json()
            .catch(() => ({ message: "Erreur inconnue" }));
        throw new Error(error.message || `Erreur ${res.status}`);
    }
    return res.json();
}

export async function loginRequest(payload: ILoginPayload): Promise<ILoginResponse> {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    })
    return handleResponse<ILoginResponse>(res)
}



export async function registerRequest(payload: IRegisterPayload): Promise<IRegisterResponse> {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    })
    return handleResponse<IRegisterResponse>(res);
}

export async function meRequest(token: string): Promise<IUser> {
    const res = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: {"Content-Type": "application/json",
        Authorization: `Bearer ${token}`},
    })
    return handleResponse<IUser>(res);
}