const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Exclude only the dist/ folder at project root (NestJS backend), not node_modules/*/dist (e.g. memoize-one)
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

// Ensure only the root directory is watched
config.watchFolders = [__dirname];

module.exports = config;









