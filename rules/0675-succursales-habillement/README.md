# Maisons à succursales de vente au détail d'habillement — IDCC 675

Le fichier [2026.3](0675-succursales-habillement.2026.3.publicodes) entre en vigueur le 1er mai 2026 et remplace les fichiers `2026.1` et `2026.2` (même date d'effet). Il reprend l'accord du 16 avril 2026 relatif aux salaires mensuels minima garantis (`KALITEXT000054871910`, BO 2026-21), étendu par arrêté du 6 juillet 2026 (JORF du 10 juillet 2026, NOR TRST2616915A). La valeur Publicodes est `succursales habillement` ; les règles sont sous `salarié . convention collective . succursales habillement`.

La convention collective nationale des maisons à succursales de vente au détail d'habillement du 30 juin 1972 (brochure 3065) ne doit pas être confondue avec la convention [1483](../1483-commerce-detail-habillement-textiles/README.md), celle du commerce de détail de l'habillement et des articles textiles.

## Règles implémentées

- `niveau` reçoit la catégorie : `E1` à `E4` (employés), `AM1` et `AM2` (agents de maîtrise), `C1` à `C3` (cadres). Défaut : `non renseigné`.
- `salaire minimum conventionnel . grille` : minimum mensuel de l'article 1er (A.1 et B.1) pour un temps complet, de 1 824 € (`E1`) à 3 044 € (`C3`).
- `salaire minimum conventionnel` : la grille multipliée par `salarié . contrat . temps de travail . quotité` (ne pas proratiser une seconde fois).
- `montant prime d'ancienneté` : montant fixe en euros de l'article 1er (A.2 et B.2) pour un temps complet, par catégorie et par tranche de 3, 6, 9, 12, 15 et 20 ans d'ancienneté (par exemple `E1` : 30,76 / 61,52 / 92,06 / 122,80 / 153,57 / 204,56 €). La tranche inférieure atteinte s'applique ; 0 € avant 3 ans.
- `prime d'ancienneté` : ce montant proratisé selon la quotité, pour les employés et agents de maîtrise ; elle remplace `rémunération . primes . ancienneté`. Pour les cadres, la prime est incluse forfaitairement dans la rémunération (article 1er, B.2) : la règle vaut `0 €/mois`.
- `salaire minimum avec prime d'ancienneté` : minimum conventionnel plus montant de la prime proratisé. Pour les cadres, c'est le seuil à partir duquel la prime est réputée incluse.
- `forfait jours` et `salaire minimum annuel forfait jours` : pour un cadre en forfait en jours, minimum mensuel hors prime d'ancienneté × 12 × 1,15 (majoration d'au moins 15 %, article 1er, B.1) : `C1` 32 402,40 €, `C2` 35 617,80 €, `C3` 42 007,20 € par an. Non proratisé.
- `niveau hors grille` signale une catégorie absente des 9 positions ; la grille vaut alors `0 €/mois`.

Changements par rapport à `2026.2` : primes en montants fixes (et non 3 à 15 % du minimum), tranche de 20 ans ajoutée, prime des cadres non ajoutée en sus, forfait jours recalculé. Clés de classification, noms de règles et unités inchangés ; les règles `montant prime d'ancienneté` est nouvelle.

Les catégories `E1` à `E3` (de 1 824 € à 1 851 €) sont inférieures au SMIC mensuel en vigueur : l'arrêté d'extension réserve l'application des dispositions réglementaires sur le SMIC, et l'application doit retenir le plus élevé des deux montants.

## Limites

- Pour les employeurs non adhérents à la fédération signataire, l'arrêté d'extension ne rend l'accord applicable qu'à compter du lendemain de sa publication (11 juillet 2026) : cette distinction n'est pas modélisée.
- La grille vaut pour la France métropolitaine.
- Les grilles antérieures au 1er mai 2026 ne sont pas modélisées. Le texte prévoit une négociation en décembre 2026 pour 2027.
- Majorations, prévoyance et autres éléments de la convention ne sont pas modélisés.
