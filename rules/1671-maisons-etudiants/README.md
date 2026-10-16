# Maisons d'étudiants — IDCC 1671

La version `2026.3` (qui remplace `2026.2`, même date `2026-01-01`) modélise l'avenant n° 75 du **9 décembre 2025** (annexe 1 : grille des 20 classes et coefficients minima, inchangés depuis l'avenant n° 70 de 2023), l'avenant n° 76 du **9 décembre 2025** (NAO : point à 68,80 € au lieu de 67,78 €, santé à 65 % employeur) et l'avenant n° 74 du **15 décembre 2025** (treizième mois). Les trois entrent en vigueur « sans attendre leur extension » (1er janvier 2026 pour 75 et 76, 1er juillet 2026 pour 74), donc pour les employeurs adhérents aux organisations signataires. Pour les autres employeurs, l'application commence avec le Journal officiel : arrêté du 3 juillet 2026 (JORF du **11 juillet 2026**) pour les avenants n° 75 et n° 74, soit à partir du **12 juillet 2026** ; arrêté du 23 septembre 2026 (JORF du **3 octobre 2026**) pour l'avenant n° 76, soit à partir du **4 octobre 2026**. Entre le 12 juillet et le 3 octobre 2026, ces employeurs restent donc à la valeur de point de 67,78 € (avenant n° 73, texte non relu). Avant le 12 juillet 2026, la grille n'est pas modélisée pour eux (elle date de l'avenant n° 70, non modélisé).

La valeur Publicodes est `maisons d'étudiants` et les règles sont sous `salarié . convention collective . maisons d'étudiants`.

## Règles implémentées

- `classe` accepte les classes 1 à 20 ; la grille associe chaque classe à son coefficient conventionnel ;
- `valeur annuelle du point` vaut `68,80 €/an` (adhérents dès le 1er janvier 2026, tous employeurs à partir du 4 octobre 2026) et `67,78 €/an` pour les autres employeurs du 12 juillet au 3 octobre 2026 ;
- `champ juridique` (`employeur signataire ou adhérent` ou `tous employeurs après extension`, défaut) et `date de calcul` (à fournir : sans date, le minimum est non applicable) pilotent ces dates ;
- `salaire minimum annuel conventionnel` calcule le minimum brut annuel à temps plein et le prorata selon la quotité ;
- `salaire minimum mensuel indicatif` expose seulement l'équivalent de la garantie annuelle (`minimum annuel / 12`) ;
- `treizième mois annuel` applique la montée en charge de l'avenant n° 74 : un tiers en 2026, deux tiers en 2027, puis la totalité à partir de 2028, sur une assiette annuelle fournie par l'application ;
- `prise en charge employeur santé` et `part salarié santé` répartissent la cotisation totale externe selon la clé 65 % / 35 % de l'avenant n° 76 ;
- les dates et le champ juridique sont bloqués explicitement ; une classe hors grille vaut zéro et est signalée.

## Audit explicite des rubriques de paie

L'audit a porté sur l'avenant salarial et les textes dédiés de protection sociale, de formation, de prévoyance, de santé, de primes et d'avantages, ainsi que sur les arrêtés d'extension disponibles.

- **Cotisations salarié/employeur, taux et assiettes** : les avenants n° 75 et n° 76 ne changent pas les cotisations générales de sécurité sociale. La seule clé conventionnelle calculable trouvée est la complémentaire santé : 65 % employeur et 35 % salarié ; la cotisation totale reste une entrée externe car le montant dépend du contrat assureur.
- **Bases, plafonds, tranches et forfaits** : aucun plafond, aucune tranche ni assiette forfaitaire générique nouvelle n'est calculable à partir des entrées du modèle ; omission explicite.
- **Santé** : la répartition 65 % / 35 % est modélisée sur une cotisation mensuelle totale fournie par l'application. Les garanties et le montant assureur ne sont pas inventés.
- **Prévoyance** : les textes autonomes ne fournissent pas, dans le périmètre calculable de cette version, un taux universel salarié/employeur et une assiette indépendante de l'organisme ; aucune valeur par défaut n'est ajoutée.
- **Formation professionnelle** : les contributions légales et éventuelles contributions conventionnelles dépendent de l'effectif, de la masse salariale et du dispositif ; aucun taux additionnel suffisamment paramétré n'est calculé.
- **AT/MP** : aucun taux conventionnel n'est fixé par les avenants modélisés ; la tarification dépend de l'activité et du régime réglementaire, donc elle reste hors modèle.
- **Primes et avantages** : le treizième mois est exposé avec son assiette externe et sa montée en charge. Les primes d'ancienneté, indemnités, avantages en nature, repas/logement, congés et remboursements de frais ne sont pas calculés faute d'entrées et de conditions d'attribution sûres.
- **Comparaison et proratisation** : le minimum légalement modélisé reste annuel en `€/an`; seul son équivalent indicatif est divisé par douze, et le prorata est appliqué à la quotité de travail.

## Sources officielles

- Avenant n° 75 du 9 décembre 2025 (annexes 1 et 2, classification et coefficients minima), KALITEXT `KALITEXT000054454208`, étendu par arrêté du 3 juillet 2026 (JORF du 11 juillet 2026).
- Avenant n° 76 du 9 décembre 2025 (NAO : valeur du point, santé), KALITEXT `KALITEXT000054454222`, étendu par arrêté du 23 septembre 2026 (JORF du 3 octobre 2026).
- Avenant n° 74 du 15 décembre 2025 (treizième mois), KALITEXT `KALITEXT000054454229`, étendu par arrêté du 3 juillet 2026 (JORF du 11 juillet 2026).
- Avenant n° 72 du 17 avril 2025 relatif à la prévoyance, KALITEXT `KALITEXT000051314781`.
- Convention collective nationale des maisons d'étudiants, conteneur `KALICONT000005635917`, et arrêtés d'extension ci-dessus.

## Limites

Les dispositifs de prévoyance, formation, AT/MP, garanties santé et avantages nécessitent des paramètres de contrat, d'effectif, d'activité ou d'organisme. Ils sont audités et explicitement laissés à l'application plutôt que remplacés par des taux ou assiettes par défaut.
