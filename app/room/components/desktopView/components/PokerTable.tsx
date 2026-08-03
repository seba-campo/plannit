import IPlayer from "@/interfaces/Player"
import { type RoomSession } from "@/lib/rtdb-client/DTOs"
import PlayerSeat from "./PlayerSeat"

const BASE_ORBIT_RX = 240
const BASE_ORBIT_RY = 120

// Above this many players seats switch to the compact PlayerSeat size.
const SHRINK_THRESHOLD = 8
// Above this many players the table switches from an ellipse to a rounded rectangle:
// straight edges pack seats more efficiently than a curve once the group gets big.
const SQUARE_THRESHOLD = 10
const BASE_RECT_RW = 280
const BASE_RECT_RH = 140
const BASE_RECT_R = 60

const SEAT_MD = { w: 80, h: 135 }
const SEAT_SM = { w: 64, h: 110 }
const CONTAINER_MARGIN = 24

type Offset = { x: number; y: number }

// Faint suit marks at the four cardinal points of the felt — just enough poker-table
// flavor to break up the plain neon outline, kept subtle so it doesn't compete with the seats.
const SUIT_MARKS = [
  { symbol: "♠", style: { top: "6%", left: "50%", transform: "translate(-50%, 0)" } },
  { symbol: "♥", style: { top: "50%", right: "4%", transform: "translate(0, -50%)" } },
  { symbol: "♦", style: { bottom: "6%", left: "50%", transform: "translate(-50%, 0)" } },
  { symbol: "♣", style: { top: "50%", left: "4%", transform: "translate(0, -50%)" } },
]

// Uniform-angle steps bunch seats together on the wide sides of a flattened ellipse
// (arc length per angle step shrinks there) and spread them out on the narrow top/bottom.
// Sampling by arc length instead keeps the gap between seats visually even all the way around.
const ELLIPSE_STEPS = 360

const getEvenEllipseOffsets = (count: number, rx: number, ry: number): Offset[] => {
  if (count === 0) return []

  const cumulativeLength = [0]
  for (let s = 1; s <= ELLIPSE_STEPS; s++) {
    const theta = -Math.PI / 2 + (s / ELLIPSE_STEPS) * 2 * Math.PI
    const prevTheta = -Math.PI / 2 + ((s - 1) / ELLIPSE_STEPS) * 2 * Math.PI
    const dx = rx * (Math.cos(theta) - Math.cos(prevTheta))
    const dy = ry * (Math.sin(theta) - Math.sin(prevTheta))
    cumulativeLength.push(cumulativeLength[s - 1] + Math.sqrt(dx * dx + dy * dy))
  }
  const totalLength = cumulativeLength[ELLIPSE_STEPS]

  return Array.from({ length: count }, (_, i) => {
    const targetLength = (i / count) * totalLength
    let s = 0
    while (s < ELLIPSE_STEPS && cumulativeLength[s] < targetLength) s++
    const theta = -Math.PI / 2 + (s / ELLIPSE_STEPS) * 2 * Math.PI
    return { x: rx * Math.cos(theta), y: ry * Math.sin(theta) }
  })
}

// Evenly spaces seats along the perimeter of a rounded rectangle (half-width rw, half-height
// rh, corner radius r), starting at top-middle and going clockwise — same convention as the
// ellipse. Straight edges have constant "speed", so unlike the ellipse this never bunches seats;
// the corners are rounded so a seat landing near one isn't pinched into a sharp 90° joint.
const getEvenRoundedRectOffsets = (count: number, rw: number, rh: number, r: number): Offset[] => {
  if (count === 0) return []

  const straightX = rw - r
  const straightY = rh - r
  const arcLength = (Math.PI / 2) * r
  const segmentLengths = [straightX, arcLength, 2 * straightY, arcLength, 2 * straightX, arcLength, 2 * straightY, arcLength, straightX]
  const totalLength = segmentLengths.reduce((sum, len) => sum + len, 0)

  const pointAt = (length: number): Offset => {
    let remaining = length

    if (remaining < segmentLengths[0]) return { x: remaining, y: -rh }
    remaining -= segmentLengths[0]

    if (remaining < segmentLengths[1]) {
      const theta = -Math.PI / 2 + (remaining / segmentLengths[1]) * (Math.PI / 2)
      return { x: straightX + r * Math.cos(theta), y: -straightY + r * Math.sin(theta) }
    }
    remaining -= segmentLengths[1]

    if (remaining < segmentLengths[2]) return { x: rw, y: -straightY + remaining }
    remaining -= segmentLengths[2]

    if (remaining < segmentLengths[3]) {
      const theta = (remaining / segmentLengths[3]) * (Math.PI / 2)
      return { x: straightX + r * Math.cos(theta), y: straightY + r * Math.sin(theta) }
    }
    remaining -= segmentLengths[3]

    if (remaining < segmentLengths[4]) return { x: straightX - remaining, y: rh }
    remaining -= segmentLengths[4]

    if (remaining < segmentLengths[5]) {
      const theta = Math.PI / 2 + (remaining / segmentLengths[5]) * (Math.PI / 2)
      return { x: -straightX + r * Math.cos(theta), y: straightY + r * Math.sin(theta) }
    }
    remaining -= segmentLengths[5]

    if (remaining < segmentLengths[6]) return { x: -rw, y: straightY - remaining }
    remaining -= segmentLengths[6]

    if (remaining < segmentLengths[7]) {
      const theta = Math.PI + (remaining / segmentLengths[7]) * (Math.PI / 2)
      return { x: -straightX + r * Math.cos(theta), y: -straightY + r * Math.sin(theta) }
    }
    remaining -= segmentLengths[7]

    return { x: -straightX + remaining, y: -rh }
  }

  return Array.from({ length: count }, (_, i) => pointAt((i / count) * totalLength))
}

