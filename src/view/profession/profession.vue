<template>
    <div class="wrapper">
        <el-row>
            <el-button class="btn-add" type="danger" @click="addClick">新增专业<i class="el-icon-plus el-icon--right"></i>
            </el-button>
        </el-row>
        <el-table :data="professionList"
                  border
                  style="width: 100%">
            <el-table-column prop="profession_name" label="专业名称" width="150" align="center"></el-table-column>
            <el-table-column label="专业主图" width="150" align="center">
                <template slot-scope="scope">
                    <img width="120" height="120" :src="scope.row.profession_pic"/>
                </template>
            </el-table-column>
            <el-table-column prop="profession_desc" label="专业介绍" align="center">
                <template slot-scope="scope">
                    <div v-html="scope.row.profession_desc"></div>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
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
        professionList: [],
        formTitle: '',
        formLabelWidth: '120px',
        searchText: ''
      }
    },
    created() {
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
      addClick() {
        // 新增  跳转到新增页面
        this.$router.push({name: 'createProfession'});
      },
      editClick(index, row) {
        // 编辑 跳转到新增页面
        this.$router.push({name: 'createProfession', params: row});
      },
      deleteClick(index, row) {
        // 删除
        console.log(index, row);
        this.$confirm('确定删除该专业？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete(`/api/profession/${row._id}`).then((response) => {
            console.log('delete', response);
            if (response.data.success) {
              this.professionList.splice(index, 1);
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
</style>