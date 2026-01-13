module.exports = {
  expo: {
    name: 'MotoPay',
    slug: 'motopay',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'dark',
    splash: {
      image: './shared/assets/logo.png',
      resizeMode: 'contain',
      backgroundColor: '#000000',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.motopay.app',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './shared/assets/logo.png',
        backgroundColor: '#000000',
      },
      package: 'com.motopay.app',
    },
    web: {
      favicon: './shared/assets/logo.png',
    },
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001',
      eas: {
        projectId: 'a095ef1d-2486-411d-a991-b430a5b3839d',
      },
    },
    plugins: [
      'expo-dev-client',
      'expo-font',
    ],
  },
};

