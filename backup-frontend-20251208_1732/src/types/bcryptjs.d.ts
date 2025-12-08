// Type definitions for bcryptjs
// Project: https://github.com/dcodeIO/bcrypt.js
// Definitions by: Joshua Filby <https://github.com/Joshua-F>
//                 Rafael Kraut <https://github.com/RafaelKr>
//                 Vlad Poluch <https://github.com/vlapo>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.8

declare module 'bcryptjs' {
  /**
   * Synchronously generates a salt.
   * @param rounds Number of rounds to use, defaults to 10 if omitted
   */
  export function genSaltSync(rounds?: number): string;

  /**
   * Asynchronously generates a salt.
   * @param rounds Number of rounds to use, defaults to 10 if omitted
   */
  export function genSalt(rounds?: number): Promise<string>;
  export function genSalt(rounds: number, callback: (err: Error | null, salt: string) => void): void;
  export function genSalt(callback: (err: Error | null, salt: string) => void): void;

  /**
   * Synchronously generates a hash for the given string.
   * @param s String to hash
   * @param saltOrRounds Salt length to generate or salt to use, default to 10
   */
  export function hashSync(s: string, saltOrRounds: string | number): string;

  /**
   * Asynchronously generates a hash for the given string.
   * @param s String to hash
   * @param salt Salt to use, or number of rounds to generate a salt (default 10)
   */
  export function hash(s: string, salt: string | number): Promise<string>;
  export function hash(s: string, salt: string | number, callback: (err: Error | null, hash: string) => void): void;

  /**
   * Synchronously tests a string against a hash.
   * @param s String to compare
   * @param hash Hash to test against
   */
  export function compareSync(s: string, hash: string): boolean;

  /**
   * Asynchronously compares the given data against the given hash.
   * @param s Data to compare
   * @param hash Data to be compared to
   */
  export function compare(s: string, hash: string): Promise<boolean>;
  export function compare(s: string, hash: string, callback: (err: Error | null, isMatch: boolean) => void): void;

  /**
   * Gets the number of rounds used to encrypt the specified hash.
   * @param hash Hash to extract the used number of rounds from
   */
  export function getRounds(hash: string): number;

  /**
   * Gets the salt portion from a hash.
   * @param hash Hash to extract the salt from
   */
  export function getSalt(hash: string): string;

  /**
   * The bcrypt version used.
   */
  export const version: string;
}
