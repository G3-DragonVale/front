enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export interface Dragon {
    id: number,
    nom: string,
    rarete: string,
    img_url: string,
}

export interface User {
    id: number,
    nickname: string,
    role: Role,
}

export interface Log {
    id: number,
    user: string,
    method: string,
    route: string,
    date: Date,
}

export interface ErrorResponse {
    message: string;
    error: string;
    statusCode: number;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}