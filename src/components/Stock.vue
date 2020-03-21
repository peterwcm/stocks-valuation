<template>
  <article class="card stock">
    <header class="stock__header">
      <section class="stock__heading">
        <div class="columns is-mobile">
          <div class="column">
            <h2 class="title">{{ symbol | capitalize }}</h2>
          </div>
          <div class="column is-narrow">
            <h3 class="title">${{ price }}</h3>
          </div>
        </div>
      </section>
      <section class="stock__subheading">
        <div class="columns is-mobile">
          <div class="column">
            <h3 class="subtitle">Australia and New Zealand Banking Group</h3>
          </div>
          <div class="column is-narrow">
            <h3 class="subtitle">+2.1 (+10%)</h3>
          </div>
        </div>
      </section>
      <section class="stock__highlights">
        <div class="level is-mobile">
          <div class="level-item has-text-centered">
            <div>
              <h3 class="heading">Price/Earnings</h3>
              <p class="title">4.9</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <h3 class="heading">Price/Book</h3>
              <p class="title">0.37</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <h3 class="heading">Div Yield</h3>
              <p class="title">9.99%</p>
            </div>
          </div>
        </div>
      </section>
    </header>
    <div class="card-content">
      <div class="level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Price/Sales</p>
            <p class="title">0.33</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Price/Cash Flow</p>
            <p class="title">1.99</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Market Cap</p>
            <p class="title">45b</p>
          </div>
        </div>
      </div>
      <div class="level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Debt/Equity</p>
            <p class="title">2.13</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Quick Ratio</p>
            <p class="title">-</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Current Ratio</p>
            <p class="title">-</p>
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

@Component
export default class Stock extends Vue {
  @Prop() private symbol!: string;
  @Prop() private price!: number;
  @Prop() private stock!: object;
}
</script>

<style scoped lang="scss">
@import "@/styles/components/_stock";
</style>
