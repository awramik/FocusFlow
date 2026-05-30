# <img src="./public/app-logo.svg" width="32" alt="FocusFlow logo" /> FocusFlow

FocusFlow to aplikacja wspierająca **organizację pracy i koncentrację**. Łączy widoki zadań, tablicę Kanban, tryb skupienia oraz podstawowe statystyki produktywności w jednym interfejsie.

<div style="border: 1px solid #ff6b6b; border-left: 6px solid #ff4d4f; border-radius: 8px; padding: 14px 16px; background: #fff1f0; color: #7a1111; font-size: 14px; line-height: 1.6; font-weight: 500;">
  <strong style="font-size: 16px; font-weight: 800;">Ważna informacja:</strong><br />
  <span>
    Projekt jest obecnie aplikacją frontendową. Nie posiada jeszcze backendu, bazy danych ani systemu autoryzacji.
    Dane i ustawienia przechowywane są lokalnie po stronie przeglądarki, a aplikacja będzie rozwijana o warstwę backendową w kolejnych etapach.
  </span>
</div>

## Demo

```md
[![Demo aplikacji](./public/demo-thumbnail.png)](LINK_DO_FILMU)
```

## Stack technologiczny

| Gdzie | Co |
| --- | --- |
| Frontend | ![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) |
| Build tool | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E) |
| Style | ![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white) |

## Funkcjonalności

| Obszar | Funkcjonalności |
| --- | --- |
| Organizacja pracy | Dashboard z podsumowaniem aktywności, widok zadań na dzisiaj, lista wszystkich zadań, tablica Kanban i widok kalendarza. |
| Koncentracja | Tryb skupienia oraz timer Pomodoro. |
| Analityka | Osobny widok z wykresem produktywności i osiągnięciami. |
| Ustawienia i dane | Edycja profilu, konfiguracja timera, opcje prywatności i eksport historii pracy do pliku JSON. |
| Integracje | Google Analytics oraz Hotjar/Contentsquare przez zmienne środowiskowe. |

## Status projektu

Aplikacja jest w fazie rozwoju. Aktualna wersja koncentruje się na interfejsie użytkownika oraz lokalnym przechowywaniu danych.

Planowane kierunki dalszej implementacji:

- backend API,
- baza danych,
- konta użytkowników i logowanie,
- rozbudowana analityka produktywności.

## Wymagania

| Gdzie | Co |
| --- | --- |
| Środowisko uruchomieniowe | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) |
| Menedżer pakietów | ![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white) |

## Uruchomienie

1. Zainstaluj zależności:

```bash
npm install
```

2. Uruchom aplikację w trybie developerskim:

```bash
npm run dev
```

3. Zbuduj wersję produkcyjną:

```bash
npm run build
```

4. Podejrzyj build produkcyjny lokalnie:

```bash
npm run preview
```

## Konfiguracja analityki

Aplikacja obsługuje poniższe zmienne środowiskowe:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_CONTENTSQUARE_UXA_SRC=https://t.contentsquare.net/uxa/xxxxxxxxxxxx.js
```

Zmienne należy ustawić w pliku `.env.local` dla środowiska lokalnego lub w panelu hostingu dla wersji produkcyjnej.
