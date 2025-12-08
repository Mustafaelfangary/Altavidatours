import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Content indexing service
class ContentIndexer {
  private static indexedContent: Map<string, any> = new Map();
  private static lastIndexTime: number = 0;
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static async indexAllContent() {
    const now = Date.now();
    
    // Return cached content if still fresh
    if (this.indexedContent.size > 0 && (now - this.lastIndexTime) < this.CACHE_DURATION) {
      return this.indexedContent;
    }

    console.log('🔍 Indexing website content for AI assistant...');

    try {
      // Index Dahabiyas
      const dahabiyas = await prisma.dahabiya.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          description: true,
          capacity: true,
          pricePerDay: true,
          category: true,
          features: true,
          cabins: true,
          slug: true
        }
      });

      // Index Packages
      const packages = await prisma.package.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          durationDays: true
        }
      });

      // Index Itineraries
      const itineraries = await prisma.itinerary.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          slug: true
        }
      });

      // Index Blogs
      const blogs = await prisma.blog.findMany({
        where: { isPublished: true },
        select: {
          id: true,
          title: true,
          excerpt: true,
          content: true,
          slug: true
        }
      });

      // Index FAQs (if exists)
      let faqs: any[] = [];
      try {
        const faqContent = await prisma.pageContent.findMany({
          where: {
            page: 'faq'
          }
        });
        faqs = faqContent;
      } catch (error) {
        console.log('No FAQ content found');
      }

      // Store indexed content
      this.indexedContent.set('dahabiyas', dahabiyas);
      this.indexedContent.set('packages', packages);
      this.indexedContent.set('itineraries', itineraries);
      this.indexedContent.set('blogs', blogs);
      this.indexedContent.set('faqs', faqs);
      this.lastIndexTime = now;

      console.log('✅ Content indexed:', {
        dahabiyas: dahabiyas.length,
        packages: packages.length,
        itineraries: itineraries.length,
        blogs: blogs.length,
        faqs: faqs.length
      });

      return this.indexedContent;
    } catch (error) {
      console.error('❌ Error indexing content:', error);
      return this.indexedContent;
    }
  }

  static getContent() {
    return this.indexedContent;
  }
}

