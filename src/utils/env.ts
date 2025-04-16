// 环境变量工具函数

/**
 * 获取环境变量
 * @param key 环境变量名称
 * @param defaultValue 默认值
 * @returns 环境变量值
 */
export function getEnv<T = string>(key: string, defaultValue?: T): string | T {
  const envKey = `VITE_${key.toUpperCase()}`
  const env = import.meta.env[envKey]
  return env !== undefined ? env : (defaultValue as T)
}

/**
 * 当前环境
 */
export const ENV = import.meta.env.MODE

/**
 * 是否为开发环境
 */
export const isDev = ENV === 'development'

/**
 * 是否为生产环境
 */
export const isProd = ENV === 'production'

/**
 * 是否为测试环境
 */
export const isTest = ENV === 'test'

/**
 * 应用名称
 */
export const APP_NAME = getEnv('APP_NAME', 'ODK Vue3 Template')

/**
 * API基础URL
 */
export const API_BASE_URL = getEnv('API_BASE_URL', '/api')

/**
 * 路由前缀
 */
export const ROUTE_PREFIX = getEnv('ROUTE_PREFIX', '')

/**
 * 请求超时时间（毫秒）
 */
export const REQUEST_TIMEOUT = Number(getEnv('REQUEST_TIMEOUT', 10000))

/**
 * 认证 Token 参数名
 */
export const AUTH_TOKEN_NAME = getEnv('AUTH_TOKEN_NAME', 'odk-token')

/**
 * 默认语言
 */
export const DEFAULT_LOCALE = getEnv('DEFAULT_LOCALE', 'zh-CN')

/**
 * 是否启用日志
 */
export const ENABLE_LOGS = getEnv('ENABLE_LOGS', 'true') === 'true'

// 导出所有环境变量
export default {
  ENV,
  isDev,
  isProd,
  isTest,
  APP_NAME,
  API_BASE_URL,
  ROUTE_PREFIX,
  REQUEST_TIMEOUT,
  DEFAULT_LOCALE,
  ENABLE_LOGS,
  AUTH_TOKEN_NAME,
  // 添加 Vite 内置环境变量
  BASE_URL: import.meta.env.BASE_URL,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
}
