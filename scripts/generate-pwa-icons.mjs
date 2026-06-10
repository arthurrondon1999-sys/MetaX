import sharp from "sharp"
import { mkdir } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, "..", "public", "icons")

/**
 * Gera o SVG do ícone MetaX: fundo navy (#050818), hexágono com o "M" da marca
 * em gradiente azul elétrico → ciano e o texto "MetaX" abaixo.
 * `withText` é desativado nos tamanhos menores para manter o logo legível.
 */
function iconSvg(size, withText) {
  const cx = size / 2
  // Hexágono centralizado, deslocado para cima quando há texto
  const hexCenterY = withText ? size * 0.42 : size * 0.5
  const hexR = size * (withText ? 0.26 : 0.32)
  // Pontos do hexágono (flat-top como no logo da sidebar)
  const top = hexCenterY - hexR
  const bottom = hexCenterY + hexR
  const half = hexR * 0.5
  const w = hexR * 0.92
  const hex = [
    `${cx},${top}`,
    `${cx + w},${hexCenterY - half}`,
    `${cx + w},${hexCenterY + half}`,
    `${cx},${bottom}`,
    `${cx - w},${hexCenterY + half}`,
    `${cx - w},${hexCenterY - half}`,
  ].join(" ")

  // "M" desenhado dentro do hexágono
  const mTop = hexCenterY - hexR * 0.42
  const mBottom = hexCenterY + hexR * 0.42
  const mLeft = cx - hexR * 0.52
  const mRight = cx + hexR * 0.52
  const mPath = `M${mLeft},${mBottom} V${mTop} L${cx},${hexCenterY} L${mRight},${mTop} V${mBottom}`
  const strokeW = size * 0.045

  const text = withText
    ? `<text x="${cx}" y="${size * 0.86}" text-anchor="middle"
         font-family="Arial, Helvetica, sans-serif" font-size="${size * 0.13}"
         font-weight="700" fill="#FFFFFF" letter-spacing="${size * 0.004}">MetaX</text>`
    : ""

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>
      <linearGradient id="hexFill" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0066FF" stop-opacity="0.25"/>
        <stop offset="1" stop-color="#8B00FF" stop-opacity="0.25"/>
      </linearGradient>
      <linearGradient id="hexStroke" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#00D4FF"/>
        <stop offset="0.5" stop-color="#0066FF"/>
        <stop offset="1" stop-color="#8B00FF"/>
      </linearGradient>
      <linearGradient id="mGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#00D4FF"/>
        <stop offset="1" stop-color="#0066FF"/>
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#050818"/>
    <polygon points="${hex}" fill="url(#hexFill)" stroke="url(#hexStroke)" stroke-width="${strokeW * 0.6}" stroke-linejoin="round"/>
    <path d="${mPath}" fill="none" stroke="url(#mGrad)" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round"/>
    ${text}
  </svg>`
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const targets = [
    { size: 180, name: "icon-180.png", withText: true },
    { size: 192, name: "icon-192.png", withText: true },
    { size: 512, name: "icon-512.png", withText: true },
  ]
  for (const t of targets) {
    const svg = Buffer.from(iconSvg(t.size, t.withText))
    await sharp(svg).png().toFile(join(OUT_DIR, t.name))
    console.log("[v0] gerado:", t.name)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
