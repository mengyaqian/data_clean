<template>
  <div class="page-404">

    <div class="page-404__main flex-c">
      <div class="flex-c">
        <div>
          <h3 class="page-404__title">404</h3>
          <p class="page-404__desc">抱歉，你访问的页面不存在</p>
          <router-link to="/home"><el-button type="primary" to="/home">返回首页</el-button></router-link> 
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Page404 extends Vue {}
</script>

<style lang="less" scoped>
.page-404 {
  .page-404__main {
    height: 100%;
  }
  .page-404__icon {
    height: 267px;
    margin-right: 142px;
  }
  .page-404__title {
    line-height: 64px;
    font-size: 56px;
    font-weight: 500;
  }
  .page-404__desc {
    margin-top: 10px;
    margin-bottom: 25px;
    color: rgba(85,85,85,1);
  }
}
</style>
