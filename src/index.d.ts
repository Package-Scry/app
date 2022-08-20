export interface PackageJSON {
  name?: string
  dependencies?: {
    [key in string]: string
  }
  devDependencies?: {
    [key in string]: string
  }
}
