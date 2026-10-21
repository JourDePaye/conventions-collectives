# Entreprises privées du spectacle vivant (IDCC 3090)

| Version | Date d'effet | Contenu |
|---|---|---|
| `2025.3` | 1er septembre 2025 | Grilles de l'avenant du 21 juillet 2025, dont le niveau technique « Cadres groupe 3 » (conseiller(ière) technique) |
| `2025.4` | 1er septembre 2025 | Mêmes grilles, extension déclarée (arrêté du 17 février 2026, JORF du 24 février 2026), contribution au financement du paritarisme et prévoyance des non-cadres |

Les révisions `2025.1` (montants techniques et catégories absents du texte) et `2025.2` (sans le niveau technique « Cadres groupe 3 ») ont été supprimées pendant la beta. L'avenant du 21 juillet 2025 ([KALITEXT000053721738](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000053721738)) est le dernier accord salarial de la branche publié dans KALI au 21 octobre 2026 ; ses grilles ont été relues à cette date.

## Périmètre juridique explicite

Ce modèle couvre uniquement les minima mensuels bruts des salariés permanents administratifs, commerciaux et techniques des entreprises privées du spectacle vivant. Il ne calcule pas les rémunérations des artistes, des intermittents, des tournées ou des engagements, ni les annexes spécifiques. Il ne calcule pas non plus les primes d'ancienneté, majorations, indemnités, treizième mois, santé ou formation ; depuis `2025.4`, seules la contribution au financement du paritarisme et la prévoyance de la convention de base sont calculées (voir ci-dessous).

La catégorie et l'échelon doivent être renseignés tels qu'attribués par l'employeur ; le modèle ne les déduit pas de l'intitulé du poste. Depuis `2025.4`, la classification se compose de la `filière` (`'administrative et commerciale'` ou `'technique'`), de la `catégorie` et de l'`échelon`, un nombre de 1 à 5, sans effet dans la filière technique et pour les cadres groupe 1 ; elle remplace `catégorie administrative`, `catégorie technique` et l'échelon en texte des versions précédentes. Les minima sont proratisés selon `salarié . contrat . temps de travail . quotité` et arrondis à deux décimales.

## Salariés permanents administratifs et commerciaux

| Catégorie | Échelon 1 | Échelon 2 | Échelon 3 | Échelon 4 | Échelon 5 |
|---|---:|---:|---:|---:|---:|
| Cadres groupe 1 | 3 578,18 € | — | — | — | — |
| Cadres groupe 2 | 2 833,28 € | 2 950,14 € | 3 067,04 € | 3 183,92 € | 3 300,81 € |
| Cadres groupe 3 | 2 485,24 € | 2 602,15 € | 2 719,02 € | 2 835,90 € | 2 952,77 € |
| Agents de maîtrise | 2 099,10 € | 2 175,07 € | 2 256,89 € | 2 323,53 € | 2 391,32 € |
| Employés qualifiés groupe 1 | 1 906,82 € | 1 954,08 € | 2 010,45 € | 2 059,12 € | 2 119,90 € |
| Employés qualifiés groupe 2 | 1 805,12 € | 1 834,57 € | 1 886,62 € | 1 888,86 € | 1 922,01 € |
| Employés | 1 801,80 € | 1 805,14 € | 1 811,07 € | 1 816,99 € | 1 822,90 € |

## Salariés permanents techniques

| Catégorie | Minimum mensuel |
|---|---:|
| Cadres groupe 2 | 2 658,78 € |
| Cadres groupe 3 | 2 361,50 € |
| Agents de maîtrise | 2 115,80 € |
| Employés qualifiés groupe 1 | 1 906,49 € |
| Employés qualifiés groupe 2 | 1 821,56 € |
| Employés | 1 801,80 € |

Une classification hors de ces catégories ou un salarié hors du périmètre permanent est laissé sans minimum conventionnel modélisé plutôt que traité par approximation.

## Cotisations de la convention (depuis `2025.4`)

- **Financement du paritarisme** (`FCAP`, titre V, article 5.1) : 0,1 % de la tranche A, avec un plancher de 80 € et un plafond de 300 € par an et par entreprise, collectée chaque année par le FCAP-SVP. Le modèle en fait une provision mensuelle par salarié, ajoutée à `salarié . cotisations . employeur` : 0,1 % de son salaire plafonné, entre 80 € et 300 € divisés par 12 et par l'effectif de l'entreprise. Ce partage égal du plancher et du plafond suppose des salaires comparables.
- **Prévoyance** (titre XII) : 1,20 % de la tranche A, totalement à la charge de l'employeur (articles 12.6.2 et 12.6.3), qui remplace `salarié . cotisations . prévoyances . conventionnelle . employeur`. Les non-cadres n'adhèrent au régime qu'à compter d'un an d'ancienneté dans une entreprise de la branche (article 12.3) : `ancienneté dans la branche`, contrats antérieurs compris, à renseigner. Pour les cadres, la cotisation s'impute sur l'obligation de 1,50 % de la tranche A, déjà calculée par modele-social : le modèle n'ajoute rien.
- **Non modélisés** : la contribution de 0,28 % de la tranche 1 au degré élevé de solidarité en prévoyance (accord du 12 mai 2025, [KALITEXT000053721717](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000053721717)), obligatoire pour les entreprises de l'annexe II (chanson, variétés, jazz, musiques actuelles) et facultative pour les autres, et le régime de frais de santé (accord du 19 juillet 2024).

Ces deux cotisations remplacent celles de la convention `SVP` de modele-social, à utiliser sans elle.

## Références officielles

- Accord salarial et texte KALI : [KALITEXT000053721738](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000053721738).
- Article KALI relatif à l'entrée en vigueur et à l'extension : [KALISCTA000053721742](https://www.legifrance.gouv.fr/conv_coll/id/KALISCTA000053721742).
- Convention collective nationale du 3 février 2012 ([KALICONT000028157262](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000028157262)) : titre V ([KALISCTA000028157274](https://www.legifrance.gouv.fr/conv_coll/id/KALISCTA000028157274)) et titre XII ([KALISCTA000028157281](https://www.legifrance.gouv.fr/conv_coll/id/KALISCTA000028157281)).
- Stock officiel DILA KALI, dernier snapshot inspecté : [OPENDATA/KALI](https://echanges.dila.gouv.fr/OPENDATA/KALI/), archive `KALI_20261009-214339.tar.gz`.
