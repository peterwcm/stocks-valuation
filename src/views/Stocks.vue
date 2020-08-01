<template>
  <div class="view view--stocks">
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            <b-icon icon="dollar-sign"></b-icon>tocks
          </h1>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="stocks">
          <b-message type="is-danger" v-if="error">{{ error }}</b-message>
          <div class="columns">
            <div class="column">
              <b-field label="Watchlist">
                <b-taginput
                  ref="watchlist"
                  v-model="watchlist"
                  ellipsis
                  icon="comments-dollar"
                  placeholder="Add a stock symbol, e.g. ANZ.AX"
                  type="is-info"
                  @input="symbolsChange"
                ></b-taginput>
              </b-field>
            </div>
          </div>
          <div class="columns is-multiline">
            <div
              class="column is-6-tablet is-4-desktop"
              v-for="(stock, index) in sortedStocks"
              :key="stock.symbol"
              :index="index"
            >
              <Stock
                v-bind="stock"
                v-on:refresh-stock="refreshStock"
                v-on:remove-stock="removeStock"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Stock from "@/components/Stock.vue";
import UserModel from "@/models/UserModel";
import StockModel from "@/models/StockModel";

export default {
  components: {
    Stock,
  },
  data() {
    return {
      // We only need one user for personal use.
      username: "admin",
      error: null,
      stocks: null,
      watchlist: null,
    };
  },
  methods: {
    /**
     * Symbols change event.
     */
    async symbolsChange() {
      // Convert all symbols to uppercase.
      this.watchlist = this.watchlist.map((s) => s.toUpperCase());
      // Sync the watchlist.
      await UserModel.updateWatchlist(this.username, this.watchlist);

      this.refreshStocks();
    },
    /**
     * Refresh details of a stock.
     *
     * @param {object} The updated stock object.
     */
    refreshStock(stock) {
      this.stocks = this.stocks.map((s) =>
        s.symbol === stock.symbol ? stock : s
      );
    },
    /**
     * Remove a stock from the watchlist.
     *
     * @param {object} The stock object to be removed.
     */
    async removeStock(stock) {
      // Remove the stock symbol from the watchlist.
      this.watchlist = this.watchlist.filter(
        (s) => s.toLowerCase() !== stock.symbol.toLowerCase()
      );

      // Sync the watchlist.
      await UserModel.updateWatchlist(this.username, this.watchlist);

      this.refreshStocks();
    },
    /**
     * Refresh the stocks listing.
     */
    async refreshStocks() {
      // Add loading effect inside the watchlist tags input.
      const symbolsLoading = this.$buefy.loading.open({
        container: null,
      });

      try {
        this.stocks = await StockModel.getStocks(this.watchlist);
        this.error = null;
      } catch (e) {
        // Error fetching stocks with the given watchlist.
        this.error = `Cannot fetch data for the following symbol(s): ${e.invalidSymbols}`;
        // Unset the stocks list.
        this.stocks = [];
      }

      // Stop the loading effect.
      symbolsLoading.close();
    },
  },
  computed: {
    /**
     * Sort stocks based on their score.
     */
    sortedStocks() {
      const stocks = this.stocks;
      return stocks
        ? stocks.sort((a, b) => b.score.overall - a.score.overall)
        : [];
    },
  },
  async mounted() {
    // Load the user and stocks data.
    const user = await UserModel.getUser(this.username);
    this.watchlist = user ? user?.watchlist : [];

    this.refreshStocks();
  },
};
</script>
