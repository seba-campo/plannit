import { useState } from "react";
import { FirebaseRoomService } from "@/lib/rtdb-client/rtdb";

export const useCurrentItemCard = (roomId: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [submittedTicketUrl, setSubmittedTicketUrl] = useState<string>('');
    const [submittedTitle, setSubmittedTitle] = useState<string>('');

    const rtdb = new FirebaseRoomService();

    async function handleSubmitTicket(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!roomId) return;

        setIsLoading(true);
        try {
            await rtdb.addCurrentVotingTicket(roomId, {
                id: crypto.randomUUID(),
                url: submittedTicketUrl,
                status: "voting",
                title: submittedTitle,
                averageValue: 0,
            });
            setSubmittedTicketUrl('');
            setSubmittedTitle('');
        } catch (error) {
            console.error("Error adding current voting ticket:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        isLoading,
        handleSubmitTicket,
        setSubmittedTicketUrl,
        setSubmittedTitle,
        submittedTitle,
        submittedTicketUrl
    }
}