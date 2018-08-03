<template>
    <div class="wrapper">
        <el-row>
            <el-select v-model="searchText">
                <el-option label="请选择专业" value=""></el-option>
                <template v-for="profession in professionList">
                    <el-option :label="profession.profession_name" :value="profession._id"></el-option>
                </template>
            </el-select>
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button class="btn-add" type="danger" @click="addClick">新增问题<i class="el-icon-plus el-icon--right"></i>
            </el-button>
        </el-row>
        <el-table :data="showQuestionList"
                  border
                  style="width: 100%">
            <el-table-column prop="question_title" label="题目" width="150" align="center"></el-table-column>
            <el-table-column prop="profession_name" label="涉及专业" width="150" align="center"></el-table-column>
            <el-table-column prop="question_answer" label="答案" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="150">
                <template slot-scope="scope">
                    <el-button @click="editClick(scope.$index, scope.row)" size="small">编辑</el-button>
                    <el-button @click="deleteClick(scope.$index, scope.row)" type="danger" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--弹出框-->
        <el-dialog :title="formTitle" :visible.sync="dialogFormVisible">
            <el-form :model="questionForm" :rules="questionRules" ref="questionForm">
                <el-form-item label="问题" :label-width="formLabelWidth">
                    <el-input v-model="questionForm.title" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <el-form :model="questionForm">
                <el-form-item label="所属专业" :label-width="formLabelWidth">
                    <el-select v-model="questionForm.professionId" placeholder="请选择所属专业类别">
                        <template v-for="profession in professionList">
                            <el-option :label="profession.profession_name" :value="profession._id"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-form :model="questionForm">
                <el-form-item label="答案" :label-width="formLabelWidth">
                    <el-input type="textarea" :rows="5" v-model="questionForm.answer" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogCancelClick">取 消</el-button>
                <el-button type="primary" @click="dialogConfirmClick">确 定</el-button>
            </div>
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
  export default {
    data() {
      return {
        professionList: [],
        questionList: [],
        showQuestionList: [],
        searchText: '',
        formTitle: '',
        dialogFormVisible: false,
        questionForm: {
          title: '',
          professionId: '',
          answer: '',
          professionName: ''
        },
        formLabelWidth: '80px',
        questionRules: {
          title: [
            {required: true, message: '请输入问题题目', trigger: 'blur'}
          ],
          professionId: [
            {required: true, message: '请选择所属专业类型', trigger: 'change'}
          ],
          answer: [
            {required: true, message: '请输入答案', trigger: 'blur'}
          ]
        },
        currentPage: 1,
        total: 0,
        pageSize: 10
      }
    },
    created() {
      this.getQuestionList();
      this.getProfessionList();
    },
    methods: {
      getProfessionList() {
        this.axios.get('/api/profession').then((response) => {
          console.log(response);
          if (response.data.status === 'OK') {
            this.professionList = response.data.data;
            console.log('professionList', this.professionList);
          }
        });
      },
      getQuestionList() {
        this.axios.get('/api/question').then((response) => {
          console.log(response);
          if (response.data.status === 'OK') {
            this.questionList = response.data.data;
            this.total = this.questionList.length;
            this.changeList(this.currentPage, this.pageSize);
            console.log('questionList', this.questionList);
          }
        });
      },
      addClick() {
        this.questionForm = {};
        this.dialogFormVisible = true;
        this.formTitle = '新增问题';
      },
      editClick(index, row) {
        console.log(JSON.stringify(row));
        this.questionForm = {
          title: row.question_title,
          professionId: row.profession_id,
          professionName: row.profession_name,
          answer: row.question_answer,
          id: row._id
        };
        this.dialogFormVisible = true;
        this.formTitle = '编辑问题';
      },
      deleteClick(index, row) {
        // 删除
        console.log(index, row);
        this.$confirm('确定删除该问题？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete(`/api/question/${row._id}`).then((response) => {
            console.log('delete', response);
            if (response.data.success) {
              this.questionList.splice(index, 1);
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
      search() {
        if (this.searchText) {
          this.axios.get(`/api/question/${this.searchText}`).then((response) => {
            if (response.data.status === 'OK') {
              this.questionList = response.data.data;
              this.total = this.questionList.length;
              this.changeList(this.currentPage, this.pageSize);
            }
          });
        } else {
          this.getQuestionList();
        }
      },
      dialogCancelClick() {
        this.dialogFormVisible = false;
      },
      dialogConfirmClick() {
        // 新增、编辑问题
        console.log(JSON.stringify(this.questionForm));
        this.$refs['questionForm'].validate((valid) => {
          if (valid) {
            this.axios.post('/api/question/addQuestion', this.questionForm).then((response) => {
              console.log(response);
              if (response.data.success) {
                this.$message({
                  type: 'success',
                  message: response.data.msg
                });
                // 在请求成功后需要重新去请求列表
                this.dialogFormVisible = false;
                this.getQuestionList();
              }
            }).catch((error) => {
              console.log(error);
            })
          } else {
            return false;
          }
        });
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
        this.showQuestionList = this.questionList.slice((cur - 1) * pageSize, cur * pageSize);
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

    .flex-center {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }
</style>