// AI Response Generator
class AIAssistant {
  private static async generateResponse(
    userMessage: string,
    indexedContent: Map<string, any>,
    conversationHistory: any[]
  ): Promise<string> {
    const lowerMessage = userMessage.toLowerCase();

    // Generate contextual response
    let response = '';

    // Handle greetings
    if (this.isGreeting(lowerMessage)) {
      response = "Welcome! 👋 Ask about fleets, itineraries, schedules, rates, availability, or tailor‑made journeys. How can I assist you today?";
    }
    // Handle dahabiya queries
    else if (lowerMessage.includes('dahabiya') || lowerMessage.includes('boat') || lowerMessage.includes('vessel') || lowerMessage.includes('ship') || lowerMessage.includes('fleet')) {
      const dahabiyas = indexedContent.get('dahabiyas') || [];
      if (dahabiyas.length > 0) {
        response = `🚢 We have ${dahabiyas.length} luxury dahabiyas available:\n\n`;
        dahabiyas.slice(0, 3).forEach((d: any) => {
          response += `**${d.name}**\n`;
          response += `Category: ${d.category || 'Luxury'} | Capacity: ${d.capacity} guests | $${d.pricePerDay}/day\n`;
          if (d.description) {
            response += `${d.description.substring(0, 80)}...\n`;
          }
          response += `\n`;
        });
        response += `Explore the full fleet at /dahabiyas to view suites, decks, dining and availability.`;
      } else {
        response = 'Our luxury dahabiyas combine pharaonic elegance with modern comfort. Explore the fleet at /dahabiyas.';
      }
    }
    // Handle package queries
    else if (lowerMessage.includes('package') || lowerMessage.includes('tour') || lowerMessage.includes('trip')) {
      const packages = indexedContent.get('packages') || [];
      if (packages.length > 0) {
        response = `📦 We offer ${packages.length} exciting packages:\n\n`;
        packages.slice(0, 3).forEach((p: any) => {
          response += `**${p.name}**\n`;
          response += `Duration: ${p.durationDays} days | Price: $${p.price}\n`;
          if (p.description) {
            response += `${p.description.substring(0, 80)}...\n`;
          }
          response += `\n`;
        });
        response += `View all packages at /packages for detailed information.`;
      } else {
        response = 'We offer curated packages combining luxury cruising with cultural experiences. Visit /packages for details.';
      }
    }
    // Handle itinerary queries
    else if (lowerMessage.includes('itinerar') || lowerMessage.includes('route') || lowerMessage.includes('schedule')) {
      const itineraries = indexedContent.get('itineraries') || [];
      if (itineraries.length > 0) {
        response = `🗺️ We have ${itineraries.length} carefully planned itineraries:\n\n`;
        itineraries.slice(0, 3).forEach((i: any) => {
          response += `**${i.name}**\n`;
          if (i.description) {
            response += `${i.description.substring(0, 80)}...\n`;
          }
          response += `\n`;
        });
        response += `See /itineraries to check durations, highlights and maps.`;
      } else {
        response = 'We offer multiple curated itineraries between Luxor and Aswan. See /itineraries for durations, highlights and maps.';
      }
    }
    // Handle price/rate queries
    else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rate') || lowerMessage.includes('how much')) {
      response = `💰 Our pricing varies based on:\n\n`;
      response += `🚢 Dahabiyas: Starting from $300/day per person\n`;
      response += `📦 Packages: Range from $1,500 to $5,000\n`;
      response += `⏱️ Duration: Typically 3-7 days\n`;
      response += `👥 Group Size: Better rates for larger groups\n\n`;
      response += `Schedules & Rates are at /schedule-and-rates. For tailored quotes, use /tailor-made or /booking.`;
    }
    // Handle booking queries
    else if (lowerMessage.includes('book') || lowerMessage.includes('reservation') || lowerMessage.includes('reserve') || lowerMessage.includes('availability')) {
      response = `📅 To check live availability and book:\n\n`;
      response += `1️⃣ Visit /booking to see available dates\n`;
      response += `2️⃣ Select your preferred dahabiya\n`;
      response += `3️⃣ Choose dates and number of guests\n`;
      response += `4️⃣ Complete the reservation form\n\n`;
      response += `You can also start from a specific dahabiya detail page. Need help choosing?`;
    }
    // Handle contact queries
    else if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('phone') || lowerMessage.includes('reach')) {
      response = `📞 You can reach us:\n\n`;
      response += `📧 Email: info@dahabiyat-nile-cruise.com\n`;
      response += `📞 Phone: +20 123 456 7890\n`;
      response += `💬 Live Chat: Right here!\n`;
      response += `📍 Visit /contact for more details\n\n`;
      response += `Our team is available 24/7. How else can I assist?`;
    }
    // Handle gallery queries
    else if (lowerMessage.includes('gallery') || lowerMessage.includes('photo') || lowerMessage.includes('picture') || lowerMessage.includes('image')) {
      response = 'Enjoy photos and experiences from guests at /gallery. You can filter images by category, destination or experience.';
    }
    // Default response with suggestions
    else {
      response = `I can help with:\n\n`;
      response += `🚢 Fleet (/dahabiyas)\n`;
      response += `📦 Packages (/packages)\n`;
      response += `🗺️ Itineraries (/itineraries)\n`;
      response += `💰 Rates (/schedule-and-rates)\n`;
      response += `📅 Booking (/booking)\n`;
      response += `📞 Contact (/contact)\n\n`;
      response += `What would you like to know?`;
    }

    return response;
  }

  private static isGreeting(message: string): boolean {
    const greetings = ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'];
    return greetings.some(g => message.includes(g));
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message: string = (body?.message || '').toString();
    const history = body?.history || [];
    const sessionId = body?.sessionId || `session_${Date.now()}`;

    // Index content (uses cache if recent)
    const indexedContent = await ContentIndexer.indexAllContent();

    // Generate AI response
    const reply = await AIAssistant['generateResponse'](
      message,
      indexedContent,
      history
    );

    // Save conversation to database for learning
    try {
      await prisma.$executeRaw`
        INSERT INTO "ChatConversation" (id, "sessionId", "userMessage", "assistantResponse", "createdAt")
        VALUES (gen_random_uuid(), ${sessionId}, ${message}, ${reply}, NOW())
        ON CONFLICT DO NOTHING
      `;
    } catch (dbError) {
      console.log('Note: Chat conversation table may not exist yet. Skipping save.');
    }

    return NextResponse.json({ reply });
  } catch (e) {
    console.error('Assistant API error:', e);
    return NextResponse.json({ reply: 'Sorry, something went wrong processing your question.' }, { status: 200 });
  }
}
