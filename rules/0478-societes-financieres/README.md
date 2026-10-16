# Convention collective nationale des sociétés financières — IDCC 478

La version `2026.1` modélise l'accord du 7 mai 2026 relatif aux rémunérations minimales garanties (annexe IV du livre I), applicable au 1er juin 2026. Le texte est « en vigueur non étendu » : la grille est donc modélisée pour les employeurs signataires ou adhérents (ASF), sans extension supposée.

## Grille

L'article 1er fixe 20 montants annuels pour les coefficients 230, 235, 240, 245, 250, 265, 280, 295, 310, 325, 340, 350, 360, 400, 450, 550, 625, 700, 850 et 900, de 22 381 € (coefficient 230) à 65 965 € (coefficient 900). Ils résultent de « coefficient × valeur du point + somme fixe » : 65,147 € et 7 396,90 € pour les coefficients 230 à 245, 65,083 € et 7 389,52 € pour les coefficients 250 à 900. Le modèle reprend les montants du tableau publié, pas un recalcul. Il n'y a pas de colonne d'ancienneté : l'ancienneté donne lieu à la prime de l'article 16, non modélisée.

## Règles implémentées

- `coefficient` accepte les 20 coefficients ci-dessus ; `coefficient hors grille` est vrai pour tout autre coefficient (y compris 0, valeur par défaut).
- `salaire minimum annuel conventionnel` (€/an) donne le minimum annuel à temps plein.
- `salaire minimum conventionnel` (€/mois) applique l'article 15 : minimum annualisé divisé par le nombre de mensualités de l'entreprise (`nombre de mensualités`), proratisé selon la quotité de travail, arrondi au centime.
- `nombre de mensualités` vaut 12 par défaut. Cette valeur est un repli du modèle, non fixée par la convention : l'application doit fournir le nombre réel (13 par exemple).
- `adhérent d'une organisation signataire` (oui ou non, non par défaut) limite l'accord aux employeurs adhérents d'une organisation signataire.

## Audit paie et limites

L'article 15 prévoit un prorata de la durée de travail effectif et des périodes assimilées (article 28, livre I) ; le modèle n'applique que la quotité contractuelle. Il prévoit aussi que les sommes versées en cours d'année, hors prime d'ancienneté, primes exceptionnelles et remboursements de frais, comptent pour la vérification : cette comparaison n'est pas calculée. La prime d'ancienneté (article 16) et les autres dispositifs ne sont pas modélisés. Aucune assiette ni aucun taux générique n'est ajouté. Le montant du coefficient 230 (22 381 €) est repris tel que publié, alors que le calcul brut de la formule donne 22 381,71 € : les autres montants sont arrondis à l'euro supérieur.

## Sources officielles

- [Accord du 7 mai 2026 relatif aux rémunérations minimales garanties](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054825266?idConteneur=KALICONT000005635810)
- [Article 15 du livre I, rémunérations minimales garanties](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000031531211)
- [Convention collective nationale des sociétés financières du 22 novembre 1968](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635810)
