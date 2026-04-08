import { useEffect, useRef } from 'react'
import { Chart, ScatterController, LinearScale, PointElement, Tooltip, Legend } from 'chart.js'

Chart.register(ScatterController, LinearScale, PointElement, Tooltip, Legend)

function formatINR(num) {
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`
  if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`
  return `₹${num}`
}

// Custom plugin to draw "Sweet Spot" dashed box
const sweetSpotPlugin = {
  id: 'sweetSpot',
  afterDraw(chart) {
    const { ctx, chartArea, scales } = chart
    const xScale = scales.x
    const yScale = scales.y

    const x1 = chartArea.left
    const x2 = xScale.getPixelForValue(5)
    const yMax = chartArea.top
    const yMid = yScale.getPixelForValue(yScale.max * 0.5)

    ctx.save()
    ctx.setLineDash([6, 4])
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.4)'
    ctx.lineWidth = 1.5
    ctx.strokeRect(x1, yMax, x2 - x1, yMid - yMax)

    // Label
    ctx.setLineDash([])
    ctx.fillStyle = 'rgba(0, 255, 136, 0.7)'
    ctx.font = 'bold 11px Inter, sans-serif'
    ctx.fillText('✦ Sweet Spot', x1 + 8, yMax + 18)
    ctx.restore()
  },
}

// Custom plugin to render data labels
const dataLabelsPlugin = {
  id: 'dataLabels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart
    chart.data.datasets.forEach((dataset) => {
      dataset.data.forEach((point, i) => {
        const meta = chart.getDatasetMeta(0)
        const el = meta.data[i]
        if (!el) return
        const { x, y } = el

        ctx.save()
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.font = '600 11px Inter, sans-serif'
        ctx.textAlign = 'left'
        ctx.fillText(point.label, x + 10, y - 5)
        ctx.restore()
      })
    })
  },
}

export default function EffortIncomeMatrix({ paths }) {
  const chartRef = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (instanceRef.current) {
      instanceRef.current.destroy()
    }

    const avgRevenue = paths.map((p) => (p.revenue_min + p.revenue_max) / 2)

    const data = paths.map((p, i) => ({
      x: p.effort_score,
      y: avgRevenue[i],
      label: p.title,
    }))

    const maxY = Math.max(...avgRevenue) * 1.3

    instanceRef.current = new Chart(chartRef.current, {
      type: 'scatter',
      plugins: [sweetSpotPlugin, dataLabelsPlugin],
      data: {
        datasets: [
          {
            label: 'Monetization Paths',
            data,
            backgroundColor: data.map((d) =>
              d.x <= 5 && d.y >= maxY * 0.5
                ? 'rgba(0, 255, 136, 0.9)'
                : 'rgba(99, 102, 241, 0.85)'
            ),
            borderColor: data.map((d) =>
              d.x <= 5 && d.y >= maxY * 0.5
                ? '#00FF88'
                : '#6366F1'
            ),
            borderWidth: 2,
            pointRadius: 10,
            pointHoverRadius: 14,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 15, 26, 0.95)',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              title: () => '',
              label: (ctx) => {
                const d = ctx.raw
                return [
                  `📌 ${d.label}`,
                  `Effort: ${d.x}/10`,
                  `Income: ${formatINR(d.y)}/mo`,
                ]
              },
            },
          },
        },
        scales: {
          x: {
            min: 0,
            max: 10,
            title: {
              display: true,
              text: 'Low Effort ← → High Effort',
              color: 'rgba(255,255,255,0.5)',
              font: { size: 12, family: 'Inter' },
            },
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: {
              color: 'rgba(255,255,255,0.4)',
              font: { family: 'Inter' },
            },
          },
          y: {
            min: 0,
            max: maxY,
            title: {
              display: true,
              text: 'Monthly Income (INR)',
              color: 'rgba(255,255,255,0.5)',
              font: { size: 12, family: 'Inter' },
            },
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: {
              color: 'rgba(255,255,255,0.4)',
              font: { family: 'Inter' },
              callback: (v) => formatINR(v),
            },
          },
        },
      },
    })

    return () => instanceRef.current?.destroy()
  }, [paths])

  return (
    <section>
      <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
        <span className="text-3xl">📊</span>
        Effort vs. Income Matrix
      </h2>
      <p className="text-white/50 mb-8 text-sm">Where should you focus first?</p>

      <div className="glass-card p-6 md:p-8">
        <div style={{ height: 380 }}>
          <canvas ref={chartRef} />
        </div>
        <div className="flex gap-6 mt-6 justify-center text-sm text-white/60">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00FF88]" />
            <span>Sweet Spot (Low effort, High income)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500" />
            <span>Other paths</span>
          </div>
        </div>
      </div>
    </section>
  )
}
