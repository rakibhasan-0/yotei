# Frontend

För att köra frontend krävs det att ett antal API:er och REACT servern körs. Detta görs enligt nedan:

### Att använda React och npm på skoldatorer

Om du har en developer branch, klona den med kommandot:

```
git clone https://git.cs.umu.se/courses-project/5dv214vt23/frontend/-/tree/[name-of-branch]
```

Om du inte har det, klona repot med kommandot:

```
git clone https://git.cs.umu.se/courses-project/5dv214vt23/frontend
```

Installera npm med kommandot: <br>
```
npm install 
```
följt av: <br>
```
npm install react-bootstrap bootstrap
```
Om error 122 kastas när npm installleras beror det på att det finns för lite minne på datorn. Radera lite filer, töm papperskorgen och försök igen. Om detta inte funkar kör <br>
```
cleanup-vscode.sh
```
i en terminal så får du ytterligare några hundra MB ledigt. Detta är för att VSCode remote-development är väldigt dålig på att städa gammalt skräpt efter sig.

Det går också att be support@cs.umu.se om extra minne. <br>

Om det uppstod fel när npm installerades se till att ta bort mappen <em>node modules</em> innan du försöker igen. <br>

### API:er för backend

API:erna körs på testservern (imp.cs.umu.se). Frontend är konfigurerat att använda sig av dem som backend. Det kräver att datorn som kör frontend är uppkopplad mot eduroam. Vid hemmajobb kan frontend köras på itchy, scratchy osv.

### Starta React appen

För att sedan starta React appen kör kommandot: <br>
```
npm start
```
Notera: Om du använder windows istället för linux som på skoldatorerna kan du behöva ändra lite i package.json filen.

REACT servern kommer per default köras på **localhost:3000**, men enligt den gateway som finns i koden är det **localhost:8080** som är rätt port. Därför behöver man byta till port **8080** manuellt i URL:en.

### Resurser:

Värdefulla resurser för att sätta sig in i REACT:

[W3schools react tutorial](https://www.w3schools.com/REACT/DEFAULT.ASP)

[Enkel tutorial för att hämta data från en JSON](https://pusher.com/tutorials/consume-restful-api-react/#prerequisites)

[RESTful API in React](https://rapidapi.com/blog/how-to-use-an-api-with-react/)
