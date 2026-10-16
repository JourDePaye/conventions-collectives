# Industries céramiques de France — IDCC 1558

Le fichier [2025.1](1558-industries-ceramiques.2025.1.publicodes) reprend l'accord du 14 janvier 2025 relatif à l'évolution des salaires minima conventionnels, applicable au 1er janvier 2025 et étendu par arrêté du 17 avril 2025 publié le 26 avril 2025.

La révision [2025.2](1558-industries-ceramiques.2025.2.publicodes), même date d'effet, corrige deux défauts de 2025.1 : `niveau hors grille` ne testait que la grille mensuelle, si bien que les cadres NG à J étaient hors grille, et la grille annuelle comparait `forfait annuel en jours` aux textes `'oui'` et `'non'` alors que sa valeur par défaut est le booléen `non`. En 2025.2, l'entrée est comparée comme un booléen et seule une classification absente des deux barèmes est hors grille.

La version [2026.1](1558-industries-ceramiques.2026.1.publicodes) reprend l'accord du 26 février 2026 (valeur du point 1,26, valeur de base 1 830), applicable au 1er janvier 2026 (article 7) et étendu par arrêté du 19 mai 2026 publié au JORF du 29 mai 2026 : mêmes niveaux, mêmes règles et mêmes clés que 2025.2 (par exemple NA-E1 : 1 831,26 €/mois ; J : 59 382 €/an). Les versions 2025.1 et 2025.2 restent valables pour les périodes antérieures au 1er janvier 2026.

La valeur Publicodes est `industries céramiques` ; les règles sont sous `salarié . convention collective . industries céramiques`.

## Règles implémentées

- `classification` accepte les niveaux NA-E1 à NF-E3 de la grille ouvriers, employés, techniciens et agents de maîtrise.
- `salaire minimum conventionnel` expose les minima mensuels des niveaux NA à NF, pour 151,67 heures et proratisés selon la quotité de travail.
- `salaire minimum annuel conventionnel` expose les minima annuels des cadres NG-E1, NG-E2, H, I et J ; `forfait annuel en jours` sélectionne la colonne forfait jours publiée par l'accord.
- `indemnité de panier` expose 16 €/jour lorsque l'application déclare l'éligibilité ; le nombre de jours et les autres conditions de paie restent des entrées de l'application.
- `niveau hors grille` détecte une classification absente des deux barèmes (à partir de 2025.2).

## Audit des effets de paie

L'accord salarial revalorise les minima et fixe l'indemnité de panier à 16 € à compter du 1er janvier 2025. Les primes d'ancienneté, le treizième mois, les majorations de travail posté, la santé/prévoyance, la formation professionnelle, l'AT/MP et les éventuels dispositifs d'assiette ne sont pas calculés automatiquement : leurs conditions ou bases nécessitent des entrées supplémentaires qui ne sont pas fournies par ce texte salarial seul. Aucun taux conventionnel n'est inventé dans ce modèle.

Le modèle ne calcule pas le SMIC : lorsque le minimum conventionnel est inférieur au SMIC applicable, la règle légale du modèle social doit prévaloir.
