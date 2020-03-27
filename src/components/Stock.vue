<template>
  <article class="card stock">
    <header class="stock__header">
      <section class="stock__heading">
        <div class="columns is-mobile">
          <div class="column is-narrow">
            <h2 class="title stock__symbol">
              {{ symbol }}
              <b-icon
                v-if="summaryDetail"
                class="has-tooltip-arrow has-tooltip-right"
                :data-tooltip="`$${summaryDetail.ask.raw}`"
                icon="info-circle"
                size="is-small"
              ></b-icon>
            </h2>
          </div>
        </div>
      </section>
      <section class="stock__subheading">
        <div class="columns">
          <div class="column">
            <h3 class="subtitle stock__name">{{ price.longName }}</h3>
          </div>
        </div>
      </section>
      <section class="stock__highlights">
        <div class="level is-mobile">
          <div class="level-item has-text-centered">
            <div>
              <h3 class="heading">Price/Earnings</h3>
              <p class="subtitle" v-if="summaryDetail">{{ summaryDetail.trailingPE.raw.toFixed(2) }}</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <h3 class="heading">Price/Book</h3>
              <p
                class="subtitle"
                v-if="defaultKeyStatistics"
              >{{ defaultKeyStatistics.priceToBook.raw.toFixed(2) }}</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <h3 class="heading">Div Yield</h3>
              <p
                class="subtitle"
                v-if="summaryDetail"
              >{{ (summaryDetail.dividendYield.raw * 100).toFixed(2) }}%</p>
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
            <p
              class="subtitle"
              v-if="summaryDetail"
            >{{ summaryDetail.priceToSalesTrailing12Months.raw.toFixed(2) }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Price/Cash</p>
            <p
              class="subtitle"
              v-if="summaryDetail && financialData"
            >{{ summaryDetail.ask.raw / financialData.totalCashPerShare.raw | optionalNumber('n/a') }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Market Cap</p>
            <p class="subtitle" v-if="summaryDetail">{{ summaryDetail.marketCap.raw | largeNumber }}</p>
          </div>
        </div>
      </div>
      <div class="level is-mobile">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Debt/Equity</p>
            <p
              class="subtitle"
              v-if="financialData"
            >{{ financialData.debtToEquity.raw | optionalNumber('n/a') }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Quick Ratio</p>
            <p
              class="subtitle"
              v-if="financialData"
            >{{ financialData.quickRatio.raw | optionalNumber('n/a') }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Current Ratio</p>
            <p
              class="subtitle"
              v-if="financialData"
            >{{ financialData.currentRatio.raw | optionalNumber('n/a') }}</p>
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
    largeNumber: (n: number) => {
      if (n < 1e3) return n;
      if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
      if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
      if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
      if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
    },
    optionalNumber: (value: number, defaultValue: number | string) => {
      return value ? value.toFixed(2) : defaultValue;
    }
  }
})
export default class Stock extends Vue {
  @Prop() private symbol!: string;
  @Prop() private defaultKeyStatistics!: Record<string, any>;
  @Prop() private price!: Record<string, any>;
  @Prop() private financialData!: Record<string, any>;
  @Prop() private summaryDetail!: Record<string, any>;
  @Prop({ default: 75 }) readonly scoreThreshold!: number;

  round(value: number, decimals: number) {
    return Number(value.toFixed(decimals));
  }

  get score() {
    const score = Math.random() * 100;

    if (score <= 100) {
      return score;
    }

    const peRatioMax = 15;
    const pbvRatioMax = 1.5;
    const buyThreshold = 10;

    const stockPrice = this.summaryDetail.ask.raw;
    const earningShare = 0;
    const estEarningShare = 0;
    const bookValue = 0;
    if (!estEarningShare || !bookValue) return null;

    const peRatio = stockPrice / estEarningShare;
    const pbvRatio = stockPrice / bookValue;

    const estStockPrice = this.round(estEarningShare * buyThreshold, 2);
    let indicatorScore = this.round(
      Math.min(
        Math.max(((estStockPrice - stockPrice) / stockPrice) * 100, -70),
        70
      ),
      0
    );

    // EPS Growth
    if (estEarningShare && estEarningShare > earningShare) {
      indicatorScore += 10;
    } else if (estEarningShare && estEarningShare < earningShare) {
      indicatorScore -= 10;
    }
    // Return
    if (estEarningShare) {
      indicatorScore += peRatio > 0 && peRatio <= peRatioMax ? 10 : -10;
    }
    // Safety
    if (bookValue) {
      indicatorScore += pbvRatio > 0 && pbvRatio <= pbvRatioMax ? 10 : -10;
    }

    return indicatorScore;
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/components/_stock";
</style>
