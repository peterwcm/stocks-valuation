<template>
  <div class="view view--stocks">
    <section class="section">
      <div class="container">
        <div class="stocks">
          <b-message type="is-danger" v-if="error">{{ error }}</b-message>
          <div class="columns">
            <div class="column">
              <b-field>
                <b-select
                  placeholder="Select a watchlist"
                  v-model="watchlistId"
                  required
                  expanded
                  @input="switchWatchlist"
                >
                  <option v-for="(w, index) in watchlists" :value="index" :key="index">{{ w.name }}</option>
                </b-select>
                <p class="control">
                  <b-button icon-right="plus" @click="addWatchlist" />
                </p>
                <p class="control">
                  <b-button icon-right="edit" @click="renameWatchlist" />
                </p>
                <p class="control">
                  <b-button icon-right="globe" @click="regionaliseWatchlist" />
                </p>
                <p class="control">
                  <b-button
                    icon-right="trash"
                    @click="deleteWatchlist"
                    v-if="watchlists.length > 1"
                  />
                </p>
              </b-field>

              <b-field>
                <b-taginput
                  ref="watchlist"
                  v-model="watchlist"
                  ellipsis
                  attached
                  icon="comments-dollar"
                  placeholder="Add a stock symbol, e.g. ANZ.AX"
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
                :isDetailed="isDetailed"
                v-on:toggle-details="toggleDetails"
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
      watchlists: [],
      watchlist: null,
      watchlistId: 0,
      isDetailed: false,
    };
  },
  methods: {
    /**
     * Add watchlist event.
     */
    addWatchlist() {
      this.$buefy.dialog.prompt({
        title: "Add watchlist",
        inputAttrs: {
          type: "text",
          placeholder: "Name",
          required: true,
        },
        confirmText: "Add",
        trapFocus: true,
        closeOnConfirm: false,
        onConfirm: async (value, dialog) => {
          this.$buefy.toast.open("Adding watchlist...");
          await UserModel.addWatchlist(this.username, value);
          this.$buefy.toast.open(`Watchlist added`);

          // Refresh watchlist.
          await this.loadWatchlists();
          this.switchWatchlist(this.watchlists.length - 1);

          dialog.close();
        },
      });
    },
    /**
     * Rename watchlist event.
     */
    renameWatchlist() {
      this.$buefy.dialog.prompt({
        title: "Rename watchlist",
        inputAttrs: {
          type: "text",
          placeholder: "Name",
          value: this.watchlists[this.watchlistId].name,
        },
        confirmText: "Save",
        trapFocus: true,
        closeOnConfirm: false,
        onConfirm: async (value, dialog) => {
          this.$buefy.toast.open("Renaming watchlist...");
          await UserModel.renameWatchlist(
            this.username,
            this.watchlistId,
            value
          );
          this.$buefy.toast.open("Watchlist renamed");

          // Sync the local watchlist name.
          this.watchlists[this.watchlistId].name = value;

          dialog.close();
        },
      });
    },
    regionaliseWatchlist() {
      this.$buefy.dialog.prompt({
        title: "Regionalise watchlist",
        inputAttrs: {
          type: "text",
          placeholder: "Region code",
          required: false,
          value: this.watchlists[this.watchlistId].regionCode,
        },
        confirmText: "Save",
        trapFocus: true,
        closeOnConfirm: false,
        onConfirm: async (value, dialog) => {
          this.$buefy.toast.open("Regionalising watchlist...");
          const regionCode = value.toUpperCase();

          await UserModel.regionaliseWatchlist(
            this.username,
            this.watchlistId,
            regionCode
          );
          this.$buefy.toast.open("Watchlist regionalised");

          // Sync the local watchlist region code.
          this.watchlists[this.watchlistId].regionCode = regionCode;
          await this.symbolsChange();

          dialog.close();
        },
      });
    },
    /**
     * Delete watchlist event.
     */
    deleteWatchlist() {
      this.$buefy.dialog.confirm({
        title: "Deleting watchlist",
        message:
          "Are you sure you want to <b>delete</b> the current watchlist? This action cannot be undone.",
        confirmText: "Delete",
        type: "is-danger",
        hasIcon: true,
        closeOnConfirm: false,
        onConfirm: async (value, dialog) => {
          this.$buefy.toast.open("Deleting watchlist...");
          await UserModel.deleteWatchlist(this.username, this.watchlistId);

          this.$buefy.toast.open("Watchlist deleted");

          // Refresh watchlists.
          await this.loadWatchlists();
          this.switchWatchlist();

          dialog.close();
        },
      });
    },
    /**
     * Symbols change event.
     */
    async symbolsChange() {
      // Convert all symbols to uppercase and sort it.
      this.watchlist = this.watchlist.map((s) => {
        const regionCode = this.watchlists[this.watchlistId].regionCode;

        s = s.toUpperCase();
        if (regionCode && !s.endsWith(`.${regionCode}`)) {
          s = `${s}.${regionCode}`;
        } else if (!regionCode && s.indexOf(".") !== -1) {
          s = s.substring(0, s.indexOf("."));
        }

        return s;
      });
      this.watchlist.sort();
      // Sync the watchlist.
      await UserModel.updateWatchlist(
        this.username,
        this.watchlistId,
        this.watchlist
      );

      this.refreshStocks();
    },
    /**
     * Toggle the detailed mode.
     *
     * @param {boolean} isDetailed
     *   Indicate if the detailed mode is enabled.
     */
    toggleDetails(isDetailed) {
      this.isDetailed = isDetailed;
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
      await UserModel.updateWatchlist(
        this.username,
        this.watchlistId,
        this.watchlist
      );

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
    /**
     * Load user's watchlists.
     */
    async loadWatchlists() {
      const user = await UserModel.getUser(this.username);
      this.watchlists = user.watchlists;
    },
    /**
     * Switch to a watchlist.
     */
    switchWatchlist(watchlistId = 0) {
      this.watchlistId = watchlistId;
      this.watchlist = this.watchlists[this.watchlistId].list;
      this.watchlist.sort();
      this.refreshStocks();
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
  watch: {
    watchlistId(newWatchlistId) {
      localStorage.watchlistId = newWatchlistId;
    },
  },
  async mounted() {
    await this.loadWatchlists();
    if (
      localStorage.watchlistId &&
      localStorage.watchlistId > 0 &&
      localStorage.watchlistId < this.watchlists.length
    ) {
      this.watchlistId = localStorage.watchlistId;
    }
    this.switchWatchlist(this.watchlistId);
  },
};
</script>
