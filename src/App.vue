<template>
  <div class="page">
    <header class="header">
      <Menu />
    </header>

    <main class="main">
      <router-view />
    </main>

    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <strong>Stocks Valuation App</strong> by
          <a href="https://github.com/peterwcm" target="_blank">Peter Wong</a>
          © {{ new Date().getFullYear() }}
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import Menu from "@/components/Menu.vue";

export default {
  components: {
    Menu
  }
};
</script>

<style lang="scss">
@import "~bulma";
@import "~buefy/src/scss/buefy";
@import "@/styles/base";
@import "~@creativebulma/bulma-tooltip/src/sass";
</style>
