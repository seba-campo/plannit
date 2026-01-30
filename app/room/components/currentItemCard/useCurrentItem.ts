import { useState } from "react";

export const useCurrentItemCard = () => {
    const [ticketUrl, setTicketUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [submittedTicketUrl, setSubmittedTicketUrl] = useState<string>('');

    function handleSubmitTicket(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        setTicketUrl(submittedTicketUrl);
        setSubmittedTicketUrl('');
    }

    return {
        ticketUrl,
        setTicketUrl,
        isLoading,
        handleSubmitTicket,
        setSubmittedTicketUrl
    }
}