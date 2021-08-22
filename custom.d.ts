export {}

export type SendChannel =
  | "workspaceFolder"
  | "outdated"
  | "packageUpdate"
  | "cancelled"
  | "authenticate"
  | "isLoggedIn"
  | "token"
  | "logout"
  | "upgrade"
  | "alert"
  | "proFeature"
  | "updateAll"
export type ReceiveChannel =
  | "packages"
  | "outdated"
  | "packageUpdated"
  | "cancelled"
  | "saveToken"
  | "logout"
  | "alert"
  | "proFeature"
  | "updatedAll"

declare global {
  interface Window {
    api: {
      send: (channel: SendChannel, data: TSFixMe) => void
      receive: (channel: ReceiveChannel, data: TSFixMe) => void
    }
  }
}
