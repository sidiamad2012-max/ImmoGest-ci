// Service de base simple sans caractères spéciaux
export class BaseService {
  static async handleRequest<T>(
    requestFn: () => Promise<T>,
    fallbackFn: () => T
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      console.warn('Request failed, using fallback:', error);
      return fallbackFn();
    }
  }
}