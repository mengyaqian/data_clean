<template>
    <div class="app-main">
         <router-view />
    </div>
</template>
<script lang="ts">
import {Vue, Component} from 'vue-property-decorator'
@Component
export default class AppMain extends Vue{

}
</script>
<style lang="less" scoped>
.app-main{
  height: 100%;
}
</style>