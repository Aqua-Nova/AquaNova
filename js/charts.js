/**
 * Water Intelligence - Cyber Visualisation Layer (Neon Glow Gradient Chart.js)
 * Prepared for SIH 2026 - Saurav (Frontend & Visualisation Lead)
 */

let forecastChartInstance = null;
let historicalChartInstance = null;
let factorDonutInstance = null;

function isMobile() {
  return window.innerWidth < 640;
}

// Global Chart.js Cyber Defaults
Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = "'Plus Jakarta Sans', system-ui, sans-serif";

/**
 * Creates Vertical Neon Gradients for Bar Charts
 */
function createBarGradient(ctx, colorType) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 240);
  switch (colorType) {
    case 'emerald':
      gradient.addColorStop(0, '#10b981');
      gradient.addColorStop(0.5, '#059669');
      gradient.addColorStop(1, 'rgba(4, 120, 87, 0.25)');
      break;
    case 'amber':
      gradient.addColorStop(0, '#fbbf24');
      gradient.addColorStop(0.5, '#d97706');
      gradient.addColorStop(1, 'rgba(180, 83, 9, 0.25)');
      break;
    case 'orange':
      gradient.addColorStop(0, '#fb923c');
      gradient.addColorStop(0.5, '#ea580c');
      gradient.addColorStop(1, 'rgba(194, 65, 12, 0.25)');
      break;
    case 'rose':
    case 'critical':
      gradient.addColorStop(0, '#f43f5e');
      gradient.addColorStop(0.5, '#e11d48');
      gradient.addColorStop(1, 'rgba(159, 18, 57, 0.25)');
      break;
    case 'cyan':
    default:
      gradient.addColorStop(0, '#38bdf8');
      gradient.addColorStop(0.5, '#0284c7');
      gradient.addColorStop(1, 'rgba(3, 105, 161, 0.25)');
      break;
  }
  return gradient;
}

/**
 * 4-Day Water Availability Forecast Bar Chart (Neon Gradient Edition)
 */
function updateForecastChart(next4Days) {
  const canvas = document.getElementById('forecastChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const mobile = isMobile();

  const labels = next4Days.map(item => item.day);
  const dataValues = next4Days.map(item => item.value);

  // Determine gradient color based on value
  const backgroundGradients = next4Days.map(item => {
    if (item.value >= 50) return createBarGradient(ctx, 'emerald');
    if (item.value >= 40) return createBarGradient(ctx, 'amber');
    if (item.value >= 30) return createBarGradient(ctx, 'orange');
    return createBarGradient(ctx, 'rose');
  });

  const borderColors = next4Days.map(item => {
    if (item.value >= 50) return '#34d399';
    if (item.value >= 40) return '#fbbf24';
    if (item.value >= 30) return '#fb923c';
    return '#f43f5e';
  });

  if (forecastChartInstance) {
    forecastChartInstance.destroy();
  }

  forecastChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Water Availability (%)',
        data: dataValues,
        backgroundColor: backgroundGradients,
        borderColor: borderColors,
        borderWidth: 1.5,
        borderRadius: mobile ? 8 : 12,
        borderSkipped: false,
        barPercentage: mobile ? 0.6 : 0.52,
        categoryPercentage: mobile ? 0.9 : 0.82
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(5, 8, 17, 0.95)',
          titleColor: '#38bdf8',
          bodyColor: '#f8fafc',
          borderColor: 'rgba(56, 189, 248, 0.4)',
          borderWidth: 1.5,
          padding: mobile ? 8 : 12,
          cornerRadius: 10,
          displayColors: false,
          callbacks: {
            label: function(context) {
              const idx = context.dataIndex;
              const badge = next4Days[idx].badge || 'Status';
              return `  Availability: ${context.parsed.y}% (${badge})`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function(value) { return value + '%'; },
            font: { size: mobile ? 9 : 11, weight: '600' },
            color: '#64748b',
            stepSize: 25
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
            drawBorder: false
          }
        },
        x: {
          grid: { display: false, drawBorder: false },
          ticks: {
            font: { size: mobile ? 11 : 12, weight: '700' },
            color: '#e2e8f0'
          }
        }
      },
      animation: {
        duration: 900,
        easing: 'easeOutQuart'
      }
    }
  });
}

/**
 * Multi-Metric Historical Trend Chart (Neon Wave Edition)
 */
