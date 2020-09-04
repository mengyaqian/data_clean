<template>
  <div class="home">
    <div class="con-box">
      <p class="p-hello">欢迎使用</p>
      <p class="p-welcome">数据蒸馏助手</p>
      <p
        class="p-text"
      >借助数据蒸馏助手您可以快速实现实时数据数据质量评分、异常值诊断与修复和数采频率自适应。</p>
      <div class="img-box">
        <img src="../../assets/images/study_new.png" />
      </div>
      <div class="btn-box" @click="go('/creat/new')">
        <i class="el-icon-plus add-icon"></i>新建项目
      </div>
      <p class="my-project" @click="go('/list')">我的项目></p>
    </div>
    <BasePower />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { BasePower } from "@/components";

@Component({
  components: {
    BasePower,
  },
})
export default class Home extends Vue {
  private go(path: string) {
    this.$router.push({ path });
  }
}
</script>
<style lang="less" scoped>
.home {
  height: 100%;
  position: relative;
  color: #404040;

  .con-box {
    width: 640px;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 32px 64px;
    text-align: center;
    z-index: 2;
    .p-hello {
      font-size: 48px;
      font-weight: bold;
    }
    .p-welcome {
      font-size: 24px;
      padding: 8px 0 24px;
      margin-bottom: 24px;
      border-bottom: 1px solid #e0e0e0;
    }
    .p-text {
      font-size: 12px;
      line-height: 1.5;
      text-align: justify;
      text-justify: newspaper;
      word-break: break-all;
    }
    .img-box {
      width: 320px;
      height: 320px;
      margin: 32px auto;
      img {
        width: 320px;
        height: 320px;
      }
    }
    .btn-box {
      width: 320px;
      height: 48px;
      background-color: #1792e5;
      background-image: linear-gradient(
        179deg,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(255, 255, 255, 0) 100%
      );
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
      border-radius: 50px;
      font-size: 20px;
      color: #ffffff;
      font-weight: bold;
      line-height: 48px;
      text-align: center;
      cursor: pointer;
      margin: 0 auto;
      position: relative;
      .add-icon {
        position: absolute;
        left: 16px;
        top: 14px;
        font-size: 20px;
        font-weight: bold;
      }
    }
    .my-project {
      text-align: center;
      color: #1792e5;
      font-weight: bold;
      cursor: pointer;
      margin-top: 16px;
    }
  }
}
</style>