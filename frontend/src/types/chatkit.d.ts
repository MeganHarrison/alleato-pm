/// <reference types="@openai/chatkit" />

declare module "@openai/chatkit" {
  export interface ChatKitOptions {
    [key: string]: any; // Allow any options
  }
  
  export interface ChatKitElement extends HTMLElement {
    setOptions(options: any): void;
    focusComposer(): void;
    setThreadId(threadId: string): void;
    sendUserMessage(message: string): void;
    setComposerValue(value: string): void;
    fetchUpdates(): void;
    sendCustomAction(action: any): void;
  }
  
  export interface ChatKitElementEventMap {
    // Add any specific events if needed
  }
}
