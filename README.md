# SANAD Healthcare Mediation Platform - Provider Search Module

SANAD (**سَنَد**) is a patient-centric healthcare mediation platform designed for the Egyptian healthcare ecosystem. It empowers patients across Greater Cairo, Alexandria, and Egyptian governorates to discover, filter, and schedule appointments with certified, syndicate-verified medical consultants and top clinics.

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS (`#0E7C86` Brand Teal, 8px rhythm, RTL/LTR)
- **Backend API**: Laravel 11 + PHP 8.5 + SQLite (`C:\Users\al khshab\Downloads\Sanad-main\Sanad-main`)
- **API Base URL**: `http://127.0.0.1:8000/api`
- **Routing**: `react-router-dom`
- **Icons**: `lucide-react`
- **Bilingual (i18n)**: Arabic (RTL) & English (LTR) with dynamic document `dir` switching and Tailwind logical utilities

---

## 🚀 How to Run the Full Application (Backend + Frontend)

### 1. Run the Laravel Backend API
In a terminal, navigate to the backend directory:
```bash
cd "C:\Users\al khshab\Downloads\Sanad-main\Sanad-main"
php artisan serve --host=127.0.0.1 --port=8000
```
Backend will be live at `http://127.0.0.1:8000`.

### 2. Run the React Frontend
In a second terminal, navigate to the frontend directory:
```bash
cd "C:\Users\al khshab\.gemini\antigravity\scratch\sanad-provider-search"
npm run dev
```
Open your browser at `http://localhost:5173`. Everything is connected directly to the real SQLite database with full Egyptian doctors and clinics data!

---

## 🧪 Triggering Demo UI States (Loading, Empty, Error, Slow)

The application includes interactive controls to test edge-case UI states:

1. **From the Navbar**:
   Click on the **"Dev Mock Mode"** dropdown on the top-right of the header and select:
   - **Normal Data**: Default fast simulated response (~400ms).
   - **Force Error**: Simulates API failure / 500 network disconnect with a **"Try Again"** button.
   - **Force Empty**: Simulates zero matching doctors with friendly suggestions and a **"Reset all filters"** button.
   - **Slow Network**: Simulates 2.5s network delay to observe full skeleton loading states.

2. **Via URL Query Parameters**:
   - `http://localhost:5173/?mock=error`
   - `http://localhost:5173/?mock=empty`
   - `http://localhost:5173/?mock=slow`

3. **Offline Detection**:
   - Open browser DevTools -> Network -> set to **Offline** (or toggle device Wi-Fi).
   - An accessible orange offline banner will immediately render at the top using `navigator.onLine`.

4. **Emergency Safety Alert (FR-SAN-11)**:
   - In the search bar, type urgent terms such as:
     - `chest pain` or `ألم في الصدر`
     - `difficulty breathing` or `ضيق في التنفس`
     - `severe bleeding` or `نزيف حاد`
     - `stroke` or `سكتة دماغية`
     - `unconscious` or `فقدان الوعي`
   - A prominent red emergency banner will immediately render above all results with direct `tel:123` calling, and normal clinic results will be de-emphasized.

---

## 📋 Feature-to-Requirement (FR-SAN) Traceability Matrix

