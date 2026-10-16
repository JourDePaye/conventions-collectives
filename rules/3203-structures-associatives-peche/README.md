# Structures associatives de pêche de loisir et de protection du milieu aquatique — IDCC 3203

Le fichier [2026.1](3203-structures-associatives-peche.2026.1.publicodes) entre en vigueur le **1er janvier 2026**. Il modélise l’avenant n° 16 du 17 décembre 2025 relatif aux salaires minima conventionnels.

## Sources officielles

- [Convention collective et textes salaires IDCC 3203 sur Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000029100418)
- [Texte publié de l’avenant n° 16](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054802134)

L’avenant est pris dans son champ signataire ou adhérent, avant extension. Le modèle ne présume pas d’une extension ultérieure.

## Règles implémentées

- `niveau et échelon` reçoit le positionnement publié : `I`, `II.1` à `VI.3`.
- `salaire minimum conventionnel . grille` donne le minimum mensuel brut à temps plein (151,67 heures), de 1 855 € à 3 355 €.
- `salaire minimum conventionnel` prorate la grille selon la quotité de travail.
- `niveau hors grille` signale les positionnements absents et la grille retourne alors `0 €/mois`.
- `adhérent d'une organisation signataire` (oui ou non, non par défaut) : à partir de la version `2026.2` (même date d'effet que 2026.1, qu'elle remplace), le minimum n'est applicable qu'aux employeurs adhérents d'une organisation signataire ; pour un employeur non adhérent, l'avenant n'étant pas étendu, le minimum vaut 0 €/mois (aucun minimum n’est dû au titre de l’avenant). La version 2026.1 ne faisait que documenter ce périmètre sans le faire respecter.

## Audit des effets de paie

L’avenant salarial consulté chiffre uniquement les minima mensuels. Aucun taux, plafond, forfait, prime, avantage, régime de santé ou de prévoyance, contribution de formation ou cotisation AT/MP directement modélisable n’est ajouté. Les autres dispositions de la convention restent hors périmètre de cette version.
