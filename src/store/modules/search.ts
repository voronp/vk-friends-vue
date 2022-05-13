/* eslint-disable */
import { Module, ActionContext } from 'vuex'
import vk from "@/services/vk";

interface SearchItem {
  id:number
  first_name:string
  last_name:string
  deactivated:string
  is_closed:boolean
  screen_name:string
  sex: number
  bdate: string
  photo_50: string
}

interface ExtendedSearchItem extends SearchItem {
  value:string
  title:string
}

type SearchStatusEnum = 'done' | 'initial' | 'loading';

interface SearchState {
  error: string;
  items: SearchItem[]
  selected: string[],
  itemsDict: ItemsDict,
  status: SearchStatusEnum;
}

const state:() => SearchState = () => ({
  error: '',
  items: [],
  selected: [],
  itemsDict: {},
  status: 'initial',
});

interface ItemsDict {
  [key: string]: ExtendedSearchItem
}

const getters = {
  autocompleteItems: (state:SearchState):ExtendedSearchItem[] => state.items.map(v => ({
    ...v,
    title: `${v.first_name} ${v.last_name} (${v.screen_name})`,
    value: v.screen_name
  }))
}

const mutations = {
  setStatus: (state:SearchState, payload:SearchStatusEnum) => {
    state.status = payload;
  },
  setItems: (state:SearchState, payload:SearchItem[]) => {
    state.items = payload;
  },
  setSelected: (state:SearchState, payload:string[]) => {
    state.selected = payload;
  },
  setItemsDict: (state:SearchState, payload:ItemsDict) => {
    state.itemsDict = payload;
  },
  setError: (state:SearchState, payload:string) => {
    state.error = payload;
  },
};

const actions = {
  addUserToDict({commit, getters, state}:ActionContext<SearchState, unknown>, ids:string[]) {
    const missingIds = ids.filter((v) => !state.itemsDict[v])
    const missingItems = getters.autocompleteItems.filter((v:ExtendedSearchItem) => missingIds.includes(v.screen_name))
    const allItems:ItemsDict = missingItems.reduce((acc:ItemsDict, v:ExtendedSearchItem) => ({...acc, [v.screen_name]: v}), {...state.itemsDict})
    commit('setItemsDict', allItems)
  },
  searchUserVK({commit}:ActionContext<SearchState, unknown>, q:string) {
    commit('setStatus', 'loading');
    vk.call('users.search', {q, v: '5.131', fields: ['sex', 'bdate', 'photo_50', 'screen_name'] }).then((data) => {
      const { response: { items } } = data as {response: {count:number, items: []}}
      commit('setItems', items);
      commit('setStatus', 'done');
    })
  },
};

const searchModule:Module<SearchState,unknown> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default searchModule;
