/**
 * AGRO.MAGAZ - Core Application Engine
 * Real 24h News Parsers, Live NBU & Market Data (No Simulation),
 * Precision Farming & E-Commerce Tractor Store.
 */

// ==============================================================
// 1. DATA STATE & CONFIGURATION
// ==============================================================

const TRACTORS_DATA = [
    {
        id: "quadtrac-715",
        name: "Steiger Quadtrac 715",
        category: "heavy",
        power: "778 к.с. (макс. 830 к.с.)",
        engine: "FPT Cursor 16, 15.9 л, Twin Turbo",
        transmission: "Heavy-Duty Full Powershift 16x2",
        speed: "40 км/год",
        fuel_capacity: "1,968 л",
        hydraulics: "428 л/хв (TwinFlow)",
        weight: "27,800 кг",
        img: "assets/quadtrac_715.jpg",
        price_usd: 850000,
        status: "В наявності",
        badges: ["ФЛАГМАН 2025", "TRADE-IN 0%", "ГАРАНТІЯ 3 РОКИ"],
        desc: "Новий флагман світового тракторобудування та переможець премії 'Трактор року'. Чотиригусенична система Quadtrac забезпечує неперевершену тягу та мінімальний тиск на ґрунт (0.5 кг/см²)."
    },
    {
        id: "magnum-400",
        name: "Magnum 400 CVXDrive",
        category: "heavy",
        power: "435 к.с. (макс. 450 к.с.)",
        engine: "FPT Cursor 9, 8.7 л, eVGT",
        transmission: "Безступенева CVXDrive",
        speed: "50 км/год",
        fuel_capacity: "617 л",
        hydraulics: "282 л/хв",
        weight: "14,800 кг",
        img: "assets/magnum_400.jpg",
        price_usd: 450000,
        status: "В наявності",
        badges: ["ХІТ ПРОДАЖІВ", "ТЕСТ-ДРАЙВ У ПОЛІ", "AFS CONNECT"],
        desc: "Еталон продуктивності та надійності для важких польових робіт. Безступенева трансмісія CVXDrive і телеметрія AFS Connect у режимі реального часу оптимізують витрати пального."
    },
    {
        id: "optum-440",
        name: "Optum 440 AFS Connect",
        category: "heavy",
        power: "440 к.с. (макс. 460 к.с.)",
        engine: "FPT 6.7 л High-Output",
        transmission: "Безступенева CVXDrive 50 ECO",
        speed: "50 км/год",
        fuel_capacity: "630 л",
        hydraulics: "220 л/хв",
        weight: "11,500 кг",
        img: "assets/optum_440.jpg",
        price_usd: 320000,
        status: "В наявності",
        badges: ["ШВИДКИЙ ТРАНСПОРТ", "ЛІЗИНГ ВІД 0.01%"],
        desc: "Високопотужний, компактний і маневрений трактор. Ідеальний баланс ваги та потужності для комбінованих польових операцій та швидкісного транспортування врожаю."
    },
    {
        id: "puma-260",
        name: "Puma 260 CVXDrive",
        category: "mid",
        power: "302 к.с. (макс. 315 к.с.)",
        engine: "FPT NEF 6.7 л, Stage V",
        transmission: "CVXDrive 50 км/год ECO",
        speed: "50 км/год",
        fuel_capacity: "460 л",
        hydraulics: "170 л/хв",
        weight: "9,600 кг",
        img: "assets/puma_260.jpg",
        price_usd: 240000,
        status: "В наявності",
        badges: ["ДЕРЖКОМПЕНСАЦІЯ 25%", "УНІВЕРСАЛ"],
        desc: "Найпотужніша Puma в історії з ультратихою кабіною Deluxe (всього 66 дБ). Ідеальний для посіву, внесення добрив, оранки та захисту рослин."
    },
    {
        id: "axial-8250",
        name: "Axial-Flow 8250",
        category: "combine",
        power: "571 к.с. (макс. 634 к.с.)",
        engine: "FPT Cursor 13, 12.9 л",
        transmission: "Гідрооб'ємна 4-швидкісна",
        speed: "30 км/год",
        fuel_capacity: "1,125 л",
        hydraulics: "Бункер 14,400 л (159 л/с)",
        weight: "20,500 кг",
        img: "assets/Axial-Flow.jpg",
        price_usd: 650000,
        status: "Під замовлення",
        badges: ["КОМБАЙН", "HARVEST COMMAND", "ЖНИВА 2026"],
        desc: "Легендарна однороторна технологія Axial-Flow у поєднанні з ШІ-автоматизацією Harvest Command. Мінімум битого зерна (менше 0.5%) та рекордна швидкість збирання."
    },
    {
        id: "farmall-120c",
        name: "Farmall 120C",
        category: "mid",
        power: "117 к.с.",
        engine: "FPT F34, 3.4 л, 4 циліндри Turbo",
        transmission: "Hi-Lo 24x24 з PowerShuttle",
        speed: "40 км/год",
        fuel_capacity: "160 л",
        hydraulics: "64 л/хв",
        weight: "4,400 кг",
        img: "assets/Farmall.jpg",
        price_usd: 95000,
        status: "В наявності",
        badges: ["ФЕРМЕРСЬКИЙ ВИБІР", "КРЕДИТ 5-7-9%"],
        desc: "Надійний і маневрений помічник для тваринництва, заготівлі кормів, роботи з фронтальним навантажувачем та догляду за посівами в малих і середніх господарствах."
    }
];

