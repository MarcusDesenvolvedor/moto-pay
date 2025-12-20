"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiClient = exports.ApiClient = void 0;
const axios_1 = __importDefault(require("axios"));
const token_storage_1 = require("../storage/token-storage");
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
class ApiClient {
    constructor() {
        this.client = axios_1.default.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.setupInterceptors();
    }
    setupInterceptors() {
        this.client.interceptors.request.use(async (config) => {
            const token = await (0, token_storage_1.getToken)();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });
        this.client.interceptors.response.use((response) => response, async (error) => {
            if (error.response?.status === 401) {
                await (0, token_storage_1.clearTokens)();
            }
            return Promise.reject(error);
        });
    }
    get instance() {
        return this.client;
    }
}
exports.ApiClient = ApiClient;
exports.apiClient = new ApiClient();
//# sourceMappingURL=api-client.js.map