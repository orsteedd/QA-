export const normalizeTrend = (trend) => {
  if (typeof trend === 'number') {
    return {
      value: trend,
      label: `${trend > 0 ? '+' : ''}${trend.toFixed(1)}%`,
      isPositive: trend >= 0,
    }
  }

  const numeric = Number.parseFloat(String(trend).replace('%', ''))
  const isPositive = Number.isNaN(numeric) ? true : numeric >= 0

  return {
    value: Number.isNaN(numeric) ? 0 : numeric,
    label: String(trend),
    isPositive,
  }
}

export const buildMetricValue = ({ value, unit = '' }) => {
  if (typeof value === 'number') {
    const fixed = Number.isInteger(value) ? value.toString() : value.toFixed(1)
    return `${fixed}${unit}`
  }

  return `${value}${unit}`
}

export const withOpacity = (hexColor = '#14B8A6', alpha = 0.15) => {
  const hex = hexColor.replace('#', '')
  if (hex.length !== 6) return `rgba(20,184,166,${alpha})`

  const red = Number.parseInt(hex.slice(0, 2), 16)
  const green = Number.parseInt(hex.slice(2, 4), 16)
  const blue = Number.parseInt(hex.slice(4, 6), 16)
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}
