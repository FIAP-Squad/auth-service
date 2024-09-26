export interface ICreateBusinessPartner<T> {
  execute: (params: T) => Promise<void>
}

export class CreateBusinessPartner<T> implements ICreateBusinessPartner<T> {
  async execute (params: T): Promise<void> {
    await Promise.resolve()
  }
}
