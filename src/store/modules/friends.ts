/* eslint-disable */
import { Module, ActionContext } from 'vuex'
import vk, { VKError, VKResponse } from "@/services/vk";
import {getSexName, bdateToAge} from '@/utils'

interface FriendItem {
  id:number
  first_name:string
  last_name:string
  deactivated:string
  is_closed:boolean
  screen_name:string
  sex:number
  bdate:string
  photo_50:string
}

interface ExtendedFriendItem extends FriendItem {
  sexName:string
  age:string
  friendsCount:number
  friendIds:number[]
}

type FriendsStatusEnum = 'done' | 'initial' | 'loading';

interface FriendsState {
  error: string;
  items: ItemsDict
  status: FriendsStatusEnum;
}

const state:() => FriendsState = () => ({
  error: '',
  items: {},
  status: 'initial',
});

interface ItemsDict {
  [key: string]: FriendItem[]
}

interface ExtendedItemsDict {
  [key: string]: ExtendedFriendItem
}

const getters = {
  allFriends(state:FriendsState) {
    const result:ExtendedItemsDict = {}
    for (let key in state.items) {
      for (let i=0;i<state.items[key].length;i++) {
        const item:FriendItem = state.items[key][i] as FriendItem
        if (result[item.id]) {
          result[item.id].friendsCount++
          result[item.id].friendIds.push(Number(key))
        } else result[item.id] = {
          ...item,
          friendsCount: 1,
          sexName: getSexName(item.sex),
          age: bdateToAge(item.bdate),
          friendIds: [Number(key)]
        }
      }
    }
    return result;
  }
}

const mutations = {
  setStatus: (state:FriendsState, payload:FriendsStatusEnum) => {
    state.status = payload;
  },
  setItems: (state:FriendsState, payload:ItemsDict) => {
    state.items = payload;
  },
  setError: (state:FriendsState, payload:string) => {
    state.error = payload;
  },
};

const actions = {
  getFriendsVK({commit, state}:ActionContext<FriendsState, unknown>, id:number) {
    commit('setStatus', 'loading');
    return vk.call('friends.get', {user_id: id, v: '5.131', fields: ['sex', 'bdate', 'photo_50', 'screen_name'] }).then((data) => {
      const { error } = data as VKError
      if (error) {
        commit('setStatus', 'done');
        commit('setError', error.error_msg);
        return
      }
      const { response: { items } } = data as {response: {count:number, items: []}}
      const { items: oldItems } = state
      commit('setItems', {...oldItems, [id]: items});
      commit('setStatus', 'done');
    })
  },
};

const friendsModule:Module<FriendsState,unknown> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default friendsModule;
