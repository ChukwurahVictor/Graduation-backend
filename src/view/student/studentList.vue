<template>
    <div class="student-wrapper">
        <!--<el-row>-->
            <!--<el-button class="btn-add" type="danger" @click="addClick">新增学生<i class="el-icon-plus el-icon&#45;&#45;right"></i>-->
            <!--</el-button>-->
        <!--</el-row>-->
        <el-table :data="showStudentList"
                  border
                  style="width: 100%">
            <el-table-column prop="student_name" label="姓名" width="100" align="center"></el-table-column>
            <el-table-column prop="student_id" label="身份证号" align="center"></el-table-column>
            <el-table-column prop="student_interested" label="意向专业" width="200" align="center"></el-table-column>
            <el-table-column prop="student_phone" label="联系电话" width="150" align="center"></el-table-column>
            <el-table-column prop="student_isAdmitted" label="状态" width="100" align="center">
                <template slot-scope="scope">
                    <el-tag :type="filterTypeTag(scope.row.student_isAdmitted)">
                        {{filterType(scope.row.student_isAdmitted)}}
                    </el-tag>
                </template>
            </el-table-column>
            <!--<el-table-column prop="student_pass" label="密码" width="150" align="center"></el-table-column>-->
            <el-table-column label="操作" align="center" width="180">
                <template slot-scope="scope">
                    <el-button @click="acceptClick(scope.$index, scope.row)" size="small" type="success"
                               :disabled="scope.row.student_isAdmitted !== '0'">录取
                    </el-button>
                    <el-button @click="rejectClick(scope.$index, scope.row)" size="small" type="danger"
                               :disabled="scope.row.student_isAdmitted !== '0'">未录取
                    </el-button>
                    <el-button @click="open(scope.$index, scope.row)" size="small" type="danger">打开
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

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

        <!--弹出框-->
        <el-dialog title="编辑" :visible.sync="dialogFormVisible">
            <el-form :model="studentForm">
                <el-form-item label="问题" :label-width="formLabelWidth">
                    <el-input v-model="studentInfo.student_question" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <el-form :model="studentForm">
                <el-form-item label="答案" :label-width="formLabelWidth">
                    <el-input v-model="studentInfo.student_answer" auto-complete="off"></el-input>
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
  export default {
    data() {
      return {
        studentList: [],
        showStudentList: [],
        currentPage: 1,
        total: 0,
        pageSize: 10,
        formTitle: '新增学生',
        dialogFormVisible: false,
        formLabelWidth: '120px',
        studentForm: {},
        studentInfo: {}
      }
    },
    created() {
      this.getStudentList();
    },
    methods: {
      getStudentList() {
        this.axios.get('/api/student').then((response) => {
          if (response.data.status === 'OK') {
            this.studentList = response.data.data;
            this.total = this.studentList.length;
            this.changeList(this.currentPage, this.pageSize);
          }
        });
      },
      modifyStatus(param) {
        this.axios.post('/api/modifyStudent', param).then((response) => {
          console.log('modifyStatus', response);
          if (response.status === 200) {
            console.log('enter');
            // 页面刷新
            this.getStudentList();
//            location.reload();
          }
        });
      },
      addClick() {
        this.dialogFormVisible = true;
      },
      dialogCancelClick() {
        // 取消，清空adminForm
        this.dialogFormVisible = false;
      },
      dialogConfirmClick() {
        // 新增学生
        this.axios.post('/api/modifyStudent', {
          id: this.studentInfo._id,
          phone: this.studentInfo.student_phone,
          answer: this.studentInfo.student_question,
          question: this.studentInfo.student_question,
        }).then((response) => {
          console.log('info', response);
        })
      },
      acceptClick(index, row) {
        // 录取
//        console.log('录取', row);
//        let param = {
//          id: row._id,
//          isAdmitted: '1'
//        };
//        this.modifyStatus(param);
        this.dialogFormVisible = true;
        this.studentInfo = row;
      },
      open(index, row) {
        this.dialogFormVisible = true;
        this.studentInfo = row;
      },
      rejectClick(index, row) {
        // 未录取
        console.log('未录取', row);
        let param = {
          id: row._id,
          isAdmitted: '-1'
        };
        this.modifyStatus(param);
      },
      filterTypeTag(type) {
        return type === '0' ? 'info' : type === '1' ? 'primary' : 'danger';
      },
      filterType(type) {
        return type === '0' ? '待审核' : type === '1' ? '已录取' : '未录取';
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
        this.showStudentList = this.studentList.slice((cur - 1) * pageSize, cur * pageSize);
      }
    }
  }
</script>

<style scoped>
    .student-wrapper {
        padding: 40px;
    }

    .flex-center {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }
    .btn-add {
        float: right;
        margin-bottom: 20px;
        margin-right: 20px;
    }
</style>
