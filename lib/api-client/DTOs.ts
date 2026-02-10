import { VotingCard } from "@/interfaces/VotingCard"

export interface CreateRoomRequest {
    userData: { name: string }
}

export interface CreateRoomResponse {
    msesage: string
    data: {
        room: {
            roomDocId: string,
            roomRtRef: string,
            roomDocCode: string,
        },
        userData: {
            hasVoted: boolean,
            lastSeen: number,
            currentStatus: string,
            uniqueId: string,
            name: string,
            userType: string
        }
    }
}

export interface JoinRoomRequest {
    roomId: string
    userName: { name: string }
}

export interface JoinRoomResponse {
    roomCode: string,
    rtdbKey: string,
    userData: {
        uniqueId: string,
        name: string,
        userType: string
    }
}

export interface ApiError {
    message: string
    code?: string
    status?: number
}

export interface SaveGameHistoryRequest {
    roomCode: string
    gameHistory: VotingCard[]
}

export interface SaveGameHistoryResponse {
    roomCode: string;
    tickets: VotingCard[]
}