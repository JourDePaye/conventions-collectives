# Commerce de détail non alimentaire — IDCC 1517

Le fichier [2026.1](1517-commerce-detail-non-alimentaire.2026.1.publicodes) entre en vigueur le 1er juin 2026. Il est fondé sur l’avenant n° 15 du 6 février 2026 portant revalorisation de la rémunération minimale, applicable le premier jour du mois qui suit la publication de l’arrêté d’extension, soit le 1er juin 2026 : l’arrêté du 4 mai 2026 a été publié au JORF n° 0109 du 10 mai 2026 (texte n° 80, NOR TRST2610662A). Les références figurent dans ses métadonnées. La valeur Publicodes est `commerce de détail non alimentaire` ; les règles sont sous `salarié . convention collective . commerce de détail non alimentaire`.

La convention collective nationale des commerces de détail non alimentaires du 14 juin 1988 (brochure 3251) couvre les entreprises relevant de l’IDCC 1517.

## Règles implémentées

- `niveau` reçoit le niveau de la classification du chapitre XII, de `1` à `9` (défaut : `non renseigné`).
- `salaire minimum conventionnel . grille` donne le salaire minimum mensuel des 9 niveaux, pour 151,67 heures, de 1 829 € (niveau 1) à 4 034 € (niveau 9).
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, le niveau 5 vaut 1 967 €/mois à temps complet et 983,50 €/mois à mi-temps.
- `niveau hors grille` signale un niveau absent des 9 positions. La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.

Les niveaux 1 à 3 (de 1 829 € à 1 843 €) et le niveau 4 (1 867 €) sont inférieurs au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 : l’avenant précise que l’employeur verse un complément pour atteindre le SMIC, et l’application doit retenir le plus élevé des deux montants.

## Limites

- Le niveau 1 est un niveau de débutant, qui ne peut être appliqué au-delà de 6 mois de présence dans l’entreprise, sauf pour les employés de nettoyage (rappel de l’avenant). Cette durée n’est pas contrôlée.
- Les rémunérations de l’avenant s’entendent pour 151,67 heures par mois et sont proratisées selon la quotité. Les cadres n’ont pas de minimum distinct : la grille est unique pour les 9 niveaux.
- Une page de synthèse du CDNA donne 1 836 € pour le niveau 2, alors que le texte de l’avenant, dans ses deux exemplaires consultés, donne 1 838 € : le texte est retenu.
- Les primes, majorations, la prévoyance et les autres éléments de la convention ne sont pas modélisés.
- Les grilles antérieures au 1er juin 2026, notamment celle de l’avenant n° 14 du 27 novembre 2024, ne sont pas modélisées : la première version couvre les périodes à partir de cette date.