function updateHistoricalChart(historical) {
  const canvas = document.getElementById('historicalChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const mobile = isMobile();

  if (historicalChartInstance) {
    historicalChartInstance.destroy();
  }

  // Cyan Area Gradient
  const cyanGradient = ctx.createLinearGradient(0, 0, 0, 300);
  cyanGradient.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
  cyanGradient.addColorStop(0.6, 'rgba(56, 189, 248, 0.1)');
  cyanGradient.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

  historicalChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: historical.labels.map(l => mobile ? l.replace(' (', '\n(') : l),
      datasets: [
        {
          label: 'Availability (%)',
          data: historical.availability,
          borderColor: '#38bdf8',
          backgroundColor: cyanGradient,
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: mobile ? 3 : 5,
          pointHoverRadius: 7,
          pointBackgroundColor: '#38bdf8',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 1.5,
          yAxisID: 'yAvailability'
        },
        {
          label: 'Rainfall Inflow (mm)',
          data: historical.rainfall,
          borderColor: '#10b981',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.35,
          pointRadius: mobile ? 2 : 4,
          pointBackgroundColor: '#10b981',
          yAxisID: 'yRainfall'
        },
        {
          label: 'Consumption (MLD)',
          data: historical.consumption,
          borderColor: '#fb923c',
          backgroundColor: 'transparent',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: mobile ? 3 : 4,
          pointBackgroundColor: '#fb923c',
          yAxisID: 'yConsumption'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            usePointStyle: true,
            color: '#cbd5e1',
            font: { size: mobile ? 10 : 12, weight: '600' }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(5, 8, 17, 0.95)',
          borderColor: 'rgba(56, 189, 248, 0.4)',
          borderWidth: 1.5,
          padding: mobile ? 8 : 12,
          cornerRadius: 10,
          usePointStyle: true
        }
      },
      scales: {
        yAvailability: {
          type: 'linear',
          display: true,
          position: 'left',
          min: 0,
          max: 100,
          title: {
            display: !mobile,
            text: 'Availability (%)',
            color: '#38bdf8',
            font: { size: 10, weight: '700' }
          },
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8', font: { size: mobile ? 9 : 11, weight: '600' }, callback: val => val + '%' }
        },
        yRainfall: {
          type: 'linear',
          display: false,
          position: 'right',
          grid: { drawOnChartArea: false }
        },
        yConsumption: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: !mobile,
            text: 'Consumption (MLD)',
            color: '#fb923c',
            font: { size: 10, weight: '700' }
          },
          grid: { drawOnChartArea: false },
          ticks: { color: '#94a3b8', font: { size: mobile ? 9 : 11, weight: '600' } }
        },
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.03)' },
          ticks: { color: '#cbd5e1', font: { size: mobile ? 9 : 11, weight: '600' } }
        }
      },
      animation: {
        duration: 900,
        easing: 'easeOutQuart'
      }
    }
  });
}

/**
 * Factor Contribution Donut Chart (Cyber Donut with Center Stress Gauge)
 */
function updateFactorDonut(factors) {
  const canvas = document.getElementById('factorDonut');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const mobile = isMobile();

  const labels = factors.map(f => f.name);
  const data = factors.map(f => f.weight);
  const colors = ['#f43f5e', '#fb923c', '#38bdf8', '#10b981'];

  if (factorDonutInstance) {
    factorDonutInstance.destroy();
  }

  // Custom Plugin to Draw Center Text (AI Risk Stress Index)
  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw(chart) {
      const { width, height, ctx } = chart;
      ctx.restore();
      const fontSize = mobile ? 13 : 15;
      ctx.font = `800 ${fontSize}px 'Plus Jakarta Sans', sans-serif`;
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'center';

      const topFactor = factors[0] ? factors[0].weight : 42;
      ctx.fillText(`AI WEIGHTS`, width / 2, height / 2 - 8);

      ctx.font = `700 ${mobile ? 10 : 11}px 'Plus Jakarta Sans', sans-serif`;
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`${factors.length} Signals`, width / 2, height / 2 + 10);
      ctx.save();
    }
  };

  factorDonutInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors.slice(0, factors.length),
        borderWidth: 2.5,
        borderColor: '#050811',
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 8,
            boxHeight: 8,
            usePointStyle: true,
            color: '#e2e8f0',
            font: { size: mobile ? 10 : 11, weight: '600' }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(5, 8, 17, 0.95)',
          borderColor: 'rgba(56, 189, 248, 0.4)',
          borderWidth: 1.5,
          padding: mobile ? 8 : 10,
          cornerRadius: 10,
          callbacks: {
            label: function(context) {
              return `  Contribution: ${context.parsed}%`;
            }
          }
        }
      }
    },
    plugins: [centerTextPlugin]
  });
}

// Window resize listener
window.addEventListener('resize', () => {
  if (state && state.data && state.currentRegionKey) {
    const current = state.data[state.currentRegionKey];
    if (current) {
      updateForecastChart(current.next4Days);
      updateHistoricalChart(current.historical);
      updateFactorDonut(current.factors);
    }
  }
});
