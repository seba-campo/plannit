import { useState } from "react"
import { firebaseRoomService } from "@/lib/rtdb-client/rtdb"
import { RoomSession } from "@/lib/rtdb-client/DTOs"

export const useRoomActions = (roomSession: RoomSession | undefined, userStatus: "player" | "spectator") => {
    const [error, setError] = useState<string | null>(null)
    const [isUpdatingUserType, setIsUpdatingUserType] = useState(false)

    const handleCardSelect = async (value: string, revealed: boolean) => {
        if (!roomSession || revealed || userStatus === "spectator") return

        const sanitizedValue = value.replace(/[<>"'`\\]/g, "").slice(0, 10)
        if (!sanitizedValue) return

        try {
            await firebaseRoomService.updatePlayerVote(roomSession.roomId, roomSession.playerId, sanitizedValue)
            return true
        } catch (err) {
            console.error("Failed to update vote:", err)
            setError("Failed to submit vote")
        }
    }

    const handleReveal = async (isCreator: boolean, revealed: boolean, average: number) => {
        if (!roomSession || !isCreator || revealed) return
        try {
            await firebaseRoomService.revealVotes(roomSession.roomId, average)
        } catch (err) {
            setError("Failed to reveal votes")
        }
    }

    const handleReset = async (isCreator: boolean) => {
        if (!roomSession || !isCreator) return
        try {
            await firebaseRoomService.resetVotes(roomSession.roomId)
            await firebaseRoomService.addOneToCurrentRound(roomSession.roomId)
            await firebaseRoomService.clearCurrentTicket(roomSession.roomId)
            await firebaseRoomService.setAverageScore(roomSession.roomId, 0)
        } catch (err) {
            setError("Failed to reset votes")
        }
    }

    const handleUserTypeToggle = async (setUserStatus: (status: "player" | "spectator") => void) => {
        if (!roomSession || isUpdatingUserType) return

        setIsUpdatingUserType(true)

        try {
            // Toggle status
            const newStatus = userStatus === "spectator" ? "player" : "spectator"
            // Optimistic update handled by caller or we wait for firebase?
            // Original code updated state AND firebase.
            setUserStatus(newStatus)
            await firebaseRoomService.updatePlayerCurrentStatus(roomSession.roomId, roomSession.playerId, newStatus)

            // Update local storage session if needed (original code did this in subscribe, 
            // but doing it here is possibly faster or redundant if subscription catches it).
            // Let's stick to simple action dispatch.

        } catch (err) {
            setError("Failed to update user status")
        } finally {
            setIsUpdatingUserType(false)
        }
    }

    const handleLogOut = async (router: any) => {
        if (!roomSession) return;
        // Logout logic is partly in useRoomSession (exit guard) but manual button click needs this.
        try {
            await firebaseRoomService.removePlayer(roomSession.roomId, roomSession.playerId);
        }
        catch (e) {
            setError("Failed to remove user");
        }
        finally {
            localStorage.removeItem("currentRoom");
            localStorage.removeItem("cachedRoomCode");
            router.push(`/`);
        }
    }

    return {
        handleCardSelect,
        handleReveal,
        handleReset,
        handleUserTypeToggle,
        handleLogOut,
        isUpdatingUserType,
        error,
        setError // Export set error to clear it if needed
    }
}
