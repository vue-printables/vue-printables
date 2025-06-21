declare module "changedpi" {
  /**
   * Changes the DPI of a blob containing an image
   * @param blob - The image blob (PNG or JPEG)
   * @param dpi - The desired DPI value
   * @returns Promise that resolves to a new blob with changed DPI
   */
  export function changeDpiBlob(blob: Blob, dpi: number): Promise<Blob>;

  /**
   * Changes the DPI of a base64 data URL image
   * @param base64Image - The base64 data URL string (PNG or JPEG)
   * @param dpi - The desired DPI value
   * @returns Modified base64 data URL string with changed DPI
   */
  export function changeDpiDataUrl(base64Image: string, dpi: number): string;
}
