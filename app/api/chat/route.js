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

    const faqDictionary = {
      "what is your return policy":
        "Our return policy allows returns within 30 days with original packaging. Contact support@thamaratalawrak.com.",
      "how to track my order":
        "You can track your order using the tracking number provided in your email. Visit our tracking page at /track.",
      "are books in stock":
        "Availability varies. Check the product page or contact us for the latest stock status.",
      "what payment methods do you accept":
        "We accept credit cards, PayPal, and bank transfers.",
      "how can i contact you":
        "You can reach us at support@thamaratalawrak.com or call +123-456-7890.",
      "what are your shipping times":
        "Shipping takes 3-7 business days depending on your location.",
      "do you offer discounts":
        "Yes, check our promotions page or sign up for our newsletter for discounts!",
      "سياسة الإرجاع":
        "سياسة الإرجاع تتيح الإرجاع خلال 30 يومًا مع العبوة الأصلية. تواصلوا مع support@thamaratalawrak.com.",
      "كيف أتتبع طلبي":
        "يمكنك تتبع طلبك باستخدام رقم التتبع المرسل في بريدك الإلكتروني. زر صفحة التتبع على /track.",
    };

    const faqAnswer = faqDictionary[normalizedMessage];
    if (faqAnswer) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return new Response(JSON.stringify({ reply: faqAnswer }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    return new Response(
      JSON.stringify({
        reply:
          "I'm sorry, I couldn't find an answer to that. Please email support@thamaratalawrak.com or call +123-456-7890 for assistance.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred. Please try again later." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
