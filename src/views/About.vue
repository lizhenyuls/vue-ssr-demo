<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h2>{{$store.state.about.msg}}</h2>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'about',
  asyncData ({ store }) {
    return store.dispatch('about')
  }
}
</script>
