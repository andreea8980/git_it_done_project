-Instalare și configurare
1.	Se clonează proiectul și se accesează directorul proiectului:
-git clone https://github.com/andreea8980/git_it_done_project.git
-cd git_it_done_project
2.	Se instalează toate dependențele necesare cu comanda:
-npm install
3.	Se creează fișierul .env în rădăcina proiectului, cu următorul conținut:
4.	PORT=3000
5.	DB_NAME=presence.sqlite
6.	JWT_SECRET=cheie_secreta_pentru_jwt
•	PORT – specifică portul pe care serverul va rula (implicit 3000)
•	DB_NAME – definește numele fișierului bazei de date SQLite, care va fi creat automat
•	JWT_SECRET – cheia secretă folosită pentru generarea și verificarea token-urilor JWT, necesară autentificării securizate

-Pornirea Serverului:
1.	Se pornește serverul utilizând comanda:
-npm start
2.	Detalii importante după pornire:
•	Serverul va fi disponibil la adresa: http://localhost:3000
•	Baza de date presence.sqlite și toate tabelele necesare vor fi create automat la prima rulare
•	Rutele API disponibile sunt:
o	/api/organizatori – pentru administrarea organizatorilor
o	/api/grupuri – pentru administrarea grupurilor
o	/api/evenimente – pentru administrarea evenimentelor
o	/api/prezenta – pentru înregistrarea prezenței participanților
3.	Verificare:
Se poate accesa pagina principală în browser la:
-http://localhost:3000
•	Dacă serverul rulează corect, se va afișa mesajul de confirmare.

-Testarea API-ului
•	Pentru testarea funcționalității API-ului se recomandă utilizarea unui client REST, cum ar fi Postman.
•	Toate rutele API pot fi accesate și testate prin aceste instrumente, respectând cerințele de autentificare unde este cazul (JWT Token).
