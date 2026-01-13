const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Excluir StickerSmash do watchFolders para evitar conflitos
config.watchFolders = config.watchFolders.filter(
  (folder) => !folder.includes('StickerSmash')
);

// Garantir que apenas o diretório raiz seja observado
config.watchFolders = [__dirname];

module.exports = config;





