<template>
  <article class="card stock">
    <header class="stock__header">
      <section class="stock__heading">
        <div class="columns is-mobile">
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
    </div>
    <footer class="card-footer">
      <progress
        class="progress is-small"
        :class="[score > scoreThreshold ? 'is-success' : 'is-danger']"
        :value="score"
        max="100"
      ></progress>
    </footer>
  </article>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

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
  @Prop({ default: 75 }) readonly scoreThreshold!: number;

  round(value: number, decimals: number) {
    return Number(value.toFixed(decimals));
  }

  private upScore(
    val: number,
    better: number,
    best: number,
    betterScore: number = 10,
    bestScore: number = 25,
    worstScore: number = -5
  ) {
    if (!val) return 0;

    if (val >= better && val < best) {
      return betterScore;
    } else if (val > best) {
      return bestScore;
    } else {
      return worstScore;
    }
  }

  private downScore(
    val: number,
    better: number,
    best: number,
    betterScore: number = 10,
    bestScore: number = 25,
    worstScore: number = -5
  ) {
    if (!val) return 0;

    if (val <= better && val > best) {
      return betterScore;
    } else if (val <= best) {
      return bestScore;
    } else {
      return worstScore;
    }
  }

  get score() {
    let score = Math.random() * 100;

    // Valuation
    // PB A) 1 - 0.51 B) <= 0.5
    // PE A) 8 - 5.1 B) <= 5
    // PC A) 4 - 2.1 B) <= 2
    // PS A) 1.5 - 1.1 B) <= 1
    // Yield A) 4% - 6% B) >= 6.1%
    score = this.downScore(this.priceToBook, 1, 0.5);
    score = this.downScore(this.priceToEarnings, 8, 5);
    score = this.downScore(this.priceToCash, 4, 2);
    score = this.downScore(this.priceToSales, 1.5, 1);
    score = this.upScore(this.dividendYield, 0.04, 0.06);

    return Math.min(Math.max(score, 0), 100);

    // Health/Risk

    // Profitability

    // const peRatioMax = 15;
    // const pbvRatioMax = 1.5;
    // const buyThreshold = 10;

    // const stockPrice = this.ask;
    // const earningShare = 0;
    // const estEarningShare = 0;
    // const bookValue = 0;
    // if (!estEarningShare || !bookValue) return null;

    // const peRatio = stockPrice / estEarningShare;
    // const pbvRatio = stockPrice / bookValue;

    // const estStockPrice = this.round(estEarningShare * buyThreshold, 2);
    // let indicatorScore = this.round(
    //   Math.min(
    //     Math.max(((estStockPrice - stockPrice) / stockPrice) * 100, -70),
    //     70
    //   ),
    //   0
    // );

    // // EPS Growth
    // if (estEarningShare && estEarningShare > earningShare) {
    //   indicatorScore += 10;
    // } else if (estEarningShare && estEarningShare < earningShare) {
    //   indicatorScore -= 10;
    // }
    // // Return
    // if (estEarningShare) {
    //   indicatorScore += peRatio > 0 && peRatio <= peRatioMax ? 10 : -10;
    // }
    // // Safety
    // if (bookValue) {
    //   indicatorScore += pbvRatio > 0 && pbvRatio <= pbvRatioMax ? 10 : -10;
    // }

    // return indicatorScore;
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/components/_stock";
</style>
