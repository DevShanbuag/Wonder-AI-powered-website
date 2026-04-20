import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/src/utils/supabase/server';
import { cookies } from 'next/headers';
import { mockListings } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

// Simple mapping for AI route to avoid complex imports
function mapDbToAiListing(data: any) {
  return {
    id: data.id,
    title: data.title,
    image: data.image,
    price: data.price,
    location: data.location,
    category: data.category,
    avgRating: Number(data.avg_rating) || 0,
  };
}

const systemPrompt = `
You are a filter extraction assistant for a resort booking platform. 

Your job is ONLY to extract search filters from the user message. 

Return JSON only. 

Do NOT recommend resorts. 

Fields you can extract: 
- location: string | null (e.g., "Goa", "Manali")
- category: string | null (MUST be one of ["BeachFront", "Mountain", "Hill Station", "Treehouse", "Island", "Desert", "Others"])
- max_price: number | null
- guests: number | null
- amenities: string[] | null

Return format: 
{ 
  "response": "A friendly 1-2 sentence concierge-style response acknowledging their request.",
  "filters": {
    "location": string | null, 
    "category": string | null, 
    "max_price": number | null, 
    "guests": number | null, 
    "amenities": string[] | null 
  }
}
`;

function extractFiltersManually(message: string) {
  const text = message.toLowerCase();
  const filters: any = {
    location: null,
    category: null,
    max_price: null,
    guests: null,
    amenities: null
  };

  // Basic Location extraction
  const locations = ["goa", "manali", "kerala", "mumbai", "delhi", "jaipur", "udaipur", "shimla", "wayanad", "coorg"];
  for (const loc of locations) {
    if (text.includes(loc)) {
      filters.location = loc.charAt(0).toUpperCase() + loc.slice(1);
      break;
    }
  }

  // Basic Category extraction
  const categories = {
    "beach": "BeachFront",
    "sea": "BeachFront",
    "mountain": "Mountain",
    "hill": "Hill Station",
    "treehouse": "Treehouse",
    "island": "Island",
    "desert": "Desert"
  };
  for (const [key, val] of Object.entries(categories)) {
    if (text.includes(key)) {
      filters.category = val;
      break;
    }
  }

  // Price extraction
  const priceMatch = text.match(/(?:under|below|less than|max|maximum)\s*(?:rs\.?|inr)?\s*(\d+)/i) || 
                     text.match(/(\d+)\s*(?:budget|price|max)/i);
  if (priceMatch) {
    filters.max_price = parseInt(priceMatch[1]);
  }

  // Guests extraction
  const guestMatch = text.match(/(\d+)\s*(?:people|person|guests|adults)/i);
  if (guestMatch) {
    filters.guests = parseInt(guestMatch[1]);
  }

  return filters;
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const serverSupabase = createClient(cookieStore);
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const body = await req.json();
    const { message, filters: directFilters } = body;

    if (!message && !directFilters) {
      return NextResponse.json({ error: 'Message or filters are required' }, { status: 400 });
    }

    let filters = directFilters;
    let aiResponse = "I've searched our collection for the perfect stay for you.";

    if (message) {
      try {
        const result = await model.generateContent([systemPrompt, message]);
        const response = await result.response;
        let text = await response.text();
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const aiOutput = JSON.parse(jsonMatch[0]);
          filters = aiOutput.filters;
          aiResponse = aiOutput.response;
        } else {
          throw new Error('Failed to extract JSON from AI response');
        }
      } catch (aiError) {
        console.warn('Gemini API failed, falling back to keyword extraction:', aiError.message);
        filters = extractFiltersManually(message);
        aiResponse = "I'm currently operating in basic search mode, but I've found these resorts for you!";
      }
    }

    if (!filters) {
      return NextResponse.json({ error: 'No filters provided or extracted' }, { status: 400 });
    }

    let resorts: any[] = [];
    
    // Search Logic
    const searchResorts = async () => {
      if (!serverSupabase) throw new Error("Supabase client not initialized");
      let query = serverSupabase.from('resorts').select('*');

      if (filters && typeof filters === 'object') {
        if (filters.location) {
          query = query.ilike('location', `%${filters.location}%`);
        }
        if (filters.category) {
          query = query.eq('category', filters.category);
        }
        if (filters.max_price) {
          query = query.lte('price', filters.max_price);
        }
        if (filters.guests) {
          query = query.gte('capacity_guests', filters.guests);
        }
        if (filters.amenities && Array.isArray(filters.amenities) && filters.amenities.length > 0) {
          query = query.contains('amenities', filters.amenities);
        }
      }

      query = query.order('avg_rating', { ascending: false }).order('price', { ascending: true });

      const { data, error } = await query.limit(5);
      if (error) throw error;
      return (data || []) as any[];
    };

    try {
      resorts = await searchResorts();
      if (resorts.length > 0) {
        resorts = resorts.map(mapDbToAiListing);
      }
    } catch (err) {
      console.error('Supabase query failed:', err);
      return NextResponse.json({ 
        message: "There was an issue searching our collection. Please try again.", 
        resorts: [] 
      });
    }

    if (resorts.length === 0) {
      // If no results for specific filters, show top picks
      const { data: topPicks } = await serverSupabase
        .from('resorts')
        .select('*')
        .order('avg_rating', { ascending: false })
        .limit(3);
        
      return NextResponse.json({ 
        message: "I couldn't find an exact match for that specific request, but I highly recommend these top-rated stays!", 
        resorts: (topPicks || []).map(mapDbToAiListing)
      });
    }

    return NextResponse.json({ message: aiResponse, resorts });
  } catch (error) {
    console.error('Error in AI Search POST handler:', error);
    return NextResponse.json({ 
      message: "An unexpected error occurred. Please try again later.", 
      resorts: []
    });
  }
}
