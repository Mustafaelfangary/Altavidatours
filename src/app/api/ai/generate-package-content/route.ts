import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { packageName, dahabiyaName, cairoNights, dahabiyaNights, totalDays, packageType } = await request.json();

    // AI-generated content based on package details
    const generatePackageContent = (params: any) => {
      const { packageName, dahabiyaName, cairoNights, dahabiyaNights, totalDays, packageType } = params;
      
      // Generate description based on package type
      let description = "";
      let shortDescription = "";
      let highlights: string[] = [];
      let itinerary: any[] = [];

      if (packageType === "CAIRO_DAHABIYA") {
        shortDescription = `Experience the perfect blend of ancient wonders and luxury Nile cruising with ${cairoNights} nights in Cairo followed by ${dahabiyaNights} nights aboard the magnificent ${dahabiyaName}.`;
        
        description = `Embark on an extraordinary ${totalDays}-day journey that seamlessly combines the bustling energy of Cairo with the serene luxury of Nile cruising aboard ${dahabiyaName}. Begin your adventure exploring the iconic landmarks of Egypt's capital, from the legendary Pyramids of Giza to the treasures of the Egyptian Museum. Then transition to the timeless rhythm of the Nile, where traditional dahabiya sailing meets modern luxury. This carefully curated experience offers the perfect balance of cultural immersion, historical discovery, and relaxation, ensuring memories that will last a lifetime.`;

        highlights = [
          "Private Egyptologist guide throughout Cairo exploration",
          "Exclusive access to Pyramid complex and Sphinx",
          "VIP Egyptian Museum tour with rare artifacts",
          `Luxury accommodation aboard ${dahabiyaName}`,
          "Traditional dahabiya sailing experience",
          "Gourmet dining with authentic Egyptian cuisine",
          "Sunset cocktails on the Nile deck",
          "Visit to ancient temples and tombs",
          "Cultural interactions with local communities",
          "Professional photography opportunities"
        ];

        // Generate itinerary
        itinerary = [
          {
            title: "Arrival in Cairo - Welcome to Egypt",
            location: "Cairo",
            description: "Arrive at Cairo International Airport where you'll be greeted by our representative. Transfer to your luxury hotel in the heart of Cairo. Evening welcome dinner featuring authentic Egyptian cuisine while enjoying views of the Nile. Briefing about your upcoming adventure.",
            activities: ["Airport transfer", "Hotel check-in", "Welcome dinner", "Tour briefing"]
          },
          {
            title: "Pyramids of Giza & Sphinx Discovery",
            location: "Giza",
            description: "Begin your Egyptian odyssey with a private tour of the legendary Pyramids of Giza. Explore the Great Pyramid, one of the Seven Wonders of the Ancient World, and come face-to-face with the enigmatic Sphinx. Your expert Egyptologist will reveal the secrets and mysteries of these 4,500-year-old monuments.",
            activities: ["Great Pyramid exploration", "Sphinx visit", "Pyramid complex tour", "Camel ride experience"]
          }
        ];

        // Add Cairo days
        if (cairoNights > 1) {
          itinerary.push({
            title: "Egyptian Museum & Islamic Cairo",
            location: "Cairo",
            description: "Discover the world's most extensive collection of ancient Egyptian artifacts at the Egyptian Museum, including treasures from Tutankhamun's tomb. Afternoon exploration of Islamic Cairo, visiting the Citadel of Saladin, Mohammed Ali Mosque, and wandering through the vibrant Khan El Khalili bazaar.",
            activities: ["Egyptian Museum tour", "Tutankhamun treasures", "Citadel of Saladin", "Khan El Khalili shopping"]
          });
        }

        // Add transfer day
        itinerary.push({
          title: `Transfer to ${dahabiyaName} - Begin Nile Adventure`,
          location: "Luxor/Aswan",
          description: `Transfer to embark on your luxury dahabiya ${dahabiyaName}. Welcome aboard ceremony with traditional Egyptian music and refreshments. Settle into your elegant cabin and enjoy your first sunset on the Nile with cocktails on deck.`,
          activities: ["Dahabiya embarkation", "Welcome ceremony", "Cabin orientation", "Sunset cocktails"]
        });

        // Add dahabiya days
        for (let i = 0; i < dahabiyaNights - 1; i++) {
          const temples = ["Edfu Temple", "Kom Ombo Temple", "Philae Temple", "Karnak Temple"];
          const locations = ["Edfu", "Kom Ombo", "Aswan", "Luxor"];
          
          itinerary.push({
            title: `${temples[i % temples.length]} & Nile Sailing`,
            location: locations[i % locations.length],
            description: `Morning visit to the magnificent ${temples[i % temples.length]}, one of Egypt's best-preserved ancient monuments. Learn about ancient Egyptian mythology and religious practices. Afternoon sailing along the Nile, enjoying the peaceful rhythm of traditional dahabiya travel while watching rural Egyptian life unfold along the riverbanks.`,
            activities: [`${temples[i % temples.length]} tour`, "Nile sailing", "Village visits", "Traditional music evening"]
          });
        }

        // Add final day
        itinerary.push({
          title: "Farewell & Departure",
          location: "Luxor/Aswan",
          description: "Final breakfast aboard your dahabiya with panoramic Nile views. Disembarkation and transfer to the airport for your departure, carrying with you unforgettable memories of Egypt's ancient wonders and the timeless beauty of the Nile.",
          activities: ["Final breakfast", "Disembarkation", "Airport transfer", "Departure"]
        });
      }

      // Similar logic for other package types...
      if (packageType === "CAIRO_GIZA_DAHABIYA") {
        shortDescription = `The ultimate Egyptian experience combining ${cairoNights} nights exploring Cairo and Giza's wonders with ${dahabiyaNights} nights of luxury Nile cruising aboard ${dahabiyaName}.`;
        
        description = `Immerse yourself in the complete Egyptian experience with this comprehensive ${totalDays}-day journey. Explore both Cairo's Islamic treasures and Giza's ancient pyramids before embarking on a luxury Nile cruise aboard ${dahabiyaName}. This premium package offers the perfect introduction to Egypt's diverse cultural heritage, from bustling metropolitan life to serene river cruising, ensuring you experience every facet of this magnificent country.`;

        highlights = [
          "Comprehensive Cairo and Giza exploration",
          "Private Egyptologist throughout the journey",
          "Exclusive pyramid complex access",
          "Islamic Cairo cultural immersion",
          `Premium ${dahabiyaName} cruise experience`,
          "Traditional dahabiya sailing",
          "Gourmet Egyptian cuisine",
          "Luxury accommodations throughout",
          "Professional photography sessions",
          "Cultural workshops and demonstrations"
        ];
      }

      return {
        description,
        shortDescription,
        highlights,
        itinerary
      };
    };

    const content = generatePackageContent({
      packageName,
      dahabiyaName,
      cairoNights,
      dahabiyaNights,
      totalDays,
      packageType
    });

    return NextResponse.json(content);

  } catch (error) {
    console.error('AI content generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}


