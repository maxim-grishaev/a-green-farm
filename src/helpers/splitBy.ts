export const splitBy = <T>(chunkSize: number, arr: T[]): T[][] =>
  arr.reduce((acc, _, i) => (i % chunkSize ? acc : [...acc, arr.slice(i, i + chunkSize)]), [] as T[][]);
