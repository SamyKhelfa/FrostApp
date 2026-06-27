export interface IUpdateMePayload {
    name?: string;
    email?: string;
    avatar?: string;
}

export interface IChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

export interface IChangePasswordResponse {
    success: boolean;
}