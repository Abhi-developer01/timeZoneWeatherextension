// Type definitions for Chrome extension API

interface Chrome {
  storage: {
    local: {
      get: <T>(keys: string[], callback: (result: { [key: string]: T }) => void) => void;
      set: (items: { [key: string]: any }) => void;
    };
  };
  runtime: {
    sendMessage: <T>(message: any, callback?: (response: T) => void) => void;
  };
  tabs: {
    create: (createProperties: { url: string }) => void;
  };
}

declare global {
  interface Window {
    chrome: Chrome;
  }
  var chrome: Chrome;
}
