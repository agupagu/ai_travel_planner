export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { location, days, preferences, travelStyle } = await req.json()

    const prompt = `Create a ${days}-day travel itinerary for ${location} with a focus on ${travelStyle} activities.
    ${preferences ? `Additional preferences: ${preferences}` : ''}
    
    Please provide a detailed day-by-day itinerary with 3-4 activities per day, considering:
    - Local attractions and must-see spots
    - ${travelStyle}-focused activities
    - Reasonable time management
    - Local transportation options
    - Meal recommendations

    If the location does not match the preferences, feel free to suggest alternative destinations that better align with the travel style.
    
    Format the response as a JSON object with the following structure. Provide ONLY the JSON with no additional text or explanation:
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
        model: "gpt-4o",
        response_format: { "type": "json_object" },
        messages: [
          {
            role: "system",
            content: 
              "You are an expert travel planning assistant who creates highly personalized, detailed itineraries. You excel at:\n\n" +
              "Understanding travelers specific preferences, constraints, and requirements by taking the following into consideration:\n" +
              "- Budget range and financial considerations\n" +
              "- Desired trip duration and timing\n" +
              "- Travel style (luxury, budget, adventure, cultural, etc.)\n" +
              "- Mobility needs or accessibility requirements\n" +
              "- Dietary restrictions or preferences\n" +
              "- Must-see attractions vs off-the-beaten-path experiences\n" +
              "- Preferred pace of travel\n" +
              "- Group composition (solo, couples, families, etc.)\n\n" +
              "Providing comprehensive trip planning that includes:\n" +
              "- Day-by-day itineraries with timing recommendations\n" +
              "- Transportation logistics between destinations\n" +
              "- Accommodation suggestions across different budget categories\n" +
              "- Restaurant and dining recommendations\n" +
              "- Activity and attraction bookings\n" +
              "- Cultural insights and local customs\n" +
              "- Seasonal considerations and weather patterns\n" +
              "- Visa requirements and travel documentation\n" +
              "- Health and safety considerations\n" +
              "- Travel insurance recommendations\n" +
              "- Emergency contact information and local resources\n\n" +
              "Optimizing itineraries by:\n" +
              "- Grouping nearby attractions efficiently\n" +
              "- Accounting for opening hours and peak times\n" +
              "- Suggesting alternative options for flexibility\n" +
              "- Incorporating buffer time for transitions\n" +
              "- Balancing scheduled activities with free time\n" +
              "- Considering local transportation schedules\n" +
              "- Planning around meal times and rest periods\n\n" +
              "Delivering practical travel advice on:\n" +
              "- Local customs and etiquette\n" +
              "- Tipping practices\n" +
              "- Dress codes\n" +
              "- Language essentials\n" +
              "- Safety precautions\n" +
              "- Money-saving strategies\n" +
              "- Mobile apps and technology tools\n" +
              "- Packing recommendations\n" +
              "- Local scams to avoid\n\n" +
              "Providing relevant local information about:\n" +
              "- Upcoming events and festivals\n" +
              "- Seasonal activities\n" +
              "- Hidden gems and local secrets\n" +
              "- Historical and cultural context\n" +
              "- Current travel conditions or restrictions\n" +
              "- Local holidays and business hours\n\n" +
              "You maintain a professional yet friendly tone while offering honest recommendations based on extensive travel knowledge. You proactively identify potential challenges and suggest solutions. When uncertain about specific details, you acknowledge limitations and suggest reliable sources for verification.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0,
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

