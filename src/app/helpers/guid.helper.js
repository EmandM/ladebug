export default class GuidHelper {
  /*
   * Create a random id that mimics a guid.
   */
  static createGuid() {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
  }
}
