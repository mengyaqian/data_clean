<template>
  <div class="creat">
    <div class="dialog-contant">
      <div class="project-info">
        <div class="project-left">
          <el-form :inline="true" label-position="top" :model="cleanItem">
            <el-form-item label="名称">
              <el-input v-model="cleanItem.app_name" placeholder="名称" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="cleanItem.detail" placeholder="描述" style="width:360px"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="project-right">
          <div class="block" v-if="uuid !== 'new'">
            <p class="p-title" style="color:#303030">{{cleanItem.create_time}}</p>
            <p class="p-title">采集时间</p>
          </div>
          <div class="block" v-if="uuid !== 'new'">
            <p class="p-value">{{cleanItem.clean_status ? '已清洗':'未清洗'}}</p>
            <p class="p-title">当前状态</p>
          </div>
          <div class="block" v-if="uuid !== 'new'">
            <el-switch
              v-model="cleanItem.run_status"
              active-color="rgba(23,146,229,0.20)"
              inactive-color="rgba(208,208,208,0.20)"
              :width="32"
              @change="((val)=>startOrStop(val,cleanItem.app_uuid))"
            ></el-switch>
          </div>
          <div class="block" v-if="uuid !== 'new'">
            <p class="p-button" v-if="cleanItem.clean_status == true" @click="openResult">清洗结果</p>
          </div>
          <p class="p-button" @click="adds">
            <img src="../../assets/images/add-small.png" />
          </p>
        </div>
      </div>
      <div class="parameter">
        <el-table
          :data="tableData"
          style="width: 100%"
          :cell-style="{background:'#f0f0f0'}"
          :header-cell-style="{background:'#E0E0E0',color:'#303030',fontSize:'12px'}"
        >
          <el-table-column label="设备">
            <template slot-scope="scope">
              <el-select v-model="scope.row.device_name" placeholder="请选择设备" class="select-set">
                <el-option v-for="item in deviceList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="变量组">
            <template slot-scope="scope">
              <el-select
                class="select-set"
                v-model="scope.row.group_name"
                placeholder="请选择变量组"
                @visible-change="v=>handleVisiable(v,scope.row,'group')"
              >
                <el-option v-for="item in groupList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="变量参数">
            <template slot-scope="scope">
              <el-select
                class="select-set"
                v-model="scope.row.variable_name"
                placeholder="请选择变量参数"
                @visible-change="v=>handleVisiable(v,scope.row,'variable')"
              >
                <el-option v-for="item in varList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template slot-scope="scope">
              <img
                src="../../assets/images/delete.png"
                class="delete-icon"
                @click="deletes(scope.$index)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <el-button type="primary" @click="saveClean(false)">保存</el-button>
      <el-button v-if="uuid !== 'new'" type="primary" @click="saveClean(true)">清洗</el-button>
    </div>
    <BasePower />
    <Result v-model="isShowResult" :uuid="uuid"/>
  </div>
</template>
<script lang="ts">
import { BasePower } from "@/components";
import Result from "./components/Result.vue";
import { Vue, Component, Watch } from "vue-property-decorator";
import { creatApi, projecListApi } from "@/api";
@Component({
  components: {
    BasePower,
    Result,
  },
})
export default class Creat extends Vue {
  private cleanItem: any = {}; //当前app的详细信息
  private tableData: creatApi.ParamInter[] = [];
  private deviceList: string[] = []; //设备列表
  private groupList: string[] = []; //变量组列表
  private varList: string[] = []; //变量列表
  private parmList: creatApi.ParamInter[] = []; //参数采数列表
  private isLoading = false;
  private isShowResult = false;

  @Watch("uuid", { immediate: true })
  handlePage(newValue: string) {
    if (newValue !== "new") {
      //编辑
      this.getAppInfo();
    } else {
      //新建
      this.cleanItem = {};
      this.tableData = [];
    }
  }

  private get uuid() {
    //创建 uuid为new,编辑则为真实uuid
    return this.$route.params.uuid;
  }

  mounted() {
    this.getSelectList();
  }
  //获取所有设备
  private async getSelectList() {
    const list = (await creatApi.paramList()) as creatApi.ParamInter[];
    this.parmList = list;
    const deviceList: string[] = [];
    list.forEach((item) => {
      deviceList.push(item.device_name);
    });
    this.deviceList = [...new Set(deviceList)];
  }

  //根据app_uuid获取app信息
  private async getAppInfo() {
    const res: any = await creatApi.appInfo(this.uuid);
    this.cleanItem = res || {};
    this.tableData = res.input_param || [];
  }

