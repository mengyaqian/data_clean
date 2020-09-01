<template>
  <div class="action-bar">
    <p class="action-p">
      <el-checkbox v-model="isAllChange" @change="handleChange"></el-checkbox>
    </p>
    <p class="action-p" @click="handleClick('start')">启动</p>
    <p class="action-p" @click="handleClick('stop')">停止</p>
    <p class="action-p" @click="handleClick('delete')">删除</p>
  </div>
</template>
<script lang="ts">
import { Vue, Component, PropSync, Emit } from "vue-property-decorator";

@Component
export default class ActionBar extends Vue {
  @PropSync('allCheck', { default: false, type: Boolean }) isAllChange?: boolean;

  @Emit("handleAllChange")
  private handleChange(e: boolean) {
    return
  }

  private handleClick(type: string) {
    this.$emit("click", type);
  }
}
</script>

<style lang="less" scoped>
.action-bar {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  height: 32px;
  margin: 8px 64px;
  background-color: #ffffff;
  display: flex;
  z-index: 2;
  .action-p {
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    padding: 0 16px;
    line-height: 32px;
    font-size: 12px;
    color: #404040;
    cursor: pointer;
  }
}
</style>