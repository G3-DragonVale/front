export interface Dragon {
    id: number,
    nom: string,
    rarete: string,
}

export interface User {
    id: number,
    nom: string,
    prenom: string,
}

export interface Log {
    id: number,
    user: string,
    method: string,
    route: string,
    date: Date,
}