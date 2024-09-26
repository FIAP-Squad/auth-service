export default async (broker: any): Promise<void> => {
  await broker.subscribe('business_partner_requested', (myHandler: any) => { })
}
