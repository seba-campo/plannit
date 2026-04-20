import IPlayer from "@/interfaces/Player"
import { type RoomSession } from "@/lib/rtdb-client/DTOs"
import PlayerSeat from "./PlayerSeat"

const TABLE_W = 580
const TABLE_H = 270
const ORBIT_RX = 240
const ORBIT_RY = 120

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
  const cx = TABLE_W / 2
  const cy = TABLE_H / 2

  return (
    <div className="relative mx-auto" style={{ width: TABLE_W, height: TABLE_H + 70 }}>
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
        className="absolute rounded-[50%] border border-neon/25 bg-neon/[3%] backdrop-blur-sm"
        style={{ width: TABLE_W - 60, height: TABLE_H - 40, left: 30, top: 20 }}
      >
        <div className="absolute inset-4 rounded-[50%] border border-neon/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-muted-foreground/20 text-xs tracking-[0.3em] uppercase select-none">
            Planning Poker
          </div>
        </div>
      </div>

      {players.map((player, i) => {
        const angle = (i / players.length) * 2 * Math.PI - Math.PI / 2
        const x = cx + ORBIT_RX * Math.cos(angle)
        const y = cy + ORBIT_RY * Math.sin(angle) + 35
        const isMe = player.uniqueId === roomSession.playerId

        return (
          <div
            key={player.id}
            className="absolute"
            style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
          >
            <PlayerSeat player={player} revealed={revealed} isMe={isMe} />
          </div>
        )
      })}
    </div>
  )
}

export default PokerTable
