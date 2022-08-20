import type { Package } from "./src/app/components/stores/package"

export {}

// -------- SendChannels --------
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

// -------- ReceiveChannels --------

export enum ReceiveChannels {
  AlertError = "AlertError",
  GetPackages = "GetPackages",
  GetOutdatedPackages = "GetOutdatedPackages",
  PackageUpdated = "PackageUpdated",
  OpenWFolderCancelled = "OpenWFolderCancelled",
  SaveToken = "SaveToken",
  Alert = "Alert",
  ProFeature = "ProFeature",
  UpdatedAll = "UpdatedAll",
  SendChangeLog = "SendChangeLog",
}

export interface CallbackStatus {
  wasSuccessful: boolean
}
interface MetaData {
  meta: { workspace: string }
}

interface AlertErrorArgs extends MetaData {
  data: {
    error: string
    channel: SendChannels
  }
}
interface AlertError {
  channel: ReceiveChannels.AlertError
  fn: (args: AlertErrorArgs) => void
}
type AlertErrorSend = Omit<AlertError, "fn"> & AlertErrorArgs

interface ProFeatureArgs extends DefaultRendererEventArgs {}
interface ProFeature {
  channel: ReceiveChannels.ProFeature
  fn: (args: ProFeatureArgs) => void
}
type ProFeatureSend = Omit<ProFeature, "fn"> & ProFeatureArgs

interface OpenWFolderCancelledArgs extends DefaultRendererEventArgs {}
interface OpenWFolderCancelled {
  channel: ReceiveChannels.OpenWFolderCancelled
  fn: (args: OpenWFolderCancelledArgs) => void
}
type OpenWFolderCancelledSend = Omit<OpenWFolderCancelled, "fn"> &
  OpenWFolderCancelledArgs

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
type GetPackagesSend = Omit<GetPackages, "fn"> & GetPackagesArgs
interface GetOutdatedPackagesArgs extends DefaultRendererEventArgs {
  data: {
    packages: Omit<Package, "local", "status">[]
  }
}
interface GetOutdatedPackages {
  channel: ReceiveChannels.GetOutdatedPackages
  fn: (args: GetOutdatedPackagesArgs) => void
}
type GetOutdatedPackagesSend = Omit<GetOutdatedPackages, "fn"> &
  GetOutdatedPackagesArgs

export type RendererEvents =
  | AlertError
  | ProFeature
  | OpenWFolderCancelled
  | GetPackages
  | GetOutdatedPackages
export type RendererEventsSend =
  | AlertErrorSend
  | ProFeatureSend
  | OpenWFolderCancelledSend
  | GetPackagesSend
  | GetOutdatedPackagesSend

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