| Requirement | Module / Component | Implementation Details |
|---|---|---|
| **FR-SAN-09** (Smart Search) | `SearchBar.jsx`, `providersApi.js`, `conditions.js` | Unified search input supporting symptoms/conditions, specialties, doctor names, clinics, and Egyptian areas/governorates. |
| **FR-SAN-10** (Condition-to-Specialty Mapping & Autocomplete) | `SuggestionList.jsx`, `ConditionBanner.jsx`, `conditions.js` | 300ms debounced autocomplete suggestions grouped into **Conditions → Specialty**, **Doctors**, and **Clinics**. Shows active chip *"Showing [Specialty] for '[Condition]' "* with an inline switcher to change specialties. |
| **FR-SAN-11** (Emergency Safety Override) | `EmergencyBanner.jsx`, `providersApi.js` | Evaluates emergency terms (AR/EN) **before** normal matching. Renders authoritative red emergency alert with direct `tel:123` action, nearest 24/7 ER hospitals, and de-emphasizes non-urgent clinic results. |
| **FR-SAN-12** (Faceted Filters & Sorting) | `FiltersPanel.jsx`, `FilterChips.jsx`, `SortSelect.jsx`, `useProviderSearch.js` | Location, availability (Today, Tomorrow, This week), language, visit type (In-clinic, Online, Home), minimum rating (3+, 4+, 4.5+), fee tier, payment method, and clinic. Desktop sidebar + mobile bottom-sheet drawer. Removable active chips + `aria-live="polite"` results count. Synchronized with URL search params. |
| **FR-SAN-26** (Sponsored Placement Integrity) | `SponsoredCard.jsx`, `providersApi.js` | Clearly labeled **Sponsored** banner with distinct styling. Explicitly isolated from organic result rankings to protect algorithmic neutrality. |
| **Provider Cards & Slots** | `ProviderCard.jsx`, `SlotChips.jsx`, `VerifiedBadge.jsx` | Shows photo, name, credentials, experience, syndicate verified badge with tooltip, reviews, fee, next slot chips, profile link, and book action. Handles *"No slots available"* state. |
| **Doctor Details Page** | `ProviderDetailsPage.jsx` (`/providers/:id`) | Header, verified badge, tabs (Overview, Services, Clinic & Location, Reviews with star distribution bars, Schedule). Sticky booking card (desktop) / bottom bar (mobile). |
| **Clinic Details Page** | `ClinicDetailsPage.jsx` (`/clinics/:id`) | Overview, verified badge, branch addresses, emergency hotline, operating hours, facility gallery, and resident doctors list. |
| **Bilingual RTL / LTR** | `useI18n.jsx`, `ar.json`, `en.json`, `index.css` | Native Arabic RTL & English LTR switcher with Cairo font, HTML `dir` attribute, and Tailwind logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`). |
| **Accessibility & Design** | WCAG 2.1 AA | Semantic HTML, touch targets ≥ 44px, visible focus rings, calm medical teal palette (`#0E7C86`), rounded-xl cards, soft shadows. |

---

## 📂 Project Directory Structure

```text
sanad-provider-search/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── api/
│   │   └── providersApi.js
│   ├── data/
│   │   ├── conditions.js
│   │   ├── clinics.js
│   │   └── providers.js
│   ├── i18n/
│   │   ├── ar.json
│   │   ├── en.json
│   │   └── useI18n.jsx
│   ├── hooks/
│   │   ├── useDebounce.js
│   │   ├── useOnlineStatus.js
│   │   └── useProviderSearch.js
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── SearchBar.jsx
│   │   ├── SuggestionList.jsx
│   │   ├── EmergencyBanner.jsx
│   │   ├── ConditionBanner.jsx
│   │   ├── FiltersPanel.jsx
│   │   ├── FilterChips.jsx
│   │   ├── SortSelect.jsx
│   │   ├── ProviderCard.jsx
│   │   ├── SponsoredCard.jsx
│   │   ├── VerifiedBadge.jsx
│   │   ├── RatingStars.jsx
│   │   ├── SlotChips.jsx
│   │   ├── MapViewPlaceholder.jsx
│   │   ├── BottomSheet.jsx
│   │   ├── Toast.jsx
│   │   ├── Skeletons.jsx
│   │   ├── EmptyState.jsx
│   │   ├── ErrorState.jsx
│   │   ├── OfflineBanner.jsx
│   │   └── Tabs.jsx
│   └── pages/
│       ├── SearchPage.jsx
│       ├── ProviderDetailsPage.jsx
│       ├── ClinicDetailsPage.jsx
│       └── NotFound.jsx
```
