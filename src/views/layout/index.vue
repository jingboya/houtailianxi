<template>
 <div>
   <AppAside></AppAside>
   <AppHeader></AppHeader>
 </div>
</template>

<script>
import AppAside from './components/AppAside'
import AppHeader from './components/AppHeader'
export default {
  name: 'AppLayout',
  data () {
    return {

    }
  },
  components: {
    AppAside,
    AppHeader
  }
}
</script>

<style scoped>

</style>
