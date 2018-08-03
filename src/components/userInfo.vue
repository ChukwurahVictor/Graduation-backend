<template>
    <div class="user-info" v-for="user in userInfo">
        <img v-if="user.avatar" :src="user.avatar" alt="管理员头像">
        <img v-else :src="defaultAvatar" alt="管理员默认头像">
        <div>
            <span>管理员工号：</span>
            <el-input disabled="true" :value="user.id" auto-complete="off"></el-input>
        </div>
        <div>
            <span>管理员类型：</span>
            <el-input disabled="true" :value="user.id" auto-complete="off"></el-input>
        </div>
        <div>
            <span>管理员电话：</span>
            <el-input placeholder="请输入电话" v-model="user.phone" auto-complete="off"></el-input>
        </div>
        <div>
            <span>管理员密码：</span>
            <el-input type="password" placeholder="请输入密码" v-model="user.pass" auto-complete="off"></el-input>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import config from 'src/utils/config';

  export default {
    data() {
      return {
        userInfo: {
          id: '',  // 工号
          type: '',  // 类型
          phone: '', // 电话
          avatar: '',  // 头像
          name: '',  // 用户名
          pass: '',  // 密码
        },
        defaultAvatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3860817268,321424218&fm=27&gp=0.jpg',  // 默认头像图片
        tokenData: {
          token: ''
        }
      }
    }
  }
</script>

<style scoped>
    .user-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>