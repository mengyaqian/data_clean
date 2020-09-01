<template>
  <BaseEchart ref="echart" :options="options" />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ECHARTS_COLORS } from '@/store/constant';
import BaseEchart from './TheBase.vue';

@Component({
  name: 'BaseEchartBar',
  components: {
    BaseEchart,
  },
})
export default class extends Vue {
  @Prop({
    type: Array,
    required: true,
    default: () => [],
  })
  data!: any[]

  @Prop({
    type: Array,
  })
  colors!: string[]

  private get chartsColors() {
    return this.colors || ECHARTS_COLORS.STACK_BAR;
  }

  private get options() {
    const option = {
      color: this.chartsColors,
      tooltip: {
        trigger: 'item',
        // formatter: '{a} <br/>{b}: {c} ({d}%)',
        formatter(params: any) {
          console.log(params);
          const res = `<div style="width:116px;height:34px;"><p>${params.marker}${params.name}:${params.percent}</p></div>`;
          return res;
        },
        borderWidth: '1',
        borderColor: 'rgba(198,200,207,1)',
        extraCssText: 'box-shadow:0px 2px 10px 0px rgba(0,0,0,0.2);',
        padding: [
          8, // 上
          8, // 右
          8, // 下
          8, // 左
        ],
        backgroundColor: 'rgba(255,255,255,0.9)',
        textStyle: {
          color: '#555555', // 设置文字颜色
        },
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        orient: 'vertical',
        icon: 'circle',
        right: 36,
        top: 'center',
        data: ['好评', '差评'],
        textStyle: {
          color: '#999',
          fontSize: 12,
        },
      },
      series: [
        {
          name: '口碑评价分布',
          type: 'pie',
          radius: ['50%', '80%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '30',
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: this.data,
        },
      ],
    };
    return option;
  }
}
</script>
