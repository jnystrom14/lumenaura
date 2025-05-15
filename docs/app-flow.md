# app-flow\.md

## 👤 User Roles

* **Single user role**: All users are equal — no admin tier
* All data is stored locally in the browser

---

## 🧭 App Flow

### 🟣 Onboarding Flow

1. Welcome screen: name + birthdate input
2. Optional: add profile picture
3. Save data to localStorage
4. Redirect to Daily Dashboard

---

### 🔮 Daily Dashboard (Home Page)

* Auto-calculates today's vibration
* Displays:

  * Greeting ("Good morning, \[Name]!")
  * Daily affirmation
  * Power word/theme
  * Color, gem, lucky number
  * Meaning/description from Louise Hay system
* Option to refresh content for different day via date picker

---

### 📅 Calendar View

* Button to select a date range or full month
* Renders printable grid:

  * Title: "Numerology Forecast for \[Name] – \[Month Year]"
  * Each day shows color, gem, and number only
* Export to PDF available

---

### 🧑‍🎨 Profile Settings Page

* Edit name, birthdate, profile pic
* Button to clear all saved data

---

## 📃 Page List

| Page Name        | Path          | Description                                    |
| ---------------- | ------------- | ---------------------------------------------- |
| Onboarding       | `/onboarding` | Collects name, birthdate, optional profile pic |
| Daily Dashboard  | `/dashboard`  | Main daily view based on numerology            |
| Calendar View    | `/calendar`   | Monthly date range grid + PDF export           |
| Profile Settings | `/profile`    | Edit personal info or clear local storage      |
| 404 Page         | `/404`        | Catch-all for invalid URLs                     |

---

## 🧠 App Logic Overview

1. Calculate Universal Year = sum(current year digits)
2. Personal Year = Birth Month + Birth Day + Universal Year
3. Personal Month = Personal Year + Current Month
4. Personal Day = Personal Month + Current Day
5. Match daily number to Louise Hay dataset for:

   * Color
   * Gem
   * Lucky number
   * Affirmation
   * Meaning

Let me know if you'd like a wireframe or flowchart mockup!
