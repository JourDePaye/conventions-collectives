# Personnel au sol des entreprises de transport aérien — IDCC 1391

La version `2026.1` modélise les minima mensuels publiés dans les textes officiels de la convention collective du personnel au sol des entreprises de transport aérien (IDCC 1391), applicables au 1er janvier 2026. Le modèle couvre les cinq catégories salariales A à E dont les montants officiels consultés sont respectivement de 2 384 €, 2 450 €, 2 602 €, 2 937 € et 3 649 € par mois à temps plein.

La valeur Publicodes est `manutention nettoyage aéroports` et les règles sont sous `salarié . convention collective . manutention nettoyage aéroports`.

## Règles implémentées

- `catégorie` reçoit `A`, `B`, `C`, `D` ou `E`.
- `salaire minimum conventionnel` expose le minimum mensuel brut à temps plein et le prorata de la quotité.
- `catégorie hors grille` signale une catégorie absente ; le minimum devient alors inapplicable.

## Audit explicite des rubriques de paie

L'audit a porté sur le texte consolidé de la convention, les textes salariaux dédiés et les textes d'extension accessibles dans KALI/JORF :

- **Cotisations salarié/employeur, assiettes, plafonds et tranches :** les textes salariaux consultés ne modifient aucun taux, assiette, plafond ou tranche de cotisation. Les cotisations légales de `modele-social` restent applicables ; aucun taux conventionnel générique n'est ajouté.
- **Forfaits et assiettes forfaitaires :** aucun forfait chiffré de cotisation ou d'assiette n'est suffisamment déterminé dans les sources retenues ; omission volontaire, sans valeur nulle implicite.
- **Santé :** les régimes collectifs et leurs paramètres dépendent du contrat de branche, du statut et des options ; aucun taux calculable et suffisamment borné n'est ajouté à cette version.
- **Prévoyance :** les garanties et taux varient selon la catégorie et les textes dédiés ; faute de périmètre de garanties et de période entièrement déterminé dans la source salariale, aucune cotisation automatique n'est calculée.
- **Formation professionnelle :** aucun taux conventionnel additionnel calculable n'est retenu ; la contribution légale reste celle de `modele-social`.
- **AT/MP :** aucun taux de branche n'est déductible ; le taux dépend de l'établissement et reste hors modèle.
- **Primes, majorations et indemnités :** ancienneté, travail de nuit, dimanche/jours fériés, repas, transport, escale, astreinte et autres sujétions sont conditionnels. Ils ne sont pas calculés sans les paramètres de poste, d'aéroport, d'horaires et de statut nécessaires.
- **Avantages en nature et rémunération variable :** non incorporés au minimum conventionnel ; aucun forfait n'est inventé.

Le modèle est donc limité aux minima mensuels et n'altère aucun endpoint de cotisation partagé avec les autres conventions. Les progressions d'ancienneté et les catégories ou emplois non identifiés par A à E restent à fournir par l'application consommatrice.

## Sources officielles

- [Convention collective nationale du personnel au sol des entreprises de transport aérien — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635473)
- [Texte officiel relatif aux salaires minima — Légifrance](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000019151798)
- [Tableau salarial officiel — Légifrance](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000019151799)

## Tests

`test/manutention-nettoyage-aeroports.test.ts` vérifie l'export de la version, les cinq catégories, la proratisation, la catégorie hors grille et l'isolation de l'espace de noms.
