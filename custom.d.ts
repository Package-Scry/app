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
  UpdateAllPackages = "UpdateAllPackages",
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

interface UpdateAllPackagesArgs extends DefaultEventArgs {
  data: {
    type: "wanted" | "latest"
  }
}
export interface UpdateAllPackages extends UpdateAllPackagesArgs {
  channel: SendChannels.UpdateAllPackages
}

export type MainEvents =
  | Token
  | PackageUpdate
  | OpenWorkspaceFolder
  | UpdateAllPackages

// -------- ReceiveChannels --------

export enum ReceiveChannels {
  AlertError = "AlertError",
  GetPackages = "GetPackages",
  GetOutdatedPackages = "GetOutdatedPackages",
  PackageUpdated = "PackageUpdated",
  OpenWFolderCancelled = "OpenWFolderCancelled",
  SaveToken = "SaveToken",
  TestAlert = "TestAlert",
  IsProFeature = "IsProFeature",
  UpdatedAllPackage = "UpdatedAllPackage",
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

interface IsProFeatureArgs {}
interface IsProFeature {
  channel: ReceiveChannels.IsProFeature
  fn: (args: IsProFeatureArgs) => void
}
type IsProFeatureSend = Omit<IsProFeature, "fn"> & IsProFeatureArgs

interface OpenWFolderCancelledArgs {}
interface OpenWFolderCancelled {
  channel: ReceiveChannels.OpenWFolderCancelled
  fn: (args: OpenWFolderCancelledArgs) => void
}
type OpenWFolderCancelledSend = Omit<OpenWFolderCancelled, "fn"> &
  OpenWFolderCancelledArgs

interface GetPackagesArgs {
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

interface GetOutdatedPackagesArgs extends MetaData {
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

interface PackageUpdatedArgs extends MetaData, CallbackStatus {
  data: {
    name: string
    version: string
  }
}
interface PackageUpdated {
  channel: ReceiveChannels.PackageUpdated
  fn: (args: PackageUpdatedArgs) => void
}
type PackageUpdatedSend = Omit<PackageUpdated, "fn"> & PackageUpdatedArgs

interface SaveTokenArgs {
  data: {
    token: string
    hasPro: boolean
  }
}
interface SaveToken {
  channel: ReceiveChannels.SaveToken
  fn: (args: SaveTokenArgs) => void
}
type SaveTokenSend = Omit<SaveToken, "fn"> & SaveTokenArgs

interface TestAlertArgs {
  data: {
    text: string
  }
}
interface TestAlert {
  channel: ReceiveChannels.TestAlert
  fn: (args: TestAlertArgs) => void
}
type TestAlertSend = Omit<TestAlert, "fn"> & TestAlertArgs

interface UpdatedAllPackageArgs extends MetaData, CallbackStatus {}
interface UpdatedAllPackage {
  channel: ReceiveChannels.UpdatedAllPackage
  fn: (args: UpdatedAllPackageArgs) => void
}
type UpdatedAllPackageSend = Omit<UpdatedAllPackage, "fn"> &
  UpdatedAllPackageArgs

export type RendererEvents =
  | AlertError
  | IsProFeature
  | OpenWFolderCancelled
  | GetPackages
  | GetOutdatedPackages
  | PackageUpdated
  | SaveToken
  | TestAlert
  | UpdatedAllPackage
export type RendererEventsSend =
  | AlertErrorSend
  | IsProFeatureSend
  | OpenWFolderCancelledSend
  | GetPackagesSend
  | GetOutdatedPackagesSend
  | PackageUpdatedSend
  | SaveTokenSend
  | TestAlertSend
  | UpdatedAllPackageSend

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
