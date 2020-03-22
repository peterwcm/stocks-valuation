<template>
  <div class="view view--stocks">
    <section class="section">
      <div class="container">
        <h1 class="title">
          <b-icon icon="dollar-sign"></b-icon>tocks
        </h1>
        <div class="stocks">
          <!-- <b-message>{{ msg }}</b-message> -->
          <div class="columns is-multiline">
            <div
              class="column is-6-tablet is-4-desktop"
              v-for="(stock, index) in stocks"
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
import axios from "axios";

export default {
  components: {
    Stock
  },
  data() {
    return {
      stocks: null
    };
  },
  mounted() {
    const asxSymbols = ["GEM", "ANZ", "CBA"];

    this.stocks = [
      {
        language: "en",
        region: "AU",
        quoteType: "EQUITY",
        triggerable: false,
        currency: "AUD",
        ask: 0.67,
        bidSize: 0,
        askSize: 0,
        fullExchangeName: "ASX",
        regularMarketOpen: 0.665,
        averageDailyVolume3Month: 4401046,
        beta: 0.721359,
        fiftyTwoWeekLowChange: 0.045000017,
        fiftyTwoWeekLowChangePercent: 0.07200003,
        fiftyTwoWeekRange: "0.625 - 3.39",
        fiftyTwoWeekHighChange: -2.72,
        fiftyTwoWeekHighChangePercent: -0.8023599,
        fiftyTwoWeekLow: 0.625,
        fiftyTwoWeekHigh: 3.39,
        earningsTimestamp: 1582559940,
        earningsTimestampStart: 1582559940,
        earningsTimestampEnd: 1582559940,
        trailingPE: 4.890511,
        dividendsPerShare: 0.13,
        dividendRate: 0.11,
        dividendYield: 16.04,
        marketState: "CLOSED",
        epsTrailingTwelveMonths: 0.137,
        sharesOutstanding: 460176992,
        marketCap: 308318592,
        sourceInterval: 20,
        exchangeDataDelayedBy: 0,
        targetPriceMean: 2.92,
        regularMarketChange: 0.004999995,
        regularMarketChangePercent: 0.751879,
        regularMarketTime: 1584681072,
        regularMarketPrice: 0.67,
        regularMarketDayHigh: 0.71,
        regularMarketDayRange: "0.625 - 0.71",
        regularMarketDayLow: 0.625,
        regularMarketVolume: 12108257,
        regularMarketPreviousClose: 0.665,
        bid: 0.665,
        tradeable: false,
        priceHint: 4,
        exchange: "ASX",
        shortName: "G8 EDUCATE FPO",
        longName: "G8 Education Limited",
        messageBoardId: "finmb_64736883",
        exchangeTimezoneName: "Australia/Sydney",
        exchangeTimezoneShortName: "AEDT",
        gmtOffSetMilliseconds: 39600000,
        market: "au_market",
        esgPopulated: false,
        firstTradeDateMilliseconds: 1196798400000,
        symbol: "GEM.AX"
      },
      {
        language: "en",
        region: "AU",
        quoteType: "EQUITY",
        triggerable: false,
        currency: "AUD",
        ask: 14.9,
        bidSize: 0,
        askSize: 0,
        fullExchangeName: "ASX",
        regularMarketOpen: 15.9,
        averageDailyVolume3Month: 7750652,
        beta: 0.603843,
        fiftyTwoWeekLowChange: 1.0200005,
        fiftyTwoWeekLowChangePercent: 0.06800003,
        fiftyTwoWeekRange: "15.0 - 29.3",
        fiftyTwoWeekHighChange: -13.279999,
        fiftyTwoWeekHighChangePercent: -0.4532423,
        fiftyTwoWeekLow: 15,
        fiftyTwoWeekHigh: 29.3,
        earningsTimestamp: 1588258740,
        earningsTimestampStart: 1588258740,
        earningsTimestampEnd: 1588258740,
        trailingPE: 7.9346213,
        dividendsPerShare: 1.6,
        dividendRate: 1.6,
        dividendYield: 9.99,
        marketState: "CLOSED",
        epsTrailingTwelveMonths: 2.019,
        sharesOutstanding: 2836179968,
        marketCap: 45435604992,
        sourceInterval: 20,
        exchangeDataDelayedBy: 0,
        targetPriceMean: 28.83,
        regularMarketChange: 1.0200005,
        regularMarketChangePercent: 6.8000035,
        regularMarketTime: 1584681059,
        regularMarketPrice: 16.02,
        regularMarketDayHigh: 16.56,
        regularMarketDayRange: "15.53 - 16.56",
        regularMarketDayLow: 15.53,
        regularMarketVolume: 21132953,
        regularMarketPreviousClose: 15,
        bid: 16.02,
        tradeable: false,
        priceHint: 2,
        exchange: "ASX",
        shortName: "ANZ BANK FPO",
        longName: "Australia and New Zealand Banking Group Limited",
        messageBoardId: "finmb_384998",
        exchangeTimezoneName: "Australia/Sydney",
        exchangeTimezoneShortName: "AEDT",
        gmtOffSetMilliseconds: 39600000,
        market: "au_market",
        esgPopulated: false,
        firstTradeDateMilliseconds: 570398400000,
        symbol: "ANZ.AX"
      },
      {
        language: "en",
        region: "AU",
        quoteType: "EQUITY",
        triggerable: false,
        currency: "AUD",
        ask: 60.06,
        bidSize: 0,
        askSize: 0,
        fullExchangeName: "ASX",
        regularMarketOpen: 64.41,
        averageDailyVolume3Month: 4139335,
        beta: 0.467849,
        fiftyTwoWeekLowChange: 2.75,
        fiftyTwoWeekLowChangePercent: 0.048110567,
        fiftyTwoWeekRange: "57.16 - 91.05",
        fiftyTwoWeekHighChange: -31.140003,
        fiftyTwoWeekHighChangePercent: -0.3420099,
        fiftyTwoWeekLow: 57.16,
        fiftyTwoWeekHigh: 91.05,
        earningsTimestamp: 1581453636,
        earningsTimestampStart: 1581453636,
        earningsTimestampEnd: 1581453636,
        trailingPE: 10.865071,
        dividendsPerShare: 4.31,
        dividendRate: 4,
        dividendYield: 6.68,
        marketState: "CLOSED",
        epsTrailingTwelveMonths: 5.514,
        sharesOutstanding: 1770240000,
        marketCap: 106055081984,
        sourceInterval: 20,
        exchangeDataDelayedBy: 0,
        targetPriceMean: 73.17,
        regularMarketChange: -1.0400009,
        regularMarketChangePercent: -1.7063181,
        regularMarketTime: 1584681064,
        regularMarketPrice: 59.91,
        regularMarketDayHigh: 64.41,
        regularMarketDayRange: "59.91 - 64.41",
        regularMarketDayLow: 59.91,
        regularMarketVolume: 10090928,
        regularMarketPreviousClose: 60.95,
        bid: 59.91,
        tradeable: false,
        priceHint: 2,
        exchange: "ASX",
        shortName: "CWLTH BANK FPO",
        longName: "Commonwealth Bank of Australia",
        messageBoardId: "finmb_874262",
        exchangeTimezoneName: "Australia/Sydney",
        exchangeTimezoneShortName: "AEDT",
        gmtOffSetMilliseconds: 39600000,
        market: "au_market",
        esgPopulated: false,
        firstTradeDateMilliseconds: 686178000000,
        symbol: "CBA.AX"
      }
    ];
  }
};
</script>
