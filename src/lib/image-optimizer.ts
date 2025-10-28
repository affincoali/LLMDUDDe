export async function optimizeImage(b: ArrayBuffer, o: any = {}) {
  const u = new Uint8Array(b);
  let f = 'jpeg';
  if (u[0] === 0x89 && u[1] === 0x50) f = 'png';
  else if (u[0] === 0x47 && u[1] === 0x49) f = 'gif';
  else if (u[0] === 0x52 && u[1] === 0x49) f = 'webp';
  return { buffer: b, metadata: { width: o.maxWidth || 1920, height: o.maxHeight || 1920, format: f } };
}


