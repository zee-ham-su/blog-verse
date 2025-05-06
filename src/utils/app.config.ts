import { ConfigService } from '@nestjs/config';

/**
 * Helper class to get application configuration values
 */
export class AppConfig {
  static getBaseUrl(configService: ConfigService): string {
    const port = configService.get<number>('PORT') || 3001;
    const protocol = configService.get<string>('APP_PROTOCOL') || 'http';
    const hostname = configService.get<string>('APP_HOSTNAME') || 'localhost';
    
    return `${protocol}://${hostname}:${port}`;
  }

  static getFileUrl(configService: ConfigService, filePath: string): string {
    if (!filePath) return null;
    
    const baseUrl = this.getBaseUrl(configService);
    // Remove leading '/' if present to avoid double slashes
    const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    
    return `${baseUrl}/${cleanPath}`;
  }
}