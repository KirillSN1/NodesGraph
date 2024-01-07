<template>
  <nav>
    <router-link v-for="link in links" :key="link.join('|')" :to="link[0]">{{ link[1] }}</router-link>
  </nav>
  <router-view #default="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
<script setup lang="ts">
const links = Object.entries({
  "/":"Home",
  "/about":"About"
})
</script>

<style lang="scss">
nav {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid;
  a {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
