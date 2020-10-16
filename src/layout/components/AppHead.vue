<template>
  <div class="app-head">
    <div class="logo">
      <img src="../../assets/images/logo.png" class="logo-img" />
      <p class="line"></p>
      <p class="name">数据蒸馏助手</p>
    </div>
    <div class="header-main">
      <div class="menu-box">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          background-color="#101010"
          text-color="#fff"
          router
        >
          <el-menu-item index="/home">首页</el-menu-item>
          <el-menu-item index="/list">项目概览</el-menu-item>
        </el-menu>
      </div>
      <div class="operation-box">
        <div class="add-project" @click="addProject">
          <i class="el-icon-plus add-icon"></i>新建项目
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class AppHead extends Vue {
  private get activeIndex() {
    return this.$route.path as string;
  }
  private addProject() {
    this.$router.push({ path: "/creat/new" });
  }
}
</script>
<style lang="less" scoped>
@head-height: 60px;
.app-head {
  display: flex;
  height: 60px;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #101010;
  .logo {
    display: flex;
    align-items: center;
    .logo-img {
      width: 127px;
      height: 24px;
    }

    .name {
      font-size: 18px;
      font-weight: bold;
      color: #fff;
    }
  }
  .header-main {
    display: flex;
    .menu-box {
      margin-right: 32px;
    }
    .operation-box {
      display: flex;
      align-items: center;
      text-align: center;
      line-height: 24px;
      .add-project {
        background: #1792e5;
        border-radius: 40px;
        padding: 0 18px;
        height: 24px;
        line-height: 24px;
        color: #fff;
        font-size: 12px;
        cursor: pointer;
        .add-icon {
          font-weight: bold;
          margin-right: 6px;
        }
      }
      .user-name {
        font-size: 12px;
        color: #707070;
        margin-right: 16px;
      }
      .exit {
        width: 48px;
        height: 24px;
        border: 1px solid #a0a0a0;
        border-radius: 40px;
        font-size: 12px;
        color: #404040;
        cursor: pointer;
      }
    }
  }
  .line {
    height: 24px;
    width: 1px;
    background: #e0e0e0;
    margin: 0 16px;
  }
  /deep/ .el-menu.el-menu--horizontal {
    border-bottom: none;
  }
  /deep/ .el-menu--horizontal > .el-menu-item.is-active {
    border-bottom: 4px solid #1792e5;
    font-weight: bold;
    color:#fff;
  }
}
</style>