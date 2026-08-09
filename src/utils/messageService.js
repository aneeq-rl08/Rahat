import messagesData from '../data/messages.json';


// Response validation function
function validateResponse(data, topic, subTopic = null) {
  if (!data || typeof data !== 'object') {
    return false;
  }

  try {
    if (topic === 'mood' && subTopic) {
      // Must have dua and message
      if (!data.dua || !data.message) return false;

      // Dua must have arabic, english, urdu
      if (!data.dua.arabic || !data.dua.english || !data.dua.urdu) return false;

      // Message must have english and urdu
      if (!data.message.english || !data.message.urdu) return false;

      // Basic content validation (not empty, reasonable length)
      if (data.dua.arabic.trim().length < 5) return false;
      if (data.dua.english.trim().length < 10) return false;
      if (data.dua.urdu.trim().length < 5) return false;
      if (data.message.english.trim().length < 10) return false;
      if (data.message.urdu.trim().length < 5) return false;

      return true;
    }

    if (topic === 'study') {
      // Must have tip, ayah, motivational
      if (!data.tip || !data.ayah || !data.motivational) return false;

      // Validate each field structure
      if (!data.tip.english || !data.tip.urdu) return false;
      if (!data.ayah.arabic || !data.ayah.english || !data.ayah.urdu) return false;
      if (!data.motivational.english || !data.motivational.urdu) return false;

      // Basic content validation
      if (data.tip.english.trim().length < 10) return false;
      if (data.ayah.arabic.trim().length < 5) return false;
      if (data.ayah.english.trim().length < 10) return false;
      if (data.motivational.english.trim().length < 10) return false;

      return true;
    }

    if (topic === 'wish' && subTopic) {
      // Must have title and blessing
      if (!data.title || !data.blessing) return false;

      // Blessing must have english and urdu
      if (!data.blessing.english || !data.blessing.urdu) return false;

      // Basic content validation
      if (data.title.trim().length < 2) return false;
      if (data.blessing.english.trim().length < 10) return false;
      if (data.blessing.urdu.trim().length < 5) return false;

      return true;
    }

    return false;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
}

// Layer 0: Pre-generated JSON (always available)
function getRandomFromJSON(topic, subTopic = null) {
  try {
    let data;

    if (topic === 'mood' && subTopic) {
      data = messagesData.moods[subTopic];
      if (!data) return null;

      const randomDua = data.duas[Math.floor(Math.random() * data.duas.length)];
      const randomMessage = data.messages[Math.floor(Math.random() * data.messages.length)];

      return {
        dua: randomDua, // { arabic, english, urdu }
        message: randomMessage, // { english, urdu }
        source: 'json'
      };
    }

    if (topic === 'study') {
      const randomTip = messagesData.study.tips[Math.floor(Math.random() * messagesData.study.tips.length)];
      const randomAyah = messagesData.study.ayahs[Math.floor(Math.random() * messagesData.study.ayahs.length)];
      const randomMotivational = messagesData.study.motivational[Math.floor(Math.random() * messagesData.study.motivational.length)];

      return {
        tip: randomTip, // { english, urdu }
        ayah: randomAyah, // { arabic, english, urdu }
        motivational: randomMotivational, // { english, urdu }
        source: 'json'
      };
    }

    if (topic === 'wish' && subTopic) {
      data = messagesData.wishes[subTopic];
      if (!data) return null;

      const randomBlessing = data.blessings[Math.floor(Math.random() * data.blessings.length)];

      return {
        title: data.title,
        blessing: randomBlessing, // { english, urdu }
        source: 'json'
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting message from JSON:', error);
    return null;
  }
}



// Layer 1: Gemini API (if available)
async function getFromGemini(topic, subTopic = null) {
  try {
    // Check if Gemini API is configured
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!geminiApiKey) {
      return null;
    }

    // Check if online
    if (!navigator.onLine) {
      return null;
    }

    // Get example from JSON to use as context
    const jsonExample = getRandomFromJSON(topic, subTopic);

    let prompt = '';
    if (topic === 'mood' && subTopic) {
      prompt = `Generate a response in JSON format matching this structure:
{
  "dua": {
    "arabic": "Arabic dua text (1-2 lines)",
    "english": "English translation",
    "urdu": "Urdu translation"
  },
  "message": {
    "english": "Supportive message in English",
    "urdu": "Supportive message in Urdu"
  }
}

Example format:
${JSON.stringify(jsonExample, null, 2)}

Generate a NEW Islamic dua and supportive message for someone who is ${subTopic}. Keep it halal, positive, and safe. Return ONLY valid JSON, no additional text.`;
    } else if (topic === 'study') {
      prompt = `Generate a response in JSON format matching this structure:
{
  "tip": {
    "english": "Study tip in English",
    "urdu": "Study tip in Urdu"
  },
  "ayah": {
    "arabic": "Quranic ayah in Arabic",
    "english": "English translation",
    "urdu": "Urdu translation"
  },
  "motivational": {
    "english": "Motivational message in English",
    "urdu": "Motivational message in Urdu"
  }
}

Example format:
${JSON.stringify(jsonExample, null, 2)}

Generate a NEW study tip, Quranic ayah, and motivational message. Keep it halal and positive. Return ONLY valid JSON, no additional text.`;
    } else if (topic === 'wish' && subTopic) {
      const wishType = subTopic === 'white' ? 'dua' : subTopic === 'yellow' ? 'positivity' : 'motivation';
      prompt = `Generate a response in JSON format matching this structure:
{
  "title": "${wishType === 'dua' ? 'Dua' : wishType === 'positivity' ? 'Positivity' : 'Motivation'}",
  "blessing": {
    "english": "Blessing in English",
    "urdu": "Blessing in Urdu"
  }
}

Example format:
${JSON.stringify(jsonExample, null, 2)}

Generate a NEW ${wishType} blessing. Keep it halal, positive, and safe. Return ONLY valid JSON, no additional text.`;
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // Parse Gemini response
    try {
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!text) {
        return null;
      }

      // Try to extract JSON from response (might be wrapped in markdown code blocks)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsedData = JSON.parse(jsonMatch[0]);
          parsedData.source = 'gemini';
          return parsedData;
  } catch (_error) {
          // JSON parsing failed, try to extract structured data manually
          console.warn('Failed to parse JSON from Gemini response, attempting text extraction');
        }
      }

      // If JSON parsing failed, return null to fallback to JSON
      return null;
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      return null;
    }
  } catch (error) {
    console.error('Error getting message from Gemini:', error);
    return null;
  }
}



/**
 * Initialize all available LLM services
 * Call this at app startup
 * @returns {Promise<object>} Status of each layer
 */
export async function initializeLLMs() {
  const status = {
    browserLLM: false,
    localLLM: false,
    gemini: false
  };

  return status;
}

// Main function: Check in order: Browser LLM → Local Server → Gemini → JSON
// Main function: Check in order: Gemini → JSON
export async function getMessage(topic, subTopic = null) {
  // Try Gemini first (Layer 1)
  const geminiResult = await getFromGemini(topic, subTopic);
  if (geminiResult) {
    // Validate the parsed response
    if (validateResponse(geminiResult, topic, subTopic)) {
      console.log('Using Gemini API for:', topic, subTopic);
      return geminiResult;
    } else {
      console.warn('Gemini response failed validation, falling back to JSON');
    }
  }

  // Fallback to JSON (always works)
  const jsonResult = getRandomFromJSON(topic, subTopic);
  console.log('Using JSON fallback for:', topic, subTopic);
  return jsonResult;
}

// Synchronous version for immediate use (JSON only)
export function getMessageSync(topic, subTopic = null) {
  return getRandomFromJSON(topic, subTopic);
}

// Check if browser LLM is ready
export function isBrowserLLMReady() {
  return false;
}

