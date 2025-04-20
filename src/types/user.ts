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

// 用户状态枚举
export enum UserStatus {
  CLOSED = '-1', // 销户
  NORMAL = '0', // 正常
  FROZEN = '2', // 冻结
}
// export class UserStatusObj {
//   constructor(
//     public userStatus: UserStatus,
//     public userStatusDesc: string,
//   ) {}
// }

// 用户状态映射到中文描述
// export const UserStatusMap: Record<string, UserStatusObj> = {
//   '0': new UserStatusObj(UserStatus.NORMAL, '正常'),
//   '2': new UserStatusObj(UserStatus.FROZEN, '冻结'),
//   '-1': new UserStatusObj(UserStatus.CLOSED, '销户'),
// }
export const UserStatusMap: Record<string, string> = {
  '0': '正常',
  '2': '冻结',
  '-1': '销户',
}

// 登录结果接口
export interface UserEntity {
  userId: string
  userType: string
  userStatus: string
  accessToken: AccessToken
  userProfile: UserProfile
  token: string
}
