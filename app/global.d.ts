/// <reference types="vite/client" />
declare global {
  interface Window {
    WigoalSDK?: {
      playRewardVideo?: () => void;
      onLevelChanged?: (videoId: string, level: number) => void;
    };
    onRewardVideoResult?: (success: boolean, message: string) => void;
    addMonitor?: (event_type: string, data: Record<string, any>) => void;
  }
}
export {};
