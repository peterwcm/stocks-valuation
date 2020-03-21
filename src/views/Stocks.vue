<template>
  <div class="view view--stocks">
    <section class="section">
      <div class="container">
        <h1 class="title">
          <b-icon icon="dollar-sign"></b-icon>tocks
        </h1>
        <h2 class="subtitle">
          A simple container to divide your page into
          <strong>sections</strong>, like the one you're currently reading
        </h2>
        <Stock />
      </div>
    </section>
  </div>
</template>

<script>
import Stock from "@/components/Stock.vue";

export default {
  components: {
    Stock
  }
};
</script>
