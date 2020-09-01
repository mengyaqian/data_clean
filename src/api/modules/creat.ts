import request from '@/plugins/request';

const { VUE_APP_API } = process.env;

export interface ParamInter{
  device_name: string;
  group_name: string;
  variable_name: string;
}

export interface CleanInter{
  app_uuid: string;
}

export interface SaveInter{
  app_name: string;
  app_uuid: string;
  detail: string;
  input_param: ParamInter[];
}

//获取所有设备
export const paramList = (): Promise<object> => {
    return request({
      url: `${VUE_APP_API}/acquisition_filter/data_clean/param_list`,
      method: 'get'
    });
};

//根据app_uuid获取app信息
export const appInfo = (uuid: string) => {
  return request({
    url: `${VUE_APP_API}/acquisition_filter/filter_application/${uuid}`,
    method: 'get'
  });
};

//数据清洗
export const cleaning = (data: CleanInter): Promise<object> => {
  return request({
    url: `${VUE_APP_API}/acquisition_filter/data_clean/cleaning`,
    method: 'put',
    data
  });
}

//保存
export const saveApp = (data: SaveInter): Promise<object> =>{
  return request({
    url: `${VUE_APP_API}/acquisition_filter/data_clean/save`,
    method: 'post',
    data
  })
}

