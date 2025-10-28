export interface ApiResponse<T> {
    status: number;
    data: T | null;
    message?: string;
}