<template>
  <div class="app">
    <h1>vue-scroll-number</h1>
    <h3>Open console panel to see what happened</h3>
    <ScrollNumber ref="scrollNumber" :value="value" :itemStyle="{ fontSize: '120px' }"/>

    <br>
    <button @click="runWithValue">Start with changing value props</button>
    <br>
    <button @click="runWithApi">Start with change API method</button>

    <br>
    <ScrollNumber :value="time" :itemStyle="{ fontSize: '80px' }"/>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "app",
  data() {
    return {
      value: 10,
      time: moment().format("HH:mm:ss")
    };
  },
  created() {
    setInterval(() => {
      this.time = moment().format("HH:mm:ss");
    }, 1000);
  },
  methods: {
    generateValue() {
      const random = val => (Math.random() > 0.5 ? val : "");
      const num = () =>
        +[...new Array(((Math.random() * 5) >> 0) + 1).keys()]
          .map(() => (Math.random() * 9) >> 0)
          .join("");
      return random("-") + num() + random("." + num());
    },
    runWithValue() {
      const series = [...new Array(5).keys()].map(this.generateValue);
      console.log(series);
      let index = 0;
      const run = () => {
        const value = series[index++];
        console.log("Run value: " + value);
        this.value = value;
        if (index !== series.length) {
          this.$refs.scrollNumber.process.then(() => {
            run();
          });
        }
      };
      run();
    },

    runWithApi() {
      const series = [...new Array(5).keys()].map(this.generateValue);
      console.log(series);
      series.forEach((value, index) => {
        const p = this.$refs.scrollNumber.changeTo(value);
        p.then(() =>
          console.log(`Complete to change value ${value} with index ${index}`)
        );
      });
    }
  }
};
</script>

