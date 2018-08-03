<template>
    <div class="root-wrapper">
        <navbar></navbar>
        <div class="main-container">
            <div class="sidebar-wrapper">
                <sidebar class="sidebar-container"></sidebar>
            </div>
            <el-scrollbar tag="div" wrapClass="content-scrollbar">
                <section class="content">
                    <!--<transition mode="out-in" enter-active-class="fadeIn" leave-active-class="fadeOut" appear>-->
                    <router-view></router-view>
                    <!--</transition>-->
                </section>
            </el-scrollbar>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import Navbar from './Navbar.vue';
    import Sidebar from './Sidebar.vue';

    export default {
        components: {
            Navbar,
            Sidebar
        }
    }
</script>

<style scoped>
    .root-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .sidebar-wrapper {
        width: 200px;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 1001;
        overflow: hidden;
    }

    .sidebar-container {
        position: absolute;
        width: 200px;
        top: 60px;
        bottom: 0;
        left: 0;
        overflow-y: scroll;
        overflow-x: hidden;
    }

    .main-container {
        min-height: 100%;
        margin-top: 60px;
        /*margin-left: 200px;*/
    }
</style>
<style>
    .content-scrollbar {
        margin-left: 200px;
    }
</style>