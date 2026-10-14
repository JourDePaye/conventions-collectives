# Personnels des sociétés anonymes et fondations d'HLM — IDCC 2150

La version `2026.1` modélise l'avenant n° **15 du 7 janvier 2026** relatif au barème de rémunérations minimales, applicable au **1er janvier 2026** et étendu par arrêté du **2 avril 2026**, publié au Journal officiel du 17 avril 2026.

La valeur Publicodes est `personnels hlm` et les règles sont sous `salarié . convention collective . personnels hlm`.

## Règles implémentées

- `coefficient` reçoit le coefficient de classification (G1, EE, OE, EQ, OQ1, G2, GQ, AQ, OQ2, G3, GHQ, OHQ, G4, GS, CE, G5, G6, G7, G8 ou G9) ;
- `salaire minimum annuel conventionnel` expose les minima annuels bruts 2026 de l'avenant n° 15, proratisés selon la quotité de travail ;
- `prime de vacances annuelle` expose le montant brut de 900 € prévu par l'avenant, proratisé selon la quotité ;
- `coefficient hors grille` signale les coefficients non publiés et laisse les endpoints à zéro.

Les minima sont annuels et bruts : ils ne sont pas convertis en minimum mensuel, conformément au texte. La comparaison au salaire réel doit tenir compte des éléments inclus par les annexes de la convention ; cette assiette de comparaison n'est pas inventée dans ce modèle.

## Audit explicite des rubriques de paie

Les textes dédiés de la branche ont été recherchés en plus de l'avenant salarial : textes de prévoyance et de frais de santé, dispositions de formation professionnelle, accords relatifs aux avantages et primes, ainsi que les arrêtés d'extension disponibles. L'audit couvre explicitement :

- **Cotisations salarié/employeur, taux et assiettes** : l'avenant n° 15 modifie le barème annuel et la prime de vacances, pas les taux ou assiettes de cotisations. Aucun taux conventionnel générique n'est ajouté.
- **Plafonds, tranches et forfaits** : aucun changement calculable de plafond, tranche, forfait ou assiette conventionnelle n'est fixé par l'avenant n° 15 ; omission documentée.
- **Santé** : les garanties et cotisations de complémentaire santé relèvent de textes de protection sociale distincts et de paramètres d'adhésion ; aucun taux salarié/employeur calculable et sûr n'est rattaché au barème salarial ici.
- **Prévoyance** : les régimes et leurs cotisations sont organisés par des textes autonomes ; aucun changement de taux ou d'assiette directement introduit par l'avenant n° 15 n'est calculé.
- **Formation professionnelle** : les contributions légales et conventionnelles dépendent notamment de l'effectif et des dispositifs ; aucun taux additionnel calculable n'est fixé par l'avenant n° 15.
- **AT/MP** : aucun taux conventionnel n'est fixé par l'avenant salarial ; la tarification dépend de l'activité et du régime réglementaire. Non calculé.
- **Primes et avantages** : la prime de vacances est modélisée séparément à 900 € bruts annuels ; le treizième mois, les avantages en nature, les primes fixes et la prime d'ancienneté ne sont pas calculés faute d'entrées et de conditions d'attribution suffisamment sûres. Le texte précise que certains éléments entrent dans la comparaison annuelle, sans justifier leur calcul automatique.
- **Bases de comparaison** : le minimum reste en `€/an`, pour un temps plein, et est proratisé uniquement par la quotité de travail ; aucune mensualisation ou base de cotisation implicite n'est ajoutée.

## Sources officielles

- Avenant n° 15 du 7 janvier 2026 relatif au barème de rémunérations minimales, IDCC 2150, NOR `ASET2650148M`, texte publié via la convention officielle Légifrance `KALICONT000005635331`.
- Arrêté du 2 avril 2026 portant extension de l'avenant n° 15, `JORFTEXT000053907654`, publié au Journal officiel du 17 avril 2026.
- Fédération des entreprises sociales pour l'habitat, page officielle « Convention collective et avenants », entrée du 7 janvier 2026 relative à l'avenant n° 15.

## Limites

Les dispositions autonomes de santé, prévoyance, formation, AT/MP, treizième mois, avantages en nature et prime d'ancienneté nécessitent leurs propres entrées, dates d'effet et périmètres. Elles sont auditées et explicitement omises plutôt que calculées avec des taux ou bases par défaut.
