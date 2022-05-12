/* eslint-disable */
import { Module, ActionContext } from 'vuex'
import vk, { VKError, VKResponse } from "@/services/vk";

interface WallItem {
  id:number
  text:string
  date:number
}

type WallStatusEnum = 'done' | 'initial' | 'loading';

interface WallState {
  error: string;
  items: WallItem[]
  status: WallStatusEnum;
}

const state:() => WallState = () => ({
  error: '',
  items: [],
  status: 'initial',
});

const getters = {}

const mutations = {
  setStatus: (state:WallState, payload:WallStatusEnum) => {
    state.status = payload;
  },
  setItems: (state:WallState, payload:WallItem[]) => {
    state.items = payload;
  },
  setError: (state:WallState, payload:string) => {
    state.error = payload;
  },
};

const actions = {
  getWallVK({commit, state}:ActionContext<WallState, unknown>, id:number) {
    commit('setStatus', 'loading');
    return vk.call('wall.get', {owner_id: id, v: '5.131'}).then((data) => {
      const { error } = data as VKError
      if (error) {
        commit('setStatus', 'done');
        commit('setError', error.error_msg);
        return
      }
      const { response: { items } } = data as VKResponse
      commit('setItems', items);
      commit('setStatus', 'done');
    })
  },
};

const wallModule:Module<WallState,unknown> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default wallModule;
