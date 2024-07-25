<template>
  <div>
    <h2>Deliverability Rating: {{ rating }}</h2>
  </div>
  <apexchart
    type="radialBar"
    :options="chartOptions"
    :series="series"
  ></apexchart>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';

export default {
  props: {
    rating: {
      type: String,
      default: null,
    },
    progressBar: {
      type: Number,
      default: 0,
    }
  },
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      chartOptions: {
        chart: {
          height: 280,
          type: "radialBar",
        },
        plotOptions: {
          radialBar: {
            startAngle: -90,
            endAngle: 90,
            track: {
              background: "#333",
              startAngle: -90,
              endAngle: 90,
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                fontSize: "30px",
                show: true,
              },
            },
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            type: "horizontal",
            gradientToColors: ["#87D4F9"],
            stops: [0, 100],
          },
        },
        stroke: {
          lineCap: "butt",
        },
        labels: ["Progress"],
      },
      series: [this.progressBar],
    };
  },
  watch: {
    progressBar(newProgressBar) {
        this.series = [newProgressBar];
    }
  }
};
</script>
