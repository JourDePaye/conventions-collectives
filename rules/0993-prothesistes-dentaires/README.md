# Prothésistes dentaires — IDCC 993

Le fichier [2026.1](0993-prothesistes-dentaires.2026.1.publicodes) entre en vigueur le **1er octobre 2026**, premier jour du mois suivant la publication au JORF du 4 septembre 2026 de l’arrêté du 24 août 2026 portant extension de l’accord du 15 juin 2026.

La valeur Publicodes est `prothésistes dentaires` et les règles sont sous `salarié . convention collective . prothésistes dentaires`.

## Grille salariale implémentée

| Code | Emploi ou qualification | Minimum mensuel brut |
|---|---|---:|
| `personnel-service` | Personnel de service | 1 892 € |
| `secretaire-aide-comptable` | Secrétaire administratif / aide-comptable | 1 896 € |
| `comptable` | Comptable | 2 002 € |
| `employe-prothese` | Employé en prothèse dentaire | 1 895 € |
| `auxiliaire-prothese` | Auxiliaire en prothèse dentaire | 1 903 € |
| `TQ1`, `TQ2`, `TQ3` | Technicien qualifié | 1 935 €, 2 118 €, 2 246 € |
| `PHQ1`, `PHQ2` | Prothésiste dentaire hautement qualifié | 2 293 €, 2 522 € |
| `responsable-secteur` | Responsable de secteur | 2 755 € |
| `chef-laboratoire` | Chef de laboratoire | 3 300 € |

Le minimum est proratisé une seule fois par la quotité de travail. Une qualification hors grille est signalée par `niveau hors grille` et retourne zéro afin que l’appelant puisse traiter l’anomalie.

## Audit explicite du référentiel de paie

L’accord du 15 juin 2026 porte sur les salaires minima et les primes liées aux qualifications. L’extension ne modifie pas l’assiette générale, les taux ou plafonds des cotisations, les tranches, forfaits, exonérations, avantages en nature, prévoyance, santé, formation professionnelle ou AT dans le périmètre de ce modèle. Aucun changement de ces rubriques n’est donc ajouté sous le namespace de la convention : le test dédié vérifie l’absence de collision avec `modele-social` et l’isolation des endpoints de paie.

Ne sont pas calculées ici : les primes de qualification elles-mêmes, l’ancienneté, l’apprentissage et les dispositions de temps de travail. Elles nécessitent des entrées dédiées et restent explicitement hors périmètre plutôt que d’être assimilées au salaire minimum.

## Sources officielles

- Accord du 15 juin 2026 relatif aux salaires minima et aux primes de qualification, publié au Bulletin officiel des conventions collectives.
- Arrêté du 24 août 2026 portant extension, publié au **Journal officiel n° 0206 du 4 septembre 2026**, Légifrance.