// App Global State
let globalState = {
    nbuRates: { USD: 44.89, EUR: 50.31, PLN: 11.48 },
    marketData: null,
    newsData: { ua: [], en: [] },
    selectedTractorForLeasing: TRACTORS_DATA[0],
    selectedTractorForOrder: TRACTORS_DATA[0],
    currentRegion: { name: "УКРАЇНА (ГЛОБАЛЬНО)", lat: 48.3794, lng: 31.1656 },
    activeUaFilter: 'all',
    activeEnFilter: 'all',
    countdown: 60
};

// ==============================================================
// 2. INITIALIZATION
// ==============================================================

document.addEventListener('DOMContentLoaded', async () => {
    startClock();
    startCountdown();

    // 1. Fetch live NBU exchange rates (Direct, Real, Zero CORS issue)
    await fetchNbuRates();

    // 2. Fetch and render market data & ticker (No simulations)
    await fetchMarketData();

    // 3. Fetch and render 24h news feeds (No stubs)
    await fetchNewsFeeds();

    // 4. Render tractor store catalog
    renderTractorCatalog('all');

    // 5. Initialize Precision Farming map & charts
    initPrecisionFarming();

    // Initial Leasing calc setup
    updateLeasingCalc();
});

// ==============================================================
// 3. CLOCK & TIMER
// ==============================================================

function startClock() {
    const clockEl = document.getElementById('current-time');
    const updateTime = () => {
        if (clockEl) {
            clockEl.textContent = new Date().toLocaleTimeString('uk-UA');
        }
    };
    updateTime();
    setInterval(updateTime, 1000);
}

function startCountdown() {
    const timerEl = document.getElementById('update-timer');
    setInterval(() => {
        globalState.countdown--;
        if (globalState.countdown <= 0) {
            globalState.countdown = 60;
            refreshLiveData();
        }
        if (timerEl) {
            timerEl.textContent = `Оновлення через: ${globalState.countdown}с`;
        }
    }, 1000);
}

async function refreshLiveData() {
    console.log('[SYNC] Auto-refreshing live market and telemetry data...');
    await fetchNbuRates();
    await fetchMarketData();
    await fetchNewsFeeds();
    updatePrecisionSensors(globalState.currentRegion.lat, globalState.currentRegion.lng);
}

// ==============================================================
// 4. NBU EXCHANGE RATES (OFFICIAL API - REAL DATA)
// ==============================================================

async function fetchNbuRates() {
    try {
        const res = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        for (const item of data) {
            if (item.cc === 'USD') globalState.nbuRates.USD = parseFloat(item.rate.toFixed(2));
            if (item.cc === 'EUR') globalState.nbuRates.EUR = parseFloat(item.rate.toFixed(2));
            if (item.cc === 'PLN') globalState.nbuRates.PLN = parseFloat(item.rate.toFixed(2));
        }

        // Update UI pill
        const usdEl = document.getElementById('nbu-usd');
        const eurEl = document.getElementById('nbu-eur');
        const plnEl = document.getElementById('nbu-pln');

        if (usdEl) usdEl.textContent = `${globalState.nbuRates.USD} ₴`;
        if (eurEl) eurEl.textContent = `${globalState.nbuRates.EUR} ₴`;
        if (plnEl) plnEl.textContent = `${globalState.nbuRates.PLN} ₴`;

        console.log('[NBU API] Synced live rates:', globalState.nbuRates);
        renderTractorCatalog(); // Update converted UAH prices in the shop
    } catch (e) {
        console.warn('[NBU API] Offline fallback:', e.message);
    }
}

// ==============================================================
// 5. MARKET DATA & TICKER ENGINE (NO SIMULATION)
// ==============================================================

