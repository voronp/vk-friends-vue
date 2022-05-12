export const getSexName = (sex:number) => sex === 1 ? 'Ж' : sex === 2 ? 'М' : 'Неизв.'
export const bdateToAge = (bdate:string|undefined):string => {
  if (!bdate) return 'Не указан'
  const parts = bdate.split('.')
  if (parts.length < 3) return 'Неизв.'
  const today = new Date()
  let age = today.getFullYear() - Number(parts[2])
  if (today.getMonth() < Number(parts[1]) - 1 || (today.getMonth() === Number(parts[1]) - 1 && today.getDate() < Number(parts[0]))) {
    age--
  }
  let suffix = 'лет'
  if (age % 10 === 1) suffix = 'год'
  else if (age % 10 && age % 10 <= 4) suffix = 'года'
  return `${age} ${suffix}`
}

export default {
  getSexName,
  bdateToAge
}
