import OpenAI from "openai";

const faqDictionary = {
  "what is your return policy":
    "Our return policy allows returns within 30 days with original packaging. Contact support@thamaratalawrak.com.",
  "how to track my order":
    "You can track your order using the tracking number provided in your email. Visit our tracking page at /track.",
  "are books in stock":
    "Availability varies. Check the product page or contact us for the latest stock status.",
  "what payment methods do you accept":
    "We accept credit cards, PayPal, and bank transfers.",
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const normalizedMessage = message.toLowerCase().trim();

    const faqAnswer = faqDictionary[normalizedMessage];
    if (faqAnswer) {
      return new Response(JSON.stringify({ reply: faqAnswer }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful customer support agent for an Islamic book store. Provide concise, polite, and relevant answers.",
        },
        { role: "user", content: message },
      ],
      max_tokens: 150,
    });

    const aiReply = completion.choices[0].message.content;
    return new Response(JSON.stringify({ reply: aiReply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process message" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
