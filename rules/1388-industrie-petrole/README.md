# Industrie du pétrole — IDCC 1388

Le fichier [2026.1](1388-industrie-petrole.2026.1.publicodes) entre en vigueur le 1er janvier 2026. Il est fondé sur l’accord du 27 novembre 2025 relatif aux salaires minima, étendu par arrêté du 27 janvier 2026 (JORF n° 0030 du 5 février 2026), cités dans ses métadonnées. La valeur Publicodes est `industrie pétrole` ; les règles sont sous `salarié . convention collective . industrie pétrole`.

La convention collective nationale de l’industrie du pétrole du 3 septembre 1985 (brochure 3001) ne fixe pas une grille de montants mais une formule, appliquée au coefficient du salarié.

## Règles implémentées

- `coefficient` reçoit le coefficient hiérarchique, de 130 à 880 (défaut : 0).
- `salaire minimum conventionnel . minimum hiérarchique` calcule le minimum mensuel à temps plein : coefficient × 9,9749 € (valeur minimale du point), plus (880 − coefficient) × 0,2517 € (majoration conventionnelle), plus, pour les coefficients inférieurs à 215, (215 − coefficient) × 3,1855 € (surmajoration). Le résultat est arrondi au centime. Par exemple, le coefficient 200 vaut 2 213,92 € et le coefficient 880 vaut 8 777,91 €.
- `salaire minimum conventionnel` multiplie ce minimum par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois.
- `coefficient hors grille` signale un coefficient inférieur à 130 ou supérieur à 880. Le minimum vaut alors `0 €/mois` et l’application doit traiter l’anomalie.

Les coefficients proches de 130 donnent un minimum inférieur au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 (1 756,28 € pour 130) : l’application doit retenir le plus élevé des deux montants.

## Limites

- Le texte de l’accord n’a pas été lu. Les paramètres (9,9749 €, 0,2517 € et 3,1855 €) viennent de plusieurs pages de synthèse concordantes, et la formule reproduit les montants publiés pour les coefficients 150, 200, 215, 310, 400, 550 et 880. Le numéro de texte et le NOR de l’arrêté ne sont pas vérifiés.
- La plage de 130 à 880 est celle de la classification d’après les pages consultées : la liste exacte des coefficients valides n’a pas été vérifiée, et tout entier de cette plage est accepté.
- La ressource annuelle minimale garantie (RMAG), qui inclut les primes fixes et le treizième mois et vaut selon les pages 23 550 € (une page donne 22 644 €) pour un salarié à temps plein ayant six mois d’ancienneté, n’est pas modélisée. Cette divergence n’est pas tranchée.
- Les primes de poste, les indemnités de repas et les autres éléments de la convention ne sont pas modélisés.
- Les grilles antérieures au 1er janvier 2026 ne sont pas modélisées : la première version couvre les périodes à partir de cette date.
