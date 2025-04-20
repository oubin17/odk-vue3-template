<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { LoginParams } from '@/types/user'
import { useUserStore } from '@/stores/user'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

// 引入 Iconify 图标组件
import { Icon } from '@iconify/vue'

//获取用户登录 store
const userStore = useUserStore()

const router = useRouter()
const route = useRoute()

const loginFormRef = ref()


// 登录表单数据
const loginForm = reactive<LoginParams>({
  loginId: '',
  loginType: '1',
  identifyType: '1',
  identifyValue: ''
})
// 登录表单校验规则
const loginRules = reactive<FormRules>({
  loginId: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 20, message: '账号长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  identifyValue: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, max: 20, message: '密码长度在 3 到 20 个字符', trigger: 'blur' }
  ]
})

// 登录状态
const loading = ref(false)

// 登录方法
const handleLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await userStore.login(loginForm)
        ElMessage.success('登录成功')
        // 1. 获取重定向路径（处理未定义情况）
        const redirectPath = route.query.redirect?.toString() || '/'
        // 2. 跳转到 redirect 或默认页面
        router.replace(redirectPath || '/') // 使用 replace 避免历史记录残留
        // router.push(redirectPath || '/')
      } catch (error) {
        console.error('登录失败：', error)
        ElMessage.error('登录失败，请检查账号密码')
      } finally {
        loading.value = false
      }
    }
  })
}

</script>
<template>
  <div class="login-container">
    <div v-if="userStore.isLoggedIn" class="login-success">
      <h2>登录成功</h2>
      <p>欢迎回来，{{ userStore.userInfo?.userProfile.userName }}！</p>
      <el-button type="primary" @click="router.push('/')">

        <Icon icon="material-symbols:family-home-outline" class="icon-margin" /> 返回首页
      </el-button>
      <el-button type="primary" @click="userStore.logout">
        <Icon icon="mdi:logout" class="icon-margin" /> 退出登录
      </el-button>
    </div>
    <div v-else class="login-form-wrapper">
      <div class="login-header">
        <h2>用户登录</h2>
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="80px" class="login-form">
        <el-form-item label="账号" prop="loginId">
          <el-input v-model="loginForm.loginId" placeholder=" 请输入账号" />
        </el-form-item>
        <el-form-item label="密码" prop="identifyValue">
          <el-input v-model="loginForm.identifyValue" type="password" palceholder="请输入密码" show-password
            @keyup.enter="handleLogin(loginFormRef)" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleLogin(loginFormRef)">
            <Icon icon="mdi:login" class="icon-margin" /> 登录
          </el-button>
          <el-button @click="loginFormRef?.resetFields()">
            <Icon icon="mdi:refresh" class="icon-margin" /> 重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<style scoped>
/**
align-items: center; 垂直居中
justify-content: center; 水平居中
*/
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 20px;
}

.login-form-wrapper {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.login-header {
  text-align: center;
  margin-bottom: 20px;
}

.login-form {
  margin-top: 20px;
}

.login-success {
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #f0f9eb;
}

/* 添加图标相关样式 */
.icon-margin {
  margin-right: 4px;
}
</style>
