import { Injectable } from '@angular/core';
import axios from 'axios';
import { ApiResponse } from '../Interfaces/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}

  getAll(url: string): any {
    return axios.get(url, { withCredentials: true });
  }

  getOne<T>(url: string, id: number): Promise<ApiResponse<T>> {
    return axios
      .get(`${url}/${id}`, { withCredentials: true })
      .then((response: any) => {
        console.log(response.data[0]);
        return { status: response.status, data: response.data[0] };
      })
      .catch((error: any) => {
        console.error(error);
        return { status: error.response?.status || 500, data: null };
      }) as Promise<ApiResponse<T>>;
  }

  post<T>(url: string, data: any): Promise<ApiResponse<T>> {
    console.log(data);
    return axios
      .post(url, data, { withCredentials: true })
      .then((response: any) => {
        return { status: response.status, data: response.data } as ApiResponse<T>;
      })
      .catch((error: any) => {
        console.error(error);
        const errorResponse: ApiResponse<T> = {
          status: error.response?.status || 500,
          data: null,
          message: error.response?.data?.message
        };
        return Promise.resolve(errorResponse);
      });
  }

  patch<T>(url: string, id: number, data: any): Promise<ApiResponse<T>> {
    return axios
      .patch(`${url}/${id}`, data, { withCredentials: true })
      .then((response: any) => {
        return { status: response.status, data: response.data } as ApiResponse<T>;
      })
      .catch((error: any) => {
        console.error(error);
        const errorResponse: ApiResponse<T> = {
          status: error.response?.status || 500,
          data: null,
          message: error.response?.data?.message
        };
        return Promise.resolve(errorResponse);
      });
  }

  delete(url: string, id: number): any {
    return axios.delete(`${url}/${id}`, { withCredentials: true });
  }
}