declare module 'bcryptjs' {
  /**
   * Generates a salt synchronously.
   * @param {number} rounds Number of rounds to use, defaults to 10 if omitted
   * @returns {string} Salt
   */
  export function genSaltSync(rounds?: number): string;

  /**
   * Generates a salt asynchronously.
   * @param {number} rounds Number of rounds to use, defaults to 10 if omitted
   * @returns {Promise<string>} Promise with the generated salt
   */
  export function genSalt(rounds?: number): Promise<string>;

  /**
   * Hashes data synchronously.
   * @param {string|Buffer} data Data to hash
   * @param {string|number} salt Salt or number of rounds
   * @returns {string} Hash
   */
  export function hashSync(data: string, salt: string | number): string;

  /**
   * Hashes data asynchronously.
   * @param {string|Buffer} data Data to hash
   * @param {string|number} salt Salt or number of rounds
   * @returns {Promise<string>} Promise with the hashed data
   */
  export function hash(data: string, salt: string | number): Promise<string>;

  /**
   * Compares data with a hash synchronously.
   * @param {string|Buffer} data Data to compare
   * @param {string} encrypted Hash to compare to
   * @returns {boolean} True if matching, otherwise false
   */
  export function compareSync(data: string, encrypted: string): boolean;

  /**
   * Compares data with a hash asynchronously.
   * @param {string|Buffer} data Data to compare
   * @param {string} encrypted Hash to compare to
   * @returns {Promise<boolean>} Promise with the comparison result
   */
  export function compare(data: string, encrypted: string): Promise<boolean>;
} 