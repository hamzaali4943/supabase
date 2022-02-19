import { supabase } from "boot/supabase";

const state = () => ({
  user: null,
  error: null,
  session: null
})

const mutations = {
  setUser (state, payload) {
    state.user = payload
  },
  setError (state, payload) {
    state.error = payload
  },
  setSession (state, session) {
  state.session = session
}
}

const getters = {
  user: (state) => state.user,
}

const actions = {
  setSession ({ commit }, session) {
    commit('setSession', session)
  },
  
  setUser ({ commit }, user) {
    commit('setUser', user)
  },

  // async loadAuth ({ commit, dispatch }) {
  //   try {
  //     const user = supabase.auth.user()
  //     console.log('sloadAuth:', user)
  //     commit('setUser', user)
  //     // dispatch('getMember', user.id)
  //     // dispatch('getAccess')
  //     localStorage.setItem('loggedIn', true)
  //   } catch (error) {
  //     commit('setUser', null)
  //     // commit('setMember', null)
  //     // commit('setAccess', null)
  //     localStorage.setItem('loggedIn', false)
  //   }
  // },
  
  async login ({ commit, dispatch }, { email, password }) {
    try {
      await supabase.auth.signIn({ email, password })
      dispatch('loadAuth')
      // const userInfo = await Auth.currentUserInfo()
      // const user = {
      //   id: userInfo.attributes.sub,
      //   email: userInfo.attributes.email
      // }
      // commit('setUser', user)
      // dispatch('getProfile', user.id)
      // dispatch('getAccess')
      // dispatch('getMember', user.id)
      this.$router.push({ name: 'account' })
    } catch (error) {
      commit('setError', error)
      const err = error
      return err.message
    }
  },
  
  async logout ({ commit }) {
    await supabase.auth.signOut()
    commit('setUser', null)
    localStorage.setItem('loggedIn', false)
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
