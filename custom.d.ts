import type { Package } from "./src/app/components/stores/package"

export {}

export enum SendChannels {
  OpenWorkspaceFolder = "OpenWorkspaceFolder",
  PackageUpdate = "PackageUpdate",
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
  AlertError = "AlertError",
  GetPackages = "GetPackages",
  Outdated = "Outdated",
  PackageUpdated = "PackageUpdated",
  OpenWFolderCancelled = "OpenWFolderCancelled",
  SaveToken = "SaveToken",
  Alert = "Alert",
  ProFeature = "ProFeature",
  UpdatedAll = "UpdatedAll",
  SendChangeLog = "SendChangeLog",
}

export interface DefaultEventArgs {
  meta: { path?: string; workspace?: string }
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

interface OpenWorkspaceFolderArgs extends DefaultEventArgs {
  data: {
    workspaceCount
  }
}
export interface OpenWorkspaceFolder extends OpenWorkspaceFolderArgs {
  channel: SendChannels.OpenWorkspaceFolder
}

export type MainEvents = Token | PackageUpdate | OpenWorkspaceFolder

interface MetaData extends CallbackStatus {
  meta: { workspace?: string }
}
interface DefaultRendererEventArgs extends MetaData {}

interface ProFeatureArgs extends DefaultRendererEventArgs {}
interface ProFeature {
  channel: ReceiveChannels.ProFeature
  fn: (args: ProFeatureArgs) => void
}

interface OpenWFolderCancelledArgs extends DefaultRendererEventArgs {}
interface OpenWFolderCancelled {
  channel: ReceiveChannels.OpenWFolderCancelled
  fn: (args: OpenWFolderCancelledArgs) => void
}

interface GetPackagesArgs extends DefaultRendererEventArgs {
  data: {
    packages: Package[]
    filePath: string
    name: string
  }
}
interface GetPackages {
  channel: ReceiveChannels.GetPackages
  fn: (args: GetPackagesArgs) => void
}

export type RendererEvents = ProFeature | OpenWFolderCancelled | GetPackages

export interface CallbackStatus {
  wasSuccessful?: boolean
  error?: string
}

declare global {
  interface Window {
    api: {
      send: ({ channel, data, meta }: MainEvents) => void
      receive: ({ channel, fn }: RendererEvents) => void
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
