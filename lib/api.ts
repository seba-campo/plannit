// API configuration and utility functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api"

export interface CreateRoomRequest {
    userData: {name: string}
}

export interface CreateRoomResponse {
    msesage: string
    data:{
      room:{
        roomDocId: string,
        roomRtRef: string,
        roomDocCode: string,
      },
      userData:{
            "hasVoted": boolean,
            "lastSeen": number,
            "currentStatus": string,
            "uniqueId": string,
            "name": string,
            "userType": string
      }

    }
}

export interface JoinRoomRequest {
  roomId: string
  userName: {name: string}
}

export interface JoinRoomResponse {
  roomCode: string,
  rtdbKey: string,
  userData:{
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

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ApiError({
          message: errorData.message || `HTTP error! status: ${response.status}`,
          status: response.status,
          code: errorData.code,
        })
      }

      return await response.json()
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError({
        message: error instanceof Error ? error.message : "Network error occurred",
      })
    }
  }

  async createRoom(data: CreateRoomRequest): Promise<CreateRoomResponse> {
    return this.request<CreateRoomResponse>("/room", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async joinRoom(data: JoinRoomRequest): Promise<JoinRoomResponse> {
    return this.request<JoinRoomResponse>("/room/join", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getRoomDetails(roomCode: string): Promise<JoinRoomResponse> {
    return this.request<JoinRoomResponse>(`/room/${roomCode}`)
  }
}

// Create a single instance
export const apiClient = new ApiClient()

// Helper function to handle API errors
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return "An unexpected error occurred"
}

// Custom error class
export class ApiError extends Error {
  public status?: number
  public code?: string

  constructor({ message, status, code }: { message: string; status?: number; code?: string }) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.code = code
  }
}
