<script lang="ts">
import {
  Component, Vue, Prop, Ref, Watch,
} from 'vue-property-decorator';
import echarts from 'echarts';
import ElementResizeDecorator from 'element-resize-detector';
import { debounce, isEqual } from 'lodash';

@Component({
  name: 'BaseEchart',
})
export default class extends Vue {
  @Ref() readonly echart!: HTMLDivElement

  /** echarts options配置参数 */
  @Prop({
    type: Object,
    required: true,
    default: () => ({}),
  })
  options!: echarts.EChartOption

  /** echarts实例 */
  private ins: echarts.ECharts | null = null

  /** resize实例 */
  private insResize = null

  /** 监听options变化，重新渲染echarts */
  @Watch('options', { deep: true })
  onOptionsChange(val: echarts.EChartOption,oldval: echarts.EChartOption): void {
    if (this.ins !== null) {
      (this as any).ins.clear();
      (this as any).ins.setOption(val, true);
    }
  }

  render(h: any) {
    return h('div', {
      ref: 'echart',
      class: 'g-echarts',
    });
  }

  private mounted() {
    this.renderEchart();
    this.resize = debounce(this.resize, 200);
    if (!this.insResize) {
      (this as any).insResize = ElementResizeDecorator({
        strategy: 'scroll',
      });
    }
    (this as any).insResize.listenTo(this.echart, this.resize);
  }

  /**
   * @method beforeDestroy
   * @description 销毁实例、取消resize监听
   */
  private beforeDestroy() {
    // if (this.ins) {
    //   this.ins.dispose();
    // }
    if (this.insResize) {
      (this as any).insResize.uninstall(this.echart);
    }
  }

  /**
   * @method renderEchart
   * @description 渲染echarts实例
   */
  public renderEchart() {
    if (this.ins) {
      this.ins.dispose();
      this.ins = null;
    }
    console.log(this.options)
    this.ins = echarts.init(this.echart);
    this.ins.setOption(this.options);
  }

  /**
   * @methdos resize
   * @description 对外暴露方法，调整Echarts尺寸
   */
  resize() {
    if (this.ins) {
      this.ins.resize();
      this.$emit('resize');
    }
  }

  /**
   * @methdos rerender
   * @description 对外暴露方法，清除重新创建
   */
  public rerender() {
    if (this.ins) {
      this.ins.clear();
      (this as any).renderEChart();
      this.ins.resize();
    }
  }

  /**
   * @methdos getIns
   * @description 对外暴露方法，获取Echarts实例
   */
  public getIns() {
    return this.ins;
  }
}
</script>

<style lang="less">
.g-echarts {
  width: 100%;
  height: 100%;
}
</style>
