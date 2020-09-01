<template>
  <div class="project">
    <ActionBar @click="handleClick" :allCheck="allCheck" @handleAllChange="handleAllChange" />
    <div class="con-box">
      <Card v-for="(item,index) of list" :key="index" :cardData="item" @click="cardClick" @resetStatus="resetStatus" @changeAppStatus="changeAppStatus" />
    </div>
    <img src="../../assets/images/study_new.png" class="study-img" />
    <BasePower />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { findIndex } from 'lodash';
import { projecListApi } from "@/api";
import { BasePower } from "@/components";
import ActionBar from "./components/ActionBar.vue";
import Card from "./components/Card.vue";

@Component({
  components: {
    BasePower,
    ActionBar,
    Card,
  },
})
export default class List extends Vue {
  private list: Array<projecListApi.ListItem> = []
  private isLoading = false
  private allCheck = false

  @Watch('list', { deep: true })
  onListChange(newValue: projecListApi.ListItem[]) {
    const chooseList = newValue.filter((item: projecListApi.ListItem) => {
        return item.isChecked === true;
    });
    if(chooseList.length === this.list.length && chooseList.length > 0){
        this.allCheck = true
    }else{
        this.allCheck = false
    }
  }
  
  mounted() {
    this.getList();
  }
  //给所有list数据设置是否选中（全选  取消全选）
  private handleAllChange(e: boolean){
        this.list.forEach(item=>{
            this.$set(item, 'isChecked', e)
        })
  }

  private async getList() {
    const data = (await projecListApi.projectList()) as Array<
      projecListApi.ListItem
    >;
    data.forEach(item=>{
        item.isChecked = false
    })
    this.list = data;
  }

  private handleClick(type: string) {
    if (this.isLoading) return;
    const chooseList = this.list.filter((item: projecListApi.ListItem) => {
      return item.isChecked === true;
    });
    if (chooseList.length > 0) {
      if(type === 'delete'){
          this.$confirm(
            `确认删除选中的App`,
            "提示"
          ).then(() => {
            const uuidArr: string[] = [];
            chooseList.forEach(item=>{
              uuidArr.push(item.app_uuid)
            })
            this.deleteApp({'app_uuid' :uuidArr})
          })
          .catch(()=>{
            console.log('取消')
          })
          
      }else{
        this.multipleOperation(type, chooseList);
      }
      
    } else {
      this.$message.error(
        `请先选择要的${this.returnText(type)}的app`
      );
    }
  }

  private returnText(type: string): string{
    let text = ''
    switch (type) {
      case 'start':
        text = '启动';
        break;
      case 'stop':
        text = '停止';
        break;
      case 'delete':
        text = '删除';
        break;
      default:
        text = '';
        break;
    }
    return text
  }

  private multipleOperation(
    type: string,
    chooseList: projecListApi.ListItem[]
  ) {
    this.$confirm(
      `确认${type === "start" ? "启动" : "停止"}选中的App`,
      "提示"
    ).then(() => {
      const pdata: projecListApi.ChangeStatus[] = [];
      chooseList.forEach((item) => {
        const status: boolean = type === "start" ? true : false;
        pdata.push({
          'app_uuid': item.app_uuid,
          'run_status': status,
        });
      });
      this.changeAppStatus(pdata);
    })
    .catch(() => {
        console.log('取消')
    });
  }
  


  private async deleteApp(pdata: projecListApi.DeleteInter) {
    if(this.isLoading) return;
    this.isLoading = true;
    try {
      await projecListApi.deleteApp(pdata);
      this.$message.success("删除成功");
      this.getList()
    } catch (error) {
      this.$message.error(error || "操作失败");
    } finally{
      this.isLoading = false;
    }
  }

  private async changeAppStatus(pdata: projecListApi.ChangeStatus[]) {
    if(this.isLoading) return;
    this.isLoading = true;
    try {
      await projecListApi.startOrStop(pdata);
      this.$message.success("操作成功");
    } catch (error) {
      this.$message.error(error || "操作失败");
    } finally {
      this.isLoading = false;
      this.getList();
    }
  }

  //卡片点击事件
  private cardClick(data: projecListApi.CardInter) {
    if(data.type === 'edit'){
        this.$router.push({path:`/creat/${data.uuid}`})
    }else if(data.type === 'delete'){
       this.deleteApp({'app_uuid' :[data.uuid]})
    }
  
  }

  //修改某一个card数据的启停状态
  public resetStatus(uuid: string, status: boolean){
     const index = findIndex(this.list,['app_uuid', uuid]);
     this.list[index]['run_status'] = status
  }
}
</script>
<style lang="less" scoped>
.project {
  height: 100%;
  position: relative;
  background-color: #f0f0f0;
  overflow-y: scroll;
  .con-box {
    padding: 0 64px 32px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-content: flex-start;
    z-index: 2;
    box-sizing: border-box;
    // .porject-list {
    //   width: 24.25%;
    //   height: 192px;
    //   box-sizing: border-box;
    //   background: #ffffff;
    //   border: 1px solid #f0f0f0;
    //   border-radius: 2px;
    //   margin-bottom: 16px;
    //   margin-right: 1%;
    //   padding: 16px 8px 8px;
    //   z-index: 2;
    //   overflow: hidden;
    //   position: relative;
    //   border-radius: 8px;
    //   cursor: pointer;
    // }
  }
  //   .porject-list:nth-child(4n) {
  //     margin-right: 0;
  //   }
}
.study-img {
  position: fixed;
  right: 32px;
  bottom: 84px;
  widows: 320px;
  height: 320px;
}

.set-title {
  scroll-margin-bottom: 10px;
  font-weight: bold;
}
.feature {
  display: flex;
  flex-wrap: wrap;
  .p-item {
    margin-right: 10px;
  }
}
</style>