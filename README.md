# VRG Demo - Simulátor Bojových Operací

## 1. Přehled

Toto je frontendové rozhraní pro simulátor bojových operací, které v reálném čase vizualizuje a umožňuje ovládat stav simulace běžící na Node.js backendu. Aplikace je napsána v Reactu, využívá OpenLayers pro mapové zobrazení a WebSocket pro okamžitou obousměrnou komunikaci.

### Klíčové Funkce

- **Interaktivní mapa** v plně dokovatelném layoutu, který si uživatel může přizpůsobit.
- Komunikace s backendem v **reálném čase** přes WebSocket.
- Tvorba jednotek s **unikátními ID**, role a umístění jsou náhodně generovány.
- **Ovládání simulace** (start/pauza) a dynamická **správa jednotek** (přidání/mazání).
- **Interaktivní plánování tras** pro jednotky klikáním do mapy.
- Integrovaný nástroj pro **měření vzdálenosti** mezi jednotkami.

## 2. Instalace a Spuštění

Pro spuštění je nutné mít nainstalovaný **Node.js** a **npm**.

**1. Instalace**
V kořenovém adresáři spusťte:

```bash
npm install
```

**2. Spuštění Backendu**
V **prvním terminálu** spusťte WebSocket server. Bude naslouchat na portu `8080`.

```bash
node backend/server.js
```

**3. Spuštění Frontendu**
V **druhém terminálu** spusťte server Vite.

```bash
npm run dev
```

**4. Otevření aplikace**
Otevřete prohlížeč a přejděte na adresu, kterou vám vypsal Vite (`http://localhost:5173`).

## 3. Ovládání Aplikace

- **Výběr jednotky:** Kliknutím na jednotku ji vyberete. Zobrazí se její detaily a aktivuje se režim plánování trasy.
- **Plánování trasy:** S vybranou jednotkou klikejte do mapy pro přidání bodů trasy.
- **Zrušení výběru:** Výběr zrušíte klávesou `Esc` nebo opětovným kliknutím na vybranou jednotku.
- **Měření vzdálenosti:** Kliknutím na tlačítko `Změřit vzdálenost` otevřete dialog pro měření mezi dvěma jednotkami.
- **Správa jednotek:** V panelu `Ovládání` můžete přidávat/mazat jednotky a jejich naplánované trasy a řídit chod simulace.

## 4. Technické shrnutí

- **Frontend:** React, TypeScript, Vite, Zustand (pro globální stav), OpenLayers, Material-UI, FlexLayout-React.
- **Backend:** Node.js, ws library.
- **Architektura:** Komponentová architektura s centrálním stavem (Zustand). Komunikace probíhá přes WebSocket API s definovanými typy zpráv.
# vrg-simulator
