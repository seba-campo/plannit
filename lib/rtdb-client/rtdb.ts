import { initializeApp } from "firebase/app"
import { getDatabase, ref, onValue, set, get, remove, type Database, update, runTransaction } from "firebase/database"
import { getAuth, signInAnonymously } from "firebase/auth"
import { FirebaseRoom, FirebasePlayer } from "./DTOs"
export type { RoomSession } from "./DTOs"
import { VotingCard } from "@/interfaces/VotingCard"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const database = getDatabase(app)
export const auth = getAuth(app)

// Hace login anónimo
signInAnonymously(auth)
  .then(() => {
    console.log("✅ Usuario anónimo autenticado:", auth.currentUser?.uid)
  })
  .catch((error) => {
    console.error("❌ Error al autenticar:", error)
  });

// Firebase service class
export class FirebaseRoomService {
  private database: Database
  private roomRef: any = null
  private playersRef: any = null
  private ticketRef: any = null
  private ticketHistoryRef: any = null
  private averageScoreRef: any = null
  private unsubscribers: Array<() => void> = []

  constructor() {
    this.database = database
  }

  // Initialize connection to a specific room
  public async initializeRoom(roomId: string): Promise<FirebaseRoom | null> {
    return new Promise((resolve, reject) => {
      try {
        this.roomRef = ref(this.database, `planningRooms/${roomId}`)

        // Listen for room data once to check if room exists
        const unsubscribe = onValue(
          this.roomRef,
          (snapshot) => {
            const data = snapshot.val()
            if (data) {
              resolve(data as FirebaseRoom)
            } else {
              resolve(null)
            }
            unsubscribe() // Remove listener after first read
          },
          (error) => {
            reject(error)
          },
        )
      } catch (error) {
        reject(error)
      }
    })
  }

  // Listen for real-time room updates
  public subscribeToRoom(roomId: string, callback: (room: FirebaseRoom | null) => void): () => void {
    this.roomRef = ref(this.database, `planningRooms/${roomId}`)

    const unsubscribe = onValue(this.roomRef, (snapshot) => {
      const data = snapshot.val()
      callback(data as FirebaseRoom | null)
    })

    this.unsubscribers.push(unsubscribe)
    return unsubscribe
  }

  // Listen for real-time players updates
  subscribeToPlayers(roomId: string, callback: (players: Record<string, FirebasePlayer>) => void): () => void {
    this.playersRef = ref(this.database, `planningRooms/${roomId}/participants`)

    const unsubscribe = onValue(this.playersRef, (snapshot) => {
      const data = snapshot.val() || {}
      callback(data)
    })

    this.unsubscribers.push(unsubscribe)
    return unsubscribe
  }

  public subscribeToAverageScore(roomId: string, callback: (averageScore: number | string) => void): () => void {
    this.averageScoreRef = ref(this.database, `planningRooms/${roomId}/averageScore`)

    const unsubscribe = onValue(this.averageScoreRef, (snapshot) => {
      const data = snapshot.val() ?? 0
      callback(data)
    })

    this.unsubscribers.push(unsubscribe)
    return unsubscribe
  }

  public subscribeToTickets(roomId: string, callback: (tickets: Array<VotingCard>) => void): () => void {
    this.ticketRef = ref(this.database, `planningRooms/${roomId}/currentTicket`)

    const unsubscribe = onValue(this.ticketRef, (snapshot) => {
      const data = snapshot.val() || {}
      callback(data)
    })

    this.unsubscribers.push(unsubscribe)
    return unsubscribe
  }

  public subscribeToTicketHistory(roomId: string, callback: (tickets: Array<VotingCard>) => void): () => void {
    this.ticketHistoryRef = ref(this.database, `planningRooms/${roomId}/gameTicketHistory/tickets`)

    const unsubscribe = onValue(this.ticketHistoryRef, (snapshot) => {
      const data = snapshot.val() || {}
      callback(data)
    })

    this.unsubscribers.push(unsubscribe)
    return unsubscribe
  }

  // Update player's vote
  public async updatePlayerVote(roomId: string, playerId: string, vote: string): Promise<void> {
    const participantsRef = ref(this.database, `planningRooms/${roomId}/participants`);
    const snapshot = await get(participantsRef);
    if (!snapshot.exists()) return;

    const participants = snapshot.val();
    const entry = Object.entries(participants).find(([key, p]: any) => p.uniqueId === playerId);

    if (!entry) return;
    const [key] = entry;

    const playerRef = ref(this.database, `planningRooms/${roomId}/participants/${key}`);
    await update(playerRef, {
      vote,
      hasVoted: true,
      lastSeen: Date.now(),
    });
  }

  // Update player's online status
  public async updatePlayerStatus(roomId: string, playerId: string, isOnline: boolean): Promise<void> {
    const participantsRef = ref(this.database, `planningRooms/${roomId}/participants`);
    const snapshot = await get(participantsRef);

    if (!snapshot.exists()) return;

    const participants = snapshot.val();
    const entry = Object.entries(participants).find(([key, p]: any) => p.uniqueId === playerId);

    if (!entry) return;
    const [key] = entry;

    const playerRef = ref(this.database, `planningRooms/${roomId}/participants/${key}`);
    await update(playerRef, {
      isOnline,
      lastSeen: Date.now(),
    });
  }

  // Reveal all votes
  public async revealVotes(roomId: string, average: number | string): Promise<void> {
    const gameStateRef = ref(this.database, `planningRooms/${roomId}/gameState`);
    const isRevealedRef = ref(this.database, `planningRooms/${roomId}/isRevealed`);

    await this.setAverageScore(roomId, average);
    await Promise.all([update(gameStateRef, { "gameState": "revealed" }), update(isRevealedRef, { "isRevealed": true })])
  }

