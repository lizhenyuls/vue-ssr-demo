<template>
  <div>
    <a @click="backHome" class="g-h">返回首页</a>
    <a>返回上一页({{ second }}s)</a>
  </div>
</template>

<script>
export default {
  name: 'backBtnGroup',
  data () {
    return {
      second: 5,
      timer: null
    }
  },
  methods: {
    backHome () {
      this.$router.replace({
        name: 'home'
      })
    },
    backPrev () {
      this.$router.go(-1)
    }
  },
  mounted () {
    this.timer = setInterval(() => {
      if (this.second === 0) {
        clearInterval(this.timer)
        this.backPrev()
      } else {
        this.second--
      }
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
