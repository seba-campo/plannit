import {
  CreateRoomRequest,
  CreateRoomResponse,
  GetRoomDetailsResponse,
  JoinRoomRequest,
  JoinRoomResponse,
  SaveGameHistoryRequest,
  SaveGameHistoryResponse
} from "./DTOs"

// API configuration and utility functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api"

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

  async getRoomDetails(roomCode: string): Promise<GetRoomDetailsResponse> {
    return this.request<GetRoomDetailsResponse>(`/room/${roomCode}`)
  }

  async saveGameHistory(data: SaveGameHistoryRequest): Promise<SaveGameHistoryResponse> {
    return this.request<SaveGameHistoryResponse>("/room/save-game-history", {
      method: "PUT",
      body: JSON.stringify(data),
    })
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
