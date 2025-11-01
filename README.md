# **FLOWer Recruit (React Refactor)**

Jest to nowe repozytorium dla FLOWer Recruit, zbudowane od zera przy użyciu React, Vite, TypeScript i Zustand. Projekt ten zastępuje monolityczny flower.html, implementując nowoczesną, modularną architekturę front-endową.

Celem było stworzenie szkieletu aplikacji, który jest gotowy do dalszego rozwoju funkcji rekrutacyjnych (opisanych w PDF), z zachowaniem oryginalnego wyglądu i geometrii sceny heksagonalnej.

## **🚀 Uruchomienie**

1. **Instalacja zależności:**  
   npm install

2. **Uruchomienie serwera deweloperskiego:**  
   npm run dev

Aplikacja będzie dostępna pod adresem http://localhost:5173 (lub innym wolnym porcie).

## **🎯 Kluczowe Różnice vs flower.html**

Ten refaktor to nie jest kopia 1:1. Logika została zaimplementowana na nowo, aby pasowała do wzorców React:

1. **Brak "Define Space" (Krytyczna Zmiana):**  
   * Zgodnie z poleceniem, cała logika DefineSpaceModal (wybór typu przestrzeni) została **usunięta**.  
   * Kliknięcie (pojedyncze) w heksagon aktywuje go w panelu bocznym.  
   * **Podwójne kliknięcie** w heksagon (poza centrum) otwiera bezpośrednio RecruitModal.tsx (dawny \#hexModal).  
2. **Zarządzanie Stanem:**  
   * **flower.html:** Używał globalnego obiektu state \= {} i ręcznej mutacji.  
   * **React:** Używa **Zustand** (src/state/useHexStore.ts) jako centralnego magazynu stanu. Stan jest reaktywny i automatycznie zapisywany w localStorage dzięki persist middleware.  
3. **Renderowanie Sceny:**  
   * **flower.html:** Ręczne budowanie stringów SVG i manipulacja DOM (gridEl.innerHTML \= ...).  
   * **React:** Stage.tsx używa hooka useBounds do mierzenia kontenera, oblicza układ, a następnie renderuje 37 komponentów \<Hex /\> w pętli.  
4. **Geometria i Logika:**  
   * **flower.html:** Funkcje axialToPixel, hexPoints itp. były wymieszane z logiką aplikacji.  
   * **React:** Czyste funkcje geometryczne zostały wydzielone do src/lib/geometry.ts.  
5. **Mock API:**  
   * **flower.html:** Logika mockAssistant i buildHexContext była osadzona w tagu \<script\>.  
   * **React:** Została przeniesiona do src/lib/api.ts i jest asynchronicznie wywoływana z komponentu AIPanel.tsx.  
6. **Style:**  
   * **flower.html:** Wszystkie style w jednym tagu \<style\>.  
   * **React:** Używa **TailwindCSS** (skonfigurowanego w tailwind.config.js z kolorami z :root) oraz dedykowanych plików CSS dla komponentów (hex.css, modal.css).

## **✅ Checklista Testów (Happy Path)**

Po uruchomieniu npm run dev, sprawdź następujące funkcje:

1. \[ \] **Start Aplikacji:** Czy aplikacja ładuje się poprawnie w przeglądarce?  
2. \[ \] **Renderowanie Sceny:** Czy widać Topbar oraz 37 heksagonów (1 centralny i 3 pierścienie)?  
3. \[ \] **Aktywacja Panelu Bocznego (Pojedyncze Kliknięcie):**  
   * \[ \] Czy kliknięcie w heksagon (np. P1-1) powoduje wyświetlenie jego tytułu i statystyk w prawym panelu (AIPanel)?  
   * \[ \] Czy kliknięcie w centralny heksagon (c-0) pokazuje panel główny ("Wybierz heksagon...")?  
4. \[ \] **Funkcjonalność Panelu AI:**  
   * \[ \] Czy po aktywowaniu heksa (np. P1-1) można wpisać wiadomość w panelu AI i ją wysłać?  
   * \[ \] Czy po chwili pojawia się mockowa odpowiedź asystenta (np. "Noted: ...")?  
   * \[ \] Czy historia czatu jest widoczna?  
5. \[ \] **Otwieranie Modala (Podwójne Kliknięcie):**  
   * \[ \] Czy podwójne kliknięcie w heksagon (np. P1-1) otwiera RecruitModal?  
   * \[ \] Czy podwójne kliknięcie w centralny heksagon (c-0) **nie** otwiera modala?  
6. \[ \] **Funkcjonalność Modala:**  
   * \[ \] Czy modal wyświetla poprawny tytuł aktywnego heksa?  
   * \[ \] Czy można przełączać zakładki (np. z "Overview (JD)" na "CV Match")?  
   * \[ \] Czy można zamknąć modal przyciskiem "✕"?  
7. \[ \] **Trwałość Stanu (LocalStorage):**  
   * \[ \] Czy po wysłaniu wiadomości w panelu AI i odświeżeniu strony (F5) historia czatu dla danego heksa jest nadal widoczna?