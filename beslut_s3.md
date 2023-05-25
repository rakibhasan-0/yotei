# Arkitektur
# Produktägare

# Quality assurance
## Project Management Verktyg
- **Datum** - 230516
- **Chapters** - Test/QA
- **Grupp** -  N/A
- **Beslut** - Automatiserade Systemtester avskaffas
- **Motivation**
  - På grund av polyrepo-strukturen så kommer parallell körning av systemtester vara problematiskt och därav blir testtiden mycket längre per merge. På grund av dessa problem så avskaffas automatiserade systemtester.

# Backend
# Frontend
# DevOps
## Systemtest i pipeline 
- **Datum** - 23-05-26
- **Chapters** - Bygg
- **Grupp** - NA
- **Alternativ** - NA
- **Motivation**
  - Ska fixa så att systemtester endast körs vid mergerequests tills vidare eftersom det tar upp för mycket tid på pipeline. Systemtesterna går fortfarande att köra lokalt under utveckling. 
