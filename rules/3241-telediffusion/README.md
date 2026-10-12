# Télédiffusion — IDCC 3241

Le fichier [2026.1](3241-telediffusion.2026.1.publicodes) entre en vigueur le **1er juin 2026**, conformément à l’accord du 11 mai 2026 relatif aux salaires minima des contrats à durée déterminée d’usage (CDDU).

La valeur Publicodes est `télédiffusion` et les règles sont sous `salarié . convention collective . télédiffusion`.

## Périmètre modélisé

Cette première version couvre uniquement la **liste 1** des minima journaliers bruts pour une journée de 8 heures :

| Niveau | Minimum journalier brut |
|---|---:|
| `1` | 119,83 € |
| `2` | 138,68 € |
| `3` | 151,30 € |
| `4-1` | 162,32 € |
| `4-2` | 168,30 € |
| `5-1` | 180,16 € |
| `5-2` | 193,05 € |
| `5-3` | 198,00 € |
| `6-1` | 205,01 € |
| `6-2` | 212,83 € |
| `7-1` | 223,65 € |
| `7-2` | 284,38 € |

Le niveau `8` est rémunéré de gré à gré dans le texte et n'est pas transformé en montant automatique. La liste 2 (fonctions artistiques et techniques : participants, musiciens, choristes, solistes, chefs, chorégraphes, mannequins, etc.) est également hors périmètre de cette version, faute d'un paramètre métier dédié pour distinguer ses fonctions et modalités de prestation.

## Audit explicite du référentiel de paie

L'accord audité porte sur des minima de rémunération CDDU, exprimés au jour et pour 8 heures. Il ne modifie pas, dans le périmètre de cette version, l'assiette générale des cotisations, les taux salariés ou employeurs, plafonds et tranches, forfaits, exonérations, avantages en nature, prévoyance, santé, formation professionnelle ou AT. Aucune règle de ces rubriques n'est ajoutée sous le namespace de la convention ; le test dédié vérifie l'absence de collision avec `modele-social` et l'isolation de l'endpoint salarial.

Ne sont pas calculés ici : la liste 2, les primes et indemnités, les règles d'ancienneté, les indemnités de mise à la retraite, les modalités de temps de travail et les obligations de prévoyance/santé. Ces dispositions nécessitent des entrées et des périmètres contractuels distincts ; elles restent documentées comme omissions plutôt que d'être assimilées au minimum journalier.

## Sources officielles

- Accord du 11 mai 2026 relatif aux salaires minima CDDU, publié dans la base officielle des conventions collectives.
- Convention collective nationale de la télédiffusion du 2 juillet 2021 (IDCC 3241), textes et versions consultés sur **Légifrance** : KALITEXT000054880861 et KALITEXT000054880840.
