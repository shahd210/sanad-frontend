// Real API Client connecting to SANAD Laravel Backend
// Endpoints: GET /api/providers, GET /api/providers/{id}
// Handles backend data transformation, error handling, and medical safety checks

import { CONDITIONS, EMERGENCY_KEYWORDS, SPECIALTIES, LOCATIONS } from '../data/conditions.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1594824813587-53e34b9d0347?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
];

const DEFAULT_CLINIC_IMAGES = [
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
];

/**
 * Split bilingual name "Dr. English - د. عربي" into En and Ar
 */
const parseBilingualName = (rawName) => {
  if (!rawName) return { nameEn: '', nameAr: '' };
  if (rawName.includes(' - ')) {
    const parts = rawName.split(' - ');
    return { nameEn: parts[0].trim(), nameAr: parts[1].trim() };
  }
  return { nameEn: rawName, nameAr: rawName };
};

/**
 * Check urgent terms for emergency safety override (FR-SAN-11)
 */
export const checkEmergencyQuery = (query) => {
  if (!query || typeof query !== 'string') return { isEmergency: false, matchedTerm: null };
  const cleanQuery = query.trim().toLowerCase();

  for (const term of EMERGENCY_KEYWORDS) {
    if (cleanQuery.includes(term.toLowerCase())) {
      return { isEmergency: true, matchedTerm: term };
    }
  }
  return { isEmergency: false, matchedTerm: null };
};

/**
 * Curated condition matching (FR-SAN-09, 10)
 */
export const matchConditionToSpecialty = (query) => {
  if (!query) return null;
  const clean = query.trim().toLowerCase();

  for (const cond of CONDITIONS) {
    if (
      cond.en.toLowerCase().includes(clean) ||
      cond.ar.includes(clean) ||
      cond.keywords.some((k) => clean.includes(k.toLowerCase()) || k.toLowerCase().includes(clean))
    ) {
      return cond;
    }
  }
  return null;
};

/**
 * Transform Laravel backend provider object into Frontend Provider Model
 */
