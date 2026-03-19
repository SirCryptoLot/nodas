import * as crypto from 'crypto'

export function createPayseraPayment(params: {
  orderId: string
  amount: number // centais
  currency: string
  description: string
  callbackUrl: string
  acceptUrl: string
  cancelUrl: string
  email?: string
}) {
  const projectId = process.env.PAYSERA_PROJECT_ID!
  const signPassword = process.env.PAYSERA_SIGN_PASSWORD!
  const test = process.env.NODE_ENV !== 'production' ? '1' : '0'

  const data = {
    projectid: projectId,
    orderid: params.orderId,
    amount: params.amount.toString(),
    currency: params.currency,
    country: 'LT',
    accepturl: params.acceptUrl,
    cancelurl: params.cancelUrl,
    callbackurl: params.callbackUrl,
    test,
    p_email: params.email ?? '',
  }

  const dataStr = Object.entries(data).map(([k, v]) => `${k}=${v}`).join('&')
  const encoded = Buffer.from(dataStr).toString('base64').replace(/\+/g, '-').replace(/\//g, '_')
  const sign = crypto.createHash('md5').update(encoded + signPassword).digest('hex')

  return `https://www.paysera.com/pay/?data=${encoded}&sign=${sign}`
}

export function verifyPayseraCallback(data: string, sign: string): boolean {
  const signPassword = process.env.PAYSERA_SIGN_PASSWORD!
  const expected = crypto.createHash('md5').update(data + signPassword).digest('hex')
  return expected === sign
}

export function parsePayseraCallback(data: string): Record<string, string> {
  const decoded = Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()
  return Object.fromEntries(decoded.split('&').map(p => p.split('=')))
}
