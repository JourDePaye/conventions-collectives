# Convention collective nationale de la distribution, de la logistique et des services de proximité (IDCC 1408).

Le fichier [2025.1](1408-distribution-logistique-energies.2025.1.publicodes) entre en vigueur le **1er mai 2025** pour l'avenant salarial étendu du 27 mars 2025. La valeur Publicodes est `distribution logistique énergies`.

## Grille salariale implémentée

| Coefficient | Minimum mensuel brut |
|---:|---:|
| 200 | 1 852,12 € |
| 210 | 1 858,37 € |
| 220 | 1 867,80 € |
| 230 | 1 882,42 € |
| 240 | 1 911,42 € |
| 250 | 1 989,36 € |
| 300 | 2 145,22 € |
| 310 | 2 456,96 € |
| 320 | 2 768,68 € |
| 400 | 2 846,62 € |
| 410 | 3 158,36 € |
| 420 | 3 781,82 € |
| 430 | 4 405,29 € |
| 440 | 5 184,63 € |
| 450 | 6 119,83 € |
| 460 | 7 522,62 € |

Le minimum est proratisé une seule fois par `contrat . temps de travail . quotité`. Un coefficient absent est signalé par `coefficient hors grille` et retourne zéro.

## Prime d'ancienneté

La prime d'ancienneté est modélisée pour les coefficients de la grille auxquels l'avenant applique ce dispositif : 3 % après 3 ans, 6 % après 6 ans, 9 % après 9 ans, 12 % après 12 ans et 15 % après 15 ans. Elle est calculée sur le minimum conventionnel du coefficient, après proratisation du temps de travail, et ne remplace pas le salaire minimum.

## Audit des rubriques de paie

Le texte salarial fixe les minima et la prime d'ancienneté. Il ne fixe pas une assiette conventionnelle générale, de taux ou plafonds de cotisations, de forfait, d'avantage en nature, de santé/prévoyance, de formation professionnelle ou d'AT/MP calculable sans paramètres supplémentaires. Aucun endpoint global de `modele-social` n'est donc redéfini dans ce namespace. Les tests vérifient l'absence de collision et l'inapplicabilité hors convention.

Les autres primes, indemnités, frais, classifications détaillées et dispositifs de protection sociale restent hors périmètre lorsqu'ils nécessitent des faits ou des bases non définis par l'accord salarial.

## Sources officielles

- Avenant n° 25 du 27 mars 2025 relatif aux salaires minima, Légifrance, KALITEXT000051787046.
- Arrêté du 21 mai 2025 portant extension de l'avenant, publié au Journal officiel, texte officiel référencé par l'accord étendu.
- Convention collective nationale de la distribution, de la logistique et des services de proximité du 12 juillet 2001, IDCC 1408, Légifrance.
