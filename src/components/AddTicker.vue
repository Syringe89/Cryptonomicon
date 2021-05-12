<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            v-model="ticker"
            @keydown.enter="add(ticker)"
            type="text"
            name="wallet"
            id="wallet"
            class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            placeholder="Например DOGE"
          />
        </div>
        <div class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap">
          <span
            v-for="coin in bestOfFour"
            :key="coin.coin"
            @click="add(coin.coin)"
            class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
          >
            {{ coin.coin }}
          </span>
        </div>
        <div v-if="inTickersList" class="text-sm text-red-600">
          Такой тикер уже добавлен
        </div>
      </div>
    </div>
    <add-ticker-button @click="add(ticker)" />
  </section>
</template>

<script>
import AddTickerButton from "./AddTickerButton.vue";
import { fuzzySearch, exactSearch } from "../api";

export default {
  components: {
    AddTickerButton,
  },
  props: {
    inTickersList: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    "add-ticker": (value) => typeof value === "string",
  },
  data() {
    return {
      ticker: "",
      bestOfFour: [],
    };
  },
  methods: {
    add(tickerName) {
      let exactTickerName = exactSearch(tickerName);
      if (!exactTickerName) return;

      this.$emit("add-ticker", exactTickerName);
      this.ticker = "";
      this.bestOfFour = [];
    },
  },
  watch: {
    ticker() {
      this.bestOfFour = fuzzySearch(this.ticker);
    },
  },
};
</script>
