# Fabrication de l’ameublement — IDCC 1411

Le fichier [2026.1](1411-fabrication-ameublement.2026.1.publicodes) entre en vigueur le 1er juillet 2026. Le fichier [2026.2](1411-fabrication-ameublement.2026.2.publicodes) entre en vigueur le 11 juillet 2026, date de publication de l’arrêté d’extension de l’accord du 30 janvier 2026, et ajoute sa contribution conventionnelle de formation professionnelle de 0,50 % pour les entreprises d’au moins 10 salariés. La valeur Publicodes est `fabrication ameublement` ; les règles sont sous `salarié . convention collective . fabrication ameublement`.

La convention collective nationale de la fabrication de l’ameublement du 14 janvier 1986 (brochure 3155) classe les salariés en agents de production (AP), agents fonctionnels (AF), agents d’encadrement (AE) et cadres (C).

## Règles implémentées

- `niveau` reçoit l’échelon, sans espace : `AP11`, `AP21`, `AP22`, `AP31`, `AP32`, `AP41`, `AP42`, `AP43`, `AP51`, `AP52`, `AF1`, `AF3`, `AF5`, `AF7`, `AF9`, `AF11`, `AF12`, `AF14`, `AF15`, `AF16`, `AE1` à `AE7`, `C11`, `C12`, `C13`, `C21`, `C22`, `C23`, `C31`, `C32`, `C33` (défaut : `non renseigné`).
- `salaire minimum conventionnel . grille` donne le salaire mensuel minimum des 36 échelons, pour 151,67 heures, de 1 867,02 € (`AP11`, `AF1`, `AE1`) à 4 956 € (`C33`).
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, `AP52` vaut 2 117 €/mois à temps complet et 1 058,50 €/mois à mi-temps.
- `niveau hors grille` signale un échelon absent des 36 positions. La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.
- `2026.2` remplace l’endpoint standard de formation professionnelle et ajoute 0,50 % de l’assiette des cotisations lorsque l’effectif de l’entreprise est au moins égal à 10.

Aucun montant de la grille n’est inférieur au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026, et trois échelons (`AP11`, `AF1`, `AE1`) lui sont égaux : l’application doit retenir le plus élevé des deux montants.

## Limites

- Les 36 montants ont été vérifiés le 22 octobre 2026 sur le texte officiel de l’accord du 28 mai 2026 ([KALITEXT000054887544](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054887544)), qui fixe bien les échelons `AP11`, `AF1` et `AE1` à 1 867,02 €.
- La contribution de formation est due sur la masse salariale brute de l’année précédente et versée en une fois avant le 28 février : `2026.2` la provisionne chaque mois à 0,50 % de l’assiette des cotisations.
- L’accord s’applique à compter du 1er juillet 2026 aux employeurs adhérents aux organisations signataires ; pour les autres, l’arrêté ne le rend applicable qu’à compter de sa publication (4 septembre 2026). Cette distinction n’est pas modélisée.
- Les primes d’ancienneté, majorations, la prévoyance et les autres éléments de la convention ne sont pas modélisés.
- Les grilles antérieures au 1er juillet 2026 ne sont pas modélisées : la première version couvre les périodes à partir de cette date.

## Références officielles complémentaires

- Accord du 28 mai 2026 relatif aux salaires minima, étendu par arrêté du 24 août 2026 (JORF du 4 septembre 2026) : [KALITEXT000054887544](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054887544), [JORFTEXT000054794539](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054794539).
- Accord du 30 janvier 2026 relatif à la contribution additionnelle à la formation professionnelle, étendu par arrêté du 3 juillet 2026 (JORF du 11 juillet 2026) : [KALITEXT000054177285](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054177285), [JORFTEXT000054415773](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054415773).
