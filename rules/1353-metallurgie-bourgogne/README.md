# Métallurgie de la Côte-d'Or, du Doubs, du Jura, de la Haute-Saône, du Territoire de Belfort et de la Saône-et-Loire — IDCC 1353

Le fichier [2022.1](1353-metallurgie-bourgogne.2022.1.publicodes) reprend l'accord territorial du 12 mai 2022 relatif aux rémunérations minimales hiérarchiques, applicable au 1er juin 2022 dans le périmètre historique de l'IDCC 1353. Il modélise uniquement les coefficients ouvriers explicitement publiés dans la grille, sans extrapoler les colonnes ETAM ou cadres.

## Règles implémentées

- `coefficient ouvrier` couvre les coefficients 140, 145, 155, 170, 190, 215, 240, 255, 270, 285, 305, 335, 365 et 395 ;
- `rémunération minimale hiérarchique` expose les montants mensuels de la grille 2022 et les prorate selon la quotité ;
- `coefficient hors grille` signale les valeurs non couvertes par cette colonne de la source.

## Audit paie et limites

L'accord salarial et le conteneur officiel IDCC 1353 ont été recherchés pour les changements de cotisations salarié/employeur, assiettes, plafonds et tranches, forfaits, santé, prévoyance, retraite complémentaire, formation professionnelle, AT/MP, primes, indemnités, frais et avantages en nature. Les textes dédiés de protection sociale, de formation et leurs arrêtés d'extension ont également été recherchés. Aucun taux salarié/employeur, assiette, plafond, tranche ou forfait conventionnel générique calculable avec les seules entrées de ce modèle n'est ajouté : ces rubriques restent externes et ne sont pas remplacées par zéro.

La prime d'ancienneté, les primes de panier, déplacements, travail posté, heures supplémentaires, congés, avantages en nature et frais nécessitent des données de paie ou de situation absentes du modèle ; ils sont explicitement omis plutôt qu'inventés. L'accord est territorial et historique : aucune application hors des départements et dates publiés n'est extrapolée.

## Sources officielles

- Accord territorial du 12 mai 2022 relatif aux rémunérations minimales hiérarchiques, texte officiel Légifrance `KALITEXT000046394511`.
- Arrêté d'extension du 15 décembre 2022, Journal officiel du 24 décembre 2022.
- Conteneur officiel de la convention collective territoriale IDCC 1353 sur Légifrance.
- Recherche des accords officiels dédiés aux cotisations, santé, prévoyance, retraite, formation, AT/MP, primes et avantages : aucune règle calculable additionnelle retenue.
