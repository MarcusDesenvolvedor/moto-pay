export declare function saveTokens(accessToken: string, refreshToken: string): Promise<void>;
export declare function getToken(): Promise<string | null>;
export declare function getRefreshToken(): Promise<string | null>;
export declare function clearTokens(): Promise<void>;
