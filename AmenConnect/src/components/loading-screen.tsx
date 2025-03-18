import { Loader2 } from "lucide-react"

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] w-full">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h3 className="text-xl font-medium text-muted-foreground animate-pulse"><LoadingScreen />;</h3>
      </div>
    </div>
  )
}

