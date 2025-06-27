"use client"

// hooks/useRoom.ts
import { useState, useEffect, useCallback, useRef } from "react"
import { useRoomExitGuard } from "./useExitRoom"
import { usePathname } from "next/navigation"
// importar servicios y tipos necesarios
import { firebaseRoomService, type FirebaseRoom, type RoomSession } from "@/lib/firebase"

interface Player {
  id: string
  name: string
  hasVoted: boolean
  isOnline: boolean
  userType: "admin" | "player" | "spectator"
  uniqueId: string;
  vote: string | null
}

export const useRoom = (roomId: string, router: any) => {
  const [players, setPlayers] = useState<Player[]>([])
  const [revealed, setRevealed] = useState(false)
  const [roomSession, setRoomSession] = useState<RoomSession>()
  const [roomData, setRoomData] = useState<FirebaseRoom | null>(null)
  const [currentUserType, setCurrentUserType] = useState<"admin" | "player" | "spectator">("player")
  const [gameState, setGameState] = useState<"waiting" | "voting" | "revealed">("waiting")    
  const unsubscribeRef = useRef<(() => void)[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentRound, setCurrentRound] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [currentPlayer, setCurrentPlayer] = useState<Player>()
  const [isUpdatingUserType, setIsUpdatingUserType] = useState(false)
  const pathname = usePathname()

  useRoomExitGuard(roomSession)

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
            }
          }).filter(Boolean) 
          setPlayers(playersList)
    
          // Update current user type if it changed
          if (roomSession) {
            const currentPlayer = playersList.find((p: Player) => p.uniqueId === roomSession.playerId);
            if (currentPlayer && currentPlayer.userType !== currentUserType) {
              setCurrentUserType(currentPlayer.userType)
              console.log(currentUserType, currentPlayer)
    
              // Update localStorage with new user type
              const updatedSession = {
                ...roomSession,
                playerType: currentPlayer.userType
              }
              localStorage.setItem("currentRoom", JSON.stringify(updatedSession))
              setRoomSession(updatedSession)
            }
          }
    
          // console.log('Seteando players:', playersList)
        })
    
        unsubscribeRef.current = [roomUnsubscribe, playersUnsubscribe]
  }, [roomSession, currentUserType])

  const initializeRoom = useCallback(async () => {
    try {
        const storedSession = localStorage.getItem("currentRoom")
        if (!storedSession) {
          const storageSession = {roomCode: roomId}
            localStorage.setItem("cachedRoomCode", JSON.stringify(storageSession))
            router.push("/join")
            return
        }

        const session: RoomSession = JSON.parse(storedSession)

        // Validate that the room code matches the URL
        if (session.roomCode != roomId) {
            router.push("/join")
            return
        }

        setRoomSession(session)
        setCurrentUserType(session.playerType as "admin" | "player" | "spectator")

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
    if(!roomSession) return;
    console.log("ENTRO AL effect ")

    const handleBeforeUnload = () => {
      firebaseRoomService.removePlayer(roomId, roomSession.playerId)
      console.log("Eliminado el user")
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      // Se ejecuta al desmontar el componente o al cambiar de ruta
      firebaseRoomService.removePlayer(roomId, roomSession.playerId)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [roomId, router, pathname] )
  
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
    if (!roomSession || isUpdatingUserType || currentUserType === "admin") return

    setIsUpdatingUserType(true)

    try {
      const newUserType = currentUserType === "spectator" ? "player" : "spectator"
      setCurrentUserType(newUserType)
      await firebaseRoomService.updatePlayerType(roomSession.roomId, roomSession.playerId, newUserType)
    } catch (err) {
      setError("Failed to update user type")
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
      await firebaseRoomService.resetVotes(roomSession.roomId)
    } catch (err) {
      setError("Failed to reset votes")
    }
  }

  const isCreator = () => currentUserType === "admin"
  const isSpectator = () => currentUserType === "spectator"

  const getCurrentPlayerVote = () => {
    if (!roomSession || isSpectator()) return null
    const currentPlayer = players.find((p) => p.uniqueId === roomSession.playerId)
    return currentPlayer?.vote 
  }

  const getActivePlayersCount = () => {
    return players.filter((p) => p.isOnline && p.userType !== "spectator").length
  }

  const getSpectatorsCount = () => {
    return players.filter((p) => p.isOnline && p.userType === "spectator").length
  }

  const allVoted = players
    .filter((p) => p.isOnline && p.userType !== "spectator")
    .every((player) => player.hasVoted);

  const calculateAverage = () => {
    const numericVotes = players
      .filter((p) => p.vote && p.vote !== "?" && p.vote !== '0' && p.isOnline && p.userType !== "spectator")
      .map((p) => Number.parseInt(p.vote as string))
      .filter((vote) => !isNaN(vote))

    if (numericVotes.length === 0) return "-"
    const sum = numericVotes.reduce((acc, val) => acc + val, 0)
    return (sum / numericVotes.length).toFixed(1)
  }

  
  const handleCardSelect = async (value: string) => {
    if (!roomSession || revealed || currentUserType === "spectator") return

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
      if(!userId || !fsRoomId) return;

      try{
        await firebaseRoomService.removePlayer(fsRoomId, userId);
      }
      catch(e){
        setError("Failed to remove user");
      }
      finally{
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
    currentUserType,
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
    calculateAverage,
    handleLogOut
  }
}
