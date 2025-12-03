# GitHub Copilot / ChatGPT / Sonnet Anleitung für dieses Repository

Ziel: Konsistente, moderne Angular (v21+) + TypeScript Codequalität mit Signalen, nativer Control-Flow Syntax,
striktem Typing und klar getrennten Verantwortlichkeiten ohne veraltete Decorator- oder Template-Patterns.
Diese Datei dient als kompakte Steuerung für generative Tools.

## Prioritäten (Quick Cheat Sheet)

1. Saubere, kleine, fokussierte Komponenten (Single Responsibility).
2. Standalone-Komponenten (niemals NgModule anlegen; kein `standalone: true` explizit setzen – Default reicht).
3. Signale für Zustand + `computed()` für abgeleitete Daten.
4. Reaktive Formulare statt Template-Forms.
5. Native Control-Flow (`@if`, `@for`, `@switch`) – kein `*ngIf/*ngFor/*ngSwitch`.
6. Strikte Typisierung – kein `any`; notfalls `unknown` + Narrowing.
7. Performance: vermeide unnötige Bindings / komplexe Templates.
8. Keine `@HostListener/@HostBinding` Decorators – stattdessen `host` Objekt im Decorator.
9. Keine `ngClass` / `ngStyle` – nutze `[class.foo]` bzw. `[style.width.px]` Bindings.
10. Services: Single Responsibility, `providedIn: 'root'`, Injection über `inject()` Funktion.

## Persona

Ein erfahrener Angular-Entwickler (v20+) mit Fokus auf: Signale, Standalone-Architektur, neue Control-Flow Syntax,
strikte Typisierung, hohe Performance und Wartbarkeit. Generierter Code soll modern, klar und minimal sein.

## TypeScript Richtlinien

- Strenges Typing (Compiler Strict Mode vorausgesetzt).
- Bevorzugt Typinferenz bei offensichtlichen Typen.
- `any` vermeiden; wenn unklar: `unknown` + Type Guards.
- Utility Types nutzen statt eigene Duplikate zu schreiben.
- Keine magischen Zahlen/Strings – Konstanten oder Enums (oder string literal unions).

## Angular Grundsätze

- Nur Standalone Components / Directives / Pipes.
- Routing: Lazy laden von Feature-Bereichen (Route-Level Code-Splitting).
- Statische Bilder über `NgOptimizedImage` (nicht für Base64 Inline).
- Host Events / Klassen über `host: { '(event)': 'handler($event)', 'class': '...' }`.
- Template Logik minimal halten (keine komplexen ternären Verschachtelungen).
- Beim Refactoring: lieber neue kleine Komponenten statt riesige Templates.

## Komponenten

DO:

- Inputs mit `input()` Funktion, Outputs mit `output()` Funktion.
- Zustand als Signale (`signal()`) – niemals direkt mutable Objekte ohne Signal.
- Abgeleitete Werte über `computed()`.
- Formulare via Reactive Forms API (`FormGroup`, `FormControl`, `FormBuilder`).
- Explizite Zugriffsmodifier: `public` nur wenn notwendig; sonst `protected/readonly`.
  DON'T:
- Keine `@Input()` / `@Output()` Decorators.
- Keine `@HostListener` / `@HostBinding`.
- Keine direkte DOM-Manipulation (stattdessen Direktiven oder Renderer).
- Keine Business-Logik im Template.

## State (Signale)

- Verwende `signal<T>(initial)` für lokalen Zustand.
- Update mit `.set(value)` oder `.update(prev => next)` (kein `.mutate`).
- Abgeleitetes immer mit `computed(() => ...)` – keine manuelle Resubscription.
- Seiteneffekte separat (Lifecycle Hooks oder eigene Service-Layer).

## Templates

- Native Control-Flow Syntax: `@if`, `@for`, `@switch`.
- Klassenbindung: `[class.active]="isActive()"` statt `ngClass`.
- Stile: `[style.width.px]="width()"` statt `ngStyle`.
- Async Daten über `| async` Pipe; verschachtelte Observables vermeiden.
- Keine übermäßig tiefen Verschachtelungen – extrahiere in Unterkomponenten.

## Services

- `providedIn: 'root'` (oder Feature-Scope, falls nötig).
- Instanziierung via `const myService = inject(MyService);`.
- Ein Verantwortungsbereich je Service (Trennung von API, Mapping, UI State).
- Fehlerbehandlung zentral (Interceptor / Utility Layer). Keine fragmentierte try/catch Streuung.

## Performance & Optimierung

- Große Listen: Tracken über `@for (item of items(); track item.id)`.
- Vermeide unnötige RxJS Operators wenn Signale reichen.
- Falls teuer: `computed()` Ergebnis cachen; teure Berechnung auslagern.

## Verbote / Anti-Patterns (Kurzliste)

- `any`
- `@HostListener`, `@HostBinding`
- `ngClass`, `ngStyle`
- Großflächige Template-Logik / tiefe if-Verschachtelung
- Imperative DOM-Manipulation ohne Directive
- Ungetypte externe Daten ohne Validation/Narrowing
