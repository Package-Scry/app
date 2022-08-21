export enum SendChannels {
  OpenWorkspaceFolder = "OpenWorkspaceFolder",
  PackageUpdate = "PackageUpdate",
  Authenticate = "Authenticate",
  IsLoggedIn = "IsLoggedIn",
  ValidateToken = "ValidateToken",
  Upgrade = "Upgrade",
  UpdateAllPackages = "UpdateAllPackages",
  Feedback = "Feedback",
  GetChangeLog = "GetChangeLog",
}

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
