const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

// Caminho para a pasta temporária onde os arquivos serão armazenados temporariamente
const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");
// Caminho para a pasta onde os arquivos enviados serão armazenados permanentemente
const UPLOAD_FOLDER = path.resolve(TMP_FOLDER, "uploads");

/**
 * Configuração do multer para gerenciar o armazenamento de arquivos enviados.
 * Armazena os arquivos temporariamente na pasta TMP_FOLDER e gera um nome de arquivo único para cada upload.
 */
const MULTER = {
  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString("hex");
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};

module.exports = {
  TMP_FOLDER,
  UPLOAD_FOLDER,
  MULTER,
};
