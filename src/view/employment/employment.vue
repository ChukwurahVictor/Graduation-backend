<template>
    <div class="admin-wrapper">
        <el-row>
          <el-button class="btn-add" type="danger" @click="addClick">新增就业信息<i class="el-icon-plus el-icon--right"></i>
          </el-button>
        </el-row>
        <el-table :data="showEmploymentList"
                  border
                  style="width: 100%">
            <el-table-column prop="employment_title" label="标题" align="center"></el-table-column>
            <el-table-column prop="update_time" label="发布时间" width="220" align="center">
                <template slot-scope="scope">
                    <div>{{formatDate(scope.row.update_time)}}</div>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
                <template slot-scope="scope">
                    <el-button @click="editClick(scope.$index, scope.row)" size="small">编辑</el-button>
                    <el-button @click="deleteClick(scope.$index, scope.row)" type="danger" size="small">删除</el-button>
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
    </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        employmentList: [],
        showEmploymentList: [],
        currentPage: 1,
        total: 0,
        pageSize: 10
      }
    },
    created() {
      this.getEmploymentList();
    },
    methods: {
      getEmploymentList() {
        this.axios.get('/api/employment').then((response) => {
          console.log(response);
          if (response.status === 200) {
            this.employmentList = response.data.data;
            this.total = this.employmentList.length;
            this.changeList(this.currentPage, this.pageSize);
            console.log('employmentList', this.employmentList);
          }
        });
      },
      addClick() {
        // 新增  跳转到新增页面
        this.$router.push({name: 'createEmployment'})
      },
      editClick(index, row) {
        // 编辑 跳转到新增页面
        this.$router.push({name: 'createEmployment', params: row});
      },
      deleteClick(index, row) {
        // 删除
        console.log(index, row);
        this.$confirm('确定删除该条信息？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete(`/api/employment/${row._id}`).then((response) => {
            console.log('delete', response);
            if (response.data.success) {
//              this.employmentList.splice(index, 1);
//              this.total--;
              this.getEmploymentList();
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
      formatDate(time) {
        let date = new Date(time).toLocaleString();
        return date;
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
        this.showEmploymentList = this.employmentList.slice((cur - 1) * pageSize, cur * pageSize);
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

    .search-text {
        float: left;
        width: 200px;
        margin-right: 10px;
    }

    .flex-center {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }
</style>
