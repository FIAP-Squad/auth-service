export interface IListener {
  handle: (event: any) => Promise<void>
}
