import store from '@/store/store';
import {
    VuexModule, Module, Mutation, Action, getModule,
  } from 'vuex-module-decorators';
import { getStorage, setStorage, clearStorage } from '@/utils/storage';
import * as types from "../mutation-types";
import router from '@/router';
// import { accountApi } from '@/api';
console.log(router)
interface Tactive {
    activeIndex: string | undefined;
}


@Module({
    dynamic: true, namespaced: true, name: 'ActiveRouter', store,
})
class ActiveRouter extends VuexModule implements Tactive {
    public activeIndex = getStorage('activeIndex') || ''
     @Mutation
     public [types.SET_ROUTER](path: string){
         this.activeIndex = path;
         setStorage('activeIndex',path)
     }
    // 获取当前页面路由
    public get getCurrentRouter() {
        return this.activeIndex
    }

}

export default getModule(ActiveRouter);