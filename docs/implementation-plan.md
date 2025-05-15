# implementation-plan.md

## 📌 Project Scope

A browser-based numerology app that calculates a user's daily vibration using Louise Hay's system and presents an uplifting daily dashboard and optional printable calendar.

---

## ⚙️ Tech Overview

* **Frontend**: Web app using Lovable (React-based)
* **State Management**: localStorage (no backend for MVP)
* **Data Source**: Embedded JSON based on Louise Hay PDF

---

## 🧩 Implementation Phases

### 🚀 Phase 1: Core MVP (Daily Dashboard)

**Goal**: Deliver personalized daily info to the user with no login required

#### ✅ Step 1: Onboarding

* Input birthdate, name, optional profile picture
* Save to localStorage

#### ✅ Step 2: Numerology Engine

* Universal Year calculation
* Personal Year = Birth Month + Birth Day + Universal Year
* Personal Month = Personal Year + Calendar Month
* Personal Day = Personal Month + Calendar Day
* Cycle 1–9 (with 11/2 and 22/4 special cases)

#### ✅ Step 3: Daily Dashboard View

* Pull today's vibration
* Display:

  * Affirmation
  * Power word/theme
  * Color, gem, lucky number
  * Meaning text

### 🗓 Phase 2: Calendar View + Export

**Goal**: Let users plan and print a monthly guide

#### ✅ Step 1: Date Picker

* Select specific date or range/month
* Run numerology calculation across date range

#### ✅ Step 2: Monthly Grid UI

* Display clean calendar with color, gem, and number only per date

#### ✅ Step 3: PDF Export

* Render grid into PDF via HTML-to-PDF tool
* Title with user's name and month

### ✨ Phase 3: UI Polish & Experience

**Goal**: Add delight, beauty, and personality

#### ✅ Step 1: Profile & Settings Page

* Edit name, birthdate, profile picture

#### ✅ Step 2: Visual Enhancements

* Add animations, hover states, fade-ins
* Optimize mobile view

#### ✅ Step 3: Shareable Features

* Optional: Export/share today’s reading as image

---

## 📅 Recommended Timeline

* Week 1–2: Phase 1
* Week 3–4: Phase 2
* Week 5: Phase 3

Total MVP Build Time: \~5 weeks with iterative testing

---

## 🧠 Notes

* All daily values are deterministic — logic engine can be unit tested early
* Content from PDF must be structured into JSON or equivalent first
* Ensure full mobile compatibility for accessibility

Let me know if you'd like a CSV/JSON conversion of the Louise Hay dataset!
