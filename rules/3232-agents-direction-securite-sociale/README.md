# Agents de direction des organismes du régime général de sécurité sociale — IDCC 3232

La version `2026.1` est applicable au **1er janvier 2026** (avenants du 10 février 2026, KALITEXT000054092344 et KALITEXT000054092339) ; la version `2025.2` reste applicable du 1er janvier au 31 décembre 2025 (avenants du 31 janvier 2025). Elles modélisent uniquement les montants chiffrés et calculables : l'indemnité de double résidence et les plafonds du prêt automobile.

## Règles calculées

- indemnité mensuelle de double résidence : 1 089,94 € à Paris ou dans un département limitrophe (zone 1), 871,95 € dans une unité urbaine de plus de 400 000 habitants ou dont la ville principale est préfecture de région (zone 2), 544,97 € dans les autres cas (zone 3) ;
- majoration de 54,29 € par enfant à charge ;
- plafond du prêt automobile : 9 051,92 € ;
- plafond du renouvellement du prêt automobile : 5 966,00 €.

(Montants 2025, version `2025.2` : 1 065,24 / 852,19 / 532,62 €, majoration 53,06 €, prêt 8 970,87 € et 5 912,58 €.)

L'accord du 22 novembre 2024 relatif à la nouvelle classification et au dispositif de rémunération, agréé le 20 mars 2025, prévoit une nouvelle grille avec mise en œuvre au 1er juillet 2025. Elle n'est pas calculée ici : le classement des organismes, les points de fonction, la part variable et le repositionnement individuel nécessitent des entrées propres à l'organisme et à l'agent.

## Audit explicite des rubriques de paie

La convention, l'avenant du 31 janvier 2025, les textes dédiés de classification/rémunération et les textes d'extension ou d'agrément disponibles ont été recherchés pour :

- **Cotisations salarié/employeur, taux et assiettes** : aucun taux ou changement d'assiette chiffré et générique n'est fixé par les textes modélisés ; omission documentée.
- **Plafonds, tranches et forfaits** : les seuls plafonds conventionnels calculés sont ceux des prêts automobiles ci-dessus ; aucun plafond ou forfait de cotisation n'est ajouté.
- **Santé et prévoyance** : aucun taux ou montant universel directement calculable sans contrat assureur n'est ajouté.
- **Retraite complémentaire et supplémentaire** : aucun taux ni assiette conventionnelle nouvelle n'est calculé.
- **Formation professionnelle** : le texte impose des dispositifs de formation mais ne fournit pas de contribution chiffrée calculable dans cette version ; omission documentée.
- **AT/MP** : aucun taux conventionnel ; la tarification dépend du régime réglementaire et de l'activité.
- **Primes et indemnités** : seule l'indemnité de double résidence chiffrée par l'avenant est calculée ; la part variable et les points de responsabilité nécessitent des données d'évaluation et de classement non disponibles.
- **Avantages, exonérations et frais** : le prêt automobile est exposé comme plafond, sans simuler l'octroi, les remboursements ou un avantage en nature ; aucune exonération ni frais n'est inventé.

Ces omissions sont intentionnelles : aucun taux salarié/employeur, base, plafond de cotisation, tranche ou forfait non sourcé n'est mis à zéro.

## Sources officielles

- [Convention collective nationale des agents de direction des organismes du régime général de sécurité sociale — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000039800704)
- [Avenant du 10 février 2026, double résidence — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054092344)
- [Avenant du 10 février 2026, prêts véhicule — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054092339)
- [Avenant du 31 janvier 2025, prêts véhicule — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000051447486)
- [Avenant du 31 janvier 2025, double résidence — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000051447491)
- [Lettre circulaire UCANSS 011-25 sur le protocole du 22 novembre 2024](https://jurilettres.ucanss.fr/lettresCirculaires/LC011-25.html/)
