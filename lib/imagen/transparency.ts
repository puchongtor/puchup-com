import { PNG } from "pngjs";

/** True if the PNG has any pixel with alpha < 250 (useful transparency). */
export function pngHasTransparency(bytes: Buffer): boolean {
  try {
    const png = PNG.sync.read(bytes);
    const { data, width, height } = png;
    // Sample + full scan for small images; for large, sample grid then confirm.
    const step = width * height > 400_000 ? 16 : 1;
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const i = (width * y + x) << 2;
        if (data[i + 3] < 250) return true;
      }
    }
    // denser edge check (cutouts often only transparent at edges)
    for (let x = 0; x < width; x++) {
      const top = (x) << 2;
      const bot = (width * (height - 1) + x) << 2;
      if (data[top + 3] < 250 || data[bot + 3] < 250) return true;
    }
    for (let y = 0; y < height; y++) {
      const left = (width * y) << 2;
      const right = (width * y + width - 1) << 2;
      if (data[left + 3] < 250 || data[right + 3] < 250) return true;
    }
    return false;
  } catch {
    return false;
  }
}
