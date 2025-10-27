type Role = {
    role : "user" | "admin";
}

export interface User {
    id: string; //UniqID
    name: string;
    email: string;
    password: string;
    role: Role;
    status: boolean;
}