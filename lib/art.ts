/**
 * Placeholder imagery: layered gradients that read as a glass facade.
 * Swap for <Image> components once you have real photos per listing.
 */
const PAL = [
  ['#1D4D45', '#7FA89A', '#E3A23B'], ['#26395A', '#8FA6C8', '#F0B35A'], ['#4A3B32', '#B9A086', '#E9C46A'],
  ['#203B2E', '#94B59C', '#F2A541'], ['#3A2F4B', '#A592BC', '#EFB65B'], ['#17424F', '#80B4C0', '#F4B860'],
];

export function art(s: number, v = 0): string {
  const p = PAL[s % PAL.length];
  const a = 145 + ((s * 37 + v * 53) % 70);
  const w = 14 + ((s + v) % 4) * 5;
  const h = w + 6 + ((s * 3 + v) % 3) * 4;
  const gx = 60 + ((s * 13 + v * 29) % 35);
  return `radial-gradient(circle at ${gx}% 14%,${p[2]}bb 0,transparent 42%),linear-gradient(to top,rgba(0,0,0,.42),transparent 55%),repeating-linear-gradient(90deg,transparent 0 ${w}px,rgba(255,255,255,.17) ${w}px ${w + 1}px),repeating-linear-gradient(0deg,transparent 0 ${h}px,rgba(0,0,0,.14) ${h}px ${h + 1}px),linear-gradient(${a}deg,${p[0]},${p[1]})`;
}
