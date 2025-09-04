export function debounce<T extends (...args:any[])=>any>(fn:T, wait=400) {
  let t: any;
  return (...args:Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(()=> fn(...args), wait);
  };
}