<template>
    <div class="admin-wrapper">
        <el-row>
            <el-select class="search-text" v-model="searchText" placeholder="请选择类型">
                <el-option label="请选择" value=""></el-option>
                <el-option label="学院新闻" value="XYXW"></el-option>
                <el-option label="招生公告" value="ZSGG"></el-option>
            </el-select>
            <el-button type="primary" @click="searchClick">搜索</i>
            </el-button>
            <el-button class="btn-add" type="danger" @click="addClick">新增公告<i class="el-icon-plus el-icon--right"></i>
            </el-button>
        </el-row>
        <el-table :data="showNoticeList"
                  border
                  style="width: 100%">
            <el-table-column prop="notice_title" label="标题" align="center"></el-table-column>
            <el-table-column label="图片" width="200" align="center">
                <template slot-scope="scope">
                    <img width="120" height="120" :src="scope.row.notice_url"/>
                </template>
            </el-table-column>
            <el-table-column label="类型" width="120" align="center">
                <template slot-scope="scope">
                    <el-tag :type="filterTypeIcon(scope.row.notice_type)">
                        {{filterType(scope.row.notice_type)}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" width="190" align="center">
                <template slot-scope="scope">
                    <div>{{formatDate(scope.row.create_time)}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="update_time" label="更新时间" width="190" align="center">
                <template slot-scope="scope">
                    <div>{{formatDate(scope.row.update_time)}}</div>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="140">
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
        noticeList: [],
        showNoticeList: [],
        formTitle: '',
        dialogFormVisible: false,
        adminForm: {
          name: '',
          id: '',
          type: '',
          phone: '',
          pass: ''
        },
        formLabelWidth: '120px',
        searchText: '',
        currentPage: 1,
        total: 0,
        pageSize: 10
      }
    },
    created() {
      this.getNoticeList();
    },
    methods: {
      getNoticeList() {
        this.axios.get('/api/notice').then((response) => {
          console.log(response);
          if (response.data.status === 'OK') {
            this.noticeList = response.data.data;
            this.total = this.noticeList.length;
            this.changeList(this.currentPage, this.pageSize);
            console.log('noticeList', this.noticeList);
          }
        });
      },
      addClick() {
        // 新增  跳转到新增页面
        this.$router.push({name: 'createNotice'})
      },
      editClick(index, row) {
        // 编辑 跳转到新增页面
        this.$router.push({name: 'createNotice', params: row});
      },
      deleteClick(index, row) {
        // 删除
        console.log(index, row);
        this.$confirm('确定删除该条公告？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete(`/api/notice/${row._id}`).then((response) => {
            console.log('delete', response);
            if (response.data.success) {
              this.noticeList.splice(index, 1);
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
      searchClick() {
        if (!this.searchText) {
          this.getNoticeList();
        } else {
          console.log('searchClick', this.searchText);
          this.axios.get(`/api/notice/${this.searchText}`).then((response) => {
            console.log(response);
            if (response.status === 200) {
              this.noticeList = response.data.data;
              this.total = this.noticeList.length;
              this.changeList(this.currentPage, this.pageSize);
            }
          }).catch((error) => {
            console.log(error);
          });
        }
      },
      filterType(type) {
        if (type === 'ZSGG') {
          return '招生公告'
        } else if (type === 'XYXW') {
          return '学院新闻'
        }
      },
      filterTypeIcon(type) {
        if (type === 'ZSGG') {
          return 'danger'
        } else if (type === 'XYXW') {
          return 'success'
        }
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
        this.showNoticeList = this.noticeList.slice((cur - 1) * pageSize, cur * pageSize);
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