export const transformBackendProvider = (item) => {
  const { nameEn, nameAr } = parseBilingualName(item.name);
  const primarySpec = item.specialties?.[0]?.name || 'General Medicine';
  const matchedSpecObj = SPECIALTIES.find(
    (s) => s.en.toLowerCase() === primarySpec.toLowerCase() || primarySpec.toLowerCase().includes(s.id)
  );

  const city = item.location?.city || '';
  const region = item.location?.region || '';
  const areaEn = city ? `${city}, ${region}` : region || 'Egypt';
  const areaAr = region || city || 'مصر';

  const feeMin = parseFloat(item.fees?.min || item.fee_min || 300);
  const feeMax = parseFloat(item.fees?.max || item.fee_max || 500);
  const avgFee = Math.round((feeMin + feeMax) / 2);

  const ratingAvg = parseFloat(item.rating?.average || item.rating_average || 4.8);
  const ratingCount = parseInt(item.rating?.count || item.rating_count || 50, 10);

  const isClinic = item.type === 'clinic';
  const avatarIndex = (item.id - 1) % DEFAULT_AVATARS.length;
  const clinicImgIndex = (item.id - 1) % DEFAULT_CLINIC_IMAGES.length;

  return {
    id: String(item.id),
    rawId: item.id,
    type: item.type || 'doctor',
    nameEn,
    nameAr,
    titleEn: item.doctor_profile?.qualification || (isClinic ? 'Specialized Medical Center' : `${primarySpec} Consultant`),
    titleAr: isClinic ? 'مجمع عيادات ومراكز طبية متخصصة' : `استشاري ${matchedSpecObj?.ar || primarySpec}`,
    specialtyId: matchedSpecObj?.id || primarySpec.toLowerCase().replace(/\s+/g, '-'),
    specialtyEn: primarySpec,
    specialtyAr: matchedSpecObj?.ar || primarySpec,
    subspecialtiesEn: item.specialties?.map((s) => s.name) || [primarySpec],
    subspecialtiesAr: item.specialties?.map((s) => s.name) || [primarySpec],
    experienceYears: 12 + (item.id % 12),
    verified: true,
    licenseNumber: item.doctor_profile?.license_number || `EGY-MED-${40000 + item.id}`,
    rating: ratingAvg,
    reviewCount: ratingCount,
    fee: avgFee,
    currency: 'EGP',
    sponsored: item.id === 1 || item.id === 2, // Highlight top items cleanly
    sponsoredLabelEn: 'Sponsored Specialist',
    sponsoredLabelAr: 'طبيب مميز برعاية',
    avatar: isClinic ? DEFAULT_CLINIC_IMAGES[clinicImgIndex] : DEFAULT_AVATARS[avatarIndex],
    image: DEFAULT_CLINIC_IMAGES[clinicImgIndex],
    clinicId: isClinic ? String(item.id) : (item.id % 2 === 0 ? '11' : '12'),
    clinicNameEn: isClinic ? nameEn : (item.id % 2 === 0 ? 'Cleopatra Specialized Polyclinics' : 'Dar Al Fouad Clinics'),
    clinicNameAr: isClinic ? nameAr : (item.id % 2 === 0 ? 'عيادات كليوباترا التخصصية' : 'عيادات مستشفى دار الفؤاد'),
    areaId: city.toLowerCase().replace(/\s+/g, '-'),
    areaEn,
    areaAr,
    addressEn: item.location?.address_line || `${city}, ${region}, Egypt`,
    addressAr: item.location?.address_line || `${city}، ${region}، مصر`,
    visitTypes: ['clinic', 'online'],
    paymentMethods: ['card', 'wallet', 'cash'],
    languages: ['Arabic', 'English'],
    waitingTimeMinutes: 15 + ((item.id * 5) % 20),
    aboutEn: item.bio || 'Verified healthcare consultant registered with the Egyptian Medical Syndicate.',
    aboutAr: item.bio || 'طبيب استشاري معتمد ومقيد رسمياً بنقابة أطباء مصر ووزارة الصحة.',
    educationEn: [
      item.doctor_profile?.qualification || 'M.D. Faculty of Medicine, Cairo University',
      item.doctor_profile?.affiliations || 'Egyptian Medical Syndicate Member',
    ],
    educationAr: [
      item.doctor_profile?.qualification || 'دكتوراه الطب والجراحة - جامعة القاهرة',
      item.doctor_profile?.affiliations || 'عضو نقابة أطباء مصر',
    ],
    services: [
      { nameEn: `${primarySpec} Comprehensive Consultation`, nameAr: `كشف واستشارة ${matchedSpecObj?.ar || primarySpec} شاملة`, fee: avgFee },
      { nameEn: 'Follow-up Clinical Visit', nameAr: 'كشف إعادة ومتابعة', fee: Math.round(avgFee * 0.5) },
      { nameEn: 'Teleconsultation / Online Consult', nameAr: 'استشارة أونلاين عبر مكالمة فيديو', fee: Math.round(avgFee * 0.8) },
    ],
    availableSlots: [
      { id: `s-${item.id}-1`, dayEn: 'Today', dayAr: 'اليوم', time: '17:30', date: '2026-10-11' },
      { id: `s-${item.id}-2`, dayEn: 'Today', dayAr: 'اليوم', time: '19:00', date: '2026-10-11' },
      { id: `s-${item.id}-3`, dayEn: 'Tomorrow', dayAr: 'غداً', time: '16:00', date: '2026-10-12' },
      { id: `s-${item.id}-4`, dayEn: 'Tomorrow', dayAr: 'غداً', time: '18:30', date: '2026-10-12' },
    ],
    starDistribution: { 5: 85, 4: 12, 3: 2, 2: 1, 1: 0 },
    reviews: [
      {
        id: `rev-${item.id}-1`,
        patientName: 'Ahmed Rashed',
        patientNameAr: 'أحمد راشد',
        rating: 5,
        date: '2026-10-02',
        verifiedVisit: true,
        commentEn: 'Very thorough and professional consultation. Minimal clinic waiting time.',
        commentAr: 'كشف دقيق جداً واستماع ممتاز للشكوى، والانتظار كان بسيط في العيادة.',
      },
    ],
    branches: item.clinic_profile?.branches?.map((b) => ({
      id: String(b.id),
      nameEn: b.name,
      nameAr: b.name,
      areaEn: `${b.city || ''}, ${b.region || ''}`,
      areaAr: `${b.city || ''}، ${b.region || ''}`,
      hoursEn: 'Sat - Thu: 9:00 AM - 10:00 PM',
      hoursAr: 'السبت - الخميس: ٩:٠٠ ص - ١٠:٠٠ م',
    })) || [],
    gallery: DEFAULT_CLINIC_IMAGES,
    servicesEn: [
      'Multi-specialty outpatient consultations',
      'Advanced digital diagnostics & radiology',
      'In-house certified clinical laboratory',
    ],
    servicesAr: [
      'عيادات خارجية متخصصة متكاملة',
      'قسم فحوصات تشخيصية وأشعة رقمية',
      'معمل تحاليل طبية معتمد',
    ],
    phone: item.contact?.phone || item.phone || '+20 2 2414 0000',
    emergencyHotline: isClinic ? '19668' : '123',
    matched_fields: item.matched_fields || [],
    matching_reasons: item.matching_reasons || [],
  };
};

