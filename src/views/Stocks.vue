<template>
  <div class="view view--stocks">
    <section class="section">
      <div class="container">
        <h1 class="title">
          <b-icon icon="dollar-sign"></b-icon>tocks
        </h1>
        <Stock symbol="anz.ax" price="16.01" />
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
