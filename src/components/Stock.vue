<template>
  <article class="card stock">
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
    <header class="stock__header">
      <section class="stock__heading">
        <div class="columns is-mobile level">
          <div class="column is-narrow">
            <h2 class="title stock__symbol">
              {{ symbol }}
              <b-icon
                v-if="ask"
                class="has-tooltip-arrow has-tooltip-right"
                :data-tooltip="`$${ask}`"
                icon="info-circle"
                size="is-small"
              ></b-icon>
            </h2>
          </div>
          <div class="column is-narrow">
            <a
              :href="`https://finance.yahoo.com/quote/${symbol}`"
              target="_blank"
              class="stock__link"
            >
              <b-icon icon="external-link-alt" size="is-small"></b-icon>
            </a>
          </div>
        </div>
      </section>
      <section class="stock__subheading">
        <div class="columns">
          <div class="column" v-if="name">
            <h3 class="subtitle stock__name">{{ name }}</h3>
          </div>
        </div>
      </section>
      <section class="stock__highlights">
        <div class="level is-mobile">
          <div class="level-item has-text-centered">
            <div>
              <h3 class="heading">Price/Earnings</h3>
              <p class="subtitle">{{ priceToEarnings | optional | round }}</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <h3 class="heading">Price/Book</h3>
              <p class="subtitle">{{ priceToBook | optional | round }}</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <h3 class="heading">Div Yield</h3>
              <p class="subtitle">{{ dividendYield | optional | percentage }}</p>
            </div>
          </div>
        </div>
      </section>
    </header>
    <div class="card-content">
      <div class="level is-mobile">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Price/Sales</p>
            <p class="subtitle">{{ priceToSales | optional | round }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Price/Cash</p>
            <p class="subtitle">{{ priceToCash | optional | round }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Market Cap</p>
            <p class="subtitle">{{ marketCap | optional | abbreviation }}</p>
          </div>
        </div>
      </div>
      <div class="level is-mobile">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Debt/Equity</p>
            <p class="subtitle">{{ debtToEquity | optional | round }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Quick Ratio</p>
            <p class="subtitle">{{ quickRatio | optional | round }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Current Ratio</p>
            <p class="subtitle">{{ currentRatio | optional | round }}</p>
          </div>
        </div>
      </div>
      <div class="columns" v-if="createdAt">
        <div class="column has-text-right stock__date">
          <b-button size="is-small" @click="refresh">
            <b-icon icon="sync-alt"></b-icon>
          </b-button>
          <small>
            <em>Last fetched: {{ createdAt | moment('from', 'now') }}</em>
          </small>
        </div>
      </div>
    </div>
    <footer class="card-footer stock__footer">
      <b-progress
        :type="[score > scoreThreshold ? 'is-success' : 'is-danger']"
        :value="score"
        :show-value="score > 60 ? true : false"
        format="percent"
        max="100"
      ></b-progress>
    </footer>
  </article>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import StockModel from "@/models/StockModel";

@Component({
  filters: {
    abbreviation: (val: number | string) => {
      if (typeof val !== "number") return val;
      if (val < 1e3) return val;
      if (val >= 1e3 && val < 1e6) return +(val / 1e3).toFixed(1) + "K";
      if (val >= 1e6 && val < 1e9) return +(val / 1e6).toFixed(1) + "M";
      if (val >= 1e9 && val < 1e12) return +(val / 1e9).toFixed(1) + "B";
      if (val >= 1e12) return +(val / 1e12).toFixed(1) + "T";
    },
    percentage: (val: number | string, decimal: number = 2) => {
      return typeof val === "number" ? `${(val * 100).toFixed(decimal)}%` : val;
    },
    optional: (val: number | string, emptyText: string = "n/a") => {
      return val !== null && val !== undefined ? val : emptyText;
    },
    round: (val: number | string, decimal: number = 2) => {
      return typeof val === "number" ? +val.toFixed(decimal) : val;
    }
  }
})
export default class Stock extends Vue {
  @Prop() private symbol!: string;
  @Prop() private ask!: number;
  @Prop() private name!: string;
  @Prop() private marketCap!: number;
  @Prop() private priceToEarnings!: number;
  @Prop() private priceToBook!: number;
  @Prop() private priceToCash!: number;
  @Prop() private priceToSales!: number;
  @Prop() private quickRatio!: number;
  @Prop() private currentRatio!: number;
  @Prop() private debtToEquity!: number;
  @Prop() private dividendYield!: number;
  @Prop() private score!: number;
  @Prop() private createdAt!: Date;
  scoreThreshold: number = 75;
  isLoading: boolean = false;

  /**
   * Fetch the latest details of this stock.
   */
  async refresh() {
    this.isLoading = true;

    const stock = await StockModel.refreshStock(this.symbol);
    this.$emit("refresh-stock", stock);

    this.isLoading = false;
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/components/_stock";
</style>