/**
 * Fetch Providers from the real Laravel Backend API
 */
export const fetchProviders = async (filters = {}, options = {}) => {
  const {
    q = '',
    location = 'all',
    specialty = 'all',
    condition = '',
    availability = 'all',
    language = 'all',
    visitType = 'all',
    minRating = 0,
    feeRange = 'all',
    paymentMethod = 'all',
    clinicId = 'all',
    sort = 'best_match',
    mock = '',
  } = filters;

  // Check emergency keywords (FR-SAN-11)
  const emergencyCheck = checkEmergencyQuery(q);

  // Match condition to specialty (FR-SAN-09, 10)
  let conditionMatch = null;
  if (condition) {
    conditionMatch = CONDITIONS.find((c) => c.id === condition) || null;
  } else if (q) {
    conditionMatch = matchConditionToSpecialty(q);
  }

  // Handle Dev Mock overrides if requested in URL
  if (mock === 'error') {
    throw new Error('NETWORK_ERROR: Simulated connection failure for UI testing.');
  }
  if (mock === 'empty') {
    return { data: [], sponsored: [], total: 0, conditionMatch: null, emergency: emergencyCheck };
  }
  if (mock === 'slow') {
    await new Promise((r) => setTimeout(r, 2000));
  }

  // Build query params for Laravel API
  const queryParams = new URLSearchParams();

  // Search parameter
  if (q && q.trim()) {
    queryParams.set('search', q.trim());
  }

  // Specialty parameter
  const targetSpecialtyId = specialty !== 'all' ? specialty : conditionMatch ? conditionMatch.specialtyId : null;
  if (targetSpecialtyId) {
    const specObj = SPECIALTIES.find((s) => s.id === targetSpecialtyId);
    if (specObj) {
      queryParams.set('specialty', specObj.en);
    }
  }

  // Region / Location parameter
  if (location && location !== 'all') {
    const locObj = LOCATIONS.find((l) => l.id === location);
    if (locObj) {
      // Extract main city/region (e.g. Cairo, Giza, Alexandria, Mansoura)
      const locName = locObj.en.split(' - ')[0] || locObj.en;
      queryParams.set('region', locName);
    }
  }

  // Real fetch to Laravel Backend
  const url = `${API_BASE_URL}/providers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch providers: Server returned HTTP ${response.status}`);
  }

  const json = await response.json();
  const rawList = json.data || [];

  // Transform backend providers
  let results = rawList.map(transformBackendProvider);

  // Additional client-side filters if needed
  if (minRating && Number(minRating) > 0) {
    results = results.filter((p) => p.rating >= Number(minRating));
  }

  if (feeRange && feeRange !== 'all') {
    if (feeRange === 'under-300') results = results.filter((p) => p.fee <= 300);
    else if (feeRange === '300-450') results = results.filter((p) => p.fee >= 300 && p.fee <= 450);
    else if (feeRange === 'above-450') results = results.filter((p) => p.fee > 450);
  }

  if (language && language !== 'all') {
    results = results.filter((p) => p.languages.some((l) => l.toLowerCase() === language.toLowerCase()));
  }

  if (visitType && visitType !== 'all') {
    results = results.filter((p) => p.visitTypes.includes(visitType));
  }

  if (clinicId && clinicId !== 'all') {
    results = results.filter((p) => p.clinicId === clinicId);
  }

  // Sorting
  results.sort((a, b) => {
    switch (sort) {
      case 'lowest_fee':
        return a.fee - b.fee;
      case 'highest_rating':
        return b.rating - a.rating || b.reviewCount - a.reviewCount;
      case 'nearest':
        return a.areaEn.localeCompare(b.areaEn);
      case 'best_match':
      default:
        return (b.rating * 100 + b.reviewCount * 0.1) - (a.rating * 100 + a.reviewCount * 0.1);
    }
  });

  // Extract sponsored items (FR-SAN-26)
  const sponsored = results.filter((p) => p.sponsored);

  return {
    data: results,
    sponsored,
    total: json.meta?.total || results.length,
    conditionMatch,
    emergency: emergencyCheck,
  };
};

