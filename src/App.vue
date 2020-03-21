<template>
  <div class="app">
    <div class="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/stocks">Stocks</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";

.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.nav {
  padding: 30px;

  > a {
    margin: 1rem;
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
