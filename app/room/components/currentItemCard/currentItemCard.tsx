import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useCurrentItemCard } from "./useCurrentItem"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";

export default function CurrentItemCard() {
  const {
    ticketUrl,
    isLoading,
    handleSubmitTicket,
    setSubmittedTicketUrl
  } = useCurrentItemCard();

  return (
    <Card className="border-2 border-accent hover:border-primary transition-all duration-500 bg-accent/60 backdrop-blur-md tech-card-glow">
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
              placeholder="Ajustar placeholder"
              onChange={(e) => setSubmittedTicketUrl(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2 mt-4">
            <label htmlFor="url" className="text-sm text-muted-foreground">Ticket URL</label>
            <Input
              id="url"
              placeholder="https://linear.app/issue/..."
              onChange={(e) => setSubmittedTicketUrl(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full group hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
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