  /**
   * v:true下拉框显示，false下拉框隐藏
   * row:当前行数据
   * type:group:变量组选项卡变化，variable：变量参数选项卡变化
   * **/
  private handleVisiable(v: boolean, row: creatApi.ParamInter, type: string) {
    if (v) {
      const parmList = this.parmList;
      let groupList: string[] = [],
        varList: string[] = [];

      if (type == "group") {
        if (row.device_name) {
          parmList.forEach((item) => {
            if (item.device_name == row.device_name) {
              groupList.push(item.group_name);
            }
          });
        } else {
          groupList = [];
        }
      }
      if (type == "variable") {
        if (row.group_name) {
          parmList.forEach((item) => {
            if (
              item.device_name == row.device_name &&
              item.group_name == row.group_name
            ) {
              varList.push(item.variable_name);
            }
          });
        } else {
          varList = [];
        }
      }
      this.groupList = [...new Set(groupList)];
      this.varList = [...new Set(varList)];
    }
  }

  private deletes(index: number) {
    this.$confirm(`确认删除`, "提示", {
      type: "warning",
    })
      .then(() => {
        this.tableData.splice(index, 1);
        this.$message.success("删除成功");
      })
      .catch(() => {
        console.log("取消");
      });
  }

  private adds() {
    this.tableData.push({
      "device_name": "",
      "group_name": "",
      "variable_name": "",
    });
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
        this.resetStatus(false);
      });
  }

  private async changeAppStatus(pdata: projecListApi.ChangeStatus[]) {
    if (this.isLoading) return;
    this.isLoading = true;
    try {
      await projecListApi.startOrStop(pdata);
      this.$message.success("操作成功");
    } catch (error) {
      this.$message.error(error || "操作失败");
      this.resetStatus(false);
    } finally {
      this.isLoading = false;
    }
  }

  //修改启停状态
  public resetStatus(status: boolean) {
    this.cleanItem["run_status"] = status;
  }

  //数据清洗
  private async cleanings() {
    try {
      await creatApi.cleaning({ "app_uuid": this.uuid });
      this.$message.success("数据清洗成功");
      this.openResult()
    } catch (error) {
      this.$message.success("数据清洗失败");
    } 
  }

  //保存
  private async saveClean(needClean: boolean) {
    const cleanItem = this.cleanItem;
    const appName = cleanItem.app_name,
      appUuid = cleanItem.app_uuid,
      detail = cleanItem.detail;
    const tableData = this.tableData;
    if(appName == ''){
      this.$message.error('请输入名称')
      return
    }
    let _list: string[] = [];
    tableData.forEach((item) => {
      _list.push(
        `${item.device_name}_${item.group_name}_${item.variable_name}`
      );
    });
    _list = [...new Set(_list)];
    if (_list.length < tableData.length) {
      this.$message.error("不能重复添加相同的一组");
      return false;
    }
    const pdata = {
      "app_name": appName,
      "app_uuid": appUuid,
      detail,
      "input_param": this.tableData,
    };
    if (this.isLoading) return;
    this.isLoading = true;
    try {
      await creatApi.saveApp(pdata);
      if (needClean) {
        this.cleanings()
      } else {
        this.$message.success("保存成功");
        this.$router.replace("/list");
      }
    } catch (error) {
      this.$message.error("保存失败");
    } finally {
      this.isLoading = false;
    }
  }

  private openResult() {
    this.isShowResult = true
  }
}
</script>
<style lang="less" scoped>
@import url("../../assets/style/reset.less");
.creat {
  padding: 0 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.delete-icon {
  cursor: pointer;
}
.footer-top-flex {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
}
.footer-flex {
  display: flex;
  justify-content: space-between;

  align-items: center;
}
.dialog-contant {
  overflow: hidden;
  // background-color: #f0f0f0;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.footer {
  overflow: hidden;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  /deep/ .el-button {
    width: 240px;
    border-radius: 36px;
    font-size: 18px;
    font-weight: bold;
  }
}
.project-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  .p-value {
    font-size: 16px;
    color: #303030;
    font-weight: bold;
    line-height: 24px;
  }
  .p-title {
    font-size: 12px;
    color: #a0a0a0;
  }
  .project-left {
    display: flex;
    /deep/ .el-form-item {
      margin-bottom: 0;
    }
  }

  .project-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .block {
      padding: 0 16px;
      border-left: 1px solid rgba(0, 0, 0, 0.1);
      height: 46px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .p-button {
      width: 112px;
      height: 32px;
      border: 1px solid #a0a0a0;
      border-radius: 40px;
      cursor: pointer;
      font-size: 12px;
      color: #404040;
      text-align: center;
      line-height: 32px;
    }
  }
}

.parameter {
  margin-top: 16px;
  flex: 1;
  background-color: #f0f0f0;
  overflow-y: auto;
  .select-set {
    width: 100%;
  }
  /deep/ .el-table__body {
    border-bottom: 1px solid #e0e0e0;
  }
  /deep/ .el-input__inner {
    border: 1px solid #e0e0e0;
    border-radius: 4px;
  }
}
</style>