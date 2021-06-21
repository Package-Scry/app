export {}

declare global {
  interface Window {
    api: {
      send: (channel: string, data: TSFixMe) => void
      receive: (channel: string, data: TSFixMe) => void
    }
  }
}
