
# Specificații proiect

## 1. Descriere generală
Aplicația pe care o vom realiza are ca scop monitorizarea prezenței participanților la diverse activități, precum: cursuri, laboratoare, workshop-uri sau întâlniri. Vrem să înlocuim metoda clasică a prezenței pe hârtie cu un sistem digital, ușor de folosit atât de organizatori, cât și de participanți.  
Aplicația va putea fi accesată din browser, de pe calculator, laptop, telefon sau tabletă, fiind construită sub forma unei aplicații de tip Single Page Application (SPA).  
La accesarea aplicației, utilizatorul poate alege între două roluri:
- Participant
- Organizator  

Cele două roluri au funcționalități diferite, descrise mai jos.

---

## 2. Actorii aplicației

### 2.1. Organizatorul evenimentului (OE)
Este persoana care creează și administrează evenimentele. Poate fi profesor, trainer, coordonator etc.

Funcții principale:
- creare și editare grupuri de evenimente (ex.: un curs care durează tot semestrul),
- vizualizare evenimentele generate în grup,
- afișare cod / cod QR al fiecărui eveniment,
- vizualizarea în timp real a participanților prezenți,
- exportul listelor de prezență.

Pentru a avea acces la aceste funcții, organizatorul trebuie:
- să își creeze un cont, sau
- să se autentifice dacă are deja unul.

### 2.2. Participantul
Este persoana care participă efectiv la eveniment (student, angajat etc.).  
Participantul nu are nevoie de cont. Tot ce trebuie să facă este:
- să introducă codul sau să scaneze codul QR,
- să își introducă numele (emailul și alte date la alegerea organizatorului),
- să confirme prezența.

---

## 3. Elemente principale ale aplicației

### 3.1. Grupul de evenimente
Un grup de evenimente reprezintă o serie de activități legate între ele. De exemplu:
- „Curs Tehnologii Web – seria C”
- „Workshop Design – ediția 2025”

Un grup de evenimente conține:
- titlu,
- descriere,
- perioada în care are loc,
- opțional: recurență (ex.: „în fiecare joi, ora 10:30–11:50”).

### 3.2. Evenimentul
Un eveniment este o sesiune individuală dintr-un grup. De exemplu, cursul de joi din săptămâna curentă.

Un eveniment are:
- data și ora de început,
- data și ora de sfârșit,
- un cod de acces unic generat automat,
- un cod QR care conține același cod,
- o stare care poate fi:
  - CLOSED – înainte de începerea evenimentului,
  - OPEN – în intervalul în care evenimentul este activ,
  - CLOSED – după ce s-a încheiat.

Evenimentul este deschis automat de aplicație atunci când ajunge timpul programat și se închide tot automat după ce trece ora de final.

### 3.3. Participantul
Fiecare participant are un nume și, la alegerea organizatorului care a creat evenimentul, un email sau un identificator.  
Acesta folosește aplicația doar pentru confirmarea prezenței și nu are nevoie de un cont.

### 3.4. Înregistrarea de prezență
O înregistrare de prezență arată că un participant a fost prezent la un anumit eveniment. Aceasta conține:
- evenimentul la care a participat,
- numele sau identificatorul participantului,
- momentul exact în care și-a confirmat prezența.

---

## 4. Logica de funcționare (scenarii principale)

### 4.0. Alegerea rolului la început
La deschiderea aplicației, utilizatorul poate alege:
- „Participant” = este dus direct la pagina unde poate introduce codul evenimentului sau poate scana QR-ul.
- „Organizator” = trebuie fie să creeze un cont, fie să se autentifice; apoi are acces la panoul de administrare.

---

### 4.1. Crearea unui grup de evenimente
Organizatorul intră în aplicație și creează un grup nou, introducând:
- titlu,
- descriere,
- perioada în care vor avea loc evenimentele,
- recurența (opțional).

Dacă este setată recurența, aplicația poate genera automat toate evenimentele aferente perioadei.

---

