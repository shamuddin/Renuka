# 💕 Renuka's Magic World + Valentine's Week

Two beautiful websites for Renuka!

---

## 🌟 Website 1: index.html (The Magic World)

The **original** animated website with beautiful backgrounds and interactive scenes.

### ✨ Features
- **8 Animated Backgrounds**: Aurora, Hearts, Flowers, Stars, BTS Theme, Lanterns, Love Letters, Anniversary
- **Interactive Scene Switcher**: Click buttons on the right to change backgrounds
- **Click "Renuka"**: Toggle between "Renuka" and "RenuSham"
- **D3.js Animations**: Beautiful particle effects
- **GSAP Animations**: Smooth transitions

### 🚀 How to Use
Open `index.html` in your browser.

### 💕 Valentine's Special Link
There's a link to the Valentine's Week special in the top-left corner!

---

## 🌹 Website 2: valentine.html (Valentine's Week Special)

A special **Valentine's Week** website with auto-unlock feature for Feb 7-14.

### 📅 Valentine's Week Schedule

| Date | Day | Status |
|------|-----|--------|
| **Feb 7** | 🌹 Rose Day | Day 1 |
| **Feb 8** | 💍 Propose Day | Day 2 |
| **Feb 9** | 🍫 Chocolate Day | Day 3 |
| **Feb 10** | 🧸 Teddy Day | Day 4 |
| **Feb 11** | 🤝 Promise Day | Day 5 |
| **Feb 12** | 🤗 Hug Day | Day 6 |
| **Feb 13** | 💋 Kiss Day | Day 7 |
| **Feb 14** | 💕 Valentine's Day | Final Day |

### 🔒 Auto-Unlock System
- Days unlock automatically based on the current date
- Before Feb 7: Countdown timer shows time remaining
- Feb 7 onwards: Days unlock progressively
- Locked days show 🔒 icon and cannot be accessed

### 🎨 How to Change GIFs

#### Step 1: Get GIF URL from Tenor
1. Go to https://tenor.com/search/milk-mocha-bear-gifs
2. Find a GIF you like
3. Click **"Share"** → **"Copy Link"** → **"GIF Link"**

#### Step 2: Replace in valentine.html

Search for these markers:

```html
<!-- 🎨 WELCOME PAGE GIF - CHANGE THIS URL -->
<img src="PASTE_URL_HERE" id="welcome-gif">

<!-- 🎨 ROSE DAY GIF - CHANGE THIS URL -->
<img src="PASTE_URL_HERE" id="rose-gif">

<!-- 🎨 PROPOSE DAY GIF - CHANGE THIS URL -->
<img src="PASTE_URL_HERE" id="propose-gif">

<!-- 🎨 CHOCOLATE DAY GIF - CHANGE THIS URL -->
<img src="PASTE_URL_HERE" id="chocolate-gif">

<!-- 🎨 TEDDY DAY GIF - CHANGE THIS URL -->
<img src="PASTE_URL_HERE" id="teddy-gif">

<!-- 🎨 PROMISE DAY GIF - CHANGE THIS URL -->
<img src="PASTE_URL_HERE" id="promise-gif">

<!-- 🎨 HUG DAY GIF - CHANGE THIS URL -->
<img src="PASTE_URL_HERE" id="hug-gif">

<!-- 🎨 KISS DAY GIF - CHANGE THIS URL -->
<img src="PASTE_URL_HERE" id="kiss-gif">

<!-- 🎨 VALENTINE'S DAY GIF - CHANGE THIS URL -->
<img src="PASTE_URL_HERE" id="valentine-gif">
```

### 💌 How to Edit Wishes

Search for these markers in `valentine.html`:

```html
<!-- 💌 ROSE DAY WISH - EDIT THIS MESSAGE -->
<!-- 💌 PROPOSE DAY WISH - EDIT THIS MESSAGE -->
<!-- 💌 CHOCOLATE DAY WISH - EDIT THIS MESSAGE -->
<!-- etc... -->
```

### 🧪 Test Mode

To test all days before Feb 7, edit this in `valentine.html`:

```javascript
const TEST_MODE = true;  // Set to true to unlock all days
const TEST_DATE = "2026-02-10";  // Or set a specific date
```

---

## 📂 File Structure

```
index.html         # Original magic world website
valentine.html     # Valentine's Week special
main.js            # Background animations
interactions.js    # Interaction system
styles.css         # Styles
backgrounds/       # Background animation scripts
```

---

## 🚀 How to Use

1. **Open `index.html`** for the original magic world
2. **Click "💕 Valentine's Week Special"** to go to the Valentine's site
3. **Or open `valentine.html` directly**

---

Made with 💕 for Renuka
