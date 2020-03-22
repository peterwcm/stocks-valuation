<template>
  <article class="card stock">
    <header class="stock__header">
      <section class="stock__heading">
        <div class="columns is-mobile">
          <div class="column is-narrow">
            <h2 class="title stock__symbol">
              {{ symbol }}
              <b-icon
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
          <div class="column">
            <h3 class="subtitle stock__name">{{ longName }}</h3>
          </div>
        </div>
      </section>
      <section class="stock__highlights">
        <div class="level is-mobile">
          <div class="level-item has-text-centered">
            <div>
              <h3 class="heading">Price/Earnings</h3>
              <p class="subtitle">{{ trailingPE.toFixed(2) }}</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <h3 class="heading">Price/Book</h3>
              <p class="subtitle">{{ '-' }}</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <h3 class="heading">Div Yield</h3>
              <p class="subtitle">{{ dividendYield }}%</p>
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
            <p class="subtitle">{{ '-' }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Price/Cash Flow</p>
            <p class="subtitle">{{ '-' }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Market Cap</p>
            <p class="subtitle">{{ marketCap | largeNumber }}</p>
          </div>
        </div>
      </div>
      <div class="level is-mobile">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Debt/Equity</p>
            <p class="subtitle">{{ '-' }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Quick Ratio</p>
            <p class="subtitle">{{ '-' }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Current Ratio</p>
            <p class="subtitle">{{ '-' }}</p>
          </div>
        </div>
      </div>
    </div>
    <footer class="card-footer">
      <progress class="progress is-success is-small" value="60" max="100">60%</progress>
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
    }
  }
})
export default class Stock extends Vue {
  @Prop() private symbol!: string;
  @Prop() private shortName!: string;
  @Prop() private longName!: string;
  @Prop() private ask!: number;
  @Prop() private marketCap!: number;
  @Prop() private trailingPE!: number;
  @Prop() private dividendYield!: number;
}
</script>

<style scoped lang="scss">
@import "@/styles/components/_stock";
</style>
