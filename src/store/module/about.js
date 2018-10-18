import axios from 'axios'
const baseUrl = process.env.VUE_APP_AXIOS_URL
export default {
  state: {
    msg: ''
  },
  mutations: {
    about (state, { msg }) {
      state.msg = msg
    }
  },
  actions: {
    about ({ commit }) {
      return new Promise((resolve, reject) => {
        axios.get(`${baseUrl}test`).then(res => {
          const { data } = res
          if (data.code === 200) {
            commit('about', { msg: data.msg })
            resolve(data)
          } else {
            reject({ code: 400 })
          }
        }).catch(reject)
      })
    }
  }
}
