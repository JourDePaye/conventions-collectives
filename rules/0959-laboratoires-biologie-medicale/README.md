# Laboratoires de biologie médicale extra-hospitaliers — IDCC 959

La version `2024.1` modélise l'accord salarial du **11 janvier 2024**, applicable impérativement au **1er janvier 2024** à l'ensemble des employeurs de la branche et étendu par arrêté du **3 avril 2024**, publié au Journal officiel du **18 avril 2024**.

La version `2026.1` reprend l'accord du **10 juin 2026** relatif aux salaires minima, applicable impérativement au **1er juin 2026** et étendu par arrêté du 7 septembre 2026 publié au Journal officiel du 19 septembre 2026 (Légifrance `KALITEXT000054951894`). Les 22 coefficients sont inchangés ; seuls les montants mensuels changent. Les accords salariaux intermédiaires de 2025 ne sont pas modélisés.

## Salaire minimum conventionnel

Le barème fixe des minima horaires et mensuels pour 151,67 heures. Les coefficients couverts par le modèle sont :

- entretien : 135 à 200 ;
- secrétariat : 210 à 270 ;
- informatique : 210 à 290 ;
- qualiticien : 240 à 290 ;
- infirmier : 250 à 270 ;
- technique : 240 à 350 ;
- cadres : 400, 500, 600 et 800.

Les valeurs mensuelles communes à un même coefficient sont regroupées en une grille unique. Le minimum est proratisé une seule fois par `salarié . contrat . temps de travail . quotité`. Une classification absente renvoie zéro et active `coefficient hors grille`.

L'accord indique qu'au salaire réel s'ajoute une prime d'ancienneté calculée sur le salaire minimum de l'emploi occupé proportionnellement aux heures effectives. La prime n'est pas calculée ici : ses paramètres d'ancienneté et d'heures effectives doivent être fournis séparément.

## Audit explicite des rubriques de paie

L'accord et son arrêté d'extension ont été examinés avec les textes rattachés de la branche. L'accord salarial porte sur les minima et rappelle la prime d'ancienneté ; il ne constitue pas un texte de modification générale des cotisations.

- **Cotisations salarié/employeur, taux et assiettes** : aucun taux ni aucune assiette de cotisation n'est modifié par l'accord salarial ; aucun taux générique n'est inventé.
- **Plafonds, tranches et forfaits** : aucun plafond, aucune tranche et aucun forfait conventionnel calculable n'est fixé par ce texte ; omission documentée.
- **Santé** : les garanties et cotisations relèvent de textes autonomes et d'un régime d'adhésion ; aucun taux salarié/employeur sûr n'est rattaché au barème salarial.
- **Prévoyance** : les textes de prévoyance sont autonomes ; aucune variation de taux ou d'assiette n'est introduite par l'accord salarial.
- **Formation professionnelle** : les contributions légales et éventuelles contributions conventionnelles dépendent de l'effectif et du dispositif ; aucun taux additionnel calculable n'est fixé.
- **AT/MP** : aucun taux conventionnel n'est fixé ; la tarification dépend de l'activité et du régime réglementaire. Non calculé.
- **Primes et majorations** : prime d'ancienneté exposée mais non automatisée ; aucune autre prime, majoration, astreinte ou sujétion n'est calculée.
- **Avantages et frais** : avantages en nature, repas, déplacements et remboursements de frais ne sont pas déduits automatiquement.
- **Bases et unités** : le minimum est mensuel pour 151,67 heures et proratisé par la quotité ; aucune base de cotisation implicite n'est ajoutée.

## Sources officielles

- [Accord du 11 janvier 2024 relatif aux salaires minima — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000049300356)
- [Convention collective nationale du 3 février 1978 — IDCC 959 — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635844)

## Limites

Le modèle couvre le barème salarial étendu de 2024. Les régimes autonomes de santé, prévoyance et formation, ainsi que les rubriques nécessitant des entrées supplémentaires, sont explicitement audités et laissés à l'application appelante.
