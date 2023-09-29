export interface Versions {
  node: any,
  chrome: any,
  electron: any,
}

declare global {
  interface Window {
    versions: Versions
  }
}
