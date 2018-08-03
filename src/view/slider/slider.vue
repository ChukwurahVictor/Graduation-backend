<template>
    <div class="wrapper">
        <el-row>
            <el-button class="btn-add" type="danger" @click="addClick">新增轮播图<i class="el-icon-plus el-icon--right"></i>
            </el-button>
        </el-row>
        <el-table :data="sliderList"
                  border
                  style="width: 100%">
            <el-table-column label="轮播图图片" width="300" align="center">
                <template slot-scope="scope">
                    <img width="150" height="120" :src="scope.row.slider_pic" />
                </template>
            </el-table-column>
            <el-table-column prop="slider_intro" label="轮播图介绍" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="200">
                <template slot-scope="scope">
                    <el-button @click="editClick(scope.$index, scope.row)" size="small">编辑</el-button>
                    <el-button @click="deleteClick(scope.$index, scope.row)" type="danger" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--弹出框-->
        <el-dialog :title="formTitle" :visible.sync="dialogFormVisible">
            <el-form :model="sliderForm">
                <el-form-item label="轮播图图片" :label-width="formLabelWidth">
                    <el-upload
                            class="avatar-uploader"
                            action="//up.qbox.me/"
                            :show-file-list="false"
                            :on-success="handlePicSuccess"
                            :before-upload="beforePicUpload"
                            :data="tokenData">
                        <img v-if="sliderForm.pic" :src="sliderForm.pic" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="轮播图文案" :label-width="formLabelWidth">
                    <el-input v-model="sliderForm.intro" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogCancelClick">取 消</el-button>
                <el-button type="primary" @click="dialogConfirmClick">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
  import config from '../../utils/config';

  export default {
    data() {
      return {
        sliderList: [],
        formTitle: '',
        dialogFormVisible: false,
        sliderForm: {
          pic: '',
          intro: ''
        },
        formLabelWidth: '120px',
        tokenData: {
          token: config.qiniuToken
        }
      }
    },
    mounted() {
      console.log('[mounted]');
    },
    created() {
      this.tokenData.token = config.qiniuToken;
      console.log(this.tokenData.token);
      this.getSliderList();
    },
    methods: {
      getSliderList() {
        this.axios.get('/api/slider').then((response) => {
          console.log(response);
          if (response.data.status === 'OK') {
            this.sliderList = response.data.data;
            console.log('sliderList', this.sliderList);
          }
        });
      },
      addClick() {
        // 新增
//        this.$router.push({name: 'sliderNew'})
        this.dialogFormVisible = true;
        this.formTitle = '新增轮播图';
        this.sliderForm = {};
      },
      editClick(index, row) {
        // 编辑
        console.log(row);
        this.sliderForm = {
          pic: row.slider_pic,
          intro: row.slider_intro,
          id: row._id
        };
        this.dialogFormVisible = true;
        this.formTitle = '编辑轮播图';
      },
      dialogConfirmClick() {
        // 新增、编辑轮播图
        console.log('add', this.sliderForm);
        this.axios.post('/api/slider/addSlider', this.sliderForm).then((response) => {
          console.log(response);
          if (response.data.success) {
            this.$message({
              type: 'success',
              message: response.data.msg
            });
            // 在请求成功后需要重新去请求列表
            this.dialogFormVisible = false;
            this.getSliderList();
          }
        }).catch((error) => {
          console.log(error);
        })
      },
      dialogCancelClick() {
        // 取消，清空adminForm
        this.dialogFormVisible = false;
      },
      deleteClick(index, row) {
        // 删除
        console.log(index, row);
        this.$confirm('确定删除该轮播图？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete(`/api/slider/${row._id}`).then((response) => {
            console.log('delete', response);
            if (response.data.success) {
              this.sliderList.splice(index, 1);
              this.$message({
                type: 'success',
                message: '删除成功！'
              });
            }
          }).catch((error) => {
            console.log(error);
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除操作。'
          })
        });
      },
      handlePicSuccess(res, file) {
        // 编辑轮播图有问题？？？？？
        console.log(res);
        this.sliderForm.pic = 'http://ozwwcfemm.bkt.clouddn.com/' + res.key;
        console.log(this.sliderForm.pic);
        this.$set(this.sliderForm, 'pic', this.sliderForm.pic);
        console.log(this.sliderForm);
      },
      /**
       * 上传图片前处理
       * @param file
       * @return {boolean}
       */
      beforePicUpload(file) {
//        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

//        if (!isJPG) {
//          this.$message.error('上传图片只能是 JPG 格式!');
//        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isLt2M;
//        return isJPG && isLt2M;
      }
    }
  }
</script>

<style scoped>
    .wrapper {
        padding: 20px;
    }

    .btn-add {
        float: right;
        margin-bottom: 20px;
        margin-right: 20px;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
</style>