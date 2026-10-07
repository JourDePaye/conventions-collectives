# Établissements et services pour personnes inadaptées et handicapées — IDCC 413 (CCN 66)

Le fichier [2022.1](0413-personnes-handicapees.2022.1.publicodes) entre en vigueur le 1er juillet 2022, date de la valeur du point de 3,93 € des employeurs adhérents à Nexem. Il s’appuie sur l’avenant n° 361 du 9 juin 2021 (point à 3,82 € depuis le 1er février 2021) et sur la recommandation patronale de Nexem, cités dans ses métadonnées. La valeur Publicodes est `personnes handicapées et inadaptées` ; les règles sont sous `salarié . convention collective . personnes handicapées et inadaptées`.

La convention collective nationale du 15 mars 1966 (CCN 66, brochure 3116) ne fixe pas une grille de salaires par niveau : chaque emploi a un coefficient, qui évolue avec l’ancienneté, et le salaire indiciaire est le coefficient multiplié par la valeur du point.

## Règles implémentées

- `coefficient` reçoit le coefficient de l’emploi occupé (défaut : 0). Il intègre déjà l’ancienneté selon les paliers de la convention.
- `adhérent à Nexem` indique si l’employeur applique la recommandation patronale (défaut : non).
- `valeur du point` vaut 3,82 € pour les employeurs non adhérents à Nexem et 3,93 € pour les adhérents.
- `salaire minimum conventionnel` multiplie le coefficient par la valeur du point, puis par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, le coefficient 434 vaut 1 657,88 €/mois (1 705,62 € pour un adhérent à Nexem) à temps complet.
- `coefficient hors grille` signale un coefficient absent ou nul : le minimum vaut alors `0 €/mois`.

Le coefficient 489 est le premier dont le salaire indiciaire dépasse le SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 avec le point à 3,82 € ; en dessous, l’application doit retenir le SMIC.

## Limites

- Les textes n’ont pas pu être lus : le PDF de l’avenant n° 361 était inexploitable. La date de l’avenant, la valeur de 3,82 €, la recommandation patronale à 3,93 € et leur statut d’agrément viennent de pages de synthèse concordantes ; l’arrêté d’agrément ou d’extension n’a pas été vérifié, ni l’absence de revalorisation en 2026. À recouper sur Légifrance.
- **Valeur du point par défaut.** L’application n’a pas de réglage « adhérent à Nexem » : sauf réglage du package, le minimum est calculé avec 3,82 €, la valeur la plus basse. Un adhérent à Nexem peut donc être contrôlé avec un minimum trop faible.
- **Indemnité de sujétion spéciale.** Les pages consultées donnent 9,21 % du salaire indiciaire, pour des salariés dont la liste précise n’est pas établie (les cadres de classe 1 en seraient exclus). Elle n’est pas incluse dans le minimum, ce qui le sous-estime pour les salariés qui la perçoivent.
- **Planchers Nexem.** La recommandation prévoit aussi un plancher de salaire minimum garanti aux indices 403 (sans sujétion d’internat) et 413 (avec) : il n’est pas modélisé.
- **Liste des coefficients.** La classification compte de nombreux emplois et paliers d’ancienneté, de l’ordre de 371 à plus de 780 selon les pages. Cette liste n’est pas contrôlée : tout coefficient positif est accepté.
- Les grilles et valeurs du point antérieures au 1er juillet 2022, les primes, la prévoyance et les autres éléments de la convention ne sont pas modélisés.
