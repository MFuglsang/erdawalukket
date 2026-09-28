# DAWA Nedtælling

Statisk side med nedtælling til DAWA (Danmarks Adressers Web API) lukker torsdag d. 1. oktober 2026 kl. 10:00 (dansk tid), samt live statustjek af DAWA hvert 30. sekund.

## Filer

- `index.html` – sidens struktur
- `style.css` – Independence Day-inspireret "LED/CRT"-look
- `script.js` – nedtælling + statustjek mod `https://api.dataforsyningen.dk/adresser`

## Kør lokalt

Åbn blot `index.html` i en browser, eller kør en lokal server, fx:

```powershell
python -m http.server 8000
```

og gå til `http://localhost:8000`.

## Udgiv på GitHub Pages

1. Push indholdet til et GitHub-repo (branch `main`).
2. Gå til repoets **Settings → Pages**.
3. Under **Build and deployment**, vælg **Deploy from a branch**, branch `main`, mappe `/ (root)`.
4. Gem – siden bliver tilgængelig på `https://<bruger>.github.io/<repo>/` efter kort tid.

## Noter

- Måltidspunktet er hardkodet som `2026-10-01T10:00:00+02:00`, hvilket er korrekt dansk sommertid på datoen (sommertid slutter først 25. okt 2026).
- Statustjekket bruger `fetch` med en 8 sekunders timeout. Kan API'et ikke svare (netværksfejl, timeout, fejlkode), vises "DAWA ER LUKKET" i rødt. Svarer API'et med succes, vises "DAWA ER OPPE" i grønt.
- Tidsstemplet for seneste tjek vises altid i dansk tid (`Europe/Copenhagen`), uanset besøgendes egen tidszone.
