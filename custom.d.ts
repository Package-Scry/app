export {}

export enum SendChannels {
  WorkspaceFolder = "WorkspaceFolder",
  PackageUpdate = "PackageUpdate",
  Cancelled = "Cancelled",
  Authenticate = "Authenticate",
  IsLoggedIn = "IsLoggedIn",
  Token = "Token",
  Upgrade = "Upgrade",
  Alert = "Alert",
  UpdateAll = "UpdateAll",
  Feedback = "Feedback",
  GetChangeLog = "GetChangeLog",
}

export enum ReceiveChannels {
  AlertError,
  Packages,
  Outdated,
  PackageUpdated,
  Cancelled,
  SaveToken,
  Alert,
  ProFeature,
  UpdatedAll,
  SendChangeLog,
}

export interface DefaultEventArgs {
  meta: { path?: string; workspace: string }
}

interface TokenArgs extends DefaultEventArgs {
  data: {
    token: string
  }
}
export interface Token extends TokenArgs {
  channel: SendChannels.Token
}

interface PackageUpdateArgs extends DefaultEventArgs {
  data: {
    name: string
    version: string
  }
}
export interface PackageUpdate extends PackageUpdateArgs {
  channel: SendChannels.PackageUpdate
}

export type MainEvents = Token | PackageUpdate

export interface CallbackStatus {
  wasSuccessful?: boolean
  error?: string
}

interface MetaData extends CallbackStatus {
  workspace?: string
}

declare global {
  interface Window {
    api: {
      send: ({ channel, data }: MainEvents) => void
      receive: <T>(channel: ReceiveChannels, data: T) => void
    }
  }
}

declare module "electron" {
  namespace Electron {
    interface IpcMain extends NodeJS.EventEmitter {
      on(
        channel: SendChannels,
        listener: (event: IpcMainEvent, ...args: any[]) => void
      ): this
    }
  }
}
