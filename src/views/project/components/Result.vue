<template>
  <el-dialog
    :visible="dialogVisible"
    width="90%"
    top="5%"
    @close="closes"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <div slot="title" class="top-edit-clean">
      <span class="span1">清洗结果</span>
      <p class="close" @click="closes">
        <i class="el-icon-close close-icon"></i>
      </p>
    </div>
    <div class="dialog-contant">
      <div class="top-box">
        <div class="score flex-con">
          <div class="block-title">数据整体质量评分</div>
          <div class="chart-box">
            <BaseEchartGauge :data="chartGauge" />
          </div>
        </div>
        <div class="fixed">
          <div class="block-title">异常值修复</div>
          <div class="table-fixed">
             <el-table :data="recommendData" style="width: 100%" height="200" :cell-style="{'background-color':'#404040'}" :header-cell-style="{'background-color':'#404040',color:'#ffffff'}">
              <el-table-column  prop="Timestamp" label="采集时间戳"></el-table-column>
              <el-table-column prop="variable" label="参数名"></el-table-column>
              <el-table-column :width="150" label="采集值">
                <template slot-scope="scope">
                  <span>{{scope.row.acquisition_value.toFixed(3)}}</span>
                </template>
              </el-table-column>
              <el-table-column :width="150" label="修复值">
                <template slot-scope="scope">
                  <span>{{scope.row.revised_value.toFixed(3)}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>

      <div class="hz flex-con">
        <div class="block-title">
          <p class="p1">参数采集频率推荐</p>
          <el-select v-model="variableName" placeholder="请选择" @change="getSampling" :disabled="isLoading">
            <el-option v-for="(vals,idx) of selectList" :key="idx" :label="vals" :value="vals"></el-option>
          </el-select>
        </div>
        <div class="collect_hz">
          <BaseEchartsLine :data="chartLine" />
        </div>
        <div class="range-div">
          <span>压缩率：</span>
          <el-slider
            style="flex:1;margin:0 16px"
            tooltip-class="tooltips"
            :disabled="isLoading"
            show-input
            :max="99.9"
            v-model="rangeVal"
            :format-tooltip="formatTooltip"
            @change="getSampling"
          ></el-slider>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Vue, Component, PropSync, Prop, Watch } from "vue-property-decorator";
import { creatApi, projectResultApi } from "@/api";
import { BaseEchartsLine, BaseEchartGauge } from "@/components";
import { cloneDeep, isEqual } from "lodash";

@Component({
  components: {
    BaseEchartsLine,
    BaseEchartGauge,
  },
})
export default class Result extends Vue {
  @PropSync("value", { type: Boolean, default: false }) dialogVisible!: boolean;
  @Prop({ type: String, default: "" }) uuid!: string;

  private variableName = "";
  private selectList: string[] = [];
  private rangeVal = 10;
  private samplingData: projectResultApi.TresSamping[] = [];
  private recommendData = [];
  private score = 0;
  private chartLine: any = {};
  private chartGauge: any = {};
  private isLoading = false;

  @Watch("dialogVisible")
  initHandle(n: boolean, o: boolean) {
    if (n) {
      this.getSelectList();
      this.getOutlier();
      this.handleGetScore()
    }
  }

  @Watch("samplingData")
  handleSamp(n: projectResultApi.TresSamping[],o: projectResultApi.TresSamping[]){
    if(!isEqual(n, o)){
      this.chartLine = this.handleChart()
    }
  }

  @Watch("score")
  handleScore(n: number, o: number){
    if(n !== o){
      this.chartGauge = this.formatSeries()
    }
  }

  //数采参数动态压缩数据获取
  private async getSampling() {
    const pdata = {
      "app_uuid": this.uuid,
      "compress_ratio": this.rangeVal / 100,
      "variable_name": this.variableName,
    };
    if(this.isLoading){ return }
    try {
       this.isLoading = true;
       this.samplingData = (await projectResultApi.sampling(pdata)) as projectResultApi.TresSamping[];
    } catch (error) {
      this.$message.error(error || 'error')
    } finally {
      this.isLoading = false
    }
   
  }

  //根据app_uuid获取app信息
  private async getSelectList() {
    const res: any = await creatApi.appInfo(this.uuid);
    const param = res.input_param || [],
      list: string[] = [];
    param.forEach((item: creatApi.ParamInter) => {
      list.push(`${item.device_name}_${item.group_name}_${item.variable_name}`);
    });
    this.selectList = list;
    this.variableName = list[0] || "";
    this.getSampling();
  }

