<template>
    <div class="header-wrapper">
        <div class="logo">信息学院招生网后台</div>
        <div class="admin-info">
            <el-dropdown @command="handleCommand">
                <i class="el-icon-setting" style="margin-right: 15px;color: #ffffff;"></i>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="userCenter">个人中心</el-dropdown-item>
                    <el-dropdown-item command="login">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <span class="name">{{userName}}</span>
        </div>
    </div>
</template>

<script>
//  import {mapGetters, mapMutations} from 'vuex';

  export default {
    data() {
      return {
        userName: ''
      }
    },
    created() {
      this.userName = sessionStorage.getItem('adminName');
    },
    computed: {
//      ...mapGetters({
//        userInfo: 'userInfo'
//      })
    },
    methods: {
      handleCommand(command) {
        console.log('command', command);
        if (command === 'login') {
          // this.setUserInfo({});
          sessionStorage.removeItem('id');
          sessionStorage.removeItem('adminName');
          sessionStorage.removeItem('adminType');
          sessionStorage.removeItem('token');
        }
        this.$router.push({name: command});
      }
//      ...mapMutations({
//        setUserInfo: 'SET_USER_INFO'
//      })
    }
  }
</script>

<style scoped>
    .header-wrapper {
        position: fixed;
        top: 0;
        z-index: 1001;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background-color: #242f42;
        color: #333;
        line-height: 60px;
        font-size: 18px;
    }

    .logo {
        color: #ffffff;
        margin-left: 20px;
    }

    .admin-info {
        margin-right: 40px;
        color: #ffffff;
    }

    .name {
    }
</style>
