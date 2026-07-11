import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class LocalStorageProvider {
  constructor() {
    this.uploadDir = path.resolve(__dirname, '../../uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      logger.info(`[Storage] Created local uploads directory at: ${this.uploadDir}`);
    }
  }

  async saveFile(fileName, fileBuffer) {
    const filePath = path.join(this.uploadDir, `${Date.now()}_${fileName}`);
    try {
      fs.writeFileSync(filePath, fileBuffer);
      logger.info(`[Storage] Successfully saved upload locally at: ${filePath}`);
      return {
        url: `file://${filePath}`,
        provider: 'local',
        path: filePath
      };
    } catch (err) {
      logger.error('[Storage] Local storage save operation failed:', err);
      throw err;
    }
  }
}

class StorageService {
  constructor() {
    // Easily plug in Cloudinary/S3 here in future via config checks
    this.provider = new LocalStorageProvider();
  }

  async saveFile(fileName, fileBuffer) {
    return this.provider.saveFile(fileName, fileBuffer);
  }
}

export const storage = new StorageService();
export default storage;
