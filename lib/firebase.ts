import { initializeApp } from "firebase/app"
import { getDatabase, ref, onValue, set, get, type Database, update } from "firebase/database"
import { getAuth, signInAnonymously } from "firebase/auth"

// Firebase configuration - you should move these to environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:  process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
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
  })

// Types for Firebase data structure
export interface FirebasePlayer {
  name: string,
  uniqueId: string,
  userType: "admin" | "player"
  vote: number | null
  hasVoted: boolean
  lastSeen: number
  isOnline: boolean
  selection: number | null
}   

export interface FirebaseRoom {
  averageScore: number
  currentRound: number
  cardStatus: "hidden" | "revelaed"
  isRevealed: boolean
  createdAt: number
  gameState: "waiting" | "revealed"
  participants: Record<string, FirebasePlayer>
}

export interface RoomSession {
  roomDocId: string
  roomDocCode: string
  roomRtId: string // This is the rtdbKey
  playerId: string
  playerName: string
  playerType: "creator" | "participant"
}

// Firebase service class
export class FirebaseRoomService {
  private database: Database
  private roomRef: any = null
  private playersRef: any = null
  private unsubscribers: Array<() => void> = []

  constructor() {
    this.database = database
  }

  // Initialize connection to a specific room
  initializeRoom(roomId: string): Promise<FirebaseRoom | null> {
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
  subscribeToRoom(roomId: string, callback: (room: FirebaseRoom | null) => void): () => void {
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
      // console.log(data)
      callback(data)
    })

    this.unsubscribers.push(unsubscribe)
    return unsubscribe
  }

  // Update player's vote
  async updatePlayerVote(roomId: string, playerId: string, vote: string): Promise<void> {
    const participantsRef = ref(this.database, `planningRooms/${roomId}/participants`);
    const snapshot = await get(participantsRef);
    if (!snapshot.exists()) return;

    const participants = snapshot.val();
    const index = Object.values(participants).findIndex((p: any) => p.uniqueId === playerId);

    if (index === -1) return;

    const playerRef = ref(this.database, `planningRooms/${roomId}/participants/${index}/${playerId}`);
    await update(playerRef, {
      vote,
      hasVoted: true,
      lastSeen: Date.now(),
    });
  }

  // Update player's online status
  async updatePlayerStatus(roomId: string, playerId: string, isOnline: boolean): Promise<void> {
    const participantsRef = ref(this.database, `planningRooms/${roomId}/participants`);
    const snapshot = await get(participantsRef);

    if (!snapshot.exists()) return;

    const participants = snapshot.val();
    const index = Object.values(participants).findIndex((p: any) => p.uniqueId === playerId);

    if (index === -1) return;

    const playerRef = ref(this.database, `planningRooms/${roomId}/participants/${index}/${playerId}`);
    await update(playerRef, {
      isOnline,
      lastSeen: Date.now(),
    });
  }

  // Reveal all votes
  async revealVotes(roomId: string): Promise<void> {
    const gameStateRef = ref(this.database, `planningRooms/${roomId}/gameState`)
    const isRevealedRef = ref(this.database, `planningRooms/${roomId}/isRevealed`)

    await Promise.all([set(gameStateRef, "revealed"), set(isRevealedRef, true)])
  }

  // Reset votes for new round
  async resetVotes(roomId: string): Promise<void> {
    const updates: Record<string, any> = {}

    // Get current players and reset their votes
    const playersRef = ref(this.database, `planningRooms/${roomId}/participants`)

    return new Promise((resolve, reject) => {
      onValue(
        playersRef,
        async (snapshot) => {
          const players = snapshot.val() || {}

          // Reset each player's vote
          Object.keys(players).forEach((playerId) => {
            updates[`planningRooms/${roomId}/participants/${playerId}/vote`] = null
            updates[`planningRooms/${roomId}/participants/${playerId}/hasVoted`] = false
          })

          // Reset game state
          updates[`planningRooms/${roomId}/gameState`] = "voting"
          updates[`planningRooms/${roomId}/isRevealed`] = false
          updates[`planningRooms/${roomId}/currentRound`] = (players.currentRound || 0) + 1

          try {
            await set(ref(this.database), updates)
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
  async joinRoom(roomId: string, playerData: Omit<FirebasePlayer, "lastSeen" | "isOnline">): Promise<void> {
    const playerRef = ref(this.database, `planningRooms/${roomId}/participants/${playerData.uniqueId}`)
    await set(playerRef, {
      ...playerData,
      isOnline: true,
      lastSeen: Date.now(),
    })
  }

  // Clean up all subscriptions
  cleanup(): void {
    this.unsubscribers.forEach((unsubscribe) => unsubscribe())
    this.unsubscribers = []
  }
}

// Create singleton instance
export const firebaseRoomService = new FirebaseRoomService()
