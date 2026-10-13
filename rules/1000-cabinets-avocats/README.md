# Cabinets d'avocats — IDCC 1000

Le fichier [2025.1](1000-cabinets-avocats.2025.1.publicodes) entre en vigueur le 1er janvier 2025. Il reprend l'avenant n° 136 du 24 janvier 2025 relatif aux salaires minima, étendu par l'arrêté du 9 avril 2025 publié au Journal officiel du 26 avril 2025. Les textes officiels sont cités dans les métadonnées du fichier source.

La convention collective nationale des avocats et de leur personnel du 20 février 1979 (brochure 3078) utilise une classification par coefficients pour le personnel salarié non-avocats. La valeur Publicodes est `cabinets d'avocats` ; les règles sont sous `salarié . convention collective . cabinets d'avocats`.

## Règles implémentées

- `coefficient` reçoit l'un des 16 coefficients de la grille, couvrant 17 lignes de niveaux : 207, 215, 225, 240, 250, 265, 270, 285, 300, 350, 385, 410, 450, 480, 510 et 560. Le coefficient 240 couvre les niveaux 3 et 4 du tableau.
- `grille mensuelle` expose les salaires bruts minima mensuels à temps plein, de 1 851,23 € à 4 355,07 €.
- `salaire minimum conventionnel` applique la quotité de travail du contrat ; le montant ne doit donc pas être proratisé une seconde fois.
- `salaire minimum annuel conventionnel` expose treize fois le minimum mensuel, proratisé selon la quotité. L'avenant rappelle le versement en treize mensualités ; la règle ne calcule pas le calendrier de versement.
- `coefficient hors grille` vaut vrai lorsque le coefficient saisi n'est pas dans le barème modélisé. Dans ce cas, les minima retournent 0 et l'application doit signaler la classification manquante ou incohérente.

## Limites et audit paie

- Le modèle couvre les salaires minima de l'avenant n° 136. Les primes, indemnités, frais de santé, prévoyance, formation, retraite complémentaire et accidents du travail ne sont pas calculés automatiquement : les textes contrôlés ne fournissent pas ici un taux générique exploitable par salarié dans les entrées standard de `modele-social`.
- La convention prévoit aussi des dispositions relatives à la durée du travail, aux congés et à des compléments liés à la situation du salarié ; elles restent hors périmètre faute d'entrées et d'endpoints suffisamment déterminés.
- Le SMIC légal reste le plancher lorsqu'il est supérieur au minimum conventionnel.

## Sources officielles

- Avenant n° 136 du 24 janvier 2025 relatif aux salaires minima, texte KALI `KALITEXT000051537685`, Légifrance.
- Arrêté du 9 avril 2025 portant extension d'avenants à la convention collective nationale du personnel des cabinets d'avocats (n° 1000), publié au Journal officiel du 26 avril 2025, `JORFTEXT000051521244`.

Les références figurent également dans l'en-tête du fichier `.publicodes`.
