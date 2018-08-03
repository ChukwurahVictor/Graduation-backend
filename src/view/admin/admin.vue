<template>
    <div class="admin-wrapper">
        <el-row>
            <el-button class="btn-add" type="danger" @click="addClick">新增管理员<i class="el-icon-plus el-icon--right"></i>
            </el-button>
        </el-row>
        <el-table :data="showAdminList"
                  border
                  style="width: 100%">
            <el-table-column prop="admin_name" label="姓名" width="150" align="center"></el-table-column>
            <el-table-column prop="admin_id" label="工号" width="150" align="center"></el-table-column>
            <el-table-column prop="admin_type" label="类型" width="150" align="center">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.admin_type === '0' ? 'danger' : 'primary'">
                        {{filterType(scope.row.admin_type)}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="admin_phone" label="电话" width="150" align="center"</el-table-column>
            <el-table-column prop="admin_pass" label="密码" width="150" align="center">
                <!--<template slot-scope="scope">-->
                    <!--{{digestPass(scope.row.admin_pass)}}-->
                <!--</template>-->
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button @click="editClick(scope.$index, scope.row)" size="small">编辑</el-button>
                    <el-button @click="deleteClick(scope.$index, scope.row)" type="danger" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--弹出框-->
        <el-dialog :title="formTitle" :visible.sync="dialogFormVisible">
            <el-form :model="adminForm" :rules="adminRule" ref="adminForm">
                <el-form-item prop="name" label="姓名" :label-width="formLabelWidth">
                    <el-input v-model="adminForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="adminId" label="工号" :label-width="formLabelWidth">
                    <el-input v-model="adminForm.adminId" auto-complete="off" :disabled="isDisabled"></el-input>
                </el-form-item>
                <el-form-item prop="type" label="类型" :label-width="formLabelWidth">
                    <el-select v-model="adminForm.type" placeholder="请选择管理员类型" :disabled="!editable">
                        <el-option label="超级管理员" value="0"></el-option>
                        <el-option label="管理员" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="phone" label="电话" :label-width="formLabelWidth">
                    <el-input v-model="adminForm.phone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="pass" label="密码" :label-width="formLabelWidth">
                    <el-input v-model="adminForm.pass" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item style="text-align: center;">
                    <el-button @click="dialogCancelClick()">取 消</el-button>
                    <el-button type="primary" @click="dialogConfirmClick('adminForm')">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!--分页-->
        <el-row class="flex-center">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size=pageSize
                    layout="total, sizes, prev, pager, next, jumper"
                    :total=total>
            </el-pagination>
        </el-row>
    </div>
</template>

<script type="text/ecmascript-6">
//  import crypto from 'crypto';

//  const md5 = crypto.createHash("md5");

  export default {
    data() {
      var validatePhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          if (!(/^1[3|4|5|7|8][0-9]{9}$/).test(this.adminForm.phone)) {
            return callback(new Error('手机号码格式有误'));
          }
        }
      };
      return {
        adminList: [],
        showAdminList: [],
        formTitle: '',
        dialogFormVisible: false,
        adminForm: {
          name: '',
          adminId: '',
          type: '',
          phone: '',
          pass: ''
        },
        adminRule: {
          name: [
            {required: true, message: '请输入管理员名称', trigger: 'blur'}
          ],
          adminId: [
            {required: true, message: '请输入管理员工号', trigger: 'blur'},
            {min: 3, max: 11, message: '长度在 3 到 11 个字符', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请选择管理员类型', trigger: 'change'}
          ],
          phone: [
//            {validator: validatePhone, trigger: 'blur'}
            {required: true, trigger: 'blur'}
          ],
          pass: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        },
        formLabelWidth: '120px',
        isDisabled: false,
        currentPage: 1,
        total: 0,
        pageSize: 10,
        editable: true,
      }
    },
    created() {
      this.getAdminList();
    },
    methods: {
      getAdminList() {
        this.axios.get('/api/admin').then((response) => {
          console.log(response);
          if (response.data.status === 'OK') {
            this.adminList = response.data.data;
            this.total = this.adminList.length;
            this.changeList(this.currentPage, this.pageSize);
            console.log('adminList', this.adminList);
          }
        });
      },
      addClick() {
        // 新增
        this.dialogFormVisible = true;
        this.formTitle = '新增管理员';
        this.isDisabled = false;
        this.adminForm = {};
      },
      editClick(index, row) {
        // 编辑  编辑管理员接口未写
        console.log(index, row);
        if (sessionStorage.getItem('adminType') === row.admin_type) {
          this.editable = false;
        } else {
          this.editable = true;
        }
        this.isDisabled = true;
        this.adminForm.name = row.admin_name;
        this.adminForm.adminId = row.admin_id;
        this.adminForm.type = row.admin_type;
        this.adminForm.phone = row.admin_phone;
        this.adminForm.pass = row.admin_pass;
        this.adminForm = Object.assign(this.adminForm, {_id: row._id});
        console.log('adminForm', this.adminForm);
        this.dialogFormVisible = true;
        this.formTitle = '编辑管理员信息';
      },
      deleteClick(index, row) {
        // 删除
        console.log(index, row);
        this.$confirm('确定删除该管理员？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete(`/api/admin/${row._id}`).then((response) => {
            console.log('delete', response);
            if (response.data.success) {
              this.showAdminList.splice(index, 1);
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
      dialogConfirmClick(name) {
        // 新增、编辑管理员
        console.log(this.adminForm);
        this.$refs[name].validate((valid) => {
          console.log(valid);
          if (valid) {
            this.axios.post('/api/admin/addNewAdmin', this.adminForm).then((response) => {
              console.log(response);
              if (response.data.success) {
                this.$message({
                  type: 'success',
                  message: response.data.msg
                });
                // 在请求成功后需要重新去请求列表
                this.dialogFormVisible = false;
                this.getAdminList();
              } else {
                this.$message.error(response.data.msg);
              }
            }).catch((error) => {
              console.log(error);
            })
          } else {
            return false;
          }
        });
      },
      dialogCancelClick() {
        // 取消，清空adminForm
        this.dialogFormVisible = false;
        this.isDisabled = false;
      },
      filterType(type) {
        return type === '0' ? '超级管理员' : '普通管理员';
      },
      handleSizeChange(val) {
        // pageSize 改变时会触发
        // 回调参数  每页条数size
        console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.changeList(this.currentPage, this.pageSize);
      },
      handleCurrentChange(val) {
        // currentPage 改变时会触发
        // 回调参数  当前页currentPage
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        this.changeList(this.currentPage, this.pageSize);
      },
      changeList(cur, pageSize) {
        this.showAdminList = this.adminList.slice((cur - 1) * pageSize, cur * pageSize);
      },
      digestPass(pass) {
        return md5.digest(pass);
      }
    }
  }
</script>

<style scoped>
    .admin-wrapper {
        padding: 20px;
    }

    .btn-add {
        float: right;
        margin-bottom: 20px;
        margin-right: 20px;
    }

    .flex-center {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }
</style>