### 4.2. Generarea evenimentelor
Pentru fiecare eveniment, aplicația:
- creează o înregistrare nouă,
- generează un cod unic,
- generează un cod QR,
- setează starea evenimentului ca fiind CLOSED.

---

### 4.3. Desfășurarea unui eveniment
La momentul stabilit:
- când începe evenimentul, aplicația îl trece automat în starea OPEN,
- în acest timp participanții își pot confirma prezența,
- după terminare, evenimentul revine în starea CLOSED și nu mai permite înregistrări.

Organizatorul poate afișa pe un ecran codul și codul QR ca să fie ușor de accesat.

---

### 4.4. Confirmarea prezenței de către participanți

Participanții au două modalități:

#### Metoda 1: Introducerea codului text
1. Participantul selectează rolul „Participant”.
2. Introduce codul evenimentului (ex.: XJ4D92).
3. Introduce numele / emailul.
4. Apasă „Confirmă prezența”.  
Dacă evenimentul este OPEN, prezența se înregistrează.

#### Metoda 2: Scanarea codului QR
1. Participantul accesează pagina „Scanează QR”.
2. Deschide camera.
3. Codul QR este detectat și decodează automat codul evenimentului.  
Restul procesului este identic cu introducerea manuală a codului.

---

### 4.5. Vizualizarea prezenței
Organizatorul poate vedea, pentru fiecare eveniment:
- cine a venit,
- la ce oră s-a înregistrat prezența fiecăruia.

Este util pentru verificarea prezenței în timp real.

---

### 4.6. Exportul listei de participanți
Organizatorul poate exporta datele de prezență în două formate:
- CSV, sau
- XLSX (Excel).

Exportul se poate face:
- pentru un singur eveniment,
- pentru toate evenimentele unui grup (de exemplu, pentru întreg semestrul).

---

## 5. Reguli de funcționare
- Prezențele pot fi înregistrate doar când evenimentul este în starea OPEN.
- Un participant nu poate fi înregistrat de două ori la același eveniment.
- Codul evenimentului este unic.
- Organizatorul poate accesa doar grupurile și evenimentele pe care le deține.
- Participanții nu pot vedea numele altor participanți, doar își marchează propria prezență.

---

## 6. Funcționalități opționale / îmbunătățiri viitoare
Pe parcursul dezvoltării proiectului este posibil să adaugăm și alte funcționalități, în funcție de ideile care apar sau de timpul disponibil. Aplicația este gândită astfel încât să poată fi extinsă ușor, fără să afecteze funcțiile de bază.

Câteva exemple de îmbunătățiri pe care le-am putea include ulterior sunt:
- posibilitatea ca participanții să aibă propriul cont și să își vadă istoricul de prezențe,
- statistici despre prezență (grafice, rapoarte, procente),
- opțiuni avansate de filtrare și sortare pentru organizatori,
- trimiterea de notificări sau emailuri,
- generarea unor rapoarte automate pentru grupuri mari de evenimente.

Aceste funcționalități nu sunt obligatorii pentru versiunea inițială, dar pot fi adăugate ulterior dacă va fi necesar sau dacă vom considera că aduc valoare aplicației.

---

## 7. Plan de dezvoltare (etape)
- Analizăm cerințele – 1 săptămână  
  Ne familiarizăm cu funcționalitățile necesare și stabilim direcția proiectului.
- Stabilim designul arhitectural – 1 săptămână  
  Decidem structura aplicației și modul în care vor comunica componentele.
- Dezvoltăm backend-ul și API-ul – 2 săptămâni  
  Implementăm logica de server, modelele și rutele API-ului.
- Construim interfața front-end (SPA) – 3 săptămâni  
  Realizăm paginile aplicației și fluxurile pentru organizatori și participanți.
- Integrăm sistemul de QR și logica de prezență – 1–2 săptămâni  
  Adăugăm funcționalitățile pentru generarea și scanarea codurilor QR.
- Testăm aplicația – 1 săptămână  
  Verificăm funcționalitățile și rezolvăm eventualele probleme.
- Realizăm deploy-ul – 2 zile  
  Publicăm aplicația și verificăm funcționarea ei online.
