# 🏹 Atilla Öröksége

**Együttműködő stratégiai társasjáték a Hun Birodalom megmentéséért**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-AGPL--3.0-green.svg)](LICENSE)

🌐 **[Játssz Online](https://osiorokseg.hu/atilla/)** | 💻 **[GitHub Repository](https://github.com/sicambria/atilla-oroksege)**

---

## 📖 Tartalomjegyzék

- [Áttekintés](#-áttekintés)
- [Játékmenet](#-játékmenet)
- [Játékszabályok](#-játékszabályok)
- [Funkciók](#-funkciók)
- [Technológiai Stack](#-technológiai-stack)
- [Telepítés](#-telepítés)
- [Fejlesztés](#-fejlesztés)
- [Build és Deploy](#-build-és-deploy)
- [Projekt Struktúra](#-projekt-struktúra)
- [Hozzájárulás](#-hozzájárulás)
- [Licensz](#-licensz)

---

## 🎮 Áttekintés

**Atilla Öröksége** egy kooperatív stratégiai társasjáték, ahol a játékosok Atilla hun király örökösei szerepében próbálják megmenteni a széthulló birodalmat. Kr. u. 453 tavaszán, Atilla halála után a hat vezér összegyűlik, hogy együtt őrizzék meg azt, amit a nagykirály teremtett.

### 🎯 Játék Célja

Gyűjtsétek össze mind a **4 Szent Örökséget** (Atilla Kardja, Turulpecsét, Arany Íj, Táltos Kehely), mielőtt a birodalom összeomlana a fenyegetések súlya alatt!

### 🌟 Kiemelt Jellemzők

- 🤝 **Kooperatív játékmenet** - Együtt győztök vagy veszítetek
- 🗺️ **Interaktív térkép** - 29 város a Hun Birodalom területén
- 👥 **6 egyedi karakter** - Mindegyik különleges képességgel
- 🎲 **4 nehézségi szint** - Kezdőtől legendásig
- 🌓 **Sötét/Világos téma** - Teljesen testreszabható megjelenés

---

## 🎲 Játékmenet

### Alapmechanika

1. **Mozgás** - Utazz városról városra a szomszédos kapcsolatokon keresztül
2. **Fenyegetések elhárítása** - Használj kártyákat a veszélyek ellen
3. **Kártyacsere** - Oszd meg tudásodat társaiddal
4. **Örökségek megszerzése** - Gyűjts 5 kártyát és utazz a szent helyekre

### Körök Menete

Minden játékos körében:
- **4 Akciópont** áll rendelkezésre
- Akciók után **2 kártya húzása**
- **Új fenyegetések** megjelenése
- Következő játékos következik

### Győzelem és Vereség

**Győzelem:** Mind a 4 Szent Örökség megszerzése

**Vereség:**
- 30+ fenyegetés a táblán
- A főváros (Etil) elvesztése
- 5+ város elvesztése
- A húzópakli kiürül

---


## 📜 Játékszabályok

### Nehézségi Szintek

| Szint | Kezdő Fenyegetés | Vihar Kártyák | Krízis Kártyák | Leírás |
|-------|------------------|---------------|----------------|---------|
| **Kezdő** | 0 | 2 | 1 | Ideális az első játékhoz |
| **Normál** | 2 | 3 | 1 | Kiegyensúlyozott kihívás |
| **Mester** | 4 | 4 | 2 | Komoly stratégiát igényel |
| **Legendás** | 8 | 6 | 3 | Csak a legjobbaknak! |

### Karakterek

1. **Ellák** - Atilla legidősebb fia
   - Képesség: Ingyen mozgás körönként egyszer
   - Kezdő kártyák: 2x Lovasroham

2. **Aranka** - A Táltos Gyógyító
   - Képesség: Gyógyítás kártyák dupla erővel
   - Kezdő kártyák: 2x Gyógyító rítus

3. **Baján** - A Bölcs Tanácsos
   - Képesség: Diplomácia kártyák univerzálisak
   - Kezdő kártyák: 2x Kereskedelem

4. **Réka** - A Történetmesélő
   - Képesség: Távoli kártyaátadás
   - Kezdő kártyák: 2x Tanácsadás

5. **Dengizik** - A Harcedzett Vezér
   - Képesség: Védelmi kártyák dupla erővel
   - Kezdő kártyák: 2x Határvédelem

6. **Onegeszius** - A Harcos Költő
   - Képesség: Látja a pakli tetejét (2 kártya)
   - Kezdő kártyák: 2x Stratégiai terv

### Szent Örökségek Helyszínei

- 🗡️ **Atilla Kardja** - Szombathely
- 🔏 **Turulpecsét** - Kubán
- 🏹 **Arany Íj** - Dnyeszter
- 🏆 **Táltos Kehely** - Partiskum

### Fenyegetéstípusok

**Belső fenyegetések:**
- Rossz termés (Kereskedelem)
- Rablóbanda (Harci)
- Járvány (Gyógyítás)
- Belviszály (Diplomácia)

**Külső fenyegetések:**
- Nomád támadás (Védelmi)
- Római intrika (Diplomácia)
- Germán felkelés (Harci)
- Perzsa portyázók (Lovas)

---


## ✨ Funkciók

### Játék Funkciók

- ✅ **6 játszható karakter** - Egyedi képességekkel és kezdőkártyákkal
- ✅ **29 város** - Történelmi helyszínekkel
- ✅ **8 fenyegetéstípus** - Belső és külső veszélyek
- ✅ **Krízis események** - Nagy éhínség, Fekete halál, Birodalom felbomlása
- ✅ **Áldás kártyák** - Különleges segítség az ősöktől
- ✅ **Láncreakció mechanika** - Lázadások terjedése
- ✅ **Passzív fenyegetés csökkentés** - Hősök jelenléte véd

### UI/UX Funkciók

- 🌓 **Téma váltás** - Sötét és világos mód
- 📊 **Részletes statisztikák** - Kör, fenyegetések, pakli méret
- 🎯 **Interaktív térkép** - Zoom, pan, drag funkcionalitás
- 📜 **Eseménynapló** - Minden akció nyomon követhető
- 🎓 **Tutorial rendszer** - Lépésről lépésre útmutató
- 📖 **Beépített súgó** - Szabályok, szerepek, jelmagyarázat
- 🎭 **Karakter bemutató** - Animált intro minden karakterhez
- 💾 **Mentés és Betöltés** - Játékállás mentése JSON fájlba és visszatöltése

### Technikai Funkciók

- ⚡ **Gyors betöltés** - Vite build optimalizáció
- 🔄 **State management** - React useReducer
- 🎯 **TypeScript** - Teljes típusbiztonság
- 🌐 **Subfolder deploy** - Működik alkönyvtárból is
- 🎮 **Szimuláció mód** - AI teszteléshez (Ctrl+Shift+S)

---

## 🛠️ Technológiai Stack

### Core Technologies

- **React 18.3** - UI framework
- **TypeScript 5.6** - Típusbiztonság
- **Vite 6.0** - Build tool és dev server

### Styling

- **Vanilla CSS** - CSS változókkal
- **CSS Custom Properties** - Dinamikus témák
- **Glassmorphism** - Modern UI effektek

### Development Tools

- **ESLint**
- **TypeScript Compiler** - Típusellenőrzés
- **Vite HMR** - Hot Module Replacement

### Icons & Assets

- **Lucide React** - Modern ikonok
- **Custom SVG** - Egyedi grafikák

---

## 📦 Telepítés

### Előfeltételek

- **Node.js** 18.x vagy újabb
- **npm** 9.x vagy újabb

### Lépések

1. **Klónozd a repository-t**
   ```bash
   git clone https://github.com/yourusername/atilla-oroksege.git
   cd atilla-oroksege
   ```

2. **Telepítsd a függőségeket**
   ```bash
   npm install
   ```

3. **Indítsd el a fejlesztői szervert**
   ```bash
   npm run dev
   ```

4. **Nyisd meg a böngészőben**
   ```
   http://localhost:5173
   ```

---

## 🔧 Fejlesztés

### Elérhető Scriptek

```bash
# Fejlesztői szerver indítása
npm run dev

# Production build készítése
npm run build

# Build előnézete
npm run preview

# Linting
npm run lint
```

### Fejlesztői Mód Funkciók

- **Hot Module Replacement** - Azonnali frissítés kódváltozáskor
- **TypeScript ellenőrzés** - Valós idejű típushiba jelzés
- **Szimuláció mód** - `Ctrl+Shift+S` - AI játék teszteléshez

### Projekt Konfigurációk

- **vite.config.ts** - Vite beállítások
- **tsconfig.json** - TypeScript konfiguráció
- **package.json** - Függőségek és scriptek

---

## 🏗️ Build és Deploy

### Production Build

```bash
npm run build
```

A build kimenet a `dist/` mappába kerül.

### Deploy Subfolder-be

A projekt támogatja az alfkönyvtárból való futtatást:

1. **Állítsd be a base URL-t** a `vite.config.ts`-ben:
   ```typescript
   export default defineConfig({
     base: './', // Relatív útvonal
   })
   ```

2. **Build és deploy**:
   ```bash
   npm run build
   # Másold a dist/ tartalmát a szerver alkönyvtárába
   ```

### Környezeti Változók

A projekt használja a `import.meta.env.BASE_URL`-t az asset útvonalakhoz.

---

## 📁 Projekt Struktúra

```
atilla-oroksege/
├── public/                      # Statikus fájlok
│   └── tronterem.jpg          # Fő háttérkép
│   
│
├── src/
│   ├── components/            # React komponensek
│   │   ├── Board.tsx         # Játéktábla
│   │   ├── GameContainer.tsx # Fő játék konténer
│   │   ├── MainMenu.tsx      # Főmenü
│   │   ├── PlayerDashboard.tsx # Játékos panel
│   │   ├── BottomToolbar.tsx # Alsó eszköztár
│   │   ├── HelpModal.tsx     # Súgó modal
│   │   ├── TutorialOverlay.tsx # Tutorial
│   │   ├── CharacterIntroModal.tsx # Karakter bemutató
│   │   └── GameStatusModal.tsx # Győzelem/Vereség modal
│   │
│   ├── logic/                # Játéklogika
│   │   ├── gameReducer.ts   # State management
│   │   ├── initialState.ts  # Kezdő állapot
│   │   └── simulation.ts    # AI szimuláció
│   │
│   ├── constants.ts         # Játék konstansok
│   ├── types.ts            # TypeScript típusok
│   ├── index.css           # Globális stílusok
│   ├── App.tsx             # Fő App komponens
│   └── main.tsx            # Entry point
│
├── vite.config.ts          # Vite konfiguráció
├── tsconfig.json           # TypeScript konfiguráció
├── package.json            # Projekt metaadatok
└── README.md              # Ez a fájl
```

---

### Fejlesztési Irányelvek

- Használj **TypeScript** típusokat
- Kövesd a **React best practices**-t
- Írj **tiszta, dokumentált** kódot
- Tesztelj **mindkét témában** (sötét/világos)

---

## 📄 Licensz

Ez a projekt **GNU Affero General Public License v3.0** (AGPL-3.0) alatt áll.

Ez azt jelenti, hogy:
- ✅ Szabadon használhatod, módosíthatod és terjesztheted
- ✅ A forráskódnak nyíltnak kell maradnia
- ✅ Ha hálózaton keresztül szolgáltatod, a forráskódot elérhetővé kell tenned
- ✅ Minden módosítást ugyanezen licensz alatt kell közzétenned

Lásd a [LICENSE](LICENSE) fájlt a részletekért, vagy látogass el a [GNU AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html) oldalra.

---


## 📞 Kapcsolat

Ha kérdésed van vagy visszajelzést szeretnél adni:

- inczegaspar at pm dot me

---

## 🎯 Tervezett Funkciók

- [x] Mentés/Betöltés funkció
- [ ] Hangeffektek és zene: https://osiorokseg.hu/letoltes/


---

**Készítve ❤️-tel a Magyar történelem iránt**

*"Én vagyok a magyarok legelső királya, utolsó világrészről én kihozója!"*  
— Zrínyi Miklós: Atilla király
