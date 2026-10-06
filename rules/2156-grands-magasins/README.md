# Grands magasins et magasins populaires — IDCC 2156

Le fichier [2024.1](2156-grands-magasins.2024.1.publicodes) entre en vigueur le 1er juin 2024. Il est fondé sur l’avenant du 17 avril 2024 relatif aux rémunérations minimales garanties, étendu par arrêté du 28 juin 2024 (JORF du 6 juillet 2024, BOCC 2024-21), cités dans ses métadonnées. La valeur Publicodes est `grands magasins` ; les règles sont sous `salarié . convention collective . grands magasins`.

La convention collective nationale des grands magasins et des magasins populaires du 30 juin 2000 (brochure 3082) fixe, pour chaque niveau, une rémunération minimale mensuelle et une rémunération minimale annuelle.

## Règles implémentées

- `niveau` reçoit `I.1`, `I.2`, `II.1`, `II.2`, `III.1`, `III.2`, `IV.1`, `IV.2` pour les employés (niveau et échelon), `V` pour les agents de maîtrise, `VI`, `VII`, `VIII` pour les cadres (défaut : `non renseigné`).
- `salaire minimum conventionnel . grille` donne la rémunération minimale mensuelle des 12 positions, pour 151,67 heures, de 1 766,92 € (`I.1`) à 4 217 € (`VIII`).
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, `IV.2` vaut 1 895 €/mois à temps complet et 947,50 €/mois à mi-temps.
- `rémunération minimale annuelle` donne la colonne annuelle de l’avenant (de 22 087 € à 55 840 €), à temps plein. Elle dépasse douze fois le minimum mensuel (environ 12,5 mois pour les employés, 13 pour le niveau `V`, 13,24 pour les cadres) et s’apprécie sur l’année, hors remboursements de frais, primes de transport, heures supplémentaires, intéressement, participation et primes d’ancienneté.
- `niveau hors grille` signale un niveau absent des 12 positions. La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.

Les positions `I.1` à `IV.1` (de 1 766,92 € à 1 834 €) sont inférieures au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 : l’application doit retenir le plus élevé des deux montants. La grille reprend effet à partir de `IV.2` (1 895 €).

## Limites

- Le minimum annuel n’est pas contrôlé par l’application de paie, qui ne vérifie que le minimum mensuel.
- Le numéro de texte et le NOR de l’arrêté d’extension ne sont pas vérifiés. Les majorations liées à l’expérience, évoquées dans les articles 3 à 6 de l’avenant, ne sont pas modélisées.
- Aucun avenant postérieur à celui du 17 avril 2024 n’a été trouvé : la grille est ancienne et l’absence de revalorisation n’est pas établie.
- Les primes, majorations, la prévoyance et les autres éléments de la convention ne sont pas modélisés.
