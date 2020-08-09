<template>
  <article class="card stock">
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
    <header class="stock__header">
      <section class="stock__heading">
        <div class="columns is-mobile level">
          <div class="column is-narrow">
            <h2 class="title stock__symbol">
              <a :href="`https://finance.yahoo.com/quote/${symbol}`" target="_blank">{{ symbol }}</a>

              <b-icon
                v-if="ask"
                class="has-tooltip-arrow has-tooltip-right"
                :data-tooltip="`$${ask}`"
                icon="info-circle"
                size="is-small"
              ></b-icon>
            </h2>
          </div>
          <div class="column is-narrow stock__remove">
            <b-button class="stock__icon-button" size="is-small" @click="remove">
              <b-icon icon="times"></b-icon>
            </b-button>
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
      <section class="stock__rating">
        <b-progress
          :type="score.overall > scoreThreshold ? 'is-success' : 'is-danger'"
          :value="score.overall"
          :show-value="true"
          size="is-small"
          format="percent"
          :max="100"
        ></b-progress>
      </section>
      <section class="stock__highlights">
        <div class="level is-mobile">
          <div class="level-item has-text-centered">
            <div class="stock__pe">
              <h3 class="heading">P/E Ratio</h3>
              <p class="subtitle">
                {{ priceToEarnings | optional | round }}
                <b-icon
                  v-if="netIncomeToCommon > operatingCashflow"
                  class="has-tooltip-arrow has-tooltip-right has-tooltip-multiline"
                  data-tooltip="Earnings quality alert: Net income shouldn't be more than operating cash flow"
                  icon="exclamation-triangle"
                  size="is-small"
                ></b-icon>
              </p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <h3 class="heading">P/B Ratio</h3>
              <p class="subtitle">{{ priceToBook | optional | round }}</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div class="stock__yield">
              <h3 class="heading">Div Yield</h3>
              <p class="subtitle">
                {{ dividendYield | optional | percentage }}
                <a
                  v-if="dividendYield && dividendUrl"
                  :href="dividendUrl"
                  target="_blank"
                  class="stock__icon-link"
                >
                  <b-icon icon="chart-bar" size="is-small"></b-icon>
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </header>
    <b-collapse
      class="stock__stats"
      :open="isDetailed"
      animation="slide"
      @open="toggleDetails(true)"
      @close="toggleDetails(false)"
    >
      <div slot="trigger" class="card-header">
        <p class="card-header-title">
          Financials
          <a
            v-if="financeUrl"
            :href="financeUrl"
            target="_blank"
            class="stock__icon-link"
          >
            <b-icon icon="external-link-alt" size="is-small"></b-icon>
          </a>
        </p>
        <a class="card-header-icon">
          <b-icon
            class="stock__icon-button"
            size="is-small"
            :icon="isDetailed ? 'caret-down' : 'caret-up'"
          ></b-icon>
        </a>
      </div>
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
        <div class="level is-mobile">
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">Profit Margin</p>
              <p class="subtitle">{{ profitMargins | optional | percentage }}</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">ROE</p>
              <p class="subtitle">{{ returnOnEquity | optional | percentage }}</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">Earnings Growth</p>
              <p class="subtitle">{{ earningsGrowth | optional | percentage }}</p>
            </div>
          </div>
        </div>
      </div>
    </b-collapse>
    <div class="card-content">
      <div class="block stock__sub-rating">
        <div class="columns is-mobile">
          <div class="column is-4">
            <p class="heading">Valuation</p>
          </div>
          <div class="column is-8">
            <b-progress
              :type="score.valuation > scoreThreshold ? 'is-success' : 'is-danger'"
              :value="score.valuation"
              :show-value="true"
              size="is-small"
              format="percent"
              :max="100"
            ></b-progress>
          </div>
        </div>
        <div class="columns is-mobile">
          <div class="column is-4">
            <p class="heading">Health</p>
          </div>
          <div class="column is-8">
            <b-progress
              :type="score.health > scoreThreshold ? 'is-success' : 'is-danger'"
              :value="score.health"
              :show-value="true"
              size="is-small"
              format="percent"
              :max="100"
            ></b-progress>
          </div>
        </div>
        <div class="columns is-mobile">
          <div class="column is-4">
            <p class="heading">Profitability</p>
          </div>
          <div class="column is-8">
            <b-progress
              :type="score.profitability > scoreThreshold ? 'is-success' : 'is-danger'"
              :value="score.profitability"
              :show-value="true"
              size="is-small"
              format="percent"
              :max="100"
            ></b-progress>
          </div>
        </div>
      </div>

      <div class="columns is-mobile">
        <div class="column has-text-right stock__date" v-if="createdAt">
          <small>
            <em>Last fetched: {{ createdAt | moment('from', 'now') }}</em>
          </small>
          <b-button class="stock__icon-button" size="is-small" @click="refresh">
            <b-icon icon="sync-alt"></b-icon>
          </b-button>
        </div>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import StockModel, { StockScore } from "@/models/StockModel";

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
    },
  },
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
  @Prop() private netIncomeToCommon!: number;
  @Prop() private operatingCashflow!: number;
  @Prop() private profitMargins!: number;
  @Prop() private earningsGrowth!: number;
  @Prop() private returnOnEquity!: number;
  @Prop() private score!: StockScore;
  @Prop() private createdAt!: Date;
  @Prop() private isDetailed!: boolean;
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

  /**
   * Toggle the detailed mode.
   *
   * @param {boolean} isDetailed
   *   Indicate if the detailed mode is enabled.
   */
  toggleDetails(isDetailed: boolean) {
    this.$emit("toggle-details", isDetailed);
  }

  /**
   * Remove this stock.
   */
  remove() {
    this.$emit("remove-stock", this);
  }

  /**
   * Fetch the region code of this stock.
   *
   * @returns {string}
   *   The 2-char region code.
   */
  private getRegionCode(): string {
    const symbolRegionPair = this.symbol.split(".");

    if (symbolRegionPair.length < 2) {
      return "US";
    }

    const regionCode: string = symbolRegionPair[1];

    // Custom region map for certain exchange.
    const regionMap: Map<string, string> = new Map<string, string>();
    regionMap.set("AX", "AU");

    return regionMap.get(regionCode) || regionCode;
  }

  /**
   * Gets the dividend URL.
   */
  get dividendUrl(): string {
    switch (this.getRegionCode()) {
      case "US":
        return `https://www.nasdaq.com/market-activity/stocks/${this.symbol}/dividend-history`;
      case "AU": {
        const symbol = this.symbol.substring(0, this.symbol.indexOf("."));

        return `https://www.sharedividends.com.au/${symbol}-dividend-history/`;
      }
      case "HK": {
        const symbol = this.symbol.substring(0, this.symbol.indexOf("."));

        return `http://www.aastocks.com/tc/stocks/analysis/dividend.aspx?symbol=${symbol}`;
      }
      case "TW": {
        const symbol = this.symbol.substring(0, this.symbol.indexOf("."));

        return `https://histock.tw/stock/${symbol}/%E9%99%A4%E6%AC%8A%E9%99%A4%E6%81%AF`;
      }

      default:
        return "";
    }
  }

  /**
   * Gets the finance URL.
   */
  get financeUrl(): string {
    switch (this.getRegionCode()) {
      case "HK": {
        const symbol = this.symbol.substring(0, this.symbol.indexOf("."));

        return `http://stock.finance.sina.com.cn/hkstock/finance/${symbol}.html`;
      }

      default:
        return "";
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/components/_stock";
</style>
