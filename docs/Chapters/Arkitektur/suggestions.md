# Förslag till nästa år

  
### Förbättra arkitekturen för frontend

Arkitekturen för frontend är i nuläget väldigt dålig. Många komponenter har extremt hög “coupling” och det är väldigt svårt att göra ändringar i dem eller att debugga. I vissa fall skickas en metod vidare mellan 4-5 komponenter(inte bra!). Detta är för att den nuvarande arkitekturen har en väldigt dålig separation mellan Model och View.
    

  

Men som tur finns det jättebra lösningar för detta! I React finns ett koncept som heter Flux, vilket använder sig av actions, dispatches, store och view för att separera vy och modell. Det går att uppnå detta med de hooks som React erbjuder, useContext och useReducer kan lösa detta.

  

Men vi föreslår att ni försöker använda något av de bibliotek som redan finns tillgängliga på nätet för att implementera flux. Ett av dessa bibliotek, och ett av de mest använda, är Redux Toolkit.

  

Att byta till Redux Toolkit skulle såklart innebära en hög teknisk skuld för er, då ni skulle behöva först och främst lära er om detta bibliotek. Men även byta ut gammal kod. Men vi anser att detta är något som kommer förbättra kod kvaliteten otroligt mycket.
