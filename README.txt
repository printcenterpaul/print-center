PRINT CENTER — PACHET GITHUB PAGES (FĂRĂ SUBFOLDERE)

PUBLICARE SITE
1. Descarcă și dezarhivează arhiva.
2. Deschide repository-ul https://github.com/printcenterpaul/print-center
3. Încarcă toate fișierele din arhivă direct în rădăcina repository-ului. Nu crea foldere.
4. Înlocuiește fișierele existente și apasă Commit changes.
5. Așteaptă publicarea GitHub Pages, apoi reîncarcă site-ul cu Ctrl+F5.

FIȘIERE
- index.html, servicii.html, preturi.html, comanda.html, despre.html, contact.html: paginile site-ului
- style.css: stilizare responsive
- main.js: meniu mobil și formular; URL-ul Web App furnizat este deja introdus
- logo.png, printer-hero.svg: imagini
- AppsScript_Code.gs: codul backend folosit pentru Google Apps Script
- .nojekyll: configurare GitHub Pages

FORMULAR COMENZI
Formularul trimite către URL-ul Google Apps Script deja introdus în main.js. Câmpul tehnic de configurare nu este afișat clienților. Backend-ul trebuie să fie publicat ca Web App și să accepte POST cu parametrul "payload". Codul din AppsScript_Code.gs este compatibil cu formatul trimis de formular.

IMPORTANT — TEST OBLIGATORIU
Browserul folosește no-cors pentru a trimite date către Google Apps Script. Din acest motiv, pagina nu poate citi răspunsul serverului și nu poate verifica dacă fișierele au fost salvate în Google Drive. Mesajul „Comanda a fost trimisă!” confirmă că browserul a expediat cererea, nu reprezintă o confirmare independentă a salvării în Drive.

Înainte să promovezi formularul către clienți, trimite o comandă de test cu un fișier mic și verifică manual că a apărut în Google Drive, în folderul „Print Center - Comenzi”. Dacă nu apare, codul AppsScript_Code.gs trebuie copiat în proiectul Google Apps Script și redeployat ca Web App (Execute as: Me; Who has access: Anyone), apoi verificat URL-ul /exec din main.js.

CONTACT
WhatsApp: 0749 542 172
Email: paulgaiu016@gmail.com