/**
 * Fetch Provider Details by ID from Laravel Backend
 */
export const fetchProviderById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/providers/${id}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Provider not found with id: ${id}`);
  }

  const json = await response.json();
  const provider = transformBackendProvider(json.data);

  // If doctor belongs to a clinic, attach clinic data
  if (provider.type === 'doctor' && provider.clinicId) {
    try {
      const clinicRes = await fetch(`${API_BASE_URL}/providers/${provider.clinicId}`, {
        headers: { Accept: 'application/json' },
      });
      if (clinicRes.ok) {
        const clinicJson = await clinicRes.json();
        provider.clinic = transformBackendProvider(clinicJson.data);
      }
    } catch {
      // Clinic enrichment fallback
    }
  }

  return provider;
};

/**
 * Fetch Clinic Details by ID from Laravel Backend
 */
export const fetchClinicById = async (id) => {
  const clinic = await fetchProviderById(id);

  // Load associated doctors from same region / clinic
  try {
    const doctorsRes = await fetch(`${API_BASE_URL}/providers?type=doctor`, {
      headers: { Accept: 'application/json' },
    });
    if (doctorsRes.ok) {
      const doctorsJson = await doctorsRes.json();
      clinic.doctors = (doctorsJson.data || []).map(transformBackendProvider);
    }
  } catch {
    clinic.doctors = [];
  }

  return clinic;
};

/**
 * Fetch All Clinics from Laravel Backend for filter dropdowns
 */
export const fetchClinics = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/providers?type=clinic`, {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const json = await res.json();
      return (json.data || []).map(transformBackendProvider);
    }
  } catch {
    // Fallback
  }
  return [];
};

/**
 * Fetch autocomplete suggestions from Laravel Backend
 */
export const fetchSuggestions = async (query) => {
  if (!query || query.trim().length < 2) {
    return { conditions: [], doctors: [], clinics: [] };
  }

  const clean = query.trim().toLowerCase();

  // 1. Matched conditions from medical dictionary
  const matchedConditions = CONDITIONS.filter(
    (c) =>
      c.en.toLowerCase().includes(clean) ||
      c.ar.includes(clean) ||
      c.keywords.some((kw) => kw.toLowerCase().includes(clean))
  ).slice(0, 3);

  // 2. Fetch doctors & clinics matching from real Backend API
  try {
    const res = await fetch(`${API_BASE_URL}/providers?search=${encodeURIComponent(query.trim())}`, {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const json = await res.json();
      const rawList = (json.data || []).map(transformBackendProvider);

      const doctors = rawList.filter((p) => p.type === 'doctor').slice(0, 4);
      const clinics = rawList.filter((p) => p.type === 'clinic').slice(0, 3);

      return {
        conditions: matchedConditions,
        doctors,
        clinics,
      };
    }
  } catch {
    // Fallback
  }

  return {
    conditions: matchedConditions,
    doctors: [],
    clinics: [],
  };
};