// Grows the shape just enough that no two adjacent seats' bounding boxes touch.
// Only adjacent pairs need checking: both the ellipse and the rounded rectangle are convex,
// so any two seats further apart in the ordering are always at least as far apart in space.
const findNonOverlappingScale = (
  count: number,
  seatW: number,
  seatH: number,
  getOffsetsAtScale: (scale: number) => Offset[]
) => {
  if (count <= 1) return 1

  const fitsAt = (scale: number) => {
    const offsets = getOffsetsAtScale(scale)
    for (let i = 0; i < count; i++) {
      const a = offsets[i]
      const b = offsets[(i + 1) % count]
      if (Math.abs(a.x - b.x) < seatW && Math.abs(a.y - b.y) < seatH) return false
    }
    return true
  }

  let scale = 1
  while (!fitsAt(scale) && scale < 5) scale = Math.round((scale + 0.02) * 100) / 100
  return scale
}

const PokerTable = ({
  players,
  revealed,
  average,
  roomSession,
}: {
  players: IPlayer[]
  revealed: boolean
  average: string
  roomSession: RoomSession
}) => {
  const count = players.length
  const seatSize = count > SHRINK_THRESHOLD ? "sm" : "md"
  const seatBox = seatSize === "sm" ? SEAT_SM : SEAT_MD
  const isSquare = count > SQUARE_THRESHOLD

  const scale =
    count > 0
      ? isSquare
        ? findNonOverlappingScale(count, seatBox.w, seatBox.h, (s) =>
            getEvenRoundedRectOffsets(count, BASE_RECT_RW * s, BASE_RECT_RH * s, BASE_RECT_R * s)
          )
        : findNonOverlappingScale(count, seatBox.w, seatBox.h, (s) =>
            getEvenEllipseOffsets(count, BASE_ORBIT_RX * s, BASE_ORBIT_RY * s)
          )
      : 1

  const rw = isSquare ? BASE_RECT_RW * scale : BASE_ORBIT_RX * scale
  const rh = isSquare ? BASE_RECT_RH * scale : BASE_ORBIT_RY * scale

  const width = 2 * rw + seatBox.w + CONTAINER_MARGIN
  const height = 2 * rh + seatBox.h + CONTAINER_MARGIN
  const cx = width / 2
  const cy = height / 2

  const offsets = isSquare
    ? getEvenRoundedRectOffsets(count, rw, rh, BASE_RECT_R * scale)
    : getEvenEllipseOffsets(count, rw, rh)

  // The felt table sits just inside the seats on every side, like people gathered around it.
  // The ellipse keeps its original slightly-off proportions (wider than the ring horizontally,
  // narrower vertically); the rectangle uses a plain even inset.
  const feltHalfW = isSquare ? rw - 30 : rw + 20
  const feltHalfH = isSquare ? rh - 30 : rh - 5
  const feltRadius = isSquare ? Math.max(BASE_RECT_R * scale - 20, 16) : undefined

  return (
    <div className="relative mx-auto" style={{ width, height: height + 70 }}>
      {revealed && (
        <div className="absolute top-0 left-0 z-10 flex flex-col items-start animate-in fade-in zoom-in duration-300">
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">
            Average
          </div>
          <div className="text-4xl font-bold text-neon drop-shadow-[0_0_20px_rgb(var(--neon)_/_0.6)]">
            {average}
          </div>
        </div>
      )}

      <div
        className={`absolute border border-neon/25 backdrop-blur-sm ${isSquare ? "" : "rounded-[50%]"}`}
        style={{
          width: feltHalfW * 2,
          height: feltHalfH * 2,
          left: cx - feltHalfW,
          top: cy - feltHalfH,
          borderRadius: isSquare ? feltRadius : undefined,
          background:
            "radial-gradient(ellipse at 50% 40%, rgb(var(--neon) / 0.07), rgb(var(--neon) / 0.02) 60%, transparent 100%)",
          boxShadow: "inset 0 2px 6px rgb(0 0 0 / 0.45), inset 0 -1px 3px rgb(var(--neon) / 0.12)",
        }}
      >
        <div
          className={`absolute inset-4 border border-dashed border-neon/15 ${isSquare ? "" : "rounded-[50%]"}`}
          style={isSquare ? { borderRadius: feltRadius } : undefined}
        />

        {SUIT_MARKS.map(({ symbol, style }) => (
          <span key={symbol} className="absolute text-neon/10 text-lg select-none" style={style}>
            {symbol}
          </span>
        ))}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent" />
            <div className="text-muted-foreground/25 text-xs tracking-[0.3em] uppercase select-none">
              pLANNIT
            </div>
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent" />
          </div>
        </div>
      </div>

      {players.map((player, i) => {
        const x = cx + offsets[i].x
        const y = cy + offsets[i].y + 35
        const isMe = player.uniqueId === roomSession.playerId

        return (
          <div
            key={player.id}
            className="absolute"
            style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
          >
            <PlayerSeat player={player} revealed={revealed} isMe={isMe} size={seatSize} />
          </div>
        )
      })}
    </div>
  )
}

export default PokerTable
