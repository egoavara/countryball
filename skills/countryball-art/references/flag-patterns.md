# Countryball Flag Patterns

This document provides SVG code patterns for common country flags. All patterns are designed to be placed inside a flag layer group that is clipped to the body shape:

```xml
<g id="layer-flag" clip-path="url(#body-clip)">
  <!-- Flag pattern elements go here -->
</g>
```

The body circle is centered at `cx="256" cy="256" r="200"`, so the clipping area spans from x=56 to x=456 and y=56 to y=456. All flag rectangles use the full bounding box of the clip area to ensure complete coverage.

---

## 1. Horizontal Stripes

### Two Horizontal Stripes

Used for: Poland, Ukraine, Indonesia, Monaco, etc.

#### Poland (White over Red)

```xml
<!-- White top half -->
<rect x="56" y="56" width="400" height="200" fill="#FFFFFF"/>
<!-- Red bottom half -->
<rect x="56" y="256" width="400" height="200" fill="#DC143C"/>
```

#### Ukraine (Blue over Yellow)

```xml
<!-- Blue top half -->
<rect x="56" y="56" width="400" height="200" fill="#005BBB"/>
<!-- Yellow bottom half -->
<rect x="56" y="256" width="400" height="200" fill="#FFD500"/>
```

#### Indonesia (Red over White)

```xml
<!-- Red top half -->
<rect x="56" y="56" width="400" height="200" fill="#CE1126"/>
<!-- White bottom half -->
<rect x="56" y="256" width="400" height="200" fill="#FFFFFF"/>
```

### Three Horizontal Stripes

Used for: Germany, Russia, Netherlands, Luxembourg, Austria, etc.

Each stripe is 400/3 = ~133.33px tall.

#### Germany (Black-Red-Gold)

```xml
<!-- Black top stripe -->
<rect x="56" y="56" width="400" height="134" fill="#000000"/>
<!-- Red middle stripe -->
<rect x="56" y="190" width="400" height="133" fill="#DD0000"/>
<!-- Gold bottom stripe -->
<rect x="56" y="323" width="400" height="133" fill="#FFCC00"/>
```

#### Russia (White-Blue-Red)

```xml
<!-- White top stripe -->
<rect x="56" y="56" width="400" height="134" fill="#FFFFFF"/>
<!-- Blue middle stripe -->
<rect x="56" y="190" width="400" height="133" fill="#0039A6"/>
<!-- Red bottom stripe -->
<rect x="56" y="323" width="400" height="133" fill="#D52B1E"/>
```

#### Netherlands (Red-White-Blue)

```xml
<!-- Red top stripe -->
<rect x="56" y="56" width="400" height="134" fill="#AE1C28"/>
<!-- White middle stripe -->
<rect x="56" y="190" width="400" height="133" fill="#FFFFFF"/>
<!-- Blue bottom stripe -->
<rect x="56" y="323" width="400" height="133" fill="#21468B"/>
```

#### Austria (Red-White-Red)

```xml
<!-- Red top stripe -->
<rect x="56" y="56" width="400" height="134" fill="#ED2939"/>
<!-- White middle stripe -->
<rect x="56" y="190" width="400" height="133" fill="#FFFFFF"/>
<!-- Red bottom stripe -->
<rect x="56" y="323" width="400" height="133" fill="#ED2939"/>
```

---

## 2. Vertical Stripes

### Three Vertical Stripes (Tricolor)

Each stripe is 400/3 = ~133.33px wide.

#### France (Blue-White-Red)

```xml
<!-- Blue left stripe -->
<rect x="56" y="56" width="134" height="400" fill="#002395"/>
<!-- White center stripe -->
<rect x="190" y="56" width="133" height="400" fill="#FFFFFF"/>
<!-- Red right stripe -->
<rect x="323" y="56" width="133" height="400" fill="#ED2939"/>
```

#### Italy (Green-White-Red)

```xml
<!-- Green left stripe -->
<rect x="56" y="56" width="134" height="400" fill="#008C45"/>
<!-- White center stripe -->
<rect x="190" y="56" width="133" height="400" fill="#FFFFFF"/>
<!-- Red right stripe -->
<rect x="323" y="56" width="133" height="400" fill="#CD212A"/>
```

#### Ireland (Green-White-Orange)

