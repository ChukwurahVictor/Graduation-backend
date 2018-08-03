import Vue from 'vue';
import Router from 'vue-router';
// import store from '../store/index.js';
import Login from 'view/login/login.vue';
import Home from 'view/home/home.vue';
import Admin from 'view/admin/admin.vue';
import Notice from 'view/notice/notice.vue';
import CreateNotice from 'view/notice/createNotice.vue';
import Profession from 'view/profession/profession.vue';
import ProfessionDetail from 'view/profession/professionDetail.vue';
import Slider from 'view/slider/slider.vue';
import AdmissionPlan from 'view/student/admissionPlan';
import AdmissionHistory from 'view/student/admissionHistory';
import CreatePlan from 'view/student/createPlan';
import CreateHistory from 'view/student/createHistory';
import StudentList from 'view/student/studentList.vue';
import UserCenter from 'view/info/userCenter.vue';
import CreateProfession from 'view/profession/createProfession.vue';
import Employment from 'view/employment/employment.vue';
import CreateEmployment from 'view/employment/createEmployment.vue';
import College from 'view/college/college.vue';
import CreateCollegeInfo from 'view/college/createCollegeInfo.vue';
import Info from 'view/question/question.vue';
import CreateInfo from 'view/question/createQuestion.vue';

Vue.use(Router);

// 声明静态加载的路由
// const constantRouterMap = [
//   {
//     path: '/login',
//     name: 'login',
//     component: Login
//   },
//   {
//     path: '',
//     name: 'Layout',
//     redirect: '/home',
//     component(resolve) {
//       require.ensure(['@/view/layout/Layout.vue'], () => {
//         resolve(require('@/view/layout/Layout.vue'));
//       });
//     },
//     children: [
//       {path: 'home', component: Home, name: 'home'},
//       {path: 'admin', component: Admin, name: 'admin'},
//       {path: 'notice', component: Notice, name: 'notice'},
//       {path: 'createNotice', component: CreateNotice, name: 'createNotice'},
//       {path: 'profession', component: Profession, name: 'profession'},
//       {path: 'createProfession', component: CreateProfession, name: 'createProfession'},
//       {path: 'professionDetail', component: ProfessionDetail, name: 'professionDetail'},
//       {path: 'slider', component: Slider, name: 'slider'},
//       {path: 'studentList', component: StudentList, name: 'studentList'},
//       {path: 'userCenter', component: UserCenter, name: 'userCenter'}
//     ]
//   },
//   {
//     path: '/home',
//     name: 'home',
//     component(resolve) {
//       require.ensure(['@/view/home/home.vue'], () => {
//         resolve(require('@/view/home/home.vue'));
//       });
//     }
//   }
// ]

// export default new Router({
//   routes: constantRouterMap
// })

// 定义异步挂载的路由
// 动态需要根据权限加载的路由表
// const asyncRouterMap = [
//   {
//     path: '',
//     name: 'Layout',
//     redirect: '/home',
//     component(resolve) {
//       require.ensure(['@/view/layout/Layout.vue'], () => {
//         resolve(require('@/view/layout/Layout.vue'));
//       });
//     },
//     children: [
//       {
//         path: 'admin',
//         name: 'admin',
//         component: Admin,
//         meta: {
//           title: 'admin', roles: ['superadmin'], icon: 'el-icon-menu'
//         }
//       }
//     ]
//   },
//   { path: '*', redirect: '/404', hidden: true }
// ]

// const adminType = localStorage.getItem('adminType');
// let exportRouter = constantRouterMap;
// if (adminType === '0') {
//   exportRouter = exportRouter.push(asyncRouterMap);
// }

const router = new Router({
  routes: [{
    path: '/login',
    name: 'login',
    component(resolve) {
      require.ensure(['@/view/login/login.vue'], () => {
        resolve(require('@/view/login/login.vue'));
      });
    }
  }, {
    path: '',
    name: 'Layout',
    redirect: '/userCenter',
    component(resolve) {
      require.ensure(['@/view/layout/Layout.vue'], () => {
        resolve(require('@/view/layout/Layout.vue'));
      });
    },
    children: [
      {path: 'home', component: Home, name: 'home'},
      {path: 'admin', component: Admin, name: 'admin'},
      {path: 'notice', component: Notice, name: 'notice'},
      {path: 'createNotice', component: CreateNotice, name: 'createNotice'},
      {path: 'profession', component: Profession, name: 'profession'},
      {path: 'createProfession', component: CreateProfession, name: 'createProfession'},
      {path: 'professionDetail', component: ProfessionDetail, name: 'professionDetail'},
      {path: 'slider', component: Slider, name: 'slider'},
      {path: 'admissionPlan', component: AdmissionPlan, name: 'admissionPlan'},
      {path: 'admissionHistory', component: AdmissionHistory, name: 'admissionHistory'},
      {path: 'createPlan', component: CreatePlan, name: 'createPlan'},
      {path: 'createHistory', component: CreateHistory, name: 'createHistory'},
      {path: 'studentList', component: StudentList, name: 'studentList'},
      {path: 'userCenter', component: UserCenter, name: 'userCenter'},
      {path: 'employment', component: Employment, name: 'employment'},
      {path: 'createEmployment', component: CreateEmployment, name: 'createEmployment'},
      {path: 'college', component: College, name: 'college'},
      {path: 'createCollegeInfo', component: CreateCollegeInfo, name: 'createCollegeInfo'},
      {path: 'info', component: Info, name: 'info'},
      {path: 'createInfo', component: CreateInfo, name: 'createInfo'}
    ]
  }, {
    path: '/home',
    name: 'home',
    component(resolve) {
      require.ensure(['@/view/home/home.vue'], () => {
        resolve(require('@/view/home/home.vue'));
      });
    }
  }, {
    path: '*',
    component(resolve) {
      require.ensure(['@/components/404.vue'], () => {
        resolve(require('@/components/404.vue'));
      });
    },
    hidden: true
  }]
});

// const router = new Router(exportRouter);

// 验证 token，存在才跳转
router.beforeEach((to, from, next) => {
  let token = sessionStorage.getItem('token');
  if (token) {
    next();
  } else {
    if (to.path == '/login') {
      next();
    } else {
      next('/login');
    }
  }
});

export default router;
