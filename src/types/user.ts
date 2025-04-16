// 用户相关类型定义

// 登录参数接口
export interface LoginParams {
  loginId: string
  loginType: string
  identifyType: string
  identifyValue: string
}

// 访问令牌接口
export interface AccessToken {
  tokenType: string
  tokenValue: string
}

// 用户资料接口
export interface UserProfile {
  userName: string
  gender: string | null
  birthDay: string | null
}

// 登录结果接口
export interface LoginResult {
  userId: string
  userType: string
  userStatus: string
  accessToken: AccessToken
  userProfile: UserProfile
  token: string
}
