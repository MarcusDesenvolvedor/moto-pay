import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = '@motopay:access_token';
const REFRESH_TOKEN_KEY = '@motopay:refresh_token';

export async function saveTokens(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export async function getToken(): Promise<string | null> {
  return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
}

export async function clearTokens(): Promise<void> {
  await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
}
