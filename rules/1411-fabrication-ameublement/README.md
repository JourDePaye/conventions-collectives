# Fabrication de l’ameublement — IDCC 1411

Le fichier [2026.1](1411-fabrication-ameublement.2026.1.publicodes) entre en vigueur le 1er juillet 2026. Il est fondé sur l’accord du 28 mai 2026 relatif aux salaires minima professionnels catégoriels, étendu par arrêté du 24 août 2026 (JORF n° 0206 du 4 septembre 2026, texte n° 42, NOR TRST2621200A), cités dans ses métadonnées. La valeur Publicodes est `fabrication ameublement` ; les règles sont sous `salarié . convention collective . fabrication ameublement`.

La convention collective nationale de la fabrication de l’ameublement du 14 janvier 1986 (brochure 3155) classe les salariés en agents de production (AP), agents fonctionnels (AF), agents d’encadrement (AE) et cadres (C).

## Règles implémentées

- `niveau` reçoit l’échelon, sans espace : `AP11`, `AP21`, `AP22`, `AP31`, `AP32`, `AP41`, `AP42`, `AP43`, `AP51`, `AP52`, `AF1`, `AF3`, `AF5`, `AF7`, `AF9`, `AF11`, `AF12`, `AF14`, `AF15`, `AF16`, `AE1` à `AE7`, `C11`, `C12`, `C13`, `C21`, `C22`, `C23`, `C31`, `C32`, `C33` (défaut : `non renseigné`).
- `salaire minimum conventionnel . grille` donne le salaire mensuel minimum des 36 échelons, pour 151,67 heures, de 1 867,02 € (`AP11`, `AF1`, `AE1`) à 4 956 € (`C33`).
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, `AP52` vaut 2 117 €/mois à temps complet et 1 058,50 €/mois à mi-temps.
- `niveau hors grille` signale un échelon absent des 36 positions. La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.

Aucun montant de la grille n’est inférieur au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026, et trois échelons (`AP11`, `AF1`, `AE1`) lui sont égaux : l’application doit retenir le plus élevé des deux montants.

## Limites

- Le texte de l’accord n’a pas été lu : les montants viennent de deux pages de synthèse concordantes (juristique.org et convention.fr), les références de l’arrêté de Légifrance. À recouper avec l’accord.
- Les échelons `AP11`, `AF1` et `AE1` figurent à 1 867,02 €, soit le SMIC de juin 2026 : le texte de l’accord peut donner un montant inférieur, auquel cas le SMIC s’applique de toute façon. Le résultat de l’application est le même tant que le SMIC ne baisse pas.
- L’accord s’applique à compter du 1er juillet 2026 aux employeurs adhérents aux organisations signataires ; pour les autres, l’arrêté ne le rend applicable qu’à compter de sa publication (4 septembre 2026). Cette distinction n’est pas modélisée.
- Les primes d’ancienneté, majorations, la prévoyance et les autres éléments de la convention ne sont pas modélisés.
- Les grilles antérieures au 1er juillet 2026 ne sont pas modélisées : la première version couvre les périodes à partir de cette date.
