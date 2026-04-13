import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useCurrentItemCard } from "./useCurrentItem"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";

interface CurrentItemCardProps {
  roomId: string
}

export default function CurrentItemCard({ roomId }: CurrentItemCardProps) {
  const {
    isLoading,
    handleSubmitTicket,
    setSubmittedTicketUrl,
    setSubmittedTitle,
    submittedTitle,
    submittedTicketUrl,
  } = useCurrentItemCard(roomId);

  return (
    <Card className="border border-neon/15 hover:border-neon/50 transition-all duration-500 bg-neon/5 backdrop-blur-md hover:shadow-[0_0_20px_rgb(var(--neon)_/_0.08)]">
      <div className="space-y-1 pb-3 pl-6 pt-2 mt-4 block">
        <h2 className="text-xl font-semibold flex items-center">
          What's next?
        </h2>
      </div>
      <form onSubmit={handleSubmitTicket}>
        <CardContent>
          <div className="space-y-2 mt-4">
            <label htmlFor="name" className="text-sm text-muted-foreground">Title</label>
            <Input
              id="name"
              placeholder="Title of the ticket"
              value={submittedTitle}
              onChange={(e) => setSubmittedTitle(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2 mt-4">
            <label htmlFor="url" className="text-sm text-muted-foreground">Ticket URL</label>
            <Input
              id="url"
              placeholder="https://linear.app/issue/..."
              value={submittedTicketUrl}
              onChange={(e) => setSubmittedTicketUrl(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full group bg-neon text-background hover:bg-neon-hover hover:shadow-lg hover:shadow-[rgb(var(--neon)_/_0.25)] transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Add"}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}