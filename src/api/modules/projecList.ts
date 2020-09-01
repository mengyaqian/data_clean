import request from '@/plugins/request';

const { VUE_APP_API } = process.env;

export interface ListItem {
  app_name: string;
  app_uuid: string;
  clean_status: boolean;
  create_time: string;
  detail: string;
  file_hash: string;
  modify_time: string;
  run_status: boolean;
  isChecked: boolean | undefined | null;
}

export interface ChangeStatus {
  app_uuid: string;
  run_status: boolean;
}

export interface DeleteInter{
  app_uuid: string[];
}

export interface CardInter{
  uuid: string;
  type: string;
}

// 项目概览列表
export const projectList = (): Promise<object> => {
    return request({
      url: `${VUE_APP_API}/acquisition_filter/filter_applications`,
      method: 'get'
    });
};

//启动停止
export const startOrStop = (data: ChangeStatus[]): Promise<object> => {
  return request({
    url: `${VUE_APP_API}/acquisition_filter/filter_applications`,
    method: 'post',
    data
  });
};

//删除app
export const deleteApp = (data: DeleteInter): Promise<object> => {
  return request({
    url: `${VUE_APP_API}/acquisition_filter/filter_applications`,
    method: 'delete',
    data
  });
};