```xml
<!-- Green left stripe -->
<rect x="56" y="56" width="134" height="400" fill="#169B62"/>
<!-- White center stripe -->
<rect x="190" y="56" width="133" height="400" fill="#FFFFFF"/>
<!-- Orange right stripe -->
<rect x="323" y="56" width="133" height="400" fill="#FF883E"/>
```

#### Belgium (Black-Yellow-Red)

```xml
<!-- Black left stripe -->
<rect x="56" y="56" width="134" height="400" fill="#000000"/>
<!-- Yellow center stripe -->
<rect x="190" y="56" width="133" height="400" fill="#FDDA24"/>
<!-- Red right stripe -->
<rect x="323" y="56" width="133" height="400" fill="#EF3340"/>
```

---

## 3. Cross Patterns

### Nordic Cross (Sweden, Finland, Norway, Denmark)

The Nordic cross is offset to the left. The cross consists of a vertical bar and a horizontal bar overlaid on a background color.

#### Sweden (Blue background, Yellow cross)

```xml
<!-- Blue background -->
<rect x="56" y="56" width="400" height="400" fill="#006AA7"/>
<!-- Yellow horizontal bar -->
<rect x="56" y="224" width="400" height="64" fill="#FECC00"/>
<!-- Yellow vertical bar (offset left) -->
<rect x="176" y="56" width="64" height="400" fill="#FECC00"/>
```

#### Finland (White background, Blue cross)

```xml
<!-- White background -->
<rect x="56" y="56" width="400" height="400" fill="#FFFFFF"/>
<!-- Blue horizontal bar -->
<rect x="56" y="224" width="400" height="64" fill="#003580"/>
<!-- Blue vertical bar (offset left) -->
<rect x="176" y="56" width="64" height="400" fill="#003580"/>
```

#### Denmark (Red background, White cross)

```xml
<!-- Red background -->
<rect x="56" y="56" width="400" height="400" fill="#C60C30"/>
<!-- White horizontal bar -->
<rect x="56" y="228" width="400" height="56" fill="#FFFFFF"/>
<!-- White vertical bar (offset left) -->
<rect x="180" y="56" width="56" height="400" fill="#FFFFFF"/>
```

#### Norway (Red background, Blue-bordered white cross)

```xml
<!-- Red background -->
<rect x="56" y="56" width="400" height="400" fill="#BA0C2F"/>
<!-- White horizontal bar -->
<rect x="56" y="220" width="400" height="72" fill="#FFFFFF"/>
<!-- White vertical bar (offset left) -->
<rect x="172" y="56" width="72" height="400" fill="#FFFFFF"/>
<!-- Blue horizontal bar (inner) -->
<rect x="56" y="232" width="400" height="48" fill="#00205B"/>
<!-- Blue vertical bar (inner, offset left) -->
<rect x="184" y="56" width="48" height="400" fill="#00205B"/>
```

### Swiss Cross (Switzerland)

```xml
<!-- Red background -->
<rect x="56" y="56" width="400" height="400" fill="#DA291C"/>
<!-- White vertical bar of cross -->
<rect x="224" y="156" width="64" height="200" fill="#FFFFFF"/>
<!-- White horizontal bar of cross -->
<rect x="156" y="224" width="200" height="64" fill="#FFFFFF"/>
```

---

## 4. Union Jack (United Kingdom)

The Union Jack is a complex layered pattern. This is a simplified but recognizable version.

```xml
<!-- Blue background -->
<rect x="56" y="56" width="400" height="400" fill="#012169"/>

<!-- White diagonal cross (St Andrew's + St Patrick's base) -->
<line x1="56" y1="56" x2="456" y2="456" stroke="#FFFFFF" stroke-width="48"/>
<line x1="456" y1="56" x2="56" y2="456" stroke="#FFFFFF" stroke-width="48"/>

<!-- Red diagonal cross (St Patrick's) -->
<line x1="56" y1="56" x2="456" y2="456" stroke="#C8102E" stroke-width="16"/>
<line x1="456" y1="56" x2="56" y2="456" stroke="#C8102E" stroke-width="16"/>

<!-- White vertical and horizontal cross (St George's base) -->
<rect x="56" y="228" width="400" height="56" fill="#FFFFFF"/>
<rect x="228" y="56" width="56" height="400" fill="#FFFFFF"/>

<!-- Red vertical and horizontal cross (St George's) -->
<rect x="56" y="236" width="400" height="40" fill="#C8102E"/>
<rect x="236" y="56" width="40" height="400" fill="#C8102E"/>
```