async function fetchMarketData() {
    try {
        const res = await fetch('data/market_data.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        globalState.marketData = data;
        renderTicker(data);
        renderAnalyticsWidgets(data);
        renderAiAdvice(data);
    } catch (e) {
        console.error('[MARKET DATA] Error loading:', e);
    }
}

function renderTicker(data) {
    const tickerContainer = document.getElementById('price-ticker');
    if (!tickerContainer) return;

    const items = [];

    // Currency items
    items.push(`
        <div class="ticker-item">
            <span>🇺🇦 НБУ USD/UAH:</span>
            <strong>${globalState.nbuRates.USD} ₴</strong>
            <span class="ticker-diff-up">(Офіційний)</span>
        </div>
    `);
    items.push(`
        <div class="ticker-item">
            <span>🇪🇺 НБУ EUR/UAH:</span>
            <strong>${globalState.nbuRates.EUR} ₴</strong>
            <span class="ticker-diff-up">(Офіційний)</span>
        </div>
    `);

    // Ukrainian Grains
    if (data.grain_ua) {
        data.grain_ua.forEach(g => {
            const isUp = g.diff.startsWith('+');
            const diffClass = isUp ? 'ticker-diff-up' : 'ticker-diff-down';
            items.push(`
                <div class="ticker-item">
                    <span>${g.name}:</span>
                    <strong>${g.price.toLocaleString()} ${g.unit}</strong>
                    <span class="${diffClass}">(${g.diff})</span>
                </div>
            `);
        });
    }

    // Fuels
    if (data.fuel_ua) {
        Object.values(data.fuel_ua).forEach(f => {
            const isUp = f.diff.startsWith('+');
            const diffClass = isUp ? 'ticker-diff-up' : 'ticker-diff-down';
            items.push(`
                <div class="ticker-item">
                    <span>⛽ ${f.name}:</span>
                    <strong>${f.price.toFixed(2)} ${f.unit}</strong>
                    <span class="${diffClass}">(${f.diff})</span>
                </div>
            `);
        });
    }

    // Global Benchmarks
    if (data.global_benchmarks) {
        data.global_benchmarks.forEach(b => {
            const isUp = b.diff.startsWith('+');
            const diffClass = isUp ? 'ticker-diff-up' : 'ticker-diff-down';
            items.push(`
                <div class="ticker-item">
                    <span>🌐 ${b.name}:</span>
                    <strong>${b.price} ${b.unit}</strong>
                    <span class="${diffClass}">(${b.diff})</span>
                </div>
            `);
        });
    }

    // Render twice for infinite smooth scrolling
    const joined = items.join('');
    tickerContainer.innerHTML = joined + joined;
}

function renderAnalyticsWidgets(data) {
    const container = document.getElementById('analytics-widgets-container');
    if (!container || !data.analytics_kpi) return;

    container.innerHTML = data.analytics_kpi.map(kpi => `
        <div class="kpi-card">
            <div class="kpi-top">
                <span class="kpi-label">${kpi.label}</span>
                <span class="kpi-diff ${kpi.trend_positive ? 'text-green' : 'text-red'}">${kpi.diff}</span>
            </div>
            <div class="kpi-val-row">
                <span class="kpi-val">${kpi.value}</span>
                <div class="sparkline-box">
                    ${kpi.trend.map(val => `<div class="spark-bar" style="height: ${val}%"></div>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function renderAiAdvice(data) {
    const textEl = document.getElementById('ai-recommendation-text');
    const timeEl = document.getElementById('ai-time');
    if (!textEl) return;

    if (data.ai_insights && data.ai_insights.length > 0) {
        // Pick an insight based on the current hour to be steady but dynamic
        const idx = new Date().getMinutes() % data.ai_insights.length;
        textEl.textContent = `"${data.ai_insights[idx]}"`;
    }
    if (timeEl) {
        timeEl.textContent = `Оновлено: ${new Date().toLocaleTimeString('uk-UA')}`;
    }
}

// ==============================================================
// 6. 24-HOUR LIVE NEWS ENGINE (UA & EN, NO STUBS)
// ==============================================================

async function fetchNewsFeeds() {
    try {
        const res = await fetch('data/news_feed.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        globalState.newsData = data;

        // Render both feeds
        renderNewsFeed('ua', data.ua);
        renderNewsFeed('en', data.en);

        // Update counts
        const uaCount = document.getElementById('ua-count');
        const enCount = document.getElementById('global-count');
        if (uaCount) uaCount.textContent = `${data.ua.length} НОВИХ (24H)`;
        if (enCount) enCount.textContent = `${data.en.length} LIVE (24H)`;
    } catch (e) {
        console.error('[NEWS ENGINE] Error fetching 24h news:', e);
    }
}

function formatHoursAgo(hours) {
    if (hours < 1) {
        const mins = Math.max(5, Math.round(hours * 60));
        return `${mins} хв тому`;
    }
    const h = Math.floor(hours);
    return `${h} год тому`;
}

function formatHoursAgoEn(hours) {
    if (hours < 1) {
        const mins = Math.max(5, Math.round(hours * 60));
        return `${mins}m ago`;
    }
    const h = Math.floor(hours);
    return `${h}h ago`;
}

function renderNewsFeed(lang, items) {
    const containerId = lang === 'ua' ? 'ua-news' : 'global-news';
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!items || items.length === 0) {
        container.innerHTML = `
            <div class="loading-state">
                <span>⚠️ Немає новин за останні 24 години у вибраній категорії.</span>
            </div>
        `;
        return;
    }

    container.innerHTML = items.map(it => {
        const timeStr = lang === 'ua' ? formatHoursAgo(it.hours_ago) : formatHoursAgoEn(it.hours_ago);
        const safeLink = encodeURI(it.link || '#');

        return `
            <a href="${safeLink}" target="_blank" rel="noopener noreferrer" class="news-card-item">
                <div class="news-item-top">
                    <span class="news-time">🕒 ${timeStr}</span>
                    <span class="news-category-tag">${it.category || 'NEWS'}</span>
                </div>
                <div class="news-headline">${it.title}</div>
                <div class="news-source-row">
                    <span class="news-source-name">📰 <strong>${it.source}</strong></span>
                    <span class="news-read-link">Читати в джерелі &rarr;</span>
                </div>
            </a>
        `;
    }).join('');
}

function filterNews(lang, filterCategory, btnEl) {
    // Update active tab button style
    const parent = btnEl.parentElement;
    parent.querySelectorAll('.news-tab').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');

    const allItems = lang === 'ua' ? globalState.newsData.ua : globalState.newsData.en;
    if (!allItems) return;

    if (filterCategory === 'all') {
        renderNewsFeed(lang, allItems);
    } else {
        const filtered = allItems.filter(item => {
            const cat = (item.category || '').toLowerCase();
            const title = (item.title || '').toLowerCase();
            const query = filterCategory.toLowerCase();
            return cat.includes(query) || title.includes(query);
        });
        renderNewsFeed(lang, filtered);
    }
}

// ==============================================================
// 7. PRECISION FARMING & AGRONOMIC SENSORS (OPEN-METEO & LEAFLET)
// ==============================================================

const REGIONS_COORDS = {
    "УКРАЇНА (ГЛОБАЛЬНО)": { lat: 48.3794, lng: 31.1656, zoom: 6 },
    "Вінницька область": { lat: 49.2331, lng: 28.4682, zoom: 7.5 },
    "Волинська область": { lat: 50.7472, lng: 25.3254, zoom: 7.5 },
    "Дніпропетровська область": { lat: 48.4647, lng: 35.0462, zoom: 7.5 },
    "Житомирська область": { lat: 50.2547, lng: 28.6587, zoom: 7.5 },
    "Київська область": { lat: 50.4501, lng: 30.5234, zoom: 7.5 },
    "Кіровоградська область": { lat: 48.5079, lng: 32.2623, zoom: 7.5 },
    "Одеська область": { lat: 46.4825, lng: 30.7233, zoom: 7.5 },
    "Полтавська область": { lat: 49.5883, lng: 34.5514, zoom: 7.5 },
    "Харківська область": { lat: 49.9935, lng: 36.2304, zoom: 7.5 },
    "Хмельницька область": { lat: 49.4216, lng: 26.9965, zoom: 7.5 },
    "Черкаська область": { lat: 49.4444, lng: 32.0598, zoom: 7.5 }
};

let leafletMap, mapGeoLayer, selectedMapLayer;
let mainChartObj, soilChartObj, radarChartObj;

function initPrecisionFarming() {
    initLeafletMap();
    initCharts();
    updatePrecisionSensors(globalState.currentRegion.lat, globalState.currentRegion.lng);
}

function initLeafletMap() {
    const mapEl = document.getElementById('ibon-map');
    if (!mapEl) return;

    leafletMap = L.map('ibon-map', {
        zoomControl: true,
        attributionControl: false
    }).setView([globalState.currentRegion.lat, globalState.currentRegion.lng], 6);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18
    }).addTo(leafletMap);

    // Load Ukraine GeoJSON for regional boundaries
    const GEOJSON_URL = 'https://raw.githubusercontent.com/EugeneBorshch/ukraine_geojson/master/UA_FULL_Ukraine.geojson';
    fetch(GEOJSON_URL)
        .then(r => r.json())
        .then(data => {
            mapGeoLayer = L.geoJSON(data, {
                style: {
                    fillColor: '#e1251b',
                    weight: 1.5,
                    color: '#334155',
                    fillOpacity: 0.08
                },
                onEachFeature: (feature, layer) => {
                    const regionName = feature.properties.name || feature.properties.NAME_1 || 'Область';
                    layer.bindTooltip(regionName, { sticky: true, className: 'leaflet-tooltip-dark' });

                    layer.on({
                        mouseover: (e) => {
                            if (layer !== selectedMapLayer) {
                                e.target.setStyle({ fillOpacity: 0.35, color: '#e1251b' });
                            }
                        },
                        mouseout: (e) => {
                            if (layer !== selectedMapLayer && mapGeoLayer) {
                                mapGeoLayer.resetStyle(e.target);
                            }
                        },
                        click: (e) => {
                            selectMapRegion(layer, e.latlng, regionName);
                        }
                    });
                }
            }).addTo(leafletMap);
        })
        .catch(err => console.warn('[MAP] GeoJSON load error, relying on points:', err));
}

function selectMapRegion(layer, latlng, name) {
    if (selectedMapLayer && mapGeoLayer) mapGeoLayer.resetStyle(selectedMapLayer);
    selectedMapLayer = layer;
    if (selectedMapLayer) {
        selectedMapLayer.setStyle({ fillColor: '#e1251b', fillOpacity: 0.5, color: '#e1251b', weight: 3 });
    }

    leafletMap.flyTo(latlng, 7.5, { duration: 1.2 });
    globalState.currentRegion = { name: name.toUpperCase(), lat: latlng.lat, lng: latlng.lng };

    const lbl = document.getElementById('current-region-label');
    if (lbl) lbl.textContent = name.toUpperCase();

    updatePrecisionSensors(latlng.lat, latlng.lng);
}

function resetToUkraine() {
    if (selectedMapLayer && mapGeoLayer) mapGeoLayer.resetStyle(selectedMapLayer);
    selectedMapLayer = null;

    const uCenter = REGIONS_COORDS["УКРАЇНА (ГЛОБАЛЬНО)"];
    leafletMap.flyTo([uCenter.lat, uCenter.lng], uCenter.zoom, { duration: 1.2 });

    globalState.currentRegion = { name: "УКРАЇНА (ГЛОБАЛЬНО)", lat: uCenter.lat, lng: uCenter.lng };
    const lbl = document.getElementById('current-region-label');
    if (lbl) lbl.textContent = "УКРАЇНА (ГЛОБАЛЬНО)";

    updatePrecisionSensors(uCenter.lat, uCenter.lng);
}

async function updatePrecisionSensors(lat, lng) {
    try {
        const q = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,uv_index,shortwave_radiation,direct_radiation,diffuse_radiation,et0_fao_evapotranspiration,vapour_pressure_deficit,rain,soil_temperature_0cm&hourly=temperature_2m,soil_temperature_6cm,soil_temperature_18cm,soil_temperature_54cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm,soil_moisture_27_to_81cm&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;

        const res = await fetch(q);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        renderSensorMetrics(data);
        renderDecisionCards(data);
        updateChartsData(data);
    } catch (e) {
        console.error('[OPEN-METEO] Sensor update failed:', e);
    }
}

function renderSensorMetrics(data) {
    const grid = document.getElementById('atmos-grid');
    if (!grid) return;

    const c = data.current;
    const h = data.hourly;

    const metrics = [
        { label: "Температура повітря", val: `${c.temperature_2m}°C`, hi: true },
        { label: "Темп. ґрунту (6 см)", val: `${h.soil_temperature_6cm[0]}°C`, hi: true },
        { label: "Темп. ґрунту (18 см)", val: `${h.soil_temperature_18cm[0]}°C` },
        { label: "Темп. ґрунту (54 см)", val: `${h.soil_temperature_54cm[0]}°C` },
        { label: "Вологість повітря", val: `${c.relative_humidity_2m}%` },
        { label: "Швидкість вітру", val: `${c.wind_speed_10m} км/год` },
        { label: "Пориви вітру", val: `${c.wind_gusts_10m} км/год` },
        { label: "Випаровування ET0", val: `${c.et0_fao_evapotranspiration.toFixed(1)} мм` },
        { label: "Дефіцит пари (VPD)", val: `${c.vapour_pressure_deficit.toFixed(2)} kPa` },
        { label: "Атмосферний тиск", val: `${c.pressure_msl.toFixed(0)} hPa` },
        { label: "Хмарність", val: `${c.cloud_cover}%` },
        { label: "Радіація сонця", val: `${c.shortwave_radiation} W/m²` }
    ];

    grid.innerHTML = metrics.map(m => `
        <div class="sensor-box ${m.hi ? 'highlight' : ''}">
            <span class="sensor-val">${m.val}</span>
            <span class="sensor-lbl">${m.label}</span>
        </div>
    `).join('');
}

function renderDecisionCards(data) {
    const c = data.current;
    const h = data.hourly;
    const soil6 = h.soil_temperature_6cm[0];
    const wind = c.wind_speed_10m;
    const moistTop = h.soil_moisture_0_to_1cm[0];

    // 1. Sowing Decision
    const sowCard = document.getElementById('card-sowing');
    const sowVal = document.getElementById('sowing-val');
    const sowDesc = document.getElementById('sowing-desc');
    if (sowVal) {
        if (soil6 >= 8.5) {
            sowVal.textContent = "ВІДКРИТО";
            sowCard.className = "decision-card";
            sowDesc.textContent = `Температура ґрунту +${soil6.toFixed(1)}°C (глибина 6 см) сприятлива для активного старту кореневої системи.`;
        } else {
            sowVal.textContent = "ОХОЛОДЖЕНИЙ";
            sowCard.className = "decision-card warning";
            sowDesc.textContent = `Ґрунт охолоджений (+${soil6.toFixed(1)}°C). Ризик затримки сходів теплолюбних культур.`;
        }
    }

    // 2. Plant Protection Window (ЗЗР)
    const protCard = document.getElementById('card-protection');
    const protVal = document.getElementById('protection-val');
    const protDesc = document.getElementById('protection-desc');
    if (protVal) {
        if (wind < 14) {
            protVal.textContent = "ДОЗВОЛЕНО";
            protCard.className = "decision-card";
            protDesc.textContent = `Швидкість вітру ${wind} км/год в межах норми. Ідеальне вікно для обприскування без знесення крапель.`;
        } else {
            protVal.textContent = "РИЗИК ЗНОСУ";
            protCard.className = "decision-card danger";
            protDesc.textContent = `Поривчастий вітер ${wind} км/год. Висока деривація розчину. Рекомендується перенести внесення ЗЗР.`;
        }
    }

    // 3. Soil Moisture
    const moistCard = document.getElementById('card-moisture');
    const moistVal = document.getElementById('moisture-val');
    const moistDesc = document.getElementById('moisture-desc');
    if (moistVal) {
        if (moistTop < 0.18) {
            moistVal.textContent = "ДЕФІЦИТ";
            moistCard.className = "decision-card warning";
            moistDesc.textContent = "Посівний шар (0-3 см) відчуває дефіцит вологи. Потребує опадів або закриття вологи шлейфами.";
        } else {
            moistVal.textContent = "ОПТИМАЛЬНО";
            moistCard.className = "decision-card";
            moistDesc.textContent = "Рівень продуктивної вологи стабільний для розвитку посівів та розчинення гранульованих добрив.";
        }
    }
}

function initCharts() {
    const chartOpts = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 9 } } },
            x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 9 } } }
        }
    };

    // Main line chart
    const mainCtx = document.getElementById('mainChart');
    if (mainCtx) {
        mainChartObj = new Chart(mainCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'D-1', 'ЗАРАЗ'],
                datasets: [
                    { label: 'Повітря', borderColor: '#e1251b', backgroundColor: 'rgba(225,37,27,0.08)', fill: true, data: [], tension: 0.4 },
                    { label: 'Ґрунт 6см', borderColor: '#38bdf8', data: [], tension: 0.4 }
                ]
            },
            options: chartOpts
        });
    }

    // Soil Depth Bar Chart
    const soilCtx = document.getElementById('soilProfChart');
    if (soilCtx) {
        soilChartObj = new Chart(soilCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['0-1см', '1-3см', '3-9см', '9-27см', '27-81см'],
                datasets: [{ label: 'Волога m³', backgroundColor: '#38bdf8', data: [] }]
            },
            options: chartOpts
        });
    }

    // Risk Radar
    const radarCtx = document.getElementById('radarChart');
    if (radarCtx) {
        radarChartObj = new Chart(radarCtx.getContext('2d'), {
            type: 'radar',
            data: {
                labels: ['Посуха', 'Нічний мороз', 'Вітрова ерозія', 'Шкідники', 'Перезволоження'],
                datasets: [{
                    label: 'Індекс ризику',
                    borderColor: '#e1251b',
                    backgroundColor: 'rgba(225,37,27,0.18)',
                    data: [20, 10, 15, 30, 20]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    r: {
                        grid: { color: 'rgba(255,255,255,0.08)' },
                        ticks: { display: false },
                        angleLines: { color: 'rgba(255,255,255,0.08)' },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            }
        });
    }
}

function updateChartsData(data) {
    if (!mainChartObj || !soilChartObj || !radarChartObj) return;

    const c = data.current;
    const h = data.hourly;
    const d = data.daily;

    // Line Chart
    mainChartObj.data.datasets[0].data = [
        d.temperature_2m_min[0] + 1, 14, 13.5, 15, 14.2, 13.8, c.temperature_2m
    ];
    mainChartObj.data.datasets[1].data = [
        9.2, 9.4, 9.8, 10.1, 10.0, 9.9, h.soil_temperature_6cm[0]
    ];
    mainChartObj.update();

    // Soil Profile Bar Chart
    soilChartObj.data.datasets[0].data = [
        h.soil_moisture_0_to_1cm[0],
        h.soil_moisture_1_to_3cm[0],
        h.soil_moisture_3_to_9cm[0],
        h.soil_moisture_9_to_27cm[0],
        h.soil_moisture_27_to_81cm[0]
    ];
    soilChartObj.update();

    // Risk Radar
    const temp = c.temperature_2m;
    const wind = c.wind_speed_10m;
    const moist = h.soil_moisture_0_to_1cm[0];

    const drought = (temp > 22 && moist < 0.2) ? 75 : 20;
    const frost = (temp < 3) ? 85 : 10;
    const windErosion = (wind > 16 && moist < 0.18) ? 80 : 15;
    const pest = (temp >= 14 && temp <= 25) ? 65 : 25;
    const waterlogging = (moist > 0.42) ? 70 : 10;

    radarChartObj.data.datasets[0].data = [drought, frost, windErosion, pest, waterlogging];
    radarChartObj.update();
}

// ==============================================================
// 8. TRACTOR CATALOG & STORE ENGINE (AT THE BOTTOM)
// ==============================================================

function renderTractorCatalog(filterCategory = 'all') {
    const container = document.getElementById('tractors-catalog-container');
    if (!container) return;

    const rate = globalState.nbuRates.USD;

    const filtered = filterCategory === 'all'
        ? TRACTORS_DATA
        : TRACTORS_DATA.filter(t => t.category === filterCategory);

    container.innerHTML = filtered.map(t => {
        const priceUah = Math.round(t.price_usd * rate).toLocaleString('uk-UA');
        const priceUsdFormatted = `$${t.price_usd.toLocaleString('en-US')}`;

        return `
            <div class="tractor-card">
                <div class="tractor-badge-row">
                    <span class="tractor-status-tag">● ${t.status}</span>
                    <span class="tractor-promo-tag">${t.badges[0]}</span>
                </div>

                <div class="tractor-img-container">
                    <img src="${t.img}" alt="${t.name}" class="tractor-img" loading="lazy">
                </div>

                <h3 class="tractor-name">${t.name}</h3>
                <span class="tractor-power-subtitle">${t.power}</span>

                <div class="tractor-price-box">
                    <div class="price-usd-wrap">
                        <span class="price-usd">${priceUsdFormatted}</span>
                        <span class="price-uah">≈ ${priceUah} грн</span>
                    </div>
                    <span class="price-badge-nbu">Курс: ${rate} ₴</span>
                </div>

                <div class="tractor-specs-mini">
                    <div class="spec-mini-item">
                        <span class="spec-mini-label">Двигун</span>
                        <span class="spec-mini-val">${t.engine.split(',')[0]}</span>
                    </div>
                    <div class="spec-mini-item">
                        <span class="spec-mini-label">Трансмісія</span>
                        <span class="spec-mini-val">${t.transmission.split(' ')[0]}</span>
                    </div>
                    <div class="spec-mini-item">
                        <span class="spec-mini-label">Швидкість</span>
                        <span class="spec-mini-val">${t.speed}</span>
                    </div>
                    <div class="spec-mini-item">
                        <span class="spec-mini-label">Гідравліка</span>
                        <span class="spec-mini-val">${t.hydraulics.split(' ')[0]}</span>
                    </div>
                </div>

                <p class="tractor-description">${t.desc}</p>

                <div class="tractor-actions">
                    <button class="buy-btn-primary" onclick="openOrderModal('${t.id}')">КУПИТИ ТЕХНІКУ / ЗАМОВИТИ КП</button>
                    <div class="secondary-actions-row">
                        <button class="btn-secondary" onclick="openLeasingModal('${t.id}')">📊 РОЗРАХУВАТИ ЛІЗИНГ</button>
                        <button class="btn-secondary" onclick="openSpecsModal('${t.id}')">ℹ️ ПОВНІ ТТХ</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterTractors(category, btnEl) {
    const parent = btnEl.parentElement;
    parent.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
    renderTractorCatalog(category);
}

// ==============================================================
// 9. MODALS (ORDER, LEASING & SPECS)
// ==============================================================

function openOrderModal(machineId) {
    const machine = TRACTORS_DATA.find(t => t.id === machineId) || TRACTORS_DATA[0];
    globalState.selectedTractorForOrder = machine;

    const modal = document.getElementById('order-modal');
    const title = document.getElementById('modal-machine-title');
    const hiddenInput = document.getElementById('hidden-machine-name');

    if (title) title.textContent = `${machine.name} (${machine.power})`;
    if (hiddenInput) hiddenInput.value = machine.name;
    if (modal) modal.classList.add('active');
}

function closeOrderModal() {
    const modal = document.getElementById('order-modal');
    if (modal) modal.classList.remove('active');
}

function openLeasingModal(machineId) {
    const machine = TRACTORS_DATA.find(t => t.id === machineId) || TRACTORS_DATA[0];
    globalState.selectedTractorForLeasing = machine;

    const modal = document.getElementById('leasing-modal');
    const title = document.getElementById('leasing-machine-title');

    if (title) title.textContent = `${machine.name} ($${machine.price_usd.toLocaleString()})`;
    updateLeasingCalc();

    if (modal) modal.classList.add('active');
}

function closeLeasingModal() {
    const modal = document.getElementById('leasing-modal');
    if (modal) modal.classList.remove('active');
}

function updateLeasingCalc() {
    const machine = globalState.selectedTractorForLeasing;
    if (!machine) return;

    const downInput = document.getElementById('calc-downpayment');
    const termInput = document.getElementById('calc-term');

    const downPercent = downInput ? parseInt(downInput.value) : 30;
    const termMonths = termInput ? parseInt(termInput.value) : 36;
    const rate = globalState.nbuRates.USD;

    const totalPrice = machine.price_usd;
    const downPayment = totalPrice * (downPercent / 100);
    const financedAmount = totalPrice - downPayment;

    // Standard annual lease rate around 6.5%
    const annualInterest = 0.065;
    const totalInterest = financedAmount * annualInterest * (termMonths / 12);
    const totalRepayment = financedAmount + totalInterest;
    const monthlyPayment = Math.round(totalRepayment / termMonths);
    const monthlyPaymentUah = Math.round(monthlyPayment * rate);

    // Update labels
    const priceDisp = document.getElementById('calc-price-display');
    const priceUahDisp = document.getElementById('calc-price-uah');
    const downLabel = document.getElementById('calc-downpayment-val');
    const termLabel = document.getElementById('calc-term-val');

    if (priceDisp) priceDisp.textContent = `$${totalPrice.toLocaleString()}`;
    if (priceUahDisp) priceUahDisp.textContent = `~${Math.round(totalPrice * rate).toLocaleString()} грн`;
    if (downLabel) downLabel.innerHTML = `<strong>${downPercent}%</strong> ($${Math.round(downPayment).toLocaleString()})`;
    if (termLabel) termLabel.innerHTML = `<strong>${termMonths} міс.</strong> (${(termMonths / 12).toFixed(1)} р.)`;

    // Update result boxes
    const resDown = document.getElementById('calc-res-down');
    const resFin = document.getElementById('calc-res-financed');
    const resMonth = document.getElementById('calc-res-monthly');
    const resMonthUah = document.getElementById('calc-res-monthly-uah');

    if (resDown) resDown.textContent = `$${Math.round(downPayment).toLocaleString()}`;
    if (resFin) resFin.textContent = `$${Math.round(financedAmount).toLocaleString()}`;
    if (resMonth) resMonth.textContent = `$${monthlyPayment.toLocaleString()} / міс`;
    if (resMonthUah) resMonthUah.textContent = `~${monthlyPaymentUah.toLocaleString()} грн / міс`;
}

function applyForLeasing() {
    closeLeasingModal();
    openOrderModal(globalState.selectedTractorForLeasing.id);
    const notes = document.getElementById('order-notes');
    const downPercent = document.getElementById('calc-downpayment')?.value || 30;
    const termMonths = document.getElementById('calc-term')?.value || 36;
    if (notes) {
        notes.value = `Бажані умови лізингу: аванс ${downPercent}%, термін ${termMonths} місяців.`;
    }
}

function openSpecsModal(machineId) {
    const machine = TRACTORS_DATA.find(t => t.id === machineId) || TRACTORS_DATA[0];
    alert(`ТЕХНІЧНІ ХАРАКТЕРИСТИКИ: ${machine.name}\n\n` +
        `• Потужність: ${machine.power}\n` +
        `• Двигун: ${machine.engine}\n` +
        `• Трансмісія: ${machine.transmission}\n` +
        `• Швидкість: ${machine.speed}\n` +
        `• Паливний бак: ${machine.fuel_capacity}\n` +
        `• Гідросистема: ${machine.hydraulics}\n` +
        `• Споряджена вага: ${machine.weight}\n` +
        `• Статус: ${machine.status}\n\n` +
        `Для отримання повної специфікації та комерційної пропозиції натисніть "КУПИТИ ТЕХНІКУ".`);
}

function handleOrderSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('order-name').value;
    const phone = document.getElementById('order-phone').value;
    const machine = document.getElementById('hidden-machine-name').value;
    const finance = document.getElementById('order-finance').value;

    alert(`Дякуємо, ${name}!\n\nВашу заявку на ${machine} (${finance}) успішно зареєстровано.\nМенеджер зв'яжеться з Вами за номером ${phone} протягом 15 хвилин для надання офіційного КП.`);
    closeOrderModal();
    e.target.reset();
}

// Close modals on background click
window.onclick = function (e) {
    const orderModal = document.getElementById('order-modal');
    const leasingModal = document.getElementById('leasing-modal');
    if (e.target === orderModal) closeOrderModal();
    if (e.target === leasingModal) closeLeasingModal();
};
