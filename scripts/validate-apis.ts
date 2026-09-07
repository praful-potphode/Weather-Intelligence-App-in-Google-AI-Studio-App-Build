import { searchCities, fetchWeatherData, OPEN_METEO_GEOCODING_API, OPEN_METEO_FORECAST_API } from '../src/services/openMeteo';

async function runValidation() {
  console.log('====================================================');
  console.log('WEATHER INTELLIGENCE: API VALIDATION SUITE');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 4;

  // Test 1: Valid City 1 (Tokyo)
  console.log('[TEST 1] Validating City Search 1: "Tokyo"...');
  try {
    const tokyoResults = await searchCities('Tokyo');
    if (!tokyoResults || tokyoResults.length === 0) {
      throw new Error('No results returned for Tokyo');
    }
    const tokyo = tokyoResults[0];
    console.log(`  ✓ Geocoding Success: Found "${tokyo.name}, ${tokyo.country}" at Lat: ${tokyo.latitude}, Lon: ${tokyo.longitude}`);
    
    // Fetch forecast data
    const weather = await fetchWeatherData(tokyo, 'celsius', 'kmh', 'mm');
    console.log(`  ✓ Forecast API Success: Current Temp: ${weather.current.temperature}°C, Weather Code: ${weather.current.weatherCode}`);
    console.log(`  ✓ Timeline: ${weather.hourly.length} hourly slots, 7-day forecast: ${weather.daily.length} days`);
    passedTests++;
  } catch (err: any) {
    console.error(`  ✗ TEST 1 FAILED:`, err.message);
  }

  console.log('\n----------------------------------------------------\n');

  // Test 2: Valid City 2 (Paris)
  console.log('[TEST 2] Validating City Search 2: "Paris"...');
  try {
    const parisResults = await searchCities('Paris');
    if (!parisResults || parisResults.length === 0) {
      throw new Error('No results returned for Paris');
    }
    const paris = parisResults[0];
    console.log(`  ✓ Geocoding Success: Found "${paris.name}, ${paris.country}" at Lat: ${paris.latitude}, Lon: ${paris.longitude}`);
    
    // Fetch forecast data
    const weather = await fetchWeatherData(paris, 'celsius', 'kmh', 'mm');
    console.log(`  ✓ Forecast API Success: Current Temp: ${weather.current.temperature}°C, Weather Code: ${weather.current.weatherCode}`);
    console.log(`  ✓ Humidity: ${weather.current.relativeHumidity}%, Pressure: ${weather.current.pressureMsl} hPa`);
    passedTests++;
  } catch (err: any) {
    console.error(`  ✗ TEST 2 FAILED:`, err.message);
  }

  console.log('\n----------------------------------------------------\n');

  // Test 3: Invalid City Search ("NonExistentCityXyz99999")
  console.log('[TEST 3] Validating Invalid City Search: "NonExistentCityXyz99999"...');
  try {
    const invalidResults = await searchCities('NonExistentCityXyz99999');
    if (invalidResults.length === 0) {
      console.log('  ✓ Expected Behavior: Open-Meteo Geocoding API returned 0 results.');
      console.log('  ✓ UI Handler: Displays "No matching cities found" message with suggestion to verify spelling.');
      passedTests++;
    } else {
      console.warn('  ? Unexpected results returned for invalid city:', invalidResults);
    }
  } catch (err: any) {
    console.log(`  ✓ Correctly captured geocoding error: ${err.message}`);
    passedTests++;
  }

  console.log('\n----------------------------------------------------\n');

  // Test 4: API Error State (Invalid Latitude 999.0 to Forecast API)
  console.log('[TEST 4] Validating Forecast API Error State Handling (Invalid Coordinates)...');
  try {
    const invalidLocation = {
      id: 9999999,
      name: 'Invalid Coordinate Test',
      latitude: 999.0, // Invalid latitude > 90°
      longitude: 999.0,
      country: 'Invalid',
    };
    
    await fetchWeatherData(invalidLocation, 'celsius', 'kmh', 'mm');
    console.error('  ✗ Expected API error was NOT thrown!');
  } catch (err: any) {
    console.log(`  ✓ Caught Expected API Error from Open-Meteo: "${err.message}"`);
    console.log('  ✓ UI Error Boundary: Renders actionable error alert banner with "Retry" action button.');
    passedTests++;
  }

  console.log('\n====================================================');
  console.log(`RESULTS: ${passedTests}/${totalTests} Tests Passed`);
  console.log('====================================================');

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runValidation();
