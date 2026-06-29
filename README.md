# 🔥 Bell FastLane — Vorbestellen · Bezahlen · Abholen

Ein vollständig durchklickbares **End-to-End-Demo-System** für mobile Bell-Grillstände, Brutzelwagen und Eventteams der Bell Food Group.

> **Interne Demo / Prototyp.** Es erfolgt **keine echte Zahlung** und es werden **keine echten Kundendaten** gespeichert. Bell-Logos, -Farben und -Bildsprache werden zu internen Präsentationszwecken nachempfunden. Nicht offiziell.

---

## Das Erlebnis

**Gast scannt QR-Code → Stand wählen → Menü → Warenkorb → Demo-Zahlung → digitale Quittung → Abholnummer → Live-Status → Chat mit der Crew → fertig.** Beliebig viele Bestellungen hintereinander.

Drei Ansichten, ein gemeinsamer Datenstand (live synchronisiert über die Browser-Tabs):

| Ansicht | Datei | Für wen |
|---|---|---|
| 🛒 **Gast** | `index.html` | Kundinnen & Kunden am Event |
| 👨‍🍳 **Crew / Kasse** | `staff.html` | Grill-Team (Kitchen Display System) |
| 📊 **Admin / Management** | `admin.html` | Leitung, Vertrieb, Innovation |

## Der USP: Bell FastLane

Vorbestellen schon in der Warteschlange → **weniger Wartezeit, mehr Bestellungen pro Stunde, keine Hörfehler, volle digitale Auswertung** pro Event.

## Funktionsumfang

- **5 Event-Modi** mit angepasstem Angebot: Fussballmatch, Stadionverkauf, Jodlerfest, Firmenevent, Festival/Open Air
- **Demo-Zahlung** mit TWINT, Apple Pay, Google Pay, Kreditkarte, Bar — realistische Animation, klarer Demo-Hinweis
- **Live-Status** in 6 Stufen (eingegangen → in Vorbereitung → auf dem Grill → fast fertig → abholbereit → abgeschlossen), automatisch animiert **und** manuell in der Crew-Ansicht steuerbar
- **Kunden-Crew-Chat** mit Schnellnachrichten ("Ohne Zwiebeln", "Bitte später", …)
- **Kitchen Display System** mit Spalten, Status-Buttons, Walk-in-Generator
- **Management-Dashboard**: Tagesumsatz, Bestellungen, Ø Warenkorb, Top-Produkte, Event-Umschaltung, Präsentationsmodus, Demo-Reset, **QR-Code** + druckbare **QR-Karte**

## Technik

Reines **HTML / CSS / JavaScript**, keine Build-Tools, keine Serverpflicht, keine Datenbank. Daten liegen lokal im `localStorage`. Mobile-First, responsiv, GitHub-Pages-kompatibel.

```
index.html            Gästeseite (Bestellflow)
staff.html            Crew / Kasse (KDS)
admin.html            Admin / Management
qr/qr-card.html       Druckbare QR-Tischkarte
assets/css/bell.css   Bell Design-System
assets/js/store.js    Demo-"Datenbank", Produkte, Events, Bestelllogik
assets/js/ui.js       Icons, Toasts, Helfer
assets/js/app.js      Gast-Logik
assets/js/staff.js    Crew-Logik
assets/js/admin.js    Admin-Logik
assets/js/qrcode.js   QR-Generator (MIT, vendored / Build-Zeit)
```

## Lokal starten

Einfach `index.html` im Browser öffnen — oder ein kleiner Server für sauberes Routing:

```bash
python3 -m http.server 8080
# http://localhost:8080
```

## Deployment

Push auf `main` löst den GitHub-Actions-Workflow aus (`.github/workflows/deploy.yml`), der die statische Seite automatisch auf **GitHub Pages** veröffentlicht.

---

© 2026 · Interne Demo für die Bell Food Group · zu Präsentationszwecken · keine echte Zahlung.
