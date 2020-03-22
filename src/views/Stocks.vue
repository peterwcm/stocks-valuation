<template>
  <div class="view view--stocks">
    <section class="section">
      <div class="container">
        <h1 class="title">
          <b-icon icon="dollar-sign"></b-icon>tocks
        </h1>
        <div class="stocks">
          <!-- <b-message>{{ msg }}</b-message> -->
          <div class="columns is-multiline">
            <div
              class="column is-6-tablet is-4-desktop"
              v-for="(stock, index) in stocks"
              :key="stock.symbol"
              :index="index"
            >
              <Stock v-bind="stock" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Stock from "@/components/Stock.vue";
import axios from "axios";

export default {
  components: {
    Stock
  },
  data() {
    return {
      stocks: null
    };
  },
  mounted() {
    if (process.env.VUE_APP_USE_RAPIDAPI === "true") {
      const asxSymbols = ["GEM", "ANZ", "CBA"];

      axios
        .get(
          `https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-quotes?region=AU&lang=en&symbols=${asxSymbols
            .map(symbol => `${symbol}.ax`)
            .join("%252C")}`,
          {
            headers: {
              "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
              "x-rapidapi-key": process.env.VUE_APP_RAPIDAPI_KEY
            }
          }
        )
        .then(response => {
          console.log(response);
          return (this.stocks = response.data.quoteResponse.result);
        })
        .catch(error => console.log(error));
    } else {
      axios
        .get(`${process.env.BASE_URL}stocks.json`)
        .then(response => {
          this.stocks = response.data;
          console.log(response);
        })
        .catch(error => console.log(error));
    }
  }
};
</script>
