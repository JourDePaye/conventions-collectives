# Restauration rapide — IDCC 1501

Le fichier [2025.1](1501-restauration-rapide.2025.1.publicodes) entre en vigueur le 1er juin 2025 (avenant n° 72, minima conventionnels). Le fichier [2026.2](1501-restauration-rapide.2026.2.publicodes) entre en vigueur le 1er janvier 2026, date d’effet de l’avenant n° 10 du 5 décembre 2025 (régime de prévoyance, étendu par arrêté du 27 mai 2026, JORF du 3 juin 2026) : il reprend la grille de l’avenant n° 72 et ajoute la prévoyance. Le fichier [2026.1](1501-restauration-rapide.2026.1.publicodes), identique mais daté du 4 juin 2026 (lendemain de la publication de l’arrêté d’extension), est conservé car une version publiée ne change jamais ; il prend le relais de 2026.2 à partir du 4 juin 2026 avec les mêmes règles. Les textes sont cités dans les métadonnées. La valeur Publicodes est `restauration rapide` ; les règles sont sous `salarié . convention collective . restauration rapide`.

La convention collective nationale de la restauration rapide du 18 mars 1988 (brochure 3245) couvre la restauration rapide, élargie à la restauration livrée par l’avenant n° 29.

Aucun avenant plus récent ne révise ces minima, renégociés chaque année selon l’article 44 : la grille de l’avenant n° 72 reste donc en vigueur en 2026 (versions `2026.1` et `2026.2`) (à confirmer sur Légifrance).

## Règles implémentées

- `niveau` reçoit un niveau et un échelon au format `<niveau>.<échelon>` (défaut : `non renseigné`) :
  - `I.A` et `I.B`, `II.A` et `II.B`, `III.A` à `III.C`, `IV.A` à `IV.D` ;
  - `V.A` à `V.C`.

  Les niveaux I à III concernent les employés, le niveau IV les agents de maîtrise et le niveau V les cadres.
- `taux horaire minimum` donne le taux horaire minimum brut des 11 positions des niveaux I à IV, de 11,88 €/heure (`I.A`) à 17,34 €/heure (`IV.D`). Il vaut `0 €/heure` pour le niveau V.
- `rémunération minimale annuelle` donne la rémunération minimale annuelle brute, tous éléments de salaire confondus, des trois échelons du niveau V : 44 645,78 €, 46 032,71 € et 72 408,11 €. Elle vaut `0 €/an` pour les niveaux I à IV.
- `salaire minimum conventionnel` additionne les deux :
  - pour les niveaux I à IV, le taux horaire multiplié par `salarié . contrat . temps de travail` de `modele-social`, soit 151,67 heures par mois pour un temps plein, comme le SMIC. Par exemple, `III.B` vaut 1 961,05 €/mois à temps complet ;
  - pour le niveau V, un douzième du minimum annuel, multiplié par `salarié . contrat . temps de travail . quotité`. Le montant ne doit donc pas être proratisé une seconde fois.
- `niveau hors grille` signale un niveau ou un échelon absent des 14 positions. Les deux grilles retournent alors zéro et l’application doit traiter l’anomalie.

Les échelons `I.A`, `I.B` et `II.A` (de 11,88 € à 12,22 € de l’heure) sont inférieurs au SMIC horaire de 12,31 € en vigueur depuis juin 2026 : l’application doit retenir le plus élevé des deux montants.

## Limites

- Le minimum du niveau V est annuel et s’apprécie sur tous les éléments de salaire (primes, treizième mois, parts variables). Le modèle n’en donne que l’équivalent mensuel, un douzième : l’avenant ne définit pas de conversion mensuelle, c’est donc une approximation.
- Le régime de prévoyance (2026.1 et 2026.2) calcule 0,50 % du salaire brut sur T1 et T2 plafonnées à 4 PMSS, réparti à parts égales entre employeur et salarié pour les non-cadres ; les dispositions cadres restent celles du modèle social standard.
- Les primes, majorations, la santé, la formation et les autres éléments de la convention ne sont pas modélisés.
- Les grilles antérieures à l’avenant n° 72, notamment celle de l’avenant n° 67 du 30 avril 2024, ne sont pas modélisées : la première version couvre les périodes à partir du 1er juin 2025.
- L’avenant s’applique de plein droit aux adhérents des organisations patronales signataires, et à tous les employeurs du champ depuis son extension (publication de l’arrêté du 7 août 2025).

## Maintien de salaire

La révision 2026.3 et 2026.4 ajoute le maintien de salaire conventionnel (articles 19 B et 20) sous `maintien de salaire`, lu sur Légifrance le 24 octobre 2026 : les durées, taux, carences et modalités sont dans les sources de la version et dans `test/salary-maintenance.test.ts`. L’interface est décrite dans le README du package. La maladie professionnelle, confondue avec l’accident du travail, est indemnisée après 6 mois au lieu d’un an.
