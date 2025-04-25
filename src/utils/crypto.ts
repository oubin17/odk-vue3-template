import JSEncrypt from 'jsencrypt'

// 缓存公钥内容
let cachedPublicKey: string | null = null

// 硬编码公钥内容
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtUC3zAPbYC9bci0r+7wX
J98nWu9IlN2Lo+hDOjVLN4kQBqX5WHlgYC7Pv8cP2t94wUyC0mUfB8SDG0GrkN3H
DCRsUrflnHmVYkmcAp1sz04YJ7/DZnf47z6KiZkW1GAp/EveHjMCA1JEhM2DCYGB
cY0p8C4G1GpgRV6vU8ECUccuwctzwWIE0ligbmN7rjc7DiPL8hDNCAb0KaWxwcJW
1sOy4JTKnRB2/35vVUH8/pi+U9AJnd8jy67VChy0vBlVFg/ji1ghHQoJaMZDjfNi
QMVcC0AJnaqgvaGGhioMladPP3PwnCwl3rVR9ku4cYVaLuADY/y5gofZCPbZvJhX
vQIDAQAB
-----END PUBLIC KEY-----`

/**
 * 获取RSA公钥
 * @returns 公钥内容
 */
export function getPublicKey(): string {
  if (!cachedPublicKey) {
    cachedPublicKey = PUBLIC_KEY
  }
  return cachedPublicKey
}

/**
 * 使用RSA公钥加密数据
 * @param data 要加密的数据
 * @returns 加密后的数据
 */
export function encryptWithPublicKey(data: string): string {
  const publicKey = getPublicKey()
  if (!publicKey) {
    throw new Error('公钥未加载')
  }

  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey)
  const encrypted = encryptor.encrypt(data)

  if (!encrypted) {
    throw new Error('加密失败')
  }

  return encrypted
}
