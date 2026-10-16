# Industrie et services nautiques — IDCC 3236

La version `2025.2` (qui remplace `2025.1`, de même date d'effet) modélise l'avenant du **16 avril 2025** relatif aux salaires minima mensuels, applicable au **1er avril 2025** et étendu par arrêté du 19 juin 2025 publié au Journal officiel du 2 juillet 2025.

## Correction par rapport à `2025.1`

La version `2025.1` omettait le niveau II, échelon 3 (`II.3` = 1 888,21 €) : les échelons `III.1`, `III.2` et `III.3` étaient décalés d'une ligne vers le bas. La version `2025.2` reprend la grille de l'annexe : `II.3` 1 888,21 ; `III.1` 1 912,44 ; `III.2` 1 940,71 ; `III.3` 1 955,52. Seule clé ajoutée : `II.3`.

## Périmètre salarial

- `grille` expose les dix-huit minima mensuels de l'annexe, pour les niveaux et échelons `I.1` à `VII.4`.
- `salaire minimum conventionnel` expose le minimum mensuel brut proratisé une seule fois par `salarié . contrat . temps de travail . quotité`.
- Une classification absente de la grille est signalée par `niveau et échelon hors grille` et produit un minimum nul.

Le modèle couvre la grille salariale publiée. Les primes, indemnités, frais de santé, prévoyance, formation, AT/MP, forfaits et exonérations ne sont pas calculés automatiquement : l'accord retenu ne fournit pas de règle générique supplémentaire nécessaire aux endpoints standards de paie.

## Sources officielles

- Avenant du 16 avril 2025 relatif aux salaires minima mensuels au 1er avril 2025, IDCC 3236, KALITEXT000051927584 : https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000051927584
- Arrêté du 19 juin 2025 portant extension de l'avenant, JORFTEXT000051832663, publié au Journal officiel du 2 juillet 2025 : https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000051832663
- Convention collective nationale de l'industrie et des services nautiques du 13 octobre 2020, IDCC 3236, KALICONT000043157451 : https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000043157451
