const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const { transformer, resolver } = config;
config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
};
config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...resolver.sourceExts, 'svg'],
};

// Exclude only the dist/ folder at project root (NestJS backend)
const path = require('path');
const projectRootDistPath = path.join(__dirname, 'dist').replace(/\\/g, '\\\\');
const projectRootDist = new RegExp(projectRootDistPath + '[\\\\/].*');
const defaultBlockList = config.resolver.blockList;
config.resolver.blockList = Array.isArray(defaultBlockList)
  ? [...defaultBlockList, projectRootDist]
  : [defaultBlockList, projectRootDist];

// Exclude StickerSmash from watchFolders to avoid conflicts
config.watchFolders = config.watchFolders.filter(
  (folder) => !folder.includes('StickerSmash')
);
config.watchFolders = [__dirname];

module.exports = config;









