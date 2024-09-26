import { type IBrokerAdapter } from '@/main/adapters'

export default async (broker: IBrokerAdapter): Promise<void> => {
  await broker.subscribe('business-partner-identity-requested', (myHandler: any) => { })
}
