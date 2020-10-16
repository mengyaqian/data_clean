<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
@Component({})
export default class App extends Vue{}
</script>

<style>
#app {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  background-color: #303030;
  color: #fff;
}
</style>
