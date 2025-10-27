import { Injectable } from '@angular/core';
import axios from 'axios';
import { ApiResponse } from '../Interfaces/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}

  getAll(url: string): any {
    return axios.get(url);
  }

  getOne<T>(url: string, id: number): Promise<ApiResponse<T>> {
    return axios
      .get(`${url}/${id}`)
      .then((response: any) => {
        console.log(response.data[0]);
        return { status: response.status, data: response.data[0] };
      })
      .catch((error: any) => {
        console.error(error);
        return { status: error.response.status, data: null };
      }) as Promise<ApiResponse<T>>;
  }

  post<T>(url: string, data: any): Promise<ApiResponse<T>> {
    console.log(data);
    return axios
      .post(url, data)
      .then((response: any) => {
        return { status: response.status, data: response.data };
      })
      .catch((error: any) => {
        console.error(error);
        return { status: error.response.status, data: null };
      }) as Promise<ApiResponse<T>>;
  }

  patch<T>(url: string, id: number, data: any): Promise<ApiResponse<T>> {
    return axios
      .patch(`${url}/${id}`, data)
      .then((response: any) => {
        return { status: response.status, data: response.data };
        console.log(response.data[0]);
        return { status: response.status, data: response.data[0] };
      })
      .catch((error: any) => {
        console.error(error);
        return { status: error.response.status, data: null } as ApiResponse<T>;
      }) as Promise<ApiResponse<T>>;
  }

  delete(url: string, id: number): any {
    return axios.delete(`${url}/${id}`);
  }
}