<template>
    <div id="app">
        <router-view></router-view>
        <!--<layout></layout>-->
    </div>
</template>

<script>
    import Layout from 'view/layout/Layout.vue';

    export default {
        name: 'app',
        components: {
            Layout
        }
    };
</script>

<style>
</style>
