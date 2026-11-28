// Форматирование дат в вид «27 ноября в 18:42» (как в макете дашборда).
export function formatEditedAt(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  const day = date.getDate()
  const month = date.toLocaleDateString('ru-RU', { month: 'long' })
  const time = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

  const now = new Date()
  const sameDay = now.toDateString() === date.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const isYesterday = yesterday.toDateString() === date.toDateString()

  const dayLabel = sameDay ? 'сегодня' : isYesterday ? 'вчера' : `${day} ${month}`
  return `${dayLabel} в ${time}`
}