  //获取异常值修复table
  private async getOutlier() {
     const data = await projectResultApi.outlier(this.uuid) as []
     this.recommendData = data || []
  }

//获取评分
  private async handleGetScore() {
    const data = await projectResultApi.getScore(this.uuid)
    if( typeof data === "number"){
      this.score = data
    }
  }

  private formatTooltip(val: number) {
    return `${val}%`;
  }

  private handleChart() {
    const list = this.samplingData || [],
      xdata: any[] = [],
      ydata: any = [];
    if (Array.isArray(list) && list.length > 0) {
      list.forEach((item) => {
        xdata.push(item.timestamp);
        ydata.push(item.value);
      });
      return { xdata, series: [{ data: ydata }] };
    }
    
  }

  private formatSeries(){
    const s = {
      data: [{ value: this.score, name: "" }],
      axisLine: {
        lineStyle: {
          color: [
            [this.score / 100, "#1792E5"],
            [1, "rgba(255,255,255,0.20)"],
          ],
          width: 64,
        },
      }
    }
    return {series:[{setting:s}]}
  }

  closes() {
    this.$emit("input", false);
  }
}
</script>
<style lang="less" scoped>
.top-edit-clean {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .span1 {
    font-size: 24px;
    color: #ffffff;
    font-weight: bold;
  }
  .close {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    .close-icon {
      color: #fff;
      font-weight: bold;
      font-size: 16px;
    }
  }
}
.dialog-contant {
  height: 100%;
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
  .top-box{
    height: 240px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .block-title {
    height: 40px;
    line-height: 32px;
    background: #606060;
    border-radius: 8px 8px 0 0;
    color: #ffffff;
    font-weight: bold;
    box-sizing: border-box;
    padding: 4px 16px;
    display: flex;
    justify-content: space-between;
    .p1 {
      line-height: 32px;
    }
  }
  .score {
    width: 40%;
    background: #404040;
    border-radius: 8px;
    .chart-box {
      flex: 1;
    }
  }
  .fixed {
    width: 58%;
    background: #404040;
    border-radius: 8px;
    .table-fixed {
      flex: 1;
      /deep/ .el-table td.gutter, /deep/ .el-table th.gutter{
        background-color: #404040;
      }
      /deep/ .el-table{
        color:#ffffff;
        background-color: #404040;
      }
    }
    
    /deep/ .el-table__body,/deep/ .el-table td,/deep/ .el-table th.is-leaf {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      /deep/ .el-table--border::after, /deep/ .el-table--group::after, /deep/ .el-table::before{
        background-color: #404040;
      }

      /deep/ .el-table__empty-block{
        background-color: #404040;
      }
  }
  .hz {
    width: 100%;
    background: #404040;
    border-radius: 8px;
    flex: 1;
    .collect_hz {
      flex: 1;
    }
    .range-div {
      background-color: #606060;
      border-radius: 0 0 8px 8px;
      padding: 4px 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .tooltips {
      }
      /deep/.el-input__inner {
        background-color: #404040;
        border: 1px solid #a0a0a0;
        border-radius: 4px;
      }
      /deep/ .el-input-number__decrease,
      /deep/ .el-input-number__increase {
        background: #707070;
        font-size: 18px;
        font-weight: bold;
        color: #ffffff;
      }
      /deep/ .el-input-number__decrease {
        border-right: 1px solid #a0a0a0;
      }
      /deep/ .el-input-number__increase {
        border-left: 1px solid #a0a0a0;
      }
      /deep/ .el-slider__runway,
      /deep/ .el-slider__bar {
        background-color: #a0a0a0;
        height: 2px;
      }
      /deep/ .el-slider__button {
        border: none;
        width: 14px;
        height: 14px;
      }
      /deep/ .el-slider__button-wrapper {
        top: -17px;
      }
    }
  }
  .flex-con {
    display: flex;
    flex-direction: column;
  }
}
/deep/ .el-dialog {
  height: 80%;
  min-height: 576px;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  background-color: #303030;
}
/deep/ .el-dialog__body {
  padding: 16px;
  flex: 1;
}
/deep/ .el-dialog__header {
  padding: 16px;
}
/deep/ .el-input.is-disabled .el-input__inner{
  background-color: #404040;
}

</style>