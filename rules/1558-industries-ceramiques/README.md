# Industries céramiques de France — IDCC 1558

Le fichier [2025.1](1558-industries-ceramiques.2025.1.publicodes) reprend l'accord du 14 janvier 2025 relatif à l'évolution des salaires minima conventionnels, applicable au 1er janvier 2025 et étendu par arrêté du 17 avril 2025 publié le 26 avril 2025.

La valeur Publicodes est `industries céramiques` ; les règles sont sous `salarié . convention collective . industries céramiques`.

## Règles implémentées

- `classification` accepte les niveaux NA-E1 à NF-E3 de la grille ouvriers, employés, techniciens et agents de maîtrise.
- `salaire minimum conventionnel` expose les minima mensuels 2025 des niveaux NA à NF, pour 151,67 heures et proratisés selon la quotité de travail.
- `salaire minimum annuel conventionnel` expose les minima annuels 2025 des cadres NG-E1, NG-E2, H, I et J ; `forfait annuel en jours` sélectionne la colonne forfait jours publiée par l'accord.
- `indemnité de panier` expose 16 €/jour lorsque l'application déclare l'éligibilité ; le nombre de jours et les autres conditions de paie restent des entrées de l'application.
- `niveau hors grille` détecte une classification absente des deux barèmes.

## Audit des effets de paie

L'accord salarial revalorise les minima et fixe l'indemnité de panier à 16 € à compter du 1er janvier 2025. Les primes d'ancienneté, le treizième mois, les majorations de travail posté, la santé/prévoyance, la formation professionnelle, l'AT/MP et les éventuels dispositifs d'assiette ne sont pas calculés automatiquement : leurs conditions ou bases nécessitent des entrées supplémentaires qui ne sont pas fournies par ce texte salarial seul. Aucun taux conventionnel n'est inventé dans ce modèle.

Le modèle ne calcule pas le SMIC : lorsque le minimum conventionnel est inférieur au SMIC applicable, la règle légale du modèle social doit prévaloir.
