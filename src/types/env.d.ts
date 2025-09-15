declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      API_CAPTA_HOLYDATES: string;
    }
  }
}
export {};
