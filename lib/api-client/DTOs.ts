import { VotingCard } from "@/interfaces/VotingCard"

export interface GetRoomDetailsResponse {
    message: string
    data: {
        votingType: {
            title: string
            description: string
            scaleValues: string[]
        }
        roomOwner: {
            vote: number
            hasVoted: boolean
            lastSeen: number
            currentStatus: string
            uniqueId: string
            name: string
            userType: string
        }
        roomAdmins: Array<{
            vote: number
            hasVoted: boolean
            lastSeen: number
            currentStatus: string
            uniqueId: string
            name: string
            userType: string
        }>
        roomCapacity: number
        realTimeRef: string
        roomCodeSimplified: string
        gameHistory: {
            startedAt: { _seconds: number; _nanoseconds: number }
            modifiedAt: null | { _seconds: number; _nanoseconds: number }
            tickets: VotingCard[]
        }
        actualUsers: number
    }
}

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
    message: string;
    roomInfo: {
        roomCode: string;
        rtdbKey: string;
        votingType: {
            title: string;
            description: string;
            scaleValues: string[];
        };
    };
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