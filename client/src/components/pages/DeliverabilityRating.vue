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
      series: [this.getSeriesNumber(this.rating)],
    };
  },
  methods: {
    getSeriesNumber(rating) {
        if (rating) {
            switch (rating.toLowerCase()) {
                case 'great':
                    return 98;
                case 'good':
                    return 70;
                case 'ok':
                    return 50;
                case 'bad':
                    return 30;
                default:
                    return 0;
            }
        }
        return 0;
    }
  },
  watch: {
    rating(newRating) {
        this.series = [this.getSeriesNumber(newRating)];
    }
  }
};
</script>
