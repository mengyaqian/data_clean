<template>
  <div class="porject-list" @click="cardClick(cardData.app_uuid, 'edit')">
    <div>
      <div class="card-header">
        <div class="header-left">
          <p class="p-val">{{cardData.app_name}}</p>
          <p class="p-title">采集时间：{{cardData.create_time}}</p>
        </div>
        <el-checkbox v-model="cardData.isChecked"  @click.stop.native></el-checkbox>
      </div>
       <span
            :class="[{'unwashed':!cardData.clean_status},{'washed':cardData.clean_status},'span-status']"
          >{{cardData.clean_status ? '已清洗':'未清洗'}}</span>
    </div>
    <div class="card-footer">
      <el-switch
        v-model="cardData.run_status"
        active-color="rgba(23,146,229,0.20)"
        inactive-color="rgba(208,208,208,0.20)"
        :width="32"
        @change="((val)=>startOrStop(val,cardData.app_uuid))"
        @click.stop.native
      ></el-switch>
      <img src="../../../assets/images/delete.png" class="delete-icon" @click.stop="deleteOne(cardData.app_uuid)"/>
      <!-- <div class="card-status">
        <p
          :class="[{'unwashed':!cardData.clean_status},{'washed':cardData.clean_status},'p-val']"
        >{{cardData.clean_status ? '已清洗':'未清洗'}}</p>
        <p class="p-title">当前状态</p>
      </div> -->
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { projecListApi } from "@/api";

@Component
export default class Card extends Vue {
  @Prop({
    type: Object,
    default: {},
  })
  private cardData!: object;

  private cardClick(uuid: string, type: string) {
    this.$emit("click", {uuid, type});
  }

  private startOrStop(status: boolean, uuid: string) {
    this.$confirm(`确认${status ? "启动" : "停止"}该App`, "提示")
      .then(() => {
        const data: projecListApi.ChangeStatus[] = [
          {
            "app_uuid": uuid,
            "run_status": status,
          },
        ];
        this.changeAppStatus(data);
      })
      .catch(() => {
        this.changeStatus(uuid, !status);
      });
  }

  private deleteOne(uuid: string){
      this.$confirm(`确认删除该App`, "提示")
      .then(() => {
        this.cardClick(uuid,'delete')
      })
      .catch(() => {
        console.log('取消删除')
      });
  }

  @Emit("resetStatus")
  changeStatus(uuid: string, status: boolean) {
    return;
  }

  @Emit("changeAppStatus")
  changeAppStatus(pdata: projecListApi.ChangeStatus[]) {
    return;
  }
}
</script>

<style lang="less" scoped>
@import url("../../../assets/style/reset.less");
.porject-list {
  width: 24.25%;
  height: 192px;
  box-sizing: border-box;
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 2px;
  margin-bottom: 16px;
  margin-right: 1%;
  padding: 8px;
  z-index: 2;
  overflow: hidden;
  position: relative;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .card-header {
    display: flex;
    justify-content: space-between;
    margin-top:10px;
    margin-bottom: 4px;
    .header-left {
      padding-left: 34px;
      background-image: url(../../../assets/images/icon2.png);
      background-size: 24px 22px;
      background-repeat: no-repeat;
      background-position: center left;
    }
  }
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .delete-icon{
      cursor: pointer;
    }
  }
  .p-val {
    font-size: 16px;
    line-height: 16px;
    color: #303030;
    font-weight: bold;
  }
  .p-title {
    font-size: 10px;
    line-height: 10px;
    padding-top: 4px;
    color: #a0a0a0;
  }
  .span-status{
    font-size: 12px;
    padding: 2px 4px;
    border-radius: 4px;
    margin-left:34px;
  }
  .washed {
    color: #1792e5;
    border: 1px solid #1792e5;
  }
  .unwashed {
    color: red;
    border: 1px solid red;
  }
}
.porject-list:nth-child(4n) {
  margin-right: 0;
}
</style>