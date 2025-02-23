import { TravelPlannerForm } from "@/components/travel-planner-form"
import { SponsorBanner } from "@/components/sponsor-banner"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 bg-gradient-to-br from-slate-950 to-slate-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            AI Travel Planner
          </h1>
          <p className="text-muted-foreground">
            Plan your perfect trip with AI-powered recommendations tailored to your preferences.
          </p>
        </div>
        <TravelPlannerForm />
        <SponsorBanner />
      </div>
    </main>
  )
}

