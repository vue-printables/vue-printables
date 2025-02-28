/**
 * Generates a unique ID for objects
 * @returns A unique string ID
 */
export const generateUniqueId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};
