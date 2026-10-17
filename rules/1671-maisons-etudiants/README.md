# Maisons d'étudiants — IDCC 1671

La version `2026.3` modélise l'avenant n° 75 du **9 décembre 2025** (annexe 1 : grille des 20 classes et coefficients minima, inchangés depuis l'avenant n° 70 de 2022), l'avenant n° 76 du **9 décembre 2025** (NAO : point à 68,80 € au lieu de 67,78 €, santé à 65 % employeur) et l'avenant n° 74 du **15 décembre 2025** (treizième mois). Les trois entrent en vigueur « sans attendre leur extension » (1er janvier 2026 pour 75 et 76, 1er juillet 2026 pour 74), donc pour les employeurs adhérents aux organisations signataires. Pour les autres employeurs, l'application commence à la publication au Journal officiel (article 2 des arrêtés : effet à la date de publication) : arrêté du 3 juillet 2026 (JORF n° 0161 du **11 juillet 2026**) pour les avenants n° 75 et n° 74 ; arrêté du 23 septembre 2026 (JORF n° 0231 du **3 octobre 2026**) pour l'avenant n° 76.

Les versions, du point de vue d'un employeur non adhérent :

- `2025.1` (`extension: 2025-04-09`) : coefficients de l'avenant n° 70 (au 1er janvier 2023, étendu au JORF du 12 octobre 2023), point à 67,78 € (avenant n° 73, étendu au JORF du 9 avril 2025), santé à 60 % employeur (avenant n° 71). Pas de treizième mois.
- `2026.2` (`extension: 2026-07-11`) : avenants n° 75 et n° 74 sans l'avenant n° 76, soit le point à 67,78 € et la santé à 60 %, avec le treizième mois.
- `2026.3` (`extension: 2026-10-03`) : les trois avenants.

Un employeur adhérent a `2026.3` dès le 1er janvier 2026. Le minimum par classe est le même en `2025.1` et `2026.2`, la grille de l'avenant n° 75 reprenant les coefficients de l'avenant n° 70.

La valeur Publicodes est `maisons d'étudiants` et les règles sont sous `salarié . convention collective . maisons d'étudiants`.

## Règles implémentées

- `classe` accepte les classes 1 à 20 ; la grille associe chaque classe à son coefficient conventionnel ;
- `valeur annuelle du point` vaut `68,80 €/an` en `2026.3` et `67,78 €/an` en `2025.1` et `2026.2` ;
- JourDePaye choisit la version selon l'adhésion de l'employeur, les règles n'ont plus d'entrée d'adhésion ni de date ;
- `salaire minimum annuel conventionnel` calcule le minimum brut annuel à temps plein et le prorata selon la quotité ;
- `salaire minimum mensuel indicatif` expose seulement l'équivalent de la garantie annuelle (`minimum annuel / 12`) ;
- `treizième mois annuel` applique la montée en charge de l'avenant n° 74 : un tiers en 2026, deux tiers en 2027, puis la totalité à partir de 2028, sur une assiette annuelle fournie par l'application ;
- `prise en charge employeur santé` et `part salarié santé` répartissent la cotisation totale externe selon la clé 65 % / 35 % de l'avenant n° 76 (`2026.3`) ou 60 % / 40 % de l'avenant n° 71 (`2025.1`, `2026.2`) ;
- les dates et l'adhésion sont bloquées explicitement ; une classe hors grille vaut zéro et est signalée.

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
- Avenant n° 73 du 11 décembre 2024 (point à 67,78 €), KALITEXT `KALITEXT000051314792`, étendu par arrêté du 21 mars 2025 (JORF du 9 avril 2025).
- Avenant n° 71 du 12 décembre 2023 (santé à 60 %), KALITEXT `KALITEXT000049495970`, étendu par arrêté du 13 décembre 2024 (JORF du 24 décembre 2024).
- Avenant n° 70 du 1er décembre 2022 (coefficients au 1er janvier 2023), KALITEXT `KALITEXT000047618299`, étendu par arrêté du 18 septembre 2023 (JORF du 12 octobre 2023).
- Avenant n° 72 du 14 novembre 2024 relatif à la prévoyance, KALITEXT `KALITEXT000051314781`.
- Convention collective nationale des maisons d'étudiants, conteneur `KALICONT000005635917`, et arrêtés d'extension ci-dessus.

## Limites

Les dispositifs de prévoyance, formation, AT/MP, garanties santé et avantages nécessitent des paramètres de contrat, d'effectif, d'activité ou d'organisme. Ils sont audités et explicitement laissés à l'application plutôt que remplacés par des taux ou assiettes par défaut.
