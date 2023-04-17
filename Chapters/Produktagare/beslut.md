## Mall

## Exempel
Kort beskrivning av beslutet (Z) som fattats

- **Datum** - YYMMDD
- **Chapters** - [Namn](/Chapters/Namn)
- **Grupp** - N/A
- **Alternativ** - X, Y, **Z**
- **Motivation**
  - Längre beskrivning om varför Z valdes
  - Längre beskrivning om varför X _inte_ valdes
  - Längre beskrivning om varför Y _inte_ valdes
# Beslut

## Backlog-hantering

- **Datum** - 230413
- **Chapters** - PO
- **Grupp** - N/A
- **Alternativ** - GitLab issues, **Trello**
- **Motivation**
  - **Trello** Då 3st gitlab repon användes (kolla beslutslogg för DevOps) kom PO gruppen fram till att Gitlab issues som tidigare övervägts tappade en del av sina fördelar då projektet ändå blev utspritt. Vid snabb testning kom PO gruppen fram till att Trello verkade smidigare än Gitlab Issues.
  - _GitLab issues_ Projektet använder gitlab för configuration management, därför funderade PO gruppen länge på att använda Gitlab issues för att hantera backlog. Commits kunde där enkelt kopplas till olika tickets. Dock försvårade att DevOps valt 3st olika repos. Det blev inte självklart i vilket repo som vår Gitlab Issue hantering skulle ske. Fördelen med commit kopplat till ticket försvann vilket gjorde att en mer lätthanterlig (användarvänlig) Backlog hantering prioriterades.


## Dokumentation
- **Datum** - 230413
- **Chapters** - PO
- **Grupp** - N/A
- **Alternativ** - Gitlab Wiki, **Eget gitlab repo för dokumentation**
- **Motivation**
  - **Eget gitlab repo för dokumentation** Ett beslut att ha separat gitlab repo för dokumentation valdes då DevOps tyckte att byggandet av projektet underlättades med separata repos för client- respektive server- delen av applikationen. Det blev inte självklart var Gitlab Wiki sidan skulle förläggas så ett separat repo (inuti projektets "grupp av repon") blev enklast.
  - _Gitlab Wiki_ se motivation ovan.