  public async setAverageScore(roomId: string, average: number | string): Promise<void> {
    if (!roomId) return;
    const averageRef = ref(this.database, `planningRooms/${roomId}/averageScore`);
    await runTransaction(averageRef, () => {
      return average;
    })
  }

  public async addOneToCurrentRound(roomId: string): Promise<void> {
    const currentRoundRef = ref(this.database, `planningRooms/${roomId}/currentRound`)
    try {
      await runTransaction(currentRoundRef, (currentRound) => {
        return (currentRound || 0) + 1
      })
    } catch (error) {
      console.error("Error incrementing round:", error)
      throw error
    }
  }

  // Reset votes for new round
  public async resetVotes(roomId: string): Promise<void> {
    const updates: Record<string, any> = {}

    // Get current players and reset their votes
    const playersRef = ref(this.database, `planningRooms/${roomId}/participants`)

    return new Promise((resolve, reject) => {
      onValue(
        playersRef,
        async (snapshot) => {
          const players = snapshot.val() || {}

          // Reset each player's vote
          Object.keys(players).forEach((player, i) => {
            updates[`planningRooms/${roomId}/participants/${player}/vote`] = 0
            updates[`planningRooms/${roomId}/participants/${player}/hasVoted`] = false
          })

          // Reset game state
          updates[`planningRooms/${roomId}/gameState`] = "voting"
          updates[`planningRooms/${roomId}/isRevealed`] = false

          try {
            await update(ref(this.database), updates)
            resolve()
          } catch (error) {
            reject(error)
          }
        },
        { onlyOnce: true },
      )
    })
  }

  // Join room as a player
  public async joinRoom(roomId: string, playerData: Omit<FirebasePlayer, "lastSeen" | "isOnline">): Promise<void> {
    const playerRef = ref(this.database, `planningRooms/${roomId}/participants/${playerData.uniqueId}`)
    await set(playerRef, {
      ...playerData,
      isOnline: true,
      lastSeen: Date.now(),
    })
  }

  // Update player's current status (spectator/player)
  public async updatePlayerCurrentStatus(roomId: string, playerId: string, currentStatus: "spectator" | "player"): Promise<void> {
    const participantsRef = ref(this.database, `planningRooms/${roomId}/participants`)
    const snapshot = await get(participantsRef);
    if (!snapshot.exists()) return;

    const participants = snapshot.val();
    const entry = Object.entries(participants).find(([key, p]: any) => p.uniqueId === playerId);

    if (!entry) return;
    const [key] = entry;

    const playerRef = ref(this.database, `planningRooms/${roomId}/participants/${key}`)
    await update(playerRef, { "currentStatus": currentStatus })
  }

  public async removePlayer(roomId: string, playerId: string): Promise<void> {
    const participantsRef = ref(this.database, `planningRooms/${roomId}/participants`)
    const snapshot = await get(participantsRef);
    if (!snapshot.exists()) return;

    const participants = snapshot.val();
    const entry = Object.entries(participants).find(([key, p]: any) => p.uniqueId === playerId);

    if (!entry) return;
    const [key] = entry;

    const playerRef = ref(this.database, `planningRooms/${roomId}/participants/${key}`)
    await remove(playerRef);
  }

  public async addCurrentVotingTicket(roomId: string, ticket: VotingCard): Promise<void> {
    const currentTicketRef = ref(this.database, `planningRooms/${roomId}/currentTicket/0`);
    const currentTicketSnap = await get(currentTicketRef);
    if (!currentTicketSnap.exists()) {
      await set(currentTicketRef, ticket)
    } else {
      await this.pushTicketToHistory(roomId)
      await set(currentTicketRef, ticket)
    }
  }

  public async clearCurrentTicket(roomId: string): Promise<void> {
    await this.pushTicketToHistory(roomId)
    const currentTicketRef = ref(this.database, `planningRooms/${roomId}/currentTicket/0`);
    await set(currentTicketRef, null)
  }

  private async pushTicketToHistory(roomId: string): Promise<void> {
    const ticketHistoryRef = ref(this.database, `planningRooms/${roomId}/gameTicketHistory/tickets`);
    const currentTicketRef = ref(this.database, `planningRooms/${roomId}/currentTicket/0`);
    const currentAverageScoreRef = ref(this.database, `planningRooms/${roomId}/averageScore`);

    const currentTicketSnapshot = await get(currentTicketRef);
    const currentAverageScoreSnapshot = await get(currentAverageScoreRef);
    if (!currentTicketSnapshot.exists()) return;

    const currentTicket = currentTicketSnapshot.val() as VotingCard;
    currentTicket.status = 'completed';
    currentTicket.averageValue = currentAverageScoreSnapshot.val() as number | string;
    const historyTicketSnapshot = await get(ticketHistoryRef);

    if (!historyTicketSnapshot.exists()) {
      await set(ticketHistoryRef, [currentTicket])
    } else {
      let history = historyTicketSnapshot.val();
      if (!Array.isArray(history)) {
        history = [history];
      }
      history.push(currentTicket);
      await set(ticketHistoryRef, history)
    }
  }

  // Clean up all subscriptions
  cleanup(): void {
    this.unsubscribers.forEach((unsubscribe) => unsubscribe())
    this.unsubscribers = []
  }

}

// Create singleton instance
export const firebaseRoomService = new FirebaseRoomService()
