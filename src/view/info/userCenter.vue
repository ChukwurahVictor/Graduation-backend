<template>
    <div class="user-center-wrapper">
        <div class="user-center-container">
            <div class="user-item user-item-extra">
                <el-upload
                        :disabled="isReadonly"
                        class="avatar-uploader"
                        action="//up.qbox.me/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :data="postData">
                    <img v-if="showUser.admin_avatar" :src="showUser.admin_avatar" class="avatar">
                    <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
                    <img v-else :src="defaultAvatar" class="avatar">
                </el-upload>
            </div>
            <div class="user-item">
                <span class="user-item-label">管理员工号：</span>
                <el-input style="flex: 1;" :disabled=true :value="showUser.admin_id" auto-complete="off"></el-input>
            </div>
            <div class="user-item">
                <span class="user-item-label">管理员名称：</span>
                <el-input :readonly=isReadonly style="flex: 1;" :value="showUser.admin_name"
                          auto-complete="off"></el-input>
            </div>
            <div class="user-item">
                <span class="user-item-label">管理员类型：</span>
                <el-select style="flex: 1;" v-model="showUser.adminType==='0'? '超级管理员':'普通管理员'"
                           placeholder="请选择管理员类型" :disabled=true>
                    <el-option label="超级管理员" value="0"></el-option>
                    <el-option label="普通管理员" value="1"></el-option>
                </el-select>
            </div>
            <div class="user-item">
                <span class="user-item-label">管理员电话：</span>
                <el-input :readonly=isReadonly style="flex: 1;" placeholder="请输入电话" v-model="showUser.admin_phone"
                          auto-complete="off"></el-input>
            </div>
            <div class="user-item">
                <span class="user-item-label">管理员密码：</span>
                <el-input :readonly=isReadonly style="flex: 1;" type="password" placeholder="请输入密码"
                          v-model="showUser.admin_pass" auto-complete="off"></el-input>
            </div>
            <div class="button-wrapper">
                <el-button :type="isEdit ? 'success': 'danger'" style="margin-right: 20px;" @click="editClick">
                    {{buttonType}}
                </el-button>
                <!--<el-button type="primary" :disabled="!isEdit" @click="cancelClick">取消</el-button>-->
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapActions, mapMutations} from 'vuex';
  import config from '../../utils/config';

  export default {
    data() {
      return {
        defaultAvatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513936552184&di=b8c7cfb7e7acc6e292868615bca20e08&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01f7f056fe40fc32f875a944bd1c7b.png',
        isReadonly: true,
        isEdit: false,
        user: {},  // 获取的用户信息
        showUser: {},  // 显示的用户信息
        postData: {
          token: config.qiniuToken,
        }
      }
    },
    created() {
      this.getAdminInfo();
      console.log('config', config);
    },
    computed: {
      buttonType() {
        return this.isEdit ? '完成' : '编辑';
      },
      ...mapGetters([
        'userInfo'
      ])
    },
    methods: {
      getAdminInfo() {
        let id = sessionStorage.getItem("id");
        this.axios.get(`/api/admin/${id}`).then((response) => {
          console.log(response.data);
          if (response.data.success) {
            this.user = response.data.data;
            this.showUser = response.data.data;
            this.setUserInfo(response.data.data);
          } else {
            this.$message.error(response.data.msg);
          }
        }).catch((err) => {
          console.log('err', err);
        });
      },
      editClick() {
        if (!this.isEdit) {
          // 编辑
          this.isReadonly = false;
        } else {
          // 完成
          let userAvatar = this.showUser.admin_avatar ? this.showUser.admin_avatar : '';
          let param = {
            adminId: this.showUser.admin_id,
            name: this.showUser.admin_name,
            phone: this.showUser.admin_phone,
            pass: this.showUser.admin_pass,
            type: this.showUser.admin_type,
            avatar: userAvatar,
            _id: this.showUser._id
          };
          this.axios.post('/api/admin/addNewAdmin', param).then((response) => {
            console.log(response);
            if (response.data.success) {
//              this.user = this.showUser;
              this.$message({
                type: 'success',
                message: response.data.msg
              });
            }
          }).catch((err) => {
            console.log(error);
          });
        }
        this.isEdit = !this.isEdit;
      },
      cancelClick() {
        console.log(JSON.stringify(this.userInfo));
        this.isReadonly = true;
        this.isEdit = false;
        this.showUser = this.userInfo;
        console.log('cancel', JSON.stringify(this.user));
        console.log('cancel', JSON.stringify(this.showUser));
      },
      handleAvatarSuccess(res, file) {4
        console.log(res);
        this.showUser.admin_avatar = 'http://ozwwcfemm.bkt.clouddn.com/'+res.key;
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isLt2M;
      },
      ...mapActions([
        'setUserInfo'
      ])
//      ...mapMutations({
//        setUserInfo: 'SET_USER_INFO'
//      })
    }
  }
</script>

<style scoped>
    .user-center-wrapper {
        display: flex;
        justify-content: center;
    }

    .user-center-container {
        width: 500px;
        margin-top: 50px;
    }

    .user-item {
        width: 500px;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 20px;
    }

    .user-item-extra {
        justify-content: center;
    }

    .user-item-label {
        width: 100px;
    }

    .user-avatar {
        text-align: center;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background-color: #42b983;
    }

    .button-wrapper {
        display: flex;
        justify-content: center;
    }
</style>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 50% !important;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar {
        width: 100px !important;
        height: 100px !important;
        display: block;
    }
</style>