<template>
    <!--<el-menu mode="vertical" theme="dark">-->
    <!--<sidebar-item></sidebar-item>-->
    <!--</el-menu>-->
    <el-menu mode="vertical" theme="dark" default-active="1" :default-openeds="['4']">
        <!--<el-menu-item index="1" @click="mJumpToHome">-->
        <!--<i class="el-icon-message"></i>-->
        <!--<span slot="title">首页</span>-->
        <!--</el-menu-item>-->
        <el-menu-item index="1" @click="mJumpToUserCenter">
            <i class="el-icon-message"></i>
            <span slot="title">基本信息</span>
        </el-menu-item>
        <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>公告管理</template>
            <el-menu-item index="2-1" @click="mJumpToNotice">公告列表</el-menu-item>
            <el-menu-item index="2-2" @click="mJumpToNewNotice">新增公告</el-menu-item>
        </el-submenu>
        <el-submenu index="3" v-if="showAdmin">
            <template slot="title"><i class="el-icon-setting"></i>轮播图配置</template>
            <el-menu-item index="3-1" @click="mJumpToSlider">轮播图列表</el-menu-item>
            <!--<el-menu-item index="3-2" @click="mJumpToSliderNew">新增轮播图</el-menu-item>-->
        </el-submenu>
        <el-submenu index="4">
            <template slot="title"><i class="el-icon-setting"></i>专业管理</template>
            <el-menu-item index="4-1" @click="mJumpToProfession">专业介绍</el-menu-item>
            <el-menu-item index="4-2" @click="mJumpToNewProfession">新建专业分类</el-menu-item>
            <el-menu-item index="4-3" @click="mJumpToProfessionDetail">专业答疑</el-menu-item>
        </el-submenu>
        <el-submenu index="5">
            <template slot="title"><i class="el-icon-setting"></i>招生管理</template>
            <el-menu-item index="5-1" @click="mJumpToAdmissionPlan">招生计划</el-menu-item>
            <el-menu-item index="5-2" @click="mJumpToAdmissionHistory">历史录取</el-menu-item>
            <el-menu-item index="5-3" @click="mJumpToStudentList">报考信息管理</el-menu-item>
        </el-submenu>
        <el-submenu index="6">
            <template slot="title"><i class="el-icon-setting"></i>就业信息</template>
            <el-menu-item index="6-1" @click="mJumpToEmployment">信息列表</el-menu-item>
            <el-menu-item index="6-2" @click="mJumpToEmploymentPublish">就业信息发布</el-menu-item>
        </el-submenu>
        <el-submenu index="7">
            <template slot="title"><i class="el-icon-setting"></i>学院实力</template>
            <el-menu-item index="7-1" @click="mJumpToCollege">信息列表</el-menu-item>
            <el-menu-item index="7-2" @click="mJumpToCollegeInfoPublish">信息发布</el-menu-item>
        </el-submenu>
        <el-menu-item index="8" @click="mJumpToStudentList" v-if="showAdmin">
            <i class="el-icon-message"></i>
            <span slot="title">学生管理</span>
        </el-menu-item>
        <el-menu-item index="9" @click="mJumpToAdmin" v-if="showAdmin">
            <i class="el-icon-message"></i>
            <span slot="title">管理员列表</span>
        </el-menu-item>
        <el-menu-item index="10" @click="mJumpToQuestion">
            <i class="el-icon-message"></i>
            <span slot="title">管理员列表</span>
        </el-menu-item>
    </el-menu>
</template>

<script type="text/ecmascript-6">
  import SidebarItem from './SidebarItem.vue'
  export default {
    data() {
      return {
        showAdmin: false,
      }
    },
    components: {
      SidebarItem
    },
    created() {
      console.log(sessionStorage.getItem('adminType'));
      if (sessionStorage.getItem('adminType') === '0') {
        this.showAdmin = true;
      }
    },
    methods: {
      mJumpToHome() {
        this.$router.push({name: 'home'});
      },
      mJumpToAdmin() {
        this.$router.push({name: 'admin'});
      },
      mJumpToNotice() {
        this.$router.push({name: 'notice'});
      },
      mJumpToNewNotice() {
        this.$router.push({name: 'createNotice'});
      },
      mJumpToProfession() {
        this.$router.push({name: 'profession'});
      },
      mJumpToProfessionDetail() {
        this.$router.push({name: 'professionDetail'});
      },
      mJumpToSlider() {
        this.$router.push({name: 'slider'});
      },
      mJumpToSliderNew() {
        this.$router.push({name: 'sliderNew'});
      },
      mJumpToAdmissionPlan() {
        this.$router.push({name: 'admissionPlan'});
      },
      mJumpToAdmissionHistory() {
        this.$router.push({name: 'admissionHistory'});
      },
      mJumpToStudentList() {
        this.$router.push({name: 'studentList'});
      },
      mJumpToUserCenter() {
        this.$router.push({name: 'userCenter'});
      },
      mJumpToNewProfession() {
        this.$router.push({name: 'createProfession'})
      },
      mJumpToEmployment() {
        this.$router.push({name: 'employment'})
      },
      mJumpToEmploymentPublish() {
        this.$router.push({name: 'createEmployment'})
      },
      mJumpToCollege() {
        this.$router.push({name: 'college'})
      },
      mJumpToCollegeInfoPublish() {
        this.$router.push({name: 'createCollegeInfo'})
      },
      mJumpToQuestion() {
        this.$router.push({name: 'info'})
      }
    }
  }
</script>

<style scoped>
</style>
