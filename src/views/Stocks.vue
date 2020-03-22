<template>
  <div class="view view--stocks">
    <section class="section">
      <div class="container">
        <h1 class="title">
          <b-icon icon="dollar-sign"></b-icon>tocks
        </h1>
        <div class="stocks">
          <div class="columns is-multiline">
            <div
              class="column is-6-tablet is-4-desktop"
              v-for="(stock, index) in stocks"
              :key="stock.symbol"
              :index="index"
            >
              <Stock :symbol="stock.symbol" :price="stock.price" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Stock from "@/components/Stock.vue";

export default {
  components: {
    Stock
  },
  data() {
    return {
      stocks: [
        {
          symbol: "anz.ax",
          price: "16.01"
        },
        {
          symbol: "nab.ax",
          price: "15.01"
        },
        {
          symbol: "gem.ax",
          price: "6.01"
        },
        {
          symbol: "ctd.ax",
          price: "9.01"
        }
      ]
    };
  }
};
</script>