---

## 5. Special Patterns

### Japan (White background, Red circle)

```xml
<!-- White background -->
<rect x="56" y="56" width="400" height="400" fill="#FFFFFF"/>
<!-- Red sun disc -->
<circle cx="256" cy="256" r="80" fill="#BC002D"/>
```

### USA (Simplified)

A simplified version suitable for countryball art.

```xml
<!-- Red background (for stripes) -->
<rect x="56" y="56" width="400" height="400" fill="#B22234"/>

<!-- White stripes (7 red + 6 white = 13 stripes, each ~30.8px) -->
<rect x="56" y="87" width="400" height="31" fill="#FFFFFF"/>
<rect x="56" y="149" width="400" height="31" fill="#FFFFFF"/>
<rect x="56" y="211" width="400" height="31" fill="#FFFFFF"/>
<rect x="56" y="273" width="400" height="31" fill="#FFFFFF"/>
<rect x="56" y="335" width="400" height="31" fill="#FFFFFF"/>
<rect x="56" y="397" width="400" height="31" fill="#FFFFFF"/>

<!-- Blue canton -->
<rect x="56" y="56" width="168" height="216" fill="#3C3B6E"/>

<!-- Stars (simplified: rows of small white circles) -->
<circle cx="90" cy="80" r="5" fill="#FFFFFF"/>
<circle cx="110" cy="80" r="5" fill="#FFFFFF"/>
<circle cx="130" cy="80" r="5" fill="#FFFFFF"/>
<circle cx="150" cy="80" r="5" fill="#FFFFFF"/>
<circle cx="170" cy="80" r="5" fill="#FFFFFF"/>
<circle cx="190" cy="80" r="5" fill="#FFFFFF"/>
<circle cx="100" cy="100" r="5" fill="#FFFFFF"/>
<circle cx="120" cy="100" r="5" fill="#FFFFFF"/>
<circle cx="140" cy="100" r="5" fill="#FFFFFF"/>
<circle cx="160" cy="100" r="5" fill="#FFFFFF"/>
<circle cx="180" cy="100" r="5" fill="#FFFFFF"/>
<circle cx="90" cy="120" r="5" fill="#FFFFFF"/>
<circle cx="110" cy="120" r="5" fill="#FFFFFF"/>
<circle cx="130" cy="120" r="5" fill="#FFFFFF"/>
<circle cx="150" cy="120" r="5" fill="#FFFFFF"/>
<circle cx="170" cy="120" r="5" fill="#FFFFFF"/>
<circle cx="190" cy="120" r="5" fill="#FFFFFF"/>
<circle cx="100" cy="140" r="5" fill="#FFFFFF"/>
<circle cx="120" cy="140" r="5" fill="#FFFFFF"/>
<circle cx="140" cy="140" r="5" fill="#FFFFFF"/>
<circle cx="160" cy="140" r="5" fill="#FFFFFF"/>
<circle cx="180" cy="140" r="5" fill="#FFFFFF"/>
<circle cx="90" cy="160" r="5" fill="#FFFFFF"/>
<circle cx="110" cy="160" r="5" fill="#FFFFFF"/>
<circle cx="130" cy="160" r="5" fill="#FFFFFF"/>
<circle cx="150" cy="160" r="5" fill="#FFFFFF"/>
<circle cx="170" cy="160" r="5" fill="#FFFFFF"/>
<circle cx="190" cy="160" r="5" fill="#FFFFFF"/>
```

### South Korea (Simplified)

A simplified version capturing the essential visual elements.

