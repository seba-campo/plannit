/**
 * Interface para las tarjetas de la izquierda
 */

export interface VotingCard {
    /** Identificador único de la tarjeta */
    id: string

    /** Título/descripción del item a votar */
    title: string

    /** URL del ticket/issue (e.g., Linear, Jira) */
    link: string

    /** El valor final de la votación (null si la votación está en progreso) */
    votingValue: number | null

    /** Estado actual de la tarjeta */
    status: "voting" | "completed" | "skipped"
}
