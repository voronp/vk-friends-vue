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
  status: SearchStatusEnum;
}

const state:() => SearchState = () => ({
  error: '',
  items: [],
  selected: [],
  status: 'initial',
});

interface ItemsDict {
  [key: string]: ExtendedSearchItem
}

const getters = {
  autocompleteItems: (state:SearchState):ExtendedSearchItem[] => state.items.map(v => ({
    ...v,
    title: `${v.first_name} ${v.last_name}`,
    value: v.screen_name
  })),
  itemsDict: (state:SearchState, g:{autocompleteItems:ExtendedSearchItem[]}) => g.autocompleteItems.reduce((acc, v) => ({...acc, [v.screen_name]: v}), {}),
  autocompleteSelected: (state:SearchState, g:{itemsDict:ItemsDict}) => {
    return state.selected.map(v => g.itemsDict[v].title)
  }
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
  setError: (state:SearchState, payload:string) => {
    state.error = payload;
  },
};

const actions = {
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
