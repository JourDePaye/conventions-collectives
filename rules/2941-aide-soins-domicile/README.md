# Modèle aide et soins à domicile — IDCC 2941

Source Publicodes : [version 2026.1](2941-aide-soins-domicile.2026.1.publicodes).

Le modèle `2941-aide-soins-domicile`, valeur Publicodes `aide et soins à domicile`, reprend les coefficients de l’[avenant 75/2026](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054880770/), avec effet au 1er juin 2026 après l’agrément publié le 29 mai. Pour les employeurs non adhérents, cette date est prévue sous réserve de l’extension, publiée le 23 juillet 2026. Cette version ne fournit pas les grilles antérieures à juin 2026.

Les deux filières, `intervention` et `support`, comprennent chacune les catégories `employé`, `TAM` et `cadre`, deux degrés et trois échelons. Renseignez `niveau` au format `employé.2.1`, `TAM.1.1` ou `cadre.2.3`. La filière vaut `intervention` par défaut. La classification et les passages d’échelon doivent être déterminés par l’application selon les missions, les diplômes et les critères conventionnels ; ils ne sont pas déduits automatiquement de l’ancienneté. L’aide-soignant relève de TAM degré 1 depuis l’[avenant 70/2025](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054040668/). Un niveau inconnu donne un minimum nul et active `niveau hors grille` : l’application doit traiter cette anomalie.

La règle `salaire minimum conventionnel` additionne la base, l’ECR diplôme, l’ECR ancienneté et les autres ECR pérennes attribués. La base à temps plein est le coefficient multiplié par 5,77 €, augmenté d’une éventuelle `indemnité différentielle de reclassement` individuelle, avec un plancher égal au `SMIC` de `modele-social`. La date du calcul doit donc être fournie au moteur. Les montants suivent la `salarié . contrat . temps de travail . quotité`, sans double proratisation.

Paramètres complémentaires sous `salarié . convention collective . aide et soins à domicile` :

- `niveau de diplôme` : 0 sans diplôme éligible, sinon niveau 3 à 8 d’un diplôme reconnu en lien avec les missions. Un seul niveau est retenu, sans cumul automatique de diplômes.
- `ancienneté dans la branche` : années avec une fraction pour les jours depuis l’anniversaire, en tenant compte de l’ancienneté reprise. Un palier s’ouvre le lendemain de l’anniversaire de 5, 10, 15, 20, 25 ou 30 ans. Son assiette comprend le différentiel SMIC, et exclut les autres ECR.
- `autres ECR pérennes en points` : les ECR spécifiques aux cadres doivent être déterminés par l’application à partir de l’article III.19.3, puis fournis ici. Le modèle ne décide pas de leur attribution.
- `personnes tutorées` et `apprentis accompagnés` : effectifs accompagnés pendant le mois au titre des missions conventionnelles. Les forfaits correspondants restent entiers à temps partiel.
- `heures astreinte ordinaire`, `heures astreinte majorée`, `heures astreinte fractionnée ordinaire`, `heures astreinte fractionnée majorée` : quatre compteurs disjoints en `heure/mois`. Les périodes majorées concernent les dimanches, jours fériés ou nuits ; les temps d’intervention sont exclus. Les indemnités sont calculées sur les heures réellement déclarées, sans prorata supplémentaire du contrat.

Les ECR de tutorat, apprentissage et astreinte sont exposés séparément, avec leur somme dans `compléments ponctuels calculés`. L’application doit les ajouter à la rémunération pour les mois concernés ; ils ne sont pas incorporés au minimum récurrent pour éviter un ajout en double. Les majorations de travail de nuit, dimanche et jours fériés, les repos compensateurs, les heures supplémentaires, les frais de déplacement, les absences et les autres dispositions de la convention restent à modéliser. Les évolutions non étendues de l’avenant 74/2026 sont exclues de ce modèle général.
