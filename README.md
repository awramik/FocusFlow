# <img src="./public/app-logo.svg" width="32" alt="FocusFlow logo" /> FocusFlow

FocusFlow to aplikacja wspierająca **organizację pracy i koncentrację**. Łączy widoki zadań, tablicę Kanban, tryb skupienia oraz podstawowe statystyki produktywności w jednym interfejsie.

<div style="border: 1px solid #3b82f6; border-left: 6px solid #2563eb; border-radius: 8px; padding: 14px 16px; background: #eff6ff; color: #1e3a8a; font-size: 14px; line-height: 1.6; font-weight: 500;">
  <span>
    Projekt wykorzystuje <strong>hybrydowe podejście do zarządzania danymi</strong>. Do obsługi systemu użytkowników, bezpiecznej rejestracji oraz autentykacji wykorzystywana jest usługa <strong>Firebase Auth</strong>. Z kolei dynamiczny stan aplikacji (zadania, ustawienia timera, statystyki) zarządzany jest lokalnie po stronie frontendu za pomocą React Context API (oraz opcjonalnie LocalStorage). Taka konfiguracja pozwala na zademonstrowanie integracji z zewnętrznymi usługami chmurowymi (BaaS) bez konieczności budowania pełnego, dedykowanego backendu.
  </span>
</div>

## Demo

[🎬 Demo FocusFlow](https://1drv.ms/v/c/c12cc8192df5b9d1/IQBpYgujHR4-SJqVk1yTPrd-ASzRKiBa-6I8E_VDVhQqYPI?e=3kAFdv)

## Stack technologiczny

| Gdzie | Co |
| --- | --- |
| Frontend | ![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) |
| Build tool | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E) |
| Style | ![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white) |
| Ikony | ![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-1E293B?style=for-the-badge&logo=lucide&logoColor=white) |

## Funkcjonalności

| Obszar | Funkcjonalności |
| --- | --- |
| Organizacja pracy | Dashboard z podsumowaniem aktywności, widok zadań na dzisiaj, lista wszystkich zadań, tablica Kanban i widok kalendarza. |
| Koncentracja | Tryb skupienia oraz timer Pomodoro. |
| Analityka | Osobny widok z wykresem produktywności i osiągnięciami. |
| Ustawienia i dane | Tworzenie konta i autoryzacja użytkowników, edycja profilu, synchronizacja danych w chmurze, konfiguracja timera, opcje prywatności i eksport historii pracy do pliku JSON. |
| Integracje | Firebase (baza danych i uwierzytelnianie), Google Analytics oraz Hotjar/Contentsquare przez zmienne środowiskowe. |

## Status projektu

Aplikacja jest w pełni funkcjonalnym prototypem frontendowym z działającym modułem autoryzacji użytkowników w chmurze. 

Planowane kierunki dalszego rozwoju projektu:
- **Pełna migracja danych do Firestore**, tj. przeniesienie lokalnego stanu zadań (obecnie przetwarzanego w Context API) do bazy Firebase Firestore, aby zapewnić trwałość danych po wylogowaniu,
- **Wdrożenie trybu Offline (PWA)**, czyli zastosowanie mechanizmu *Service Workers* do cache'owania widoków,
- **Rozbudowana analityka**.

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

## Struktura projektu

```text
├── public/                 # Pliki statyczne dostępne publicznie (m.in. favicon)
├── src/                    # Główny kod źródłowy aplikacji
│   ├── assets/             # Zasoby statyczne importowane w kodzie (m.in. Ferdynand, grafiki)
│   ├── components/         # Globalne, reużywalne komponenty UI (m.in. panele boczne)
│   ├── context/            # Globalny stan aplikacji (React Context API)
│   ├── data/               # Mockowe dane
│   ├── pages/              # Komponenty reprezentujące całe widoki/strony (m.in. Dashboard, Kanban, Analytics)
│   ├── style/              # Pliki stylów CSS / arkusze globalne
│   ├── analytics.js        # Konfiguracja analityki (Google Analytics / Hotjar)
│   ├── firebase.js         # Inicjalizacja i konfiguracja połączenia z Firebase
│   └── main.jsx            # Punkt wejścia aplikacji dla narzędzia Vite
├── .env.example            # Szablon zmiennych środowiskowych (klucze API)
├── eslint.config.js        # Konfiguracja lintera (ESLint) dla zachowania czystości kodu
├── index.html              # Główny plik HTML aplikacji (używany przez Vite)
└── package.json            # Manifest projektu, skrypty uruchomieniowe i zależności
```

