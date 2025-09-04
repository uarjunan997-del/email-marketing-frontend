export const formatNumber = (v:number):string => new Intl.NumberFormat(undefined,{maximumFractionDigits:0}).format(v);
export const formatPercent = (v:number):string => `${v}%`;
