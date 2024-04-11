# Översiktlig beskrivning av mediespelare för eventuell vidareutveckling
Medispelaren har i dagsläget stöd för uppladdning av media-filer och länkning till bilder på internet, youtube etc.

## Frontend
Mediespelar-komponenten består av följande komponenter i frontend:

- Gallery.jsx 
    - Består av huvudkomponenten för uppvisande av media. Består av en React-Responsive-Carousel som kan visa antingen Image komponenter eller en VideoReactPlayer.
- VideoReactPlayer
    - Består i grunden av en ReactPlayer fast med lite egna inställningar
- Image
    - Är i grunden en img som kan visa upp bild-media
- EditGallery
    - Redigerarläge för Gallery. Delar på samma styling men har funktion för att ta bort media samt en uppladdningskomponent (UploadMedia). Buffrar api-anrop tills användaren sparar via sidorna som medie-spelaren ligger på. Var därmed tvungen att vara tight kopplad med dess föräldersida. Föräldersidorna styr då API-anrop för bortagning och uppladdning av meta-data för media via sendData. För fil-uppladdning så sker dessa live då man faktiskt laddar upp. Istället så sker en undo via delete-requests ifall användaren ej sparar. Detta styrs genom undoChanges. Då alla requests har gått igenom signaleras detta via done från EditGallery till föräldersida. Detta är för att förhindra att föräldersida hinner routa iväg och stänga EditGallery innan alla requests utförts.
- UploadMedia
    - Styr insamling och skapande av meta-data för media samt filuppladdning. Filuppladdning sker direkt i komponenten medans meta-data endast samlas in och skapas för att sedan skickas vidare till EditGallery via fetchMediaMetaToBeUploaded. Meta-data för filer som laddats upp skickas till EditGallery via fetchMediaFilesThatWasUploaded ifall att användaren ångrar sig så att delete-requests kan utföras.

## Backend
MediaController styr serversidan. MediaController's kod förklarar nog sig själv för det mesta. Några saker kan emellertid förtydligas.

- Filhantering sker genom ett interface kallat StorageService. I dagsläget lagras filer på servern genom en delad volym som definieras i Infra-repot och docker-compose filen under Api-containern. Volymen är egentligen en del av host-OS'ets minne som delas in i API-docker-containern. Därmed fortsätter media att existera även då API-dockern byggs om. Filhanteringen sker genom MediaStorageServiceOnDisk som implementerar StorageService. Om man i framtiden vill byta lagringssätt, kanske genom molnlagring, så kan en ny klass som implementerar StorageService skapas. 
- Vill man i framtiden ändra på maximal filstorlek så kan detta göras i application.yml filen för API.

## Kända problem/Framtida förbättringar
- Om databasen med meta-data rensas/byggs om så existerar fortfarande media-filerna kvar på disk. Via delete-api requestsen fungerar det dock fint. Kanske går på nåt avancerat sätt med triggers, alternativt nåt sorts script som körs i samband med att databasen byggs om/rensas.
- Användare kan ladda upp vilka typer av filer som helst. Kanske inte är hela världen då uppladdning är ett admin.´-privilegium.

