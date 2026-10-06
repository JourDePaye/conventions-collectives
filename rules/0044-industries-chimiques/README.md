# Industries chimiques — IDCC 44

Le fichier [2026.1](0044-industries-chimiques.2026.1.publicodes) entre en vigueur le 1er janvier 2026. Il est fondé sur l’accord du 3 décembre 2025 relatif aux salaires minima de branche, étendu par arrêté du 16 février 2026 (JORF du 24 février 2026), cités dans ses métadonnées. La valeur Publicodes est `industries chimiques` ; les règles sont sous `salarié . convention collective . industries chimiques`.

La convention collective nationale des industries chimiques et connexes du 30 décembre 1952 (brochure 3108) calcule ses minima à partir de deux paramètres, le salaire de référence (1 848,69 €) et la valeur de référence par point (8,84 €), revalorisés de 1,2 % en 2026. Le minimum d’un coefficient K est : (salaire de référence + (K − 100) × valeur de référence) × coefficient de calcul.

## Règles implémentées

- `coefficient` reçoit le coefficient hiérarchique : 130, 140, 150, 160, 175, 190, 205, 225, 235, 250, 275, 300, 325, 350, 360, 400, 460, 480, 510, 550, 660, 770 ou 880 (défaut : 0).
- `salaire minimum conventionnel . grille` donne le salaire mensuel minimum des 23 coefficients, pour 35 heures par semaine (151,67 heures), de 1 877,13 € (130) à 7 764,57 € (880).
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, le coefficient 250 vaut 2 244,51 €/mois à temps complet et 1 122,255 €/mois à mi-temps.
- `coefficient hors grille` signale un coefficient absent des 23 positions. La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.

Tous les montants de la grille dépassent le SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026.

## Limites

- Le texte de l’accord n’a pas été lu : les 23 montants viennent de deux pages de synthèse concordantes (juristique.org et lofficieldesmetiers.fr) et ont été vérifiés avec la formule ci-dessus. Les pages donnent deux valeurs différentes du salaire de référence (1 848,89 € et 1 848,69 €) : seule 1 848,69 € reproduit les montants du barème. Le numéro de texte et le NOR de l’arrêté ne sont pas vérifiés.
- Le barème vaut pour 35 heures par semaine. Les barèmes pour d’autres durées du travail, en particulier celui des 38 heures évoqué par les pages consultées, ne sont pas modélisés.
- La prime d’ancienneté (3 % après 3 ans, puis 3 % tous les 3 ans jusqu’à 15 %), les primes de poste et les autres éléments de la convention ne sont pas modélisés. Le minimum retenu est le barème, hors prime d’ancienneté.
- Les grilles antérieures au 1er janvier 2026 ne sont pas modélisées : la première version couvre les périodes à partir de cette date.
