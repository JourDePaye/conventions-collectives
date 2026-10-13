# Commerce de l'ameublement — IDCC 1880

Le fichier [2026.1](1880-commerce-ameublement.2026.1.publicodes) entre en vigueur le 1er juin 2026 pour le champ général. Il est fondé sur l'accord du 16 octobre 2025 relatif aux salaires minima conventionnels, applicable au 1er janvier 2026, référencé dans les métadonnées par son texte KALI officiel.

La valeur Publicodes est `commerce de l'ameublement` ; les règles sont sous `salarié . convention collective . commerce de l'ameublement`.

## Règles implémentées

- `niveau` reçoit les niveaux employés `1` à `5` ; sa valeur par défaut est `non renseigné`.
- `salaire minimum conventionnel . grille` donne les minima mensuels à temps plein : 1 823 €, 1 834 €, 1 845 €, 1 857 € et 1 871 € pour les niveaux 1 à 5.
- `salaire minimum conventionnel` applique la quotité de travail du contrat ; le montant ne doit donc pas être proratisé une seconde fois.
- `niveau hors grille` vaut vrai lorsque le niveau saisi n'est pas l'un des cinq niveaux modélisés.

## Limites

- L'accord publié fournit également des éléments de classification et de rémunération pour d'autres catégories. Cette première version ne modélise que la grille mensuelle des niveaux employés 1 à 5, dont les montants sont directement exploitables avec les entrées standard de `modele-social` ; les catégories agents de maîtrise et cadres restent explicitement hors périmètre.
- Les primes, majorations, garanties annuelles, frais de santé, prévoyance et autres éléments conventionnels ne sont pas modélisés.
- La version est bornée au champ général à compter du 1er juin 2026 ; l'application antérieure aux employeurs signataires ou adhérents n'est pas exposée par cette version.

## Sources officielles

- Accord du 16 octobre 2025 relatif aux salaires minima conventionnels, texte KALI `KALITEXT000054426659`, Légifrance.
- Les références et l'URL du texte officiel figurent également dans l'en-tête du fichier `.publicodes`.
