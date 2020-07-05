<template>
  <div class="clock">
    <h1>{{ showTime(currentTime) }}</h1>
    <div class="city" v-for="city in cities" :key="city.name">
      <h3>{{ city.name }}</h3>
      <h2>{{ showTime(currentTime, city.timeZone) }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'clock',
  data: function () {
    return {
      currentTime: Date.now(),
      timeCounter: null,
      cities: [
        { name: 'San Francisco', timeZone: 'America/Los_Angeles' },
        { name: 'New York', timeZone: 'America/New_York' }
      ]
    }
  },
  methods: {
    updateTime: function () {
      this.currentTime = Date.now()
    },
    showTime: function (time, timeZone = 'Asia/Jakarta') {
      return (new Date(time)).toLocaleTimeString('en-US', { timeZone, hour: '2-digit', minute: '2-digit', hour12: false })
    }
  },
  mounted: function () {
    this.timeCounter = setInterval(this.updateTime, 1000);
  },
  destroyed: function () {
    clearInterval(this.timeCounter);
    this.timeCounter = null;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  margin: 0;
  font-size: 128px;
  font-weight: 400;
}
h2 {
  font-size: 48px;
  font-weight: 400;
  margin: 0;
  text-align: right;
}
h3 {
  font-size: 24px;
  font-weight: 300;
  margin: 0;
  padding: 0 48px 0 16px;
  text-align: left;
  white-space: pre-wrap;
}
.clock {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.city {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0;
}
</style>
