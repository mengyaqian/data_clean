<template>
  <div class="power">
    <img class="imgs" src="../assets/images/power-black.svg" alt v-if="this.colors == 'black'" />
    <img class="imgs" src="../assets/images/power-white.png" alt v-if="this.colors == 'white'" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class BasePower extends Vue {
  @Prop({
    type: String,
    default: "black",
    validator: (val: string): boolean => ["black", "white"].includes(val),
  })
  private colors?: string;
}
</script>

<style scoped lang="less">
.power {
  position: fixed;
  right: 32px;
  bottom: 16px;
  .imgs {
    width: 122px;
    height: 12px;
  }
}
</style>
