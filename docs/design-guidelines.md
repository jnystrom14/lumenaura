# design-guidelines.md

## 🎨 Color Palette (Spiritual, Calming Tones)

| Color Name    | Hex Code | Usage                           |
| ------------- | -------- | ------------------------------- |
| Lavender      | #D6CDEA  | Backgrounds, highlights         |
| Rose Quartz   | #F7D1D5  | Buttons, accent elements        |
| Soft Gold     | #F5E6A6  | Icons, outlines, headers        |
| Dusty Teal    | #B2D0BE  | Tags, UI labels                 |
| Ivory White   | #FFFDF7  | Main background / text blocks   |
| Midnight Blue | #2C3E50  | Text and deep contrast elements |

---

## 🖋 Fonts

* **Headings**: Playfair Display (serif, elegant)
* **Body Text**: Inter (sans-serif, modern and soft)

---

## 🔘 UI Elements

### Buttons

* **Primary Button**: Rose Quartz background, white text
* **Secondary Button**: Transparent background, gold border/text
* **Hover State**: Slight shadow, background darkens by 10%
* **Disabled State**: 60% opacity, no shadow

### Dropdowns

* Rounded corners (12px)
* Shadow on open
* Font: Inter, 16px
* Colors based on theme (light bg, soft gold icons)

### Cards

* Rounded corners (16px)
* Shadow (light depth)
* Padding: 24px inside, margin-bottom 20px
* Background: Ivory White
* Border: 1px solid #EEE

---

## 📐 Layout and Spacing

* Page Padding: 32px
* Section Spacing: 40px top/bottom
* Element Gutter: 16px
* Form Field Height: 48px
* Line Height: 1.6 for body text

---

## 🌀 Animations & Transitions

* **Page fade-in**: 300ms ease-out
* **Card hover**: lift + slight scale (1.02x)
* **Button press**: press-down animation (95% scale)

---

## 📱 Mobile First Design

* Responsive grid layout
* Adjust spacing: 20px padding on mobile
* Font sizes:

  * Headline: 22px
  * Subhead: 18px
  * Body: 16px
  * Caption: 14px

---

## 🧩 Component Library

Compatible with Tailwind CSS and Lovable's default UI primitives.

Optional: Integrate shadcn/ui for dropdowns, modals, cards if needed.

Let me know if you'd like sample mockups or Figma structure!
