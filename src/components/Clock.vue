<template>
  <div class="pd-clock">
    <h1 class="text-h1">{{ showTime(currentTime) }}</h1>
    <div class="city" v-for="city in cities" :key="city.name">
      <h5 class="text-sm-h5">{{ city.name }}</h5>
      <h2 class="text-sm-h2">{{ showTime(currentTime, city.timeZone) }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'pd-clock',
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
<style lang="scss" scoped>
.pd-clock {
  display: flex;
  flex-direction: column;
  align-items: stretch;

  h1 {
    margin: 0;
    margin-bottom: 24px;
  }
  h2 {
    margin: 0;
    text-align: right;
  }
  h5 {
    margin: 0;
    padding: 0 48px 0 16px;
    text-align: left;
    white-space: pre-wrap;
  }

  .city {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 8px 0;
  }
}
</style>
