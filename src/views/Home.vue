<template>
  <div class="view view--home">
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Primary title</h1>
          <h2 class="subtitle">Primary subtitle</h2>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <HelloWorld msg="Welcome to Your Vue.js App" />
      </div>
    </section>
  </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld
  }
};
</script>
