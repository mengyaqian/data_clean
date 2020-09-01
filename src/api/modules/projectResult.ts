import request from '@/plugins/request';

const { VUE_APP_API } = process.env;

export interface TparamSampling {
  app_uuid: string;
  compress_ratio: number;
  variable_name: string;
}
export interface TresSamping {
  timestamp: string;
  value: number;
}

// 数采参数动态压缩数据获取
export const sampling = (data: TparamSampling): Promise<object> => {
    return request({
      url: `${VUE_APP_API}/acquisition_filter/data_clean/sampling`,
      method: 'put',
      data
    });
};

//获取异常值修复table
export const outlier = (uuid: string): Promise<object> => {
  return request({
    url: `${VUE_APP_API}/acquisition_filter/data_clean/outlier_summary/${uuid}`,
    method: 'get'
  });
};

//获取评分
export const getScore = (uuid: string): Promise<object> => {
  return request({
    url: `${VUE_APP_API}/acquisition_filter/data_clean/score_summary/${uuid}`,
    method: 'get'
  });
};