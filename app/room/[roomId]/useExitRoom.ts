import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { firebaseRoomService } from "@/lib/firebase"
import { RoomSession } from "@/lib/firebase" // si lo necesitás tipado

export const useRoomExitGuard = (roomSession?: RoomSession) => {
  const pathname = usePathname()
  const previousPath = useRef(pathname)

  const isRefresh = () => {
    if (typeof window === "undefined") return false
    const entries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[]
    return entries.length > 0 && entries[0].type === "reload"
  }

  useEffect(() => {
    const handleExit = () => {
      if (!roomSession) return
      if (roomSession.playerType == "admin") return
      firebaseRoomService.removePlayer(roomSession.roomId, roomSession.playerId)
      localStorage.removeItem("currentRoom");
      console.log("🧹 Usuario eliminado al salir de la sala")
    }

    const handleBeforeUnload = () => {
      if (!isRefresh()) {
        handleExit()
      } else {
        console.log("♻️ Refresh detectado, no se elimina al user")
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      if (previousPath.current !== pathname) {
        handleExit()
      }
      previousPath.current = pathname
    }
  }, [pathname, roomSession])
}
