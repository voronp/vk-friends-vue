/* eslint-disable */
import { Module, ActionContext } from 'vuex'
import vk from "@/services/vk";

interface AuthUser {
  domain: string;
  first_name: string;
  href: string;
  id: string;
  last_name: string;
  nickname: string;
}

interface AuthSession {
  expire: number;
  mid: number;
  secret: string;
  sid: string;
  sig: string;
}

type AuthStatusEnum = 'connected' | 'not_authorized' | 'unknown' | 'initial' | 'loading';

interface AuthState {
  error: string;
  session: AuthSession | null;
  user: AuthUser | null;
  status: AuthStatusEnum;
}

const state:() => AuthState = () => ({
  error: '',
  session: null,
  user: null,
  status: 'initial',
});

const getters = {
  isLoggedIn: (state:AuthState) => state.user && state.status === 'connected'
};

const mutations = {
  setStatus: (state:AuthState, payload:AuthStatusEnum) => {
    state.status = payload;
  },
  setSession: (state:AuthState, payload:AuthSession) => {
    state.session = payload;
  },
  setUser: (state:AuthState, payload:AuthUser) => {
    state.user = payload;
  },
};

const actions = {
  loginVK({commit}:ActionContext<AuthState, unknown>) {
    commit('setStatus', 'loading');
    vk.login().then((data) => {
      const {session: {user, ...sessionRest}, status} = data as {session: {user: AuthUser} & AuthSession, status: string};
      commit('setSession', sessionRest);
      commit('setUser', user);
      commit('setStatus', status);
    })
  },
  logoutVK({commit}:ActionContext<AuthState, unknown>) {
    commit('setStatus', 'loading');
    vk.logout().then(() => {
      commit('setSession', null);
      commit('setUser', null);
      commit('setStatus', 'unknown');
    })
  }
};

const authModule:Module<AuthState,unknown> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default authModule;
