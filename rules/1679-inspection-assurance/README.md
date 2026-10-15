# Inspection d'assurance — IDCC 1679

La version `2007.2` modélise le protocole d'accord du **21 mars 2007** relatif aux rémunérations minimales annuelles (RMA), avec effet au **1er janvier 2007**. L'accord est publié par Légifrance comme texte **en vigueur non étendu**. Il concerne les inspecteurs encore en fonction à la date de signature ; le modèle conserve cette limite dans sa documentation et ne présente pas cette grille historique comme une garantie actuelle universelle.

La version `2026.1` reprend le protocole d'accord du **10 juin 2026** relatif aux rémunérations minimales pour l'année 2026 (Légifrance `KALITEXT000054887714`), avec effet au **1er janvier 2026** : classes 5, 6 et 7 à 35 500 €, 45 030 € et 62 560 €. Le texte est « en vigueur non étendu » : il s'applique aux entreprises liées par la FFA.

Les versions `2008.1` à `2025.1` reprennent les accords et protocoles annuels de 2008 à 2025, tous « en vigueur non étendus », avec effet au 1er janvier de chaque année (montants en euros par an, relus sur Légifrance) :

| Version | Effet | Texte | Classe 5 | Classe 6 | Classe 7 |
|---|---|---|---:|---:|---:|
| `2008.1` | 1er janvier 2008 | `KALITEXT000019652438` | 27 750 | 36 630 | 51 120 |
| `2009.1` | 1er janvier 2009 | `KALITEXT000021180854` | 28 370 | 37 440 | 52 250 |
| `2010.1` | 1er janvier 2010 | `KALITEXT000023175797` | 28 890 | 38 120 | 53 200 |
| `2011.1` | 1er janvier 2011 | `KALITEXT000024769836` | 29 470 | 38 890 | 54 270 |
| `2012.1` | 1er janvier 2012 | `KALITEXT000026383056` | 30 090 | 39 710 | 55 410 |
| `2013.1` | 1er janvier 2013 | `KALITEXT000028465771` | 30 400 | 40 110 | 55 970 |
| `2014.1` | 1er janvier 2014 | `KALITEXT000029361310` | 30 620 | 40 400 | 56 370 |
| `2015.1` | 1er janvier 2015 | `KALITEXT000031284455` | 30 780 | 40 610 | 56 660 |
| `2016.1` | 1er janvier 2016 | `KALITEXT000033196798` | 30 940 | 40 820 | 56 950 |
| `2017.1` | 1er janvier 2017 | `KALITEXT000035677627` | 31 190 | 41 150 | 57 410 |
| `2018.1` | 1er janvier 2018 | `KALITEXT000037651968` | 31 510 | 41 570 | 57 990 |
| `2019.1` | 1er janvier 2019 | `KALITEXT000039191674` | 31 890 | 41 870 | 58 400 |
| `2020.1` | 1er janvier 2020 | `KALITEXT000042312633` | 32 090 | 42 040 | 58 640 |
| `2021.1` | 1er janvier 2021 | `KALITEXT000044091288` | 32 290 | 42 210 | 58 880 |
| `2022.1` | 1er janvier 2022 | `KALITEXT000046478078` | 33 100 | 42 970 | 59 940 |
| `2023.1` | 1er janvier 2023 | `KALITEXT000048044307` | 34 100 | 43 830 | 61 140 |
| `2024.1` | 1er janvier 2024 | `KALITEXT000050140803` | 34 860 | 44 490 | 62 060 |
| `2025.1` | 1er janvier 2025 | `KALITEXT000052226917` | 35 210 | 44 670 | 62 310 |
| `2026.1` | 1er janvier 2026 | `KALITEXT000054887714` | 35 500 | 45 030 | 62 560 |

La valeur Publicodes est `inspection assurance` et les règles sont sous `salarié . convention collective . inspection assurance`.

## Règles implémentées

- `classe` accepte les classes 5, 6 et 7 du barème des fonctions d'inspection ;
- `grille annuelle` fournit respectivement `27 120 €/an`, `35 800 €/an` et `49 970 €/an` ;
- `salaire minimum annuel conventionnel` conserve la comparaison en `€/an` et applique la quotité de travail ;
- `salaire minimum mensuel indicatif` expose uniquement le douzième informatif de la RMA ;
- `classe hors grille` signale les classes absentes.

## Audit explicite des rubriques de paie

La recherche a couvert le protocole salarial, la convention de base, les accords dédiés et les textes publiés ou rattachés à l'IDCC 1679, ainsi que les arrêtés d'extension disponibles.

- **Cotisations salarié/employeur, taux et assiettes** : le protocole du 21 mars 2007 ne modifie pas les cotisations générales et ne fournit pas de taux conventionnel générique calculable ; aucune différence salarié/employeur n'est ajoutée.
- **Bases, plafonds, tranches et forfaits** : aucune base, plafond, tranche ou assiette forfaitaire nouvelle n'est fixée par le texte salarial ; omission explicite.
- **Santé et prévoyance** : aucun taux universel salarié/employeur, régime assureur et assiette indépendante ne sont calculables à partir des entrées du modèle ; omission explicite.
- **Formation professionnelle** : aucune contribution conventionnelle chiffrée et paramétrable n'a été trouvée dans le périmètre du modèle ; les contributions légales restent externes.
- **AT/MP** : aucun taux conventionnel n'est fixé ; la tarification dépend de l'activité et du régime réglementaire.
- **Primes et avantages** : le protocole exclut les inspecteurs qui ne sont plus en fonction et renvoie aux modalités de comparaison de la convention ; aucune prime d'ancienneté, variable, frais, avantage en nature ou indemnité n'est calculée faute d'assiette et de conditions suffisamment paramétrées.
- **Comparaison** : les RMA restent annuelles ; le montant mensuel n'est qu'un équivalent indicatif et n'intègre pas automatiquement les éléments de rémunération retenus par le texte.

## Sources officielles

- [Protocole d'accord du 21 mars 2007 relatif aux rémunérations minimales pour l'année 2007](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000017890005).
- [Convention collective nationale de l'inspection d'assurance du 27 juillet 1992, IDCC 1679](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635475).

## Limites

Aucun accord de branche salarial plus récent et directement calculable n'a été identifié dans le périmètre retenu pour cette version. Les accords d'entreprise rattachés à l'IDCC 1679 ne sont pas utilisés comme minima de branche. Une future version devra remplacer ou compléter cette grille seulement sur la base d'un nouveau texte officiel de branche, sans modifier `2007.1`.
