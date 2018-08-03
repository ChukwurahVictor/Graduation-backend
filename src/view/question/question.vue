<template>
    <div class="college-wrapper">
        <el-row>
            <el-button class="btn-add" type="danger" @click="addClick">新增学院信息分类<i class="el-icon-plus el-icon--right"></i>
            </el-button>
        </el-row>
        <el-table :data="collegeList"
                  border
                  style="width: 100%">
            <el-table-column prop="student_id" label="分类" width="400" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button @click="editClick(scope.$index, scope.row)" size="small">编辑</el-button>
                    <el-button @click="deleteClick(scope.$index, scope.row)" type="danger" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        questionList: []
      }
    },
    created() {
      this.getQuestionList();
    },
    methods: {
      getQuestionList() {
        this.axios.get('/api/info').then((response) => {
          console.log(response);
          if (response.status === 200) {
            this.questionList = response.data.data;
            console.log('collegeList', this.questionList);
          }
        });
      },
      addClick() {
        // 新增  跳转到新增页面
        this.$router.push({name: 'createInfo'})
      },
      editClick(index, row) {
        // 编辑 跳转到新增页面
        console.log('row', row);
        this.$router.push({name: 'createInfo', params: row});
      },
      deleteClick(index, row) {
        // 删除
        console.log(index, row);
        this.$confirm('确定删除该条信息？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete(`/api/college/${row._id}`).then((response) => {
            console.log('delete', response);
            if (response.data.success) {
              this.collegeList.splice(index, 1);
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
    }
  }
</script>

<style scoped>
    .college-wrapper {
        padding: 20px;
    }

    .btn-add {
        float: right;
        margin-bottom: 20px;
        margin-right: 20px;
    }
</style>