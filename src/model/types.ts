enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export interface Dragon {
    id: number,
    nom: string,
    rarete: string,
    lien: string,
}

export interface User {
    id: number,
    nickname: string,
    role: Role,
}

export interface Log {
    id: number,
    userId: number,
    method: string,
    route: string,
    date: Date,
    body: Object,
    ip: string,
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