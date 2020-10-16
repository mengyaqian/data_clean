<template>
  <BaseEchart ref="echart" :options="options" />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ECHARTS_COLORS, TGauge } from '@/store/constant';
import { cloneDeep } from 'lodash';
import BaseEchart from './TheBase.vue';

@Component({
  components: {
    BaseEchart,
  },
})
export default class BaseEchartGauge extends Vue {
  /** 数据源 */
  @Prop({
    type: Object,
    required: true,
    default: () => {
        return {series: [], options: {}}
    },
  })
  data!: TGauge  

  /** 自定义颜色 */
  @Prop({
    type: String,
  })
  colors!: string

  @Prop({
    type: String,
    default: 'emptycircle',
  })
  symbol!: string

  private get options() {
      
    const option = {
      color: this.colors || ECHARTS_COLORS.STACK_LINE,
      tooltip: {
          formatter: "{a} <br/>{b} : {c}%",
      },
      grid: {
        // 统计图距离边缘的距离
        top: 50,
        left: '50px',
        right: '50px',
        bottom: 50,
      },
      ...this.data.options,
      series: this.formatSeriesData,
    };
    return option;
  }

  // 数据处理
  private get formatSeriesData() {
    const { data } = this;
    if (!this.data.series) return [];
    const list = cloneDeep(data).series;
    return list.map((lineItem) => {
        lineItem = {
            
            // name: "数据整体质量评分",
            type: "gauge",
            splitNumber: 1,
            radius: 150, //半径
            detail: { show: false, formatter: "{value}%" },
            // data: [{ value: data.vdata, name: "" }],
            startAngle: 180, //开始角度
            endAngle: 0, //结束角度
            // axisLine: {
            //   lineStyle: {
            //     color: [
            //       [data.vdata / 100, "#1792E5"],
            //       [1, "rgba(255,255,255,0.20)"],
            //     ],
            //     width: 64,
            //   },
            // },
            axisLine: {
              lineStyle: {
                color: [
                  [0.5, "#1792E5"],
                  [1, "rgba(255,255,255,0.20)"],
                ],
                width: 64,
              },
            },
            axisTick: {
              show: false, //是否显示刻度
            },
            axisLabel: {
              distance: 2,
              color: "#fff",
              fontSize: 10,
              padding: [20, -30, 0, -30],
            },
            pointer: {
              length: "30%",
              width: 5,
            },
            itemStyle: { color: "#707070" },
            splitLine: {
              length: 30,
              lineStyle: {
                color: "rgba(255,255,255,0)",
              },
            },
            center: ["50%", "85%"],
             ...lineItem.setting,
        }
        return lineItem;
       
    })

  }
}
</script>
