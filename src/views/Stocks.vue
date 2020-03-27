<template>
  <div class="view view--stocks">
    <section class="section">
      <div class="container">
        <h1 class="title">
          <b-icon icon="dollar-sign"></b-icon>tocks
        </h1>
        <div class="stocks">
          <b-message type="is-danger" v-if="error">{{ error }}</b-message>
          <div class="columns is-multiline">
            <div
              class="column is-6-tablet is-4-desktop"
              v-for="(stock, index) in sortedStocks"
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
import StockModel from "@/models/StockModel";
import axios from "axios";

export default {
  components: {
    Stock
  },
  data() {
    return {
      error: null,
      stocks: null
    };
  },
  computed: {
    sortedStocks() {
      const stocks = this.stocks;
      return stocks ? stocks.sort((a, b) => b.score - a.score) : [];
    }
  },
  async mounted() {
    // @todo: remove this. for development only.
    const USE_API = false;

    if (USE_API) {
      const region = "TW";
      const symbol = "2317.TW";

      axios
        .get(
          "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-statistics",
          {
            params: {
              region,
              symbol
            },
            headers: {
              "content-type": "application/octet-stream",
              "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
              "x-rapidapi-key": process.env.VUE_APP_RAPIDAPI_KEY
            }
          }
        )
        .then(response => {
          console.log(response);
          this.stocks = [response.data];
        })
        .catch(error => {
          this.error = error;
        });
    } else {
      try {
        this.stocks = await StockModel.getStocks();
        console.log("stocks", this.stocks);
      } catch (err) {
        this.error = err.message;
      }
    }
  }
};
</script>
