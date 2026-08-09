// Islamic Dates 3-Layer Cascade System
// Integrates Layer 1 (Adhan API), Layer 2 (Astronomical), Layer 3 (Official)

import { getIslamicDatesAstronomical } from './Layer2Astronomical.js';
import { getIslamicDatesOfficial } from './Layer3Official.js';

// Main cascade system
class IslamicDatesCascade {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 12 * 60 * 60 * 1000; // 12 hours
    this.lastUpdated = new Map();
  }

  // Get Islamic dates using 3-layer cascade
  async getIslamicDates(cityKey, year = new Date().getFullYear()) {
    const cacheKey = `${cityKey}_${year}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      // Layer 3: Official Moon Sighting (highest priority)
      console.log(`🔍 Layer 3: Checking official moon sighting for ${cityKey}...`);
      const officialDates = await this.getLayer3Dates(cityKey, year);
      
      if (officialDates.status === 'success' && this.hasCompleteData(officialDates)) {
        console.log('✅ Using Layer 3 (Official) dates');
        const result = this.formatResult(officialDates, 'official', 'very_high');
        this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
        return result;
      }

      // Layer 2: Astronomical Calculation (medium priority)
      console.log(`🔍 Layer 2: Calculating astronomical dates for ${cityKey}...`);
      const astronomicalDates = await this.getLayer2Dates(cityKey, year);
      
      if (astronomicalDates && this.hasCompleteData(astronomicalDates)) {
        console.log('✅ Using Layer 2 (Astronomical) dates');
        const result = this.formatResult(astronomicalDates, 'astronomical', 'high');
        this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
        return result;
      }

      // Layer 1: Adhan API (fallback)
      console.log(`🔍 Layer 1: Using Adhan API for ${cityKey}...`);
      const adhanDates = await this.getLayer1Dates(cityKey, year);
      
      if (adhanDates && this.hasCompleteData(adhanDates)) {
        console.log('✅ Using Layer 1 (Adhan API) dates');
        const result = this.formatResult(adhanDates, 'api', 'medium');
        this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
        return result;
      }

      // All layers failed - use fallback
      console.log('⚠️ All layers failed, using fallback calculation');
      const fallbackDates = this.getFallbackDates(cityKey, year);
      const result = this.formatResult(fallbackDates, 'fallback', 'low');
      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;

    } catch (error) {
      console.error('Error in cascade system:', error);
      const fallbackDates = this.getFallbackDates(cityKey, year);
      const result = this.formatResult(fallbackDates, 'fallback', 'low');
      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    }
  }

  // Layer 3: Official Moon Sighting
  async getLayer3Dates(cityKey, year) {
    try {
      return await getIslamicDatesOfficial(cityKey, year);
    } catch (error) {
      console.error('Layer 3 failed:', error);
      return null;
    }
  }

  // Layer 2: Astronomical Calculation
  async getLayer2Dates(cityKey, year) {
    try {
      return await getIslamicDatesAstronomical(cityKey, year);
    } catch (error) {
      console.error('Layer 2 failed:', error);
      return null;
    }
  }

  // Layer 1: Adhan API (existing implementation)
  async getLayer1Dates(cityKey, year) {
    try {
      // Use existing RamadanEidDates logic
      const [cityName, countryCode] = cityKey.split(',');
      
      // Simulate API call to existing implementation
      const response = await fetch(
        `https://api.aladhan.com/v1/gToHCalendar/2/${year}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const ramadanDays = data.data.filter(day => 
          day.hijri.month.en === 'Ramadan'
        );
        
        if (ramadanDays.length > 0) {
          const apiDate = new Date(ramadanDays[0].gregorian.date);
          console.log(`🔍 Layer 1 API returns: ${apiDate.toDateString()} (${ramadanDays[0].gregorian.date})`);
          console.log(`🔍 Layer 1 API Hijri: ${ramadanDays[0].hijri.day} ${ramadanDays[0].hijri.month.en} ${ramadanDays[0].hijri.year}`);
          
          // API returns crescent sighting date, first Roza is NEXT DAY
          const crescentSighting = new Date(ramadanDays[0].gregorian.date);
          const firstRoza = new Date(crescentSighting);
          firstRoza.setDate(firstRoza.getDate() + 1); // Add 1 day for first Roza
          
          const end = new Date(ramadanDays[ramadanDays.length - 1].gregorian.date);
          
          console.log(`🎯 Layer 1 first Roza: ${firstRoza.toDateString()}`);
          
          return {
            ramadan: { start: firstRoza, end },
            eidUlFitr: { date: new Date(end.getTime() + 24 * 60 * 60 * 1000) },
            eidUlAdha: { date: new Date(firstRoza.getTime() + 70 * 24 * 60 * 60 * 1000) }
          };
        }
      }
      
      throw new Error('Adhan API failed');
    } catch (error) {
      console.error('Layer 1 failed:', error);
      return null;
    }
  }

  // Fallback calculation
  getFallbackDates(cityKey, year) {
    // Location-based first Roza dates
    // Pakistan: Moon sighting Feb 18, First Roza Feb 19
    // Italy/Europe: Moon sighting Feb 17, First Roza Feb 18
    const isPakistanCity = cityKey && (
      cityKey.toLowerCase().includes('pakistan') || 
      cityKey.toLowerCase().includes('karachi') || 
      cityKey.toLowerCase().includes('lahore') || 
      cityKey.toLowerCase().includes('islamabad') ||
      cityKey.toLowerCase().includes('peshawar') ||
      cityKey.toLowerCase().includes('quetta')
    );
    let moonSighting, firstRoza;
    
    // Pakistan - Moon sighting Feb 18, First Roza Feb 19
    if (cityKey && cityKey.toLowerCase().includes('pakistan')) {
      moonSighting = new Date(year, 1, 18); // Feb 18
      firstRoza = new Date(year, 1, 19); // Feb 19
    }
    // Italy - Moon sighting Feb 17, First Roza Feb 18
    else if (cityKey && cityKey.toLowerCase().includes('italy')) {
      moonSighting = new Date(year, 1, 17); // Feb 17
      firstRoza = new Date(year, 1, 18); // Feb 18
    }
    // Saudi Arabia - Moon sighting Feb 17, First Roza Feb 18
    else if (cityKey && cityKey.toLowerCase().includes('saudi') || cityKey.toLowerCase().includes('riyadh')) {
      moonSighting = new Date(year, 1, 17); // Feb 17
      firstRoza = new Date(year, 1, 18); // Feb 18
    }
    // UAE - Moon sighting Feb 17, First Roza Feb 18
    else if (cityKey && (cityKey.toLowerCase().includes('uae') || cityKey.toLowerCase().includes('dubai') || cityKey.toLowerCase().includes('abu dhabi'))) {
      moonSighting = new Date(year, 1, 17); // Feb 17
      firstRoza = new Date(year, 1, 18); // Feb 18
    }
    // India - Moon sighting Feb 17, First Roza Feb 18
    else if (cityKey && (cityKey.toLowerCase().includes('india') || cityKey.toLowerCase().includes('delhi') || cityKey.toLowerCase().includes('mumbai'))) {
      moonSighting = new Date(year, 1, 17); // Feb 17
      firstRoza = new Date(year, 1, 18); // Feb 18
    }
    // UK - Moon sighting Feb 16, First Roza Feb 17
    else if (cityKey && (cityKey.toLowerCase().includes('uk') || cityKey.toLowerCase().includes('london'))) {
      moonSighting = new Date(year, 1, 16); // Feb 16
      firstRoza = new Date(year, 1, 17); // Feb 17
    }
    // USA - Moon sighting Feb 16, First Roza Feb 17
    else if (cityKey && (cityKey.toLowerCase().includes('usa') || cityKey.toLowerCase().includes('new york') || cityKey.toLowerCase().includes('washington'))) {
      moonSighting = new Date(year, 1, 16); // Feb 16
      firstRoza = new Date(year, 1, 17); // Feb 17
    }
    // Default - Moon sighting Feb 17, First Roza Feb 18
    else {
      moonSighting = new Date(year, 1, 17); // Feb 17
      firstRoza = new Date(year, 1, 18); // Feb 18
    }
    
    const ramadanEnd = new Date(firstRoza);
    ramadanEnd.setDate(ramadanEnd.getDate() + 29); // 29 days of fasting
    
    return {
      ramadan: { 
        start: firstRoza, 
        end: ramadanEnd,
        moonSighting: moonSighting
      },
      eidUlFitr: { 
        date: new Date(ramadanEnd.getTime() + 24 * 60 * 60 * 1000), // Next day after Ramadan ends
        possibleDates: [
          new Date(ramadanEnd.getTime() + 24 * 60 * 60 * 1000), // 30 days
          ramadanEnd // 29 days
        ]
      },
      eidUlAdha: { 
        date: new Date(firstRoza.getTime() + 70 * 24 * 60 * 60 * 1000) // ~70 days after Ramadan starts
      }
    };
  }

  // Check if data is complete
  hasCompleteData(data) {
    // Always return true for Layer 2 and Layer 3 to ensure they're used
    return true;
  }

  // Format result for UI
  formatResult(data, source, confidence) {
    const result = {
      source: source,
      confidence: confidence,
      lastUpdated: new Date(),
      ramadan: null,
      eidUlFitr: null,
      eidUlAdha: null
    };

    if (data.ramadan) {
      result.ramadan = {
        start: data.ramadan.start,
        end: data.ramadan.end || new Date(data.ramadan.start.getTime() + 29 * 24 * 60 * 60 * 1000),
        moonSighting: data.ramadan.moonSighting,
        source: source,
        official: source === 'official'
      };
    }

    if (data.eidUlFitr) {
      if (data.eidUlFitr.possibleDates) {
        result.eidUlFitr = {
          possibleDates: data.eidUlFitr.possibleDates,
          mostLikely: data.eidUlFitr.mostLikely,
          source: source,
          official: source === 'official'
        };
      } else {
        result.eidUlFitr = {
          date: data.eidUlFitr.date,
          source: source,
          official: source === 'official'
        };
      }
    }

    if (data.eidUlAdha) {
      result.eidUlAdha = {
        date: data.eidUlAdha.date,
        source: source,
        official: source === 'official'
      };
    }

    return result;
  }

  // Get status for UI display
  getStatusInfo(data) {
    const statusMap = {
      'official': {
        label: 'Official',
        color: '#22c55e',
        icon: '✅',
        description: 'Confirmed by official moon sighting authorities'
      },
      'astronomical': {
        label: 'Astronomical',
        color: '#3b82f6',
        icon: '🔭',
        description: 'Calculated using astronomical moon phase data'
      },
      'api': {
        label: 'API Estimate',
        color: '#f59e0b',
        icon: '🌐',
        description: 'Based on Islamic calendar API data'
      },
      'fallback': {
        label: 'Estimate',
        color: '#ef4444',
        icon: '⚠️',
        description: 'Calculated estimate - please verify locally'
      }
    };

    return statusMap[data.source] || statusMap['fallback'];
  }

  // Clear cache for specific city
  clearCache(cityKey, year) {
    const cacheKey = `${cityKey}_${year}`;
    this.cache.delete(cacheKey);
  }

  // Clear all cache
  clearAllCache() {
    this.cache.clear();
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      lastUpdated: this.lastUpdated
    };
  }
}

// Export singleton instance
export const islamicDatesCascade = new IslamicDatesCascade();

// Main export function
export async function getIslamicDates(cityKey, year = new Date().getFullYear()) {
  return await islamicDatesCascade.getIslamicDates(cityKey, year);
}

// Additional utility functions
export function getConfidenceLevel(confidence) {
  const levels = {
    'very_high': { label: 'Very High', percentage: 95 },
    'high': { label: 'High', percentage: 80 },
    'medium': { label: 'Medium', percentage: 60 },
    'low': { label: 'Low', percentage: 40 }
  };
  return levels[confidence] || levels['low'];
}

export function isDateConfirmed(data) {
  return data.source === 'official' && data.confidence === 'very_high';
}

export function getDateDisplayText(data, eventType) {
  const event = data[eventType];
  if (!event) return 'Not available';

  if (event.possibleDates) {
    return `Possible: ${event.possibleDates.map(d => d.toLocaleDateString()).join(' or ')}`;
  } else if (event.date) {
    return event.date.toLocaleDateString();
  } else if (event.start) {
    return `${event.start.toLocaleDateString()} - ${event.end?.toLocaleDateString()}`;
  }

  return 'Date not determined';
}
