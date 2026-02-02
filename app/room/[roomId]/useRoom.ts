"use client"

// hooks/useRoom.ts
import { useState, useEffect, useCallback, useRef } from "react"
import { useRoomExitGuard } from "./useExitRoom"
import { usePathname } from "next/navigation"
// importar servicios y tipos necesarios
import { firebaseRoomService, type FirebaseRoom, type RoomSession } from "@/lib/firebase"
import { calculateAverage } from "@/utils/calculateAverage"
import Player from "@/interfaces/Player"



const useRoom = (roomId: string, router: any) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [revealed, setRevealed] = useState(false)
  const [roomSession, setRoomSession] = useState<RoomSession>()
  const [roomData, setRoomData] = useState<FirebaseRoom | null>(null)
  const [userRole, setUserRole] = useState<"admin" | "player">("player")
  const [userStatus, setUserStatus] = useState<"player" | "spectator">("player")
  const [gameState, setGameState] = useState<"waiting" | "voting" | "revealed">("waiting")
  const unsubscribeRef = useRef<(() => void)[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player>();
  const [isUpdatingUserType, setIsUpdatingUserType] = useState(false);
  const pathname = usePathname()

  const isCreator = () => userRole === "admin"
  const isSpectator = () => userStatus === "spectator";

  const average = calculateAverage(players);
  const allVoted = players.filter((p) => p.isOnline && p.currentStatus !== "spectator").every((player) => player.hasVoted);

  const isRevealDisabled = isCreator() && revealed;
  const isNewRoundDisabled = isCreator() && !revealed;

  useRoomExitGuard(roomSession);

  const setupRealtimeListeners = useCallback((roomId: string) => {
    // Listen for room updates
    const roomUnsubscribe = firebaseRoomService.subscribeToRoom(roomId, (room) => {
      if (room) {
        setRoomData(room)
        setRevealed(room.isRevealed || false)
        setGameState(room.gameState || "waiting")
        setCurrentRound(room.currentRound || 1)
        setIsLoading(false)
      }
    })

    // Listen for players updates
    const playersUnsubscribe = firebaseRoomService.subscribeToPlayers(roomId, (playersData) => {
      const data = playersData;
      const playersList: any = Object.entries(data).map(([id, player]) => {
        if (!player) return null  // opcional: protegerte contra errores

        return {
          id,
          vote: player.vote !== null ? String(player.vote) : "0",
          hasVoted: player.hasVoted || false,
          isOnline: player.isOnline || false,
          lastSeen: player.lastSeen || null,
          name: player.name,
          uniqueId: player.uniqueId,
          userType: player.userType || "player",
          currentStatus: player.currentStatus || "player"
        }
      }).filter(Boolean)
      setPlayers(playersList)

      // Update current user type/status if it changed
      if (roomSession) {
        const currentPlayer = playersList.find((p: Player) => p.uniqueId === roomSession.playerId);
        if (currentPlayer) {
          if (currentPlayer.userType !== userRole) {
            setUserRole(currentPlayer.userType)
          }
          if (currentPlayer.currentStatus !== userStatus) {
            setUserStatus(currentPlayer.currentStatus)
          }

          // Update localStorage with new user type if needed (role usually doesn't change dynamicall easily but status might)
          // Actually, let's keep session sync simple or check if we need to update session
          if (currentPlayer.userType !== roomSession.playerType || currentPlayer.currentStatus !== roomSession.currentStatus) {
            const updatedSession = {
              ...roomSession,
              playerType: currentPlayer.userType,
              currentStatus: currentPlayer.currentStatus
            }
            localStorage.setItem("currentRoom", JSON.stringify(updatedSession))
            setRoomSession(updatedSession)
          }
        }
      }
    })

    unsubscribeRef.current = [roomUnsubscribe, playersUnsubscribe]
  }, [roomSession, userRole, userStatus])

  const initializeRoom = useCallback(async () => {
    try {
      const storedSession = localStorage.getItem("currentRoom")
      if (!storedSession) {
        const storageSession = { roomCode: roomId }
        localStorage.setItem("cachedRoomCode", JSON.stringify(storageSession))
        router.push("/join")
        return
      }

      const session: RoomSession = JSON.parse(storedSession);

      // Validate that the room code matches the URL
      if (session.roomCode != roomId) {
        router.push("/join")
        return
      }

      setRoomSession(session)
      setUserRole(session.playerType as "admin" | "player")
      setUserStatus(session.currentStatus as "player" | "spectator" || "player")

      // Initialize Firebase connection
      const roomData = await firebaseRoomService.initializeRoom(session.roomId)

      if (!roomData) {
        setError("Room not found or has been deleted")
        setIsLoading(false)
        return
      }

      setRoomData(roomData)
      setIsConnected(true)

      // Update player's online status
      await firebaseRoomService.updatePlayerStatus(session.roomId, session.playerId, true)

      // Subscribe to real-time updates
      setupRealtimeListeners(session.roomId)
    } catch (err) {
      setError("Failed to connect to room")
      setIsLoading(false)
    }
  }
    , [roomId, router])

  //inicializa la sala
  useEffect(() => {
    initializeRoom()
    return () => {
      if (roomSession) {
        // Update player status to offline before leaving
        firebaseRoomService.updatePlayerStatus(roomSession.roomId, roomSession.playerId, false).catch(console.error)
      }

      // Unsubscribe from all listeners
      unsubscribeRef.current.forEach((unsubscribe) => unsubscribe())
      firebaseRoomService.cleanup()
    }
  }, [initializeRoom])

  useEffect(() => {
    if (!roomSession) return;

    const handleBeforeUnload = () => {
      firebaseRoomService.removePlayer(roomId, roomSession.playerId)
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      // Se ejecuta al desmontar el componente o al cambiar de ruta
      firebaseRoomService.removePlayer(roomId, roomSession.playerId)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [roomId, router, pathname])

  //maneja visibilidades
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (roomSession) {
        const isVisible = !document.hidden
        firebaseRoomService.updatePlayerStatus(roomSession.roomId, roomSession.playerId, isVisible).catch(console.error)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [roomSession])

  //Handlers
  const handleUserTypeToggle = async () => {
    if (!roomSession || isUpdatingUserType) return

    setIsUpdatingUserType(true)

    try {
      // Toggle status
      const newStatus = userStatus === "spectator" ? "player" : "spectator"
      setUserStatus(newStatus)
      await firebaseRoomService.updatePlayerCurrentStatus(roomSession.roomId, roomSession.playerId, newStatus)
    } catch (err) {
      setError("Failed to update user status")
    } finally {
      setIsUpdatingUserType(false)
    }
  }

  const handleReveal = async () => {
    if (!roomSession || !isCreator() || revealed) return
    try {
      await firebaseRoomService.revealVotes(roomSession.roomId)
    } catch (err) {
      setError("Failed to reveal votes")
    }
  }

  const handleReset = async () => {
    if (!roomSession || !isCreator()) return
    try {
      await firebaseRoomService.resetVotes(roomSession.roomId);
      await firebaseRoomService.addOneToCurrentRound(roomSession.roomId);
    } catch (err) {
      setError("Failed to reset votes")
    }
  }

  const getCurrentPlayerVote = () => {
    if (!roomSession || isSpectator()) return null
    const currentPlayer = players.find((p) => p.uniqueId === roomSession.playerId)
    return currentPlayer?.vote
  }

  const getActivePlayersCount = () => {
    return players.filter((p) => p.isOnline && p.currentStatus !== "spectator").length
  }

  const getSpectatorsCount = () => {
    return players.filter((p) => p.isOnline && p.currentStatus === "spectator").length
  }

  const handleCardSelect = async (value: string) => {
    if (!roomSession || revealed || userStatus === "spectator") return

    try {
      // console.log(roomSession.playerId)
      await firebaseRoomService.updatePlayerVote(roomSession.roomId, roomSession.playerId, value)
      return true
    } catch (err) {
      console.error("Failed to update vote:", err)
      setError("Failed to submit vote")
    }
  }

  const handleLogOut = async () => {
    var userId = roomSession?.playerId;
    var fsRoomId = roomSession?.roomId;
    if (!userId || !fsRoomId) return;

    try {
      await firebaseRoomService.removePlayer(fsRoomId, userId);
    }
    catch (e) {
      setError("Failed to remove user");
    }
    finally {
      //eliminar localstorage
      setRoomSession(undefined);
      localStorage.removeItem("currentRoom");
      localStorage.removeItem("cachedRoomCode");
      router.push(`/`);
      //
    }

  }

  /*TODO 
    Agregar un useEffect donde verifique si en la sala hay al menos 1 admin
  */

  return {
    players,
    revealed,
    roomSession,
    roomData,
    currentUserType: userRole,
    userRole,
    userStatus,
    isRevealDisabled,
    isNewRoundDisabled,
    handleCardSelect,
    gameState,
    setGameState,
    currentRound,
    isLoading,
    isConnected,
    isUpdatingUserType,
    error,
    handleUserTypeToggle,
    handleReveal,
    handleReset,
    isCreator,
    isSpectator,
    getCurrentPlayerVote,
    getActivePlayersCount,
    getSpectatorsCount,
    allVoted,
    average,
    handleLogOut
  }
}

export default useRoom