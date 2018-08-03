<template>
    <div class="login-container">
        <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left"
                 label-width="0px"
                 class="card-box login-form">
            <h3 class="title">后台登录</h3>
            <el-form-item prop="adminId">
                <el-input type="text" v-model="loginForm.adminId" autoComplete="off" placeholder="请输入工号">
                </el-input>
            </el-form-item>
            <el-form-item prop="type">
                <el-select v-model="loginForm.type" placeholder="请选择管理员类型" style="width: 300px;">
                    <el-option
                            v-for="item in typeOptions"
                            :label="item.value"
                            :key="item.key"
                            :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="adminPass">
                <el-input type="password" @keyup.enter.native="handleLogin"
                          v-model="loginForm.adminPass" autoComplete="off" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
                    登录
                </el-button>
            </el-form-item>
            <div class='tips'>初始密码均为123456，请在登陆后及时更改密码！</div>
        </el-form>
    </div>
</template>

<script type="text/ecmascript-6">
  import {mapMutations, mapActions} from 'vuex';

  export default {
    data() {
      return {
        loginForm: {
          adminId: '',
          type: '',
          adminPass: ''
        },
        loginRules: {
          adminId: [
            {required: true, message: '工号不可为空', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '类型不可为空', trigger: 'change'}
          ],
          adminPass: [
            {required: true, message: '密码不可为空', trigger: 'blur'}
          ]
        },
        loading: false,
        typeOptions: [
          {value: '普通管理员', key: '1'},
          {value: '超级管理员', key: '0'}
        ]
      }
    },
    methods: {
      handleLogin() {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            this.axios.post('/api/login', this.loginForm).then((response) => {
              console.log(response);
              if (response.data.success) {
                // 保存用户信息，并跳转到首页
                console.log(response.data);
                this.setUserInfo(response.data.data);
                let id = response.data.data._id;
//                let adminId = response.data.data.admin_id;
//                let adminPass = response.data.data.admin_pass;
                let adminType = response.data.data.admin_type;
                let adminName = response.data.data.admin_name;
                sessionStorage.setItem('id', id);
//                sessionStorage.setItem('adminId', adminId);
//                sessionStorage.setItem('adminPass', adminPass);
                sessionStorage.setItem('adminType', adminType);
                sessionStorage.setItem('adminName', adminName);
                sessionStorage.setItem('token', response.data.token);
//                sessionStorage.setItem('userInfo', response.data.data);
                this.$router.push({name: 'userCenter'});
              } else {
                this.$message.error(response.data.msg);
              }
            }).catch((error) => {
              console.log('error', error);
            });
          } else {
            return false;
          }
        });
      },
      ...mapMutations({
        setUserInfo: 'SET_USER_INFO'
      })
    },
    mounted () {
      let $sessionStorage = window.sessionStorage;
      if (!$sessionStorage) {
        alert('为保证您可以正常使用我们的产品，请关闭浏览器的无痕浏览模式！');
        return;
      }
      if ($sessionStorage.id && $sessionStorage.adminType && $sessionStorage.adminName && $sessionStorage.token) {
        this.$router.push({name: 'userCenter'});
      }
    }
  }
</script>

<style>
    .login-container {
        position: relative;
        height: 100vh;
        background: url('/static/img/bg.jpg') no-repeat;
        background-size: cover;
    }

    .login-form {
        position: absolute;
        left: 0;
        right: 0;
        width: 300px;
        padding: 35px 35px 15px 35px;
        margin: 120px auto;
    }

    .title {
        font-size: 26px;
        color: #eeeeee;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
    }

    .svg-container {
        padding: 6px 5px 6px 15px;
        width: 40px;
        float: left;
        text-align: center;
        color: #889aa4;
        font-size: 20px;
    }

    .tips {
        color: #ffffff;
        font-size: 12px;
        text-align: center;
    }
</style>