```xml
<!-- White background -->
<rect x="56" y="56" width="400" height="400" fill="#FFFFFF"/>

<!-- Red (upper) half of taegeuk -->
<path d="M 256 196 A 60 60 0 0 1 256 316 A 30 30 0 0 0 256 256 A 30 30 0 0 1 256 196"
      fill="#CD2E3A"/>

<!-- Blue (lower) half of taegeuk -->
<path d="M 256 316 A 60 60 0 0 1 256 196 A 30 30 0 0 0 256 256 A 30 30 0 0 1 256 316"
      fill="#0047A0"/>

<!-- Trigram bars (simplified - 4 groups of 3 lines each) -->
<!-- Top-left trigram -->
<line x1="148" y1="128" x2="192" y2="100" stroke="#000" stroke-width="6"/>
<line x1="142" y1="138" x2="186" y2="110" stroke="#000" stroke-width="6"/>
<line x1="136" y1="148" x2="180" y2="120" stroke="#000" stroke-width="6"/>

<!-- Top-right trigram -->
<line x1="320" y1="100" x2="364" y2="128" stroke="#000" stroke-width="6"/>
<line x1="326" y1="110" x2="370" y2="138" stroke="#000" stroke-width="6"/>
<line x1="332" y1="120" x2="376" y2="148" stroke="#000" stroke-width="6"/>

<!-- Bottom-left trigram -->
<line x1="136" y1="364" x2="180" y2="392" stroke="#000" stroke-width="6"/>
<line x1="142" y1="374" x2="186" y2="402" stroke="#000" stroke-width="6"/>
<line x1="148" y1="384" x2="192" y2="412" stroke="#000" stroke-width="6"/>

<!-- Bottom-right trigram -->
<line x1="332" y1="392" x2="376" y2="364" stroke="#000" stroke-width="6"/>
<line x1="326" y1="402" x2="370" y2="374" stroke="#000" stroke-width="6"/>
<line x1="320" y1="412" x2="364" y2="384" stroke="#000" stroke-width="6"/>
```

---

## 6. Tricolor Templates

### Horizontal Tricolor Template

Replace colors as needed. The clip area spans y=56 to y=456 (400px total), so each stripe is ~133px tall.

```xml
<rect x="56" y="56"  width="400" height="134" fill="{TOP_COLOR}"/>
<rect x="56" y="190" width="400" height="133" fill="{MIDDLE_COLOR}"/>
<rect x="56" y="323" width="400" height="133" fill="{BOTTOM_COLOR}"/>
```

### Vertical Tricolor Template

The clip area spans x=56 to x=456 (400px total), so each stripe is ~133px wide.

```xml
<rect x="56"  y="56" width="134" height="400" fill="{LEFT_COLOR}"/>
<rect x="190" y="56" width="133" height="400" fill="{CENTER_COLOR}"/>
<rect x="323" y="56" width="133" height="400" fill="{RIGHT_COLOR}"/>
```

---

## Color Reference Table

| Country | Colors (hex) |
|---------|-------------|
| Poland | `#FFFFFF` (white), `#DC143C` (red) |
| Germany | `#000000` (black), `#DD0000` (red), `#FFCC00` (gold) |
| France | `#002395` (blue), `#FFFFFF` (white), `#ED2939` (red) |
| Italy | `#008C45` (green), `#FFFFFF` (white), `#CD212A` (red) |
| Russia | `#FFFFFF` (white), `#0039A6` (blue), `#D52B1E` (red) |
| Ukraine | `#005BBB` (blue), `#FFD500` (yellow) |
| UK | `#012169` (blue), `#FFFFFF` (white), `#C8102E` (red) |
| Sweden | `#006AA7` (blue), `#FECC00` (yellow) |
| Finland | `#FFFFFF` (white), `#003580` (blue) |
| Denmark | `#C60C30` (red), `#FFFFFF` (white) |
| Norway | `#BA0C2F` (red), `#FFFFFF` (white), `#00205B` (blue) |
| Switzerland | `#DA291C` (red), `#FFFFFF` (white) |
| Japan | `#FFFFFF` (white), `#BC002D` (red) |
| USA | `#B22234` (red), `#FFFFFF` (white), `#3C3B6E` (blue) |
| South Korea | `#FFFFFF` (white), `#CD2E3A` (red), `#0047A0` (blue), `#000000` (black) |
| Netherlands | `#AE1C28` (red), `#FFFFFF` (white), `#21468B` (blue) |
| Austria | `#ED2939` (red), `#FFFFFF` (white) |
| Ireland | `#169B62` (green), `#FFFFFF` (white), `#FF883E` (orange) |
| Belgium | `#000000` (black), `#FDDA24` (yellow), `#EF3340` (red) |
