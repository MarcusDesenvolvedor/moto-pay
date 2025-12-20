import { AxiosInstance } from 'axios';
export declare class ApiClient {
    private client;
    constructor();
    private setupInterceptors;
    get instance(): AxiosInstance;
}
export declare const apiClient: ApiClient;
