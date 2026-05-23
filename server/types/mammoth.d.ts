declare module 'mammoth' {
  export interface ConversionResult {
    value: string;
    messages: Array<{
      type: string;
      message: string;
    }>;
  }

  export function extractRawText(options: { path: string } | { buffer: Buffer }): Promise<ConversionResult>;
  
  export function convertToHtml(options: { path: string } | { buffer: Buffer }): Promise<ConversionResult>;
}