## Routing i strony

Aplikacja wykorzystuje bibliotekę `react-router-dom` do obsługi nawigacji i deklaratywnego routingu. Wszystkie główne widoki znajdują się w katalogu `src/pages/`.

### Podział na podstrony i ścieżki

| Widok (komponent) | Ścieżka (URL) | Opis funkcjonalności |
| --- | --- | --- |
| `Auth` | `/auth` | Panel logowania i rejestracji. Posiada wbudowany efekt (`useEffect`), który automatycznie przekierowuje zalogowanego użytkownika (`currentUser`) na pulpit po wykryciu aktywnej sesji. |
| `Dashboard` | `/dashboard` |Główny pulpit agregujący statystyki wykonania celu (completionPercentage), zsynchronizowany mini-timer Pomodoro oraz listę 3 najbliższych zadań. Wykorzystuje `useMemo` do kalkulacji Focus Streak oraz Peak Velocity (inteligentna analiza efektywności). Dynamicznie pobiera porady z lokalnego pliku konfiguracyjnego oraz zawiera ukryte interaktywne elementy wyzwalające motywacyjne pliki GIF. Umożliwia wywołanie natywnego okna drukowania raportu wydajności do PDF. |
| `AllTasks` | `/tasks` | Centralna lista wszystkich aktywnych zadań z zaawansowanym systemem filtrowania (priorytet, projekt, data), wyszukiwarką oraz formularzem szybkiego dodawania zadań. |
| `Today` | `/today` | Widok zadań na bieżący dzień, podzielony na przejrzyste sekcje dla pozycji aktywnych i ukończonych wraz z ich licznikiem. Oferuje wysuwany formularz do szybkiego dodawania nowych zadań z priorytetami i tagami, inteligentny przycisk ułatwiający przewijanie długiej listy oraz boczny panel analityczny. Z poziomu listy można błyskawicznie zmieniać status zadań, usuwać je lub przechodzić do ich szczegółów. |
| `Kanban` | `/kanban` | Interaktywna tablica workflow podzielona na 3 sztywne kolumny: `To do`, `Doing` oraz `Done`. Obsługuje natywny mechanizm **Drag & Drop** (`onDragStart`, `onDrop`) połączony z natychmiastową aktualizacją stanu zadań w lokalnym React Context API poprzez funkcję `updateTaskStatus`. Pozwala również na tworzenie nowych zadań oraz zawiera zaawansowane mechanizmy wyszukiwania i filtrowania. |
| `TaskDetails` | `/kanban/:id` | Dynamiczny widok szczegółów wybranego zadania (pobieranego z kontekstu po ID), który w razie błędu automatycznie cofa użytkownika do poprzedniej strony. Umożliwia wygodne dodawanie i usuwanie komentarzy w pamięci podręcznej komponentu, lokalne dodawanie załączników z czytelnym podglądem ich rozmiaru oraz przeglądanie metadanych (tagi, terminy, awatar). Usunięcie zadania modyfikuje stan globalny kontentu i przekierowuje na pulpit.|
| `FocusMode` | `/focus` | Tryb pracy głębokiej (*Deep focus*). Podczas montowania komponentu dynamicznie wstrzykuje klasę systemową `focus-mode-active` do globalnego elementu `document.body`, całkowicie ukrywając i izolując interfejs od bocznych rozpraszaczy. |
| `Calendar` | `/calendar` | Widok kalendarza z kropkowymi indykatorami statusu zadań, licznikiem miesięcznym, panelem podglądu deadline'ów wybranego dnia i przyciskiem powrotu. |
| `Analytics` | `/analytics` | Panel statystyk z wykresem słupkowym, dynamiczną linią średniej, systemem odznak (milestones) oraz bocznym panelem z poradami i mini-stoperem Pomodoro. |
| `Settings` | `/settings` | Zaawansowany panel do zarządzania środowiskiem pracy, który konfiguruje lokalny profil użytkownika i parametry wydajności w stanie aplikacji. Pozwala na dostosowanie motywu wizualnego aplikacji (tryb ciemny/jasny) oraz elastyczne definiowanie czasu Pomodoro, przerw i dziennych celów skupienia za pomocą wygodnych suwaków. Całość uzupełniają opcje zarządzania danymi, tj. szybki eksport historii do pliku JSON oraz funkcja resetowania lokalnych statystyk. |

---

## Zarządzanie stanem i przepływ danych

Globalny stan aplikacji oraz logika biznesowa zostały odseparowane od warstwy prezentacji za pomocą **React Context API** (wzorzec *Provider Pattern*). Dane są dystrybuowane w dół drzewa komponentów przy użyciu własnych hooków (*Custom Hooks*), co całkowicie eliminuje problem *prop drilling*.

W projekcie wydzielono trzy wyspecjalizowane konteksty:

### 1. AuthContext (`useAuth`)

* odpowiada za **uwierzytelnianie (BaaS)**, tj. zarządza sesją użytkownika w oparciu o usługę **Firebase Auth** (`onAuthStateChanged`).
* umożliwia tworzenie **profilu w chmurze**, czyli wykorzystuje mechanizm **Firestore `onSnapshot`** do ciągłego, asynchronicznego nasłuchiwania zmian w dokumencie profilowym zalogowanego użytkownika (kolekcja `users`).

### 2. TaskContext (`useTasks`)

Centralny menedżer stanów aplikacji, który realnie integruje operacje na bazie danych z logiką biznesową interfejsu. Odpowiada m.in. za:

* **Synchronizację zadań (real-time)**, tj. odbiera zadania z kolekcji `tasks` w Firestore, filtrując je po unikalnym `userId` zalogowanego użytkownika. Zastosowanie metody `onSnapshot` sprawia, że jakakolwiek zmiana w bazie (dodanie, usunięcie, `drag&drop` na Kanbanie) natychmiast i bez przeładowania strony odświeża interfejs.
* **Zarządzanie cyklem życia zadań** odpowiadając za asynchroniczne metody `addTask` (`addDoc`), `deleteTask` (`deleteDoc`) oraz `updateTaskStatus` (`updateDoc`).
* **Ewolucję Pana Ferdynanda**, jako iż śledzi punkty doświadczenia użytkownika (`currentXP`). Specjalny efekt automatycznie przelicza próg punktowy i w przypadku awansu (etapy 1-5) modyfikuje pole w bazie danych, zmieniając wygląd maskotki projektu.
* **Obsługę timera Pomodoro** zarządzając odliczaniem czasu skupienia, odtwarzaniem dźwięków oraz natywnymi powiadomieniami (Web Notifications API). Po skończonej sesji automatycznie dopisuje sekundy i punkty XP do profilu użytkownika w Firestore. Dodatkowo licznik w tle co minutę aktualizuje bieżący czas pracy, dbając o automatyczny reset celów wraz z nowym dniem.

### 3. ThemeContext (`useTheme`)

* odpowiada za globalne przełączanie motywów wizualnych (ciemny/jasny).
* zapisuje preferencje użytkownika lokalnie w `LocalStorage`, dzięki czemu interfejs zachowuje spójność przy ponownym otwarciu przeglądarki.
* bezpośrednio manipuluje drzewem DOM poprzez dynamiczne wstrzykiwanie odpowiedniej klasy do elementu `document.body` oraz podmianę plików ikon (favicon-light.svg / favicon-dark.svg) w nagłówku strony `index.html`.
