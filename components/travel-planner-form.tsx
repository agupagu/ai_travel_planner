"use client"

import type React from "react"

import { useState } from "react"
import { Loader2, Plane } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Activity {
  name: string
  description: string
  time: string
  transportation?: string
  meal?: string
}

interface Day {
  day: number
  activities: Activity[]
}

interface TravelPlan {
  days: Day[]
}

export function TravelPlannerForm() {
  const [loading, setLoading] = useState(false)
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const data = {
      location: formData.get("location"),
      days: Number(formData.get("days")),
      preferences: formData.get("preferences"),
      travelStyle: formData.get("travelStyle"),
    }

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate travel plan")
      }

      const plan = await response.json()
      setTravelPlan(plan)
    } catch (error) {
      console.error("Error generating travel plan:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Plan Your Trip</CardTitle>
          <CardDescription>Fill in your travel details and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location">Destination</Label>
                <Input id="location" name="location" placeholder="Enter city or country" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="days">Number of Days</Label>
                <Input id="days" name="days" type="number" min="1" max="30" placeholder="How many days?" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="travelStyle">Travel Style</Label>
                <Select name="travelStyle" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your travel style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relaxing">Relaxing</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="foodie">Foodie</SelectItem>
                    <SelectItem value="mixed">Mix of Everything</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="preferences">Additional Preferences</Label>
                <Textarea
                  id="preferences"
                  name="preferences"
                  placeholder="Tell us more about what you'd like to do..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating your plan...
                </>
              ) : (
                <>
                  <Plane className="mr-2 h-4 w-4" />
                  Generate Travel Plan
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {travelPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Your Travel Plan</CardTitle>
            <CardDescription>Here's your personalized itinerary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {travelPlan.days.map((day) => (
                <div key={day.day} className="space-y-4">
                  <h3 className="font-semibold text-lg">Day {day.day}</h3>
                  {day.activities.map((activity, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-medium text-primary">{activity.name}</h4>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <div className="text-sm">
                        <span className="font-medium">Time:</span> {activity.time}
                      </div>
                      {activity.transportation && (
                        <div className="text-sm">
                          <span className="font-medium">Transportation:</span> {activity.transportation}
                        </div>
                      )}
                      {activity.meal && (
                        <div className="text-sm">
                          <span className="font-medium">Meal:</span> {activity.meal}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

