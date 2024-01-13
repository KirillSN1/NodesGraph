<template>
  <div class="page-layout">
    <header class="header">
      <slot name="header"></slot>
    </header>
    <main class="body">
      <slot name="body"><slot></slot></slot>
    </main>
    <footer class="footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
<style scoped lang="scss">
.page-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  margin: auto;
  align-items: stretch;
  .header {
    width: 100%;
  }
  .body {
    height: 100%;
  }
}
</style>
