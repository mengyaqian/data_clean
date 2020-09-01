<template>
  <div class="app-container">
    <el-container style="height:100%">
      <el-header>
        <AppHead />
      </el-header>
      <el-main>
        <AppMain />
      </el-main>
    </el-container>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import AppHead from "./AppHead.vue";
import AppMain from "./AppMain.vue";
@Component({
  components: {
    AppHead,
    AppMain,
  },
})
export default class AppWrapper extends Vue {}
</script>
<style lang="less" scoped>
.app-container {
  height: 100%;
  /deep/ .el-header {
    padding: 0;
  }
 /deep/ .el-main {
    padding: 0;
  }
}
</style>