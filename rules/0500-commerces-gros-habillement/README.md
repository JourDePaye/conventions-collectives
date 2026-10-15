# Commerces de gros de l'habillement, de la mercerie, de la chaussure et du jouet — IDCC 500

Le fichier [2024.1](0500-commerces-gros-habillement.2024.1.publicodes) entre en vigueur le 1er décembre 2024, le mois suivant la signature de l'avenant n° 56 A du 26 novembre 2024. L'avenant a ensuite été étendu par arrêté du 29 janvier 2025, publié le 14 février 2025.

Le fichier [2024.2](0500-commerces-gros-habillement.2024.2.publicodes), à la même date, reprend les mêmes montants avec des codes de classification sans espace, que les applications peuvent saisir plus sûrement : `E-IA` à `E-VB` pour les employés, `AM-VIA` à `AM-VII` pour les agents de maîtrise et `C-IA` à `C-III` pour les cadres. Les anciens libellés (`employés I A`…) ne sont plus reconnus.

Le fichier [2026.1](0500-commerces-gros-habillement.2026.1.publicodes) entre en vigueur le 20 septembre 2026 avec la grille de l'annexe 56/A du 25 juin 2026. Cette grille s'applique au 1er juillet 2026 dans les entreprises adhérentes à l'organisation patronale signataire, et à tous les employeurs le lendemain de la publication de l'arrêté d'extension du 7 septembre 2026 (JO du 19 septembre 2026). **Les montants viennent du communiqué de la CFDT du 2 juillet 2026** : le texte de l'annexe n'était pas encore dans la base KALI de Légifrance et doit encore être contrôlé. Ils sont cohérents avec les hausses annoncées (3 % pour les employés, 1,5 % pour les agents de maîtrise, 1 % pour les cadres).

Le fichier [2026.2](0500-commerces-gros-habillement.2026.2.publicodes), à la même date, a les mêmes règles et remplace la source : le texte de l'avenant du 25 juin 2026 à l'annexe 56 A, publié au BOCC 2026-30 (texte n° 4, NOR ASET2650737M), donne exactement les 19 montants du communiqué de la CFDT.

La valeur Publicodes est `commerces de gros habillement` ; les règles sont sous `salarié . convention collective . commerces de gros habillement`.

## Règles implémentées

- `classification` reçoit les classifications des employés I A à V B, des agents de maîtrise VI A à VII et des cadres I A à III : libellés complets dans la version 2024.1, codes (`E-IA`, `AM-VIA`, `C-IA`…) à partir de la version 2024.2.
- `grille` expose les 19 minima mensuels à temps plein : avenant n° 56 A du 26 novembre 2024, puis annexe 56/A du 25 juin 2026.
- `salaire minimum conventionnel` applique la quotité de travail du contrat ; le montant ne doit donc pas être proratisé une seconde fois.
- `classification hors grille` vaut vrai lorsque la classification saisie n'est pas dans le barème modélisé.

## Limites et audit paie

- Les montants modélisés sont des minima conventionnels mensuels ; le SMIC légal reste le plancher lorsqu'il est supérieur.
- Les primes, majorations, indemnités, frais de santé, prévoyance, formation, retraite complémentaire et accidents du travail ne sont pas calculés automatiquement : aucun taux forfaitaire exploitable et directement applicable à tous les salariés n'a été ajouté à cette version.
- Les classifications sont conservées comme valeurs textuelles afin d'éviter toute conversion ou extrapolation entre catégories.
- Le passage automatique de l'échelon I A à l'échelon I B après un an d'ancienneté dans l'entreprise (note de la grille de 2024) n'est pas modélisé : l'application doit saisir la bonne classification.

## Sources officielles

- Avenant n° 56 A du 26 novembre 2024 relatif aux salaires minima, texte KALI `KALITEXT000051190916`, Légifrance.
- Arrêté du 29 janvier 2025 portant extension de l'avenant n° 56 A, publié au Journal officiel du 14 février 2025 et référencé dans la fiche officielle du texte KALI.
- Annexe 56/A du 25 juin 2026 relative aux salaires minima mensuels (BOCC n° 2026/30), étendue par arrêté du 7 septembre 2026 publié au Journal officiel du 19 septembre 2026 (`JORFTEXT000054860941`).
- Avenant du 25 juin 2026 à l'annexe 56 A sur les salaires minima mensuels, BOCC 2026-30, texte n° 4 (`boc_20260030_0000_0004`).
- Communiqué de la CFDT du 2 juillet 2026 donnant la grille de l'annexe 56/A (source secondaire, utilisée par la version 2026.1, confirmée par le texte du BOCC).

Les références et les liens officiels figurent également dans l'en-tête du fichier `.publicodes`.
