const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Excluir apenas a pasta dist/ na raiz do projeto (backend NestJS), não node_modules/*/dist (ex.: memoize-one)
const path = require('path');
const projectRootDistPath = path.join(__dirname, 'dist').replace(/\\/g, '\\\\');
const projectRootDist = new RegExp(projectRootDistPath + '[\\\\/].*');
const defaultBlockList = config.resolver.blockList;
config.resolver.blockList = Array.isArray(defaultBlockList)
  ? [...defaultBlockList, projectRootDist]
  : [defaultBlockList, projectRootDist];

// Excluir StickerSmash do watchFolders para evitar conflitos
config.watchFolders = config.watchFolders.filter(
  (folder) => !folder.includes('StickerSmash')
);

// Garantir que apenas o diretório raiz seja observado
config.watchFolders = [__dirname];

module.exports = config;









