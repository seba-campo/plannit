import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { firebaseRoomService, type RoomSession } from "@/lib/firebase"

export const useRoomSession = (roomId: string) => {
    const router = useRouter()
    const pathname = usePathname()
    const [roomSession, setRoomSession] = useState<RoomSession>()
    const [userRole, setUserRole] = useState<"admin" | "player">("player")
    const [userStatus, setUserStatus] = useState<"player" | "spectator">("player")
    const [isSessionLoading, setIsSessionLoading] = useState(true)
    const [sessionError, setSessionError] = useState<string | null>(null)

    const previousPath = useRef(pathname)

    // Initialize Session
    useEffect(() => {
        const initializeSession = async () => {
            try {
                const storedSession = localStorage.getItem("currentRoom")
                if (!storedSession) {
                    const storageSession = { roomCode: roomId }
                    localStorage.setItem("cachedRoomCode", JSON.stringify(storageSession))
                    router.push("/join")
                    return
                }

                const session: RoomSession = JSON.parse(storedSession)

                if (session.roomCode != roomId) {
                    router.push("/join")
                    return
                }

                setRoomSession(session)
                setUserRole(session.playerType as "admin" | "player")
                setUserStatus(session.currentStatus as "player" | "spectator" || "player")

                // Initial firebase check (optional here, but good for validation)
                // We can leave deep firebase connection to useRoomData.

                // Update presence

                // Update presence
                await firebaseRoomService.updatePlayerStatus(session.roomId, session.playerId, true)

            } catch (err) {
                setSessionError("Failed to load session")
            } finally {
                setIsSessionLoading(false)
            }
        }

        initializeSession()
    }, [roomId, router])

    // Exit Guard Logic (Merged from useExitRoom & useRoom cleanup)
    const isRefresh = () => {
        if (typeof window === "undefined") return false
        const entries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[]
        return entries.length > 0 && entries[0].type === "reload"
    }

    const handleExit = useCallback(() => {
        if (!roomSession) return
        // Admins might persist, but original code said: 
        // if (roomSession.playerType == "admin") return 
        // in useExitRoom.ts. Let's respect that policy OR make it consistent.
        // useRoom.ts cleaned up EVERYONE on unmount: 
        // firebaseRoomService.updatePlayerStatus(..., false)

        // Combining logic:
        // 1. Set offline on unmount/close
        firebaseRoomService.updatePlayerStatus(roomSession.roomId, roomSession.playerId, false).catch(console.error)

        // 2. Remove player on actual EXIT (navigation away), except refresh
        // useExitRoom had strict removal. useRoom had updatePlayerStatus(false).
        // The "Right" way for a temporary room is often remove player if they leave for good.
        // But if they just close tab, maybe just offline?
        // Let's stick to useExitRoom's aggressive cleanup for non-admins if navigating away.

        /* 
          Code from useExitRoom:
          if (roomSession.playerType == "admin") return
          firebaseRoomService.removePlayer(...)
          localStorage.removeItem("currentRoom")
        */
    }, [roomSession])

    // Window events
    useEffect(() => {
        if (!roomSession) return

        const handleBeforeUnload = () => {
            // Just set offline status or small cleanup.
            // Full removal happens if logic dictates.
            if (!isRefresh() && roomSession.playerType !== 'admin') {
                firebaseRoomService.removePlayer(roomSession.roomId, roomSession.playerId)
            } else {
                firebaseRoomService.updatePlayerStatus(roomSession.roomId, roomSession.playerId, false)
            }
        }

        window.addEventListener("beforeunload", handleBeforeUnload)

        // Visibility
        const handleVisibilityChange = () => {
            const isVisible = !document.hidden
            firebaseRoomService.updatePlayerStatus(roomSession.roomId, roomSession.playerId, isVisible).catch(console.error)
        }
        document.addEventListener("visibilitychange", handleVisibilityChange)

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload)
            document.removeEventListener("visibilitychange", handleVisibilityChange)

            // Navigation check
            if (previousPath.current !== pathname) {
                // User navigated away inside the app
                if (roomSession.playerType !== 'admin') {
                    firebaseRoomService.removePlayer(roomSession.roomId, roomSession.playerId)
                    localStorage.removeItem("currentRoom")
                } else {
                    firebaseRoomService.updatePlayerStatus(roomSession.roomId, roomSession.playerId, false)
                }
            }
            previousPath.current = pathname
        }
    }, [roomSession, pathname])

    return {
        roomSession,
        setRoomSession, // Exposed for updates
        userRole,
        setUserRole,
        userStatus,
        setUserStatus,
        isSessionLoading,
        sessionError
    }
}
