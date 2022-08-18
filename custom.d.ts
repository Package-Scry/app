export {}

export enum SendChannels {
  WorkspaceFolder,
  Outdated,
  PackageUpdate,
  Cancelled,
  Authenticate,
  IsLoggedIn,
  Token,
  Logout,
  Upgrade,
  Alert,
  ProFeature,
  UpdateAll,
  Feedback,
  GetChangeLog,
}

export enum ReceiveChannels {
  AlertError,
  Packages,
  Outdated,
  PackageUpdated,
  Cancelled,
  SaveToken,
  Logout,
  Alert,
  ProFeature,
  UpdatedAll,
  SendChangeLog,
}

export interface DefaultEventArgs {
  path: string
  workspace: string
}

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
      send: <T>(channel: SendChannels, data: T & MetaData) => void
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
