const fs = require("fs");
const path = require("path");
const uploadConfig = require("../configs/upload");

/**
 * Classe que gerencia o armazenamento de arquivos no sistema de arquivos local.
 */
class DiskStorage {

  /**
   * Salva um arquivo no sistema de arquivos local.
   * @param {string} file - O nome do arquivo a ser salvo.
   * @returns {Promise<string>} - O nome do arquivo salvo.
   * @throws {Error} - Lança um erro se a operação de renomeação falhar.
   */
  async saveFile(file) {
    // Renomeia o arquivo da pasta temporária para a pasta de upload permanente.
    await fs.promises.rename(
      path.resolve(uploadConfig.TMP_FOLDER, file),
      path.resolve(uploadConfig.UPLOAD_FOLDER, file),
    );
    return file;
  }

  /**
   * Exclui um arquivo do sistema de arquivos local.
   * @param {string} file - O nome do arquivo a ser excluído.
   * @returns {Promise<boolean>} - `true` se o arquivo foi excluído com sucesso, `false` se o arquivo não existe.
   */
  async deleteFile(file) {
    const filePath = path.resolve(uploadConfig.UPLOAD_FOLDER, file);

    try {
      await fs.promises.stat(filePath);
    } catch (e) {
      console.error("Error =>", e);
      return false; 
    }
    await fs.promises.unlink(filePath);
    return true;// O arquivo foi excluído com sucesso.
  }
}

module.exports = DiskStorage;
