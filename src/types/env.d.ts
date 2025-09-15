declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      API_WORKING_DAYS: string;
    }
  }
}
export {};
