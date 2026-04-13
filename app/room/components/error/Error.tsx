import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const Error = ({errorMessage}: {errorMessage: string}) => {
    return (
    <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-neon/5 border-neon/15 backdrop-blur-md">
            <CardContent className="p-6">
            <Alert className="border-red-500 bg-red-500/10">
                <AlertDescription className="text-red-400">{errorMessage}</AlertDescription>
            </Alert>
            <div className="mt-4 space-y-2">
                <Button className="w-full" onClick={() => window.location.reload()}>
                Reconnect
                </Button>
                <Button className="w-full" variant="outline" asChild>
                <Link href="/">Back to Home</Link>
                </Button>
            </div>
            </CardContent>
        </Card>
    </div>
    )
}

export default Error