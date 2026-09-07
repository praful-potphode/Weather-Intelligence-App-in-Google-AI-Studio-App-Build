import {
  WeatherData,
  WeatherIntelligenceReport,
  ActivityScore,
  WardrobeRecommendation,
  WeatherAlert,
  OutdoorWindow,
} from '../types/weather';

export function generateWeatherIntelligence(data: WeatherData): WeatherIntelligenceReport {
  const { current, hourly, daily, units } = data;
  const isMetric = units.temperature === '°C';

  // Normalized temperature in Celsius for consistent internal thresholds
  const tempC = isMetric ? current.temperature : ((current.temperature - 32) * 5) / 9;
  const feelsLikeC = isMetric ? current.apparentTemperature : ((current.apparentTemperature - 32) * 5) / 9;
  const windKmh = units.windSpeed === 'km/h' ? current.windSpeed : current.windSpeed * 1.60934;
  const rainProbMaxToday = daily[0]?.precipitationProbabilityMax ?? 0;
  const rainSumToday = daily[0]?.precipitationSum ?? 0;
  const uvMaxToday = daily[0]?.uvIndexMax ?? current.uvIndex;

  // 1. Overall condition summary
  let overallConditionSummary = '';
  if (current.weatherCode >= 95) {
    overallConditionSummary = `Severe thunderstorm conditions active in ${data.city.name}. Outdoor events and open field travel are strongly discouraged.`;
  } else if (current.weatherCode >= 61 && current.weatherCode <= 67) {
    overallConditionSummary = `Rainy conditions across ${data.city.name} with wet surfaces. Commuting and outdoor activities require waterproof gear.`;
  } else if (tempC >= 30) {
    overallConditionSummary = `Hot and humid conditions reaching ${current.temperature}${units.temperature}. Hydration and shade planning are recommended for all daylight activities.`;
  } else if (tempC <= 5) {
    overallConditionSummary = `Chilly conditions at ${current.temperature}${units.temperature}. Heavy thermal layering is advised for any sustained outdoor exposure.`;
  } else if (rainProbMaxToday <= 20 && windKmh <= 20) {
    overallConditionSummary = `Favorable, calm weather in ${data.city.name}. Outstanding window for active sports, patio dining, and outdoor recreation.`;
  } else {
    overallConditionSummary = `Moderate seasonal weather in ${data.city.name}. Variable conditions with a ${rainProbMaxToday}% chance of precipitation today.`;
  }

  // 2. Best Outdoor Window calculation
  const daytimeHours = hourly.filter((h) => {
    const hour = new Date(h.time).getHours();
    return hour >= 7 && hour <= 20;
  });

  let bestWindow: OutdoorWindow = {
    title: 'Peak Outdoor Opportunity',
    timeRange: 'Morning to Early Afternoon',
    description: 'Optimal ambient temperature with minimal rain probability.',
    suitabilityScore: 85,
  };

  if (daytimeHours.length > 0) {
    // Score each daytime hour
    const scoredHours = daytimeHours.map((h) => {
      const hTempC = isMetric ? h.temperature : ((h.temperature - 32) * 5) / 9;
      let score = 100;
      // Penalize extreme temp
      if (hTempC < 14) score -= (14 - hTempC) * 3;
      if (hTempC > 26) score -= (hTempC - 26) * 3.5;
      // Penalize rain
      score -= h.precipitationProbability * 0.7;
      // Penalize wind
      const hWindKmh = units.windSpeed === 'km/h' ? h.windSpeed : h.windSpeed * 1.60934;
      if (hWindKmh > 20) score -= (hWindKmh - 20) * 1.5;
      return { hour: h, score: Math.max(10, Math.min(100, Math.round(score))) };
    });

    // Find best contiguous 3-hour cluster
    let bestStartIndex = 0;
    let maxClusterScore = -1;
    for (let i = 0; i <= scoredHours.length - 3; i++) {
      const clusterAvg = (scoredHours[i].score + scoredHours[i + 1].score + scoredHours[i + 2].score) / 3;
      if (clusterAvg > maxClusterScore) {
        maxClusterScore = clusterAvg;
        bestStartIndex = i;
      }
    }

    if (maxClusterScore > 0 && scoredHours[bestStartIndex]) {
      const startHour = scoredHours[bestStartIndex].hour.hourLabel;
      const endHour = scoredHours[Math.min(scoredHours.length - 1, bestStartIndex + 3)].hour.hourLabel;
      bestWindow = {
        title: 'Prime Outdoor Window',
        timeRange: `${startHour} – ${endHour}`,
        description: `Best weather conditions of the day: ~${scoredHours[bestStartIndex].hour.temperature}${units.temperature} with ${scoredHours[bestStartIndex].hour.precipitationProbability}% rain chance.`,
        suitabilityScore: Math.round(maxClusterScore),
      };
    }
  }

  // 3. Activity Scores
  // Running
  let runningScore = 95;
  const runningTips: string[] = [];
  if (tempC > 24) {
    runningScore -= (tempC - 24) * 4;
    runningTips.push('Higher heat stress; hydrate every 15-20 minutes.');
  } else if (tempC < 8) {
    runningScore -= (8 - tempC) * 3;
    runningTips.push('Cold air intake; wear a windbreaker and thermal base.');
  } else {
    runningTips.push('Ideal running temperatures for aerobic training.');
  }
  if (rainProbMaxToday > 30) {
    runningScore -= rainProbMaxToday * 0.4;
    runningTips.push('Pavements may be slick; choose high-traction footwear.');
  }
  if (windKmh > 25) {
    runningScore -= (windKmh - 25) * 1.2;
    runningTips.push('Brisk headwinds present; plan a sheltered running route.');
  }
  runningScore = Math.max(15, Math.min(100, Math.round(runningScore)));

  // Cycling / Commute
  let cyclingScore = 92;
  const cyclingTips: string[] = [];
  if (windKmh > 20) {
    cyclingScore -= (windKmh - 20) * 2;
    cyclingTips.push(`Gusts up to ${current.windSpeed} ${units.windSpeed}; secure loose gear.`);
  } else {
    cyclingTips.push('Gentle wind profiles favorable for bike handling.');
  }
  if (rainProbMaxToday > 35) {
    cyclingScore -= 30;
    cyclingTips.push('Rain risk requires wet-weather brakes and fenders.');
  }
  if (tempC < 5) {
    cyclingScore -= 20;
    cyclingTips.push('Wear windproof cycling gloves and thermal shoe covers.');
  }
  cyclingScore = Math.max(10, Math.min(100, Math.round(cyclingScore)));

  // Outdoor Dining / Patio
  let diningScore = 90;
  const diningTips: string[] = [];
  if (tempC < 16) {
    diningScore -= (16 - tempC) * 5;
    diningTips.push('Chilly patio ambient; request heated seating or patio heaters.');
  } else if (tempC > 29) {
    diningScore -= (tempC - 29) * 4;
    diningTips.push('High afternoon heat; opt for shaded dining spots.');
  } else {
    diningTips.push('Pleasant outdoor temperature for sidewalk cafes and patios.');
  }
  if (rainProbMaxToday > 25) {
    diningScore -= rainProbMaxToday * 0.6;
    diningTips.push('Passing showers possible; prefer covered outdoor tables.');
  }
  if (windKmh > 24) {
    diningScore -= 25;
    diningTips.push('Breezy conditions; napkins and lightweight table items may blow.');
  }
  diningScore = Math.max(10, Math.min(100, Math.round(diningScore)));

  // Hiking & Nature Trails
  let hikingScore = 88;
  const hikingTips: string[] = [];
  if (current.weatherCode >= 51) {
    hikingScore -= 35;
    hikingTips.push('Active precipitation makes rocky and clay trails muddy.');
  } else if (rainProbMaxToday > 40) {
    hikingScore -= 20;
    hikingTips.push('Pack a packable waterproof shell in your daypack.');
  } else {
    hikingTips.push('Dry trail surfaces expected with firm footings.');
  }
  if (uvMaxToday >= 6) {
    hikingTips.push(`UV reaches ${uvMaxToday}; pack broad-spectrum sunscreen and hat.`);
  }
  hikingScore = Math.max(15, Math.min(100, Math.round(hikingScore)));

  // Stargazing / Astronomy
  let stargazingScore = 85;
  const stargazingTips: string[] = [];
  if (current.cloudCover > 50) {
    stargazingScore -= current.cloudCover * 0.7;
    stargazingTips.push(`${current.cloudCover}% cloud cover limits celestial visibility.`);
  } else {
    stargazingTips.push('Clear sky visibility ideal for stars and constellations.');
  }
  if (current.relativeHumidity > 85) {
    stargazingTips.push('High humidity; dew formation on telescope lenses likely.');
  }
  stargazingScore = Math.max(10, Math.min(100, Math.round(stargazingScore)));

  const getStatus = (score: number): 'Optimal' | 'Good' | 'Fair' | 'Poor' => {
    if (score >= 80) return 'Optimal';
    if (score >= 65) return 'Good';
    if (score >= 45) return 'Fair';
    return 'Poor';
  };

  const activities: ActivityScore[] = [
    {
      id: 'running',
      name: 'Running & Jogging',
      category: 'fitness',
      score: runningScore,
      status: getStatus(runningScore),
      icon: 'Activity',
      summary: runningScore >= 75 ? 'Excellent running conditions' : 'Moderate conditions; adjust pace',
      tips: runningTips,
    },
    {
      id: 'cycling',
      name: 'Cycling & Commuting',
      category: 'travel',
      score: cyclingScore,
      status: getStatus(cyclingScore),
      icon: 'Bike',
      summary: cyclingScore >= 75 ? 'Smooth cycling conditions' : 'Wind or rain impact expected',
      tips: cyclingTips,
    },
    {
      id: 'dining',
      name: 'Outdoor Dining & Patios',
      category: 'leisure',
      score: diningScore,
      status: getStatus(diningScore),
      icon: 'Coffee',
      summary: diningScore >= 75 ? 'Delightful patio atmosphere' : 'Covered or heated space suggested',
      tips: diningTips,
    },
    {
      id: 'hiking',
      name: 'Hiking & Trails',
      category: 'fitness',
      score: hikingScore,
      status: getStatus(hikingScore),
      icon: 'Footprints',
      summary: hikingScore >= 75 ? 'Great trail conditions' : 'Prepare for wet or cool conditions',
      tips: hikingTips,
    },
    {
      id: 'stargazing',
      name: 'Night Sky & Stargazing',
      category: 'leisure',
      score: stargazingScore,
      status: getStatus(stargazingScore),
      icon: 'Sparkles',
      summary: stargazingScore >= 70 ? 'High clarity night sky' : 'Overcast limits night viewing',
      tips: stargazingTips,
    },
  ];

  // 4. Wardrobe Recommendations
  const umbrellaNeeded = rainProbMaxToday >= 30 || current.precipitation > 0 || current.weatherCode >= 51;
  const sunglassesNeeded = uvMaxToday >= 3 || current.cloudCover < 40;
  const sunscreenNeeded = uvMaxToday >= 3;

  let top = 'Breathable cotton t-shirt or polo';
  let bottom = 'Comfortable casual trousers or chinos';
  let outerwear: string | undefined = undefined;
  let footwear = 'Breathable walking sneakers';
  const accessories: string[] = [];

  if (tempC >= 25) {
    top = 'Ultra-lightweight breathable linen or athletic shirt';
    bottom = 'Breathable shorts or lightweight linen trousers';
    footwear = 'Lightweight canvas sneakers or cushioned sandals';
  } else if (tempC >= 18) {
    top = 'Standard t-shirt or long-sleeve casual shirt';
    bottom = 'Denim jeans or casual trousers';
    outerwear = 'Light cardigan or zip-up windbreaker for the evening';
  } else if (tempC >= 10) {
    top = 'Long-sleeve base layer or knit sweater';
    bottom = 'Warm denim or lined trousers';
    outerwear = 'Medium jacket, denim jacket, or trench coat';
  } else if (tempC >= 2) {
    top = 'Thermal base layer with thick wool sweater';
    bottom = 'Fleece-lined pants or heavy trousers';
    outerwear = 'Insulated winter parka or heavy wool overcoat';
    accessories.push('Warm beanie hat', 'Wool scarf', 'Lined gloves');
  } else {
    top = 'Thermal underwear base layer + polar fleece';
    bottom = 'Waterproof thermal trousers';
    outerwear = 'Heavy down parka with storm hood';
    footwear = 'Insulated waterproof winter boots with thermal socks';
    accessories.push('Thermal balaclava or fleece beanie', 'Windproof mittens', 'Neck gaiter');
  }

  if (umbrellaNeeded) {
    outerwear = outerwear ? `${outerwear} (Water-repellent)` : 'Compact waterproof rain jacket';
    footwear = 'Water-resistant shoes or sealed leather boots';
    accessories.push('Compact travel umbrella');
  }

  if (sunglassesNeeded) {
    accessories.push('UV400 protective sunglasses');
  }
  if (sunscreenNeeded) {
    accessories.push(`Broad-spectrum SPF 30+ sunscreen (UV Index ${uvMaxToday})`);
  }

  const wardrobe: WardrobeRecommendation = {
    top,
    bottom,
    outerwear,
    footwear,
    accessories,
    umbrellaNeeded,
    sunglassesNeeded,
    sunscreenNeeded,
  };

  // 5. Meteorological Alerts & Advisories
  const alerts: WeatherAlert[] = [];

  if (current.weatherCode >= 95) {
    alerts.push({
      id: 'thunderstorm',
      level: 'alert',
      title: 'Thunderstorm Squall Warning',
      message: 'Lightning strikes and convective squalls detected in the area. Seek shelter indoors immediately.',
      icon: 'Zap',
    });
  }

  if (uvMaxToday >= 8) {
    alerts.push({
      id: 'uv-extreme',
      level: 'alert',
      title: 'Very High UV Radiation Alert',
      message: `UV Index reaching ${uvMaxToday}. Skin burn occurs in under 15 minutes without protection between 10 AM – 4 PM.`,
      icon: 'SunMedium',
    });
  } else if (uvMaxToday >= 6) {
    alerts.push({
      id: 'uv-high',
      level: 'warning',
      title: 'High UV Radiation Advisory',
      message: `UV Index is elevated at ${uvMaxToday}. Wear sunglasses, hat, and apply SPF 30+ before direct sun exposure.`,
      icon: 'Sun',
    });
  }

  if (windKmh >= 40) {
    alerts.push({
      id: 'wind-gale',
      level: 'alert',
      title: 'High Wind Velocity Advisory',
      message: `Wind speeds of ${current.windSpeed} ${units.windSpeed} may cause difficult vehicle steering and branch movement.`,
      icon: 'Wind',
    });
  } else if (windKmh >= 28) {
    alerts.push({
      id: 'wind-breeze',
      level: 'info',
      title: 'Fresh Gusty Breeze',
      message: `Brisk winds of ${current.windSpeed} ${units.windSpeed}. Secure lightweight outdoor furniture and umbrellas.`,
      icon: 'Wind',
    });
  }

  if (rainSumToday >= 15 || current.precipitation >= 5) {
    alerts.push({
      id: 'heavy-rain',
      level: 'warning',
      title: 'Heavy Rainfall Accumulation',
      message: `Significant rainfall (${rainSumToday} ${units.precipitation}) expected today. Localized water ponding on roadways likely.`,
      icon: 'CloudRain',
    });
  } else if (umbrellaNeeded && !alerts.some((a) => a.id === 'heavy-rain')) {
    alerts.push({
      id: 'rain-prep',
      level: 'info',
      title: 'Precipitation Likely Today',
      message: `${rainProbMaxToday}% chance of rain showers. Keep an umbrella accessible before heading out.`,
      icon: 'Umbrella',
    });
  }

  if (feelsLikeC <= 0) {
    alerts.push({
      id: 'freeze-chill',
      level: 'warning',
      title: 'Sub-Zero Wind Chill Advisory',
      message: `Real-feel temperature is ${current.apparentTemperature}${units.temperature}. Risk of frostbite during extended exposure.`,
      icon: 'Snowflake',
    });
  }

  return {
    overallConditionSummary,
    bestOutdoorWindow: bestWindow,
    activities,
    wardrobe,
    alerts,
  };
}
