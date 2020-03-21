<template>
  <article class="{s.item}">
    <div class="{s.title}">
      <h1 class="{s.heading}">
        <span class="{s.headingSymbol}">{symbol}</span>
        <span class="{s.headingPrice}">${this.props.item.Ask}</span>
      </h1>
      <h3 class="{s.subHeading}">
        <span class="{s.subHeadingName}">{name}</span>
        <span class="{changeClass}">{this.props.item.Change} ({this.props.item.ChangeinPercent})</span>
      </h3>
    </div>
    <div class="{s.highlights}">
      <div class="{s.highlightsBlock}">
        <h3 class="{s.highlightsBlockLabel}">EPS | Last Year</h3>
        <span class="{s.highlightsBlockValue}">{this.props.item.EarningsShare || 'n/a'}</span>
      </div>
      <div>
        <h3 class="{s.highlightsBlockLabel}">EPS | Latest</h3>
        <span class="{epsLatestClass}">{this.props.item.EPSEstimateCurrentYear || 'n/a'}</span>
      </div>
      <div class="{s.highlightsBlock}">
        <h3 class="{s.highlightsBlockLabel}">Book Value</h3>
        <span class="{s.highlightsBlockValue}">{this.props.item.BookValue || 'n/a'}</span>
      </div>
    </div>
    <div class="{s.details}">
      <div class="{s.detailsBlock}">
        <h3 class="{s.detailsBlockLabel}">Principle Earning</h3>
        <span class="{s.detailsBlockValue}">{principleReturn || 'n/a'}</span>
      </div>
      <div class="{s.detailsBlock}">
        <h3 class="{s.detailsBlockLabel}">Dividend Earning</h3>
        <span class="{s.detailsBlockValue}">{dividendReturn || 'n/a'}</span>
      </div>
      <div class="{s.detailsBlock}">
        <h3 class="{s.detailsBlockLabel}">Est. Price | Last Year</h3>
        <span class="{s.detailsBlockValue}">{suggestedBuyOld || 'n/a'}</span>
      </div>

      <div class="{s.detailsBlock}">
        <h3 class="{s.detailsBlockLabel}">Return</h3>
        <span class="{peRatioClass}">x%</span>
      </div>
      <div class="{s.detailsBlock}">
        <h3 class="{s.detailsBlockLabel}">Safety</h3>
        <span class="{pbvRatioClass}">x%</span>
      </div>
      <div class="{s.detailsBlock}">
        <h3 class="{s.detailsBlockLabel}">Est. Price | Latest</h3>
        <span class="{s.detailsBlockValue}">{suggestedBuyNew || 'n/a'}</span>
      </div>

      <div class="{s.detailsBlock}">
        <h3 class="{s.detailsBlockLabel}">50d MA</h3>
        <span class="{s.detailsBlockValue}">{this.props.item.FiftydayMovingAverage}</span>
      </div>
      <div class="{s.detailsBlock}">
        <h3 class="{s.detailsBlockLabel}">200d MA</h3>
        <span class="{s.detailsBlockValue}">{this.props.item.TwoHundreddayMovingAverage}</span>
      </div>
      <div class="{s.detailsBlock}">
        <h3 class="{s.detailsBlockLabel}">Year Low</h3>
        <span class="{s.detailsBlockValue}">{this.props.item.YearLow}</span>
      </div>
    </div>
    <div class="{s.recommendation}">
      <h3 class="{s.recommendationHeading}">Buy Indicator</h3>
      <div class="{s.buyIndicator}">
        <span class="{s.buyIndicatorLabel}">x%</span>
        <div class="{buyIndicatorBarClass}" style="{buyIndicatorBarStyle}" />
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Stock extends Vue {
  @Prop() private msg!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "@/styles/components/Stock";
</style>
