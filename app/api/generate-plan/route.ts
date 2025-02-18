export async function POST(req: Request) {
  try {
    const { location, days, preferences, travelStyle } = await req.json()

    const prompt = `Create a ${days}-day travel itinerary for ${location} with a focus on ${travelStyle} activities.
    Additional preferences: ${preferences}
    
    Please provide a detailed day-by-day itinerary with 3-4 activities per day, considering:
    - Local attractions and must-see spots
    - ${travelStyle}-focused activities
    - Reasonable time management
    - Local transportation options
    - Meal recommendations
    
    Format the response as a JSON object with the following structure:
    {
      "days": [
        {
          "day": 1,
          "activities": [
            {
              "name": "Activity name",
              "description": "Brief description",
              "time": "Estimated time",
              "transportation": "Transportation method (if applicable)",
              "meal": "Meal recommendation (if applicable)"
            }
          ]
        }
      ]
    }`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an expert travel planning assistant who creates highly personalized, detailed itineraries. You excel at understanding travelers' specific preferences, constraints, and requirements.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("OpenAI API error:", errorData)
      throw new Error(`OpenAI API error: ${errorData.error?.message || JSON.stringify(errorData)}`)
    }

    const data = await response.json()

    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      throw new Error("Unexpected response format from OpenAI API")
    }

    const travelPlan = JSON.parse(data.choices[0].message.content)

    return new Response(JSON.stringify(travelPlan), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error in generate-plan:", error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

