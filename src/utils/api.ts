import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { API_BASE_URL, AUTH_TOKEN_NAME, REQUEST_TIMEOUT, ROUTE_PREFIX } from '@/utils/env'
import { useUserStore } from '@/stores/user'

// 定义接口响应数据结构
interface ApiResponse<T = unknown> {
  success: boolean
  errorType: string
  errorCode: string
  errorContext: string | null
  data: T
  extendInfo: object
}

// 创建 axios 实例
const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    //如果是登录接口，不需要携带token
    const userStore = useUserStore()
    const token = userStore.userInfo?.token
    if (token) {
      config.headers = config.headers || {}
      config.headers[AUTH_TOKEN_NAME] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 定义处理 token 失效的函数
const handleTokenInvalid = () => {
  console.error('登录已过期，请重新登录')
  
  // 获取当前路由
  let currentPath = window.location.pathname + window.location.search
  
  // 如果当前路径已经包含了前缀，则移除前缀，避免重复
  if (ROUTE_PREFIX && currentPath.startsWith(ROUTE_PREFIX)) {
    currentPath = currentPath.substring(ROUTE_PREFIX.length)
  }
  
  // 清除用户信息
  const userStore = useUserStore()
  userStore.logout()
  
  // 跳转到登录页，并带上重定向参数
  window.location.href = `${ROUTE_PREFIX}/login?redirect=${encodeURIComponent(currentPath)}`
}

// 检查是否为 token 失效的错误码
const isTokenInvalidError = (errorCode: string): boolean => {
  const tokenInvalidCodes = ['017', '020', '021', '022']
  return tokenInvalidCodes.includes(errorCode)
}

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 检查响应数据中是否包含 token 失效的错误信息
    const responseData = response.data as ApiResponse<unknown>
    if (!responseData.success && isTokenInvalidError(responseData.errorCode)) {
      handleTokenInvalid()
      return Promise.reject(new Error('登录已过期，请重新登录'))
    }
    return response
  },
  (error: AxiosError) => {
    // 处理超时错误
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      console.error('请求超时，请稍后重试')
      return Promise.reject(new Error('请求超时，请稍后重试'))
    }

    // 处理网络错误
    if (error.message === 'Network Error') {
      console.error('网络异常，请检查您的网络连接')
      return Promise.reject(new Error('网络异常，请检查您的网络连接'))
    }

    // 处理 HTTP 状态码错误
    const { response } = error
    if (response) {
      const { status, data } = response
      let message = ''

      switch (status) {
        case 400:
          // 处理 token 无效的情况
          if (data && typeof data === 'object' && 'errorCode' in data) {
            const apiResponse = data as ApiResponse<unknown>
            if (isTokenInvalidError(apiResponse.errorCode)) {
              handleTokenInvalid()
              return Promise.reject(new Error('登录已过期，请重新登录'))
            }
          }
          message = '请求参数错误'
          break
        case 401:
          message = '未授权，请重新登录'
          // 可以在这里处理登出逻辑
          // store.dispatch('user/logout');
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求地址出错'
          break
        case 408:
          message = '请求超时'
          break
        case 500:
          message = '服务器内部错误'
          break
        case 501:
          message = '服务未实现'
          break
        case 502:
          message = '网关错误'
          break
        case 503:
          message = '服务不可用'
          break
        case 504:
          message = '网关超时'
          break
        case 505:
          message = 'HTTP版本不受支持'
          break
        default:
          message = `未知错误(${status})`
      }

      console.error(message)
      return Promise.reject(new Error(message))
    }

    return Promise.reject(error)
  },
)

/**
 * 封装的请求方法
 * @param config Axios请求配置
 * @returns Promise<T> 返回请求数据
 */
export async function request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await instance(config)
    const result = response.data

    // 判断请求是否成功
    if (result.success) {
      // 成功则返回 data 数据
      return result.data
    } else {
      // 处理 token 无效的情况
      if (isTokenInvalidError(result.errorCode)) {
        handleTokenInvalid()
        return Promise.reject(new Error('登录已过期，请重新登录'))
      }

      // 其他错误情况
      const errorMessage = result.errorContext || `请求失败: ${result.errorCode}`
      console.error(errorMessage)
      throw new Error(errorMessage)
    }
  } catch (error) {
    // 如果是自定义错误（已经在拦截器或上面处理过），则直接抛出
    if (error instanceof Error) {
      throw error
    }

    // 未知错误
    console.error('请求异常:', error)
    throw new Error('请求异常，请稍后重试')
  }
}

/**
 * GET 请求
 * @param url 请求地址
 * @param params 请求参数
 * @param config 其他配置
 * @returns Promise<T>
 */
export function get<T = unknown>(
  url: string,
  params?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  return request<T>({
    method: 'get',
    url,
    params,
    ...config,
  })
}

/**
 * POST 请求
 * @param url 请求地址
 * @param data 请求数据
 * @param config 其他配置
 * @returns Promise<T>
 */
export function post<T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  return request<T>({
    method: 'post',
    url,
    data,
    ...config,
  })
}

/**
 * PUT 请求
 * @param url 请求地址
 * @param data 请求数据
 * @param config 其他配置
 * @returns Promise<T>
 */
export function put<T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  return request<T>({
    method: 'put',
    url,
    data,
    ...config,
  })
}

/**
 * DELETE 请求
 * @param url 请求地址
 * @param params 请求参数
 * @param config 其他配置
 * @returns Promise<T>
 */
export function del<T = unknown>(
  url: string,
  params?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  return request<T>({
    method: 'delete',
    url,
    params,
    ...config,
  })
}

// 导出默认对象
export default {
  request,
  get,
  post,
  put,
  del,
}
