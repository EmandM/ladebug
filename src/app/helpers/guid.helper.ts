import { replace } from 'lodash';

export default class GuidHelper {
  /*
   * Create a random id that mimics a guid.
   */
  static createGuid(): string {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
  }

  static convertUserId(userId: string): string {
    const encodedUserId = replace(userId, /[^A-Za-z0-9]/g, '');
    return encodedUserId;
  }
}
