/** Echarts颜色 */
export const ECHARTS_COLORS = {
  STACK_BAR: ['#00B38B', '#F6BD16'],
  STACK_LINE: ['#1792E5', '#00B38B', '#F6BD16', '#5D7092', '#F6C3B7', '#E8684A', '#6DC8EC', '#9270CA', '#FF99C3', '#E8684A', '#FBE5A2'],
};

/**自定义Line接受的数据类型 */

export interface TLineData {
  xdata: any[];
  series: any [];//data  setting
  options?: {};
}

export interface TGauge {
  series: any [];//data  setting
  options?: {};
}

