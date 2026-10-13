# Conventions collectives françaises en publicodes

L’objectif de ce projet est de mettre à disposition **l’ensemble des conventions collectives françaises en langage [publicodes](https://publi.codes)**, sous une forme lisible, versionnée et réutilisable dans des outils de calcul.

Le dépôt contient les modèles de conventions collectives, leurs références juridiques, leur compilateur et leurs tests. Il produit le package [`conventions-collectives`](https://www.npmjs.com/package/conventions-collectives), utilisé notamment par JourDePaye pour compléter les règles de [`modele-social`](https://www.npmjs.com/package/modele-social).

**Cent vingt conventions** sont actuellement représentées, avec **cent soixante-seize versions de modèles**. Leur couverture porte sur les salaires minima, la classification nécessaire à leur calcul et certains compléments de rémunération ; la présence d’une convention ne signifie pas que toutes ses dispositions sont déjà modélisées. Elles sont regroupées par thème, puis classées par numéro IDCC.

**Les contributions sont les bienvenues !** Vous pouvez proposer une nouvelle convention, enrichir une convention existante, ajouter des tests, améliorer les références aux textes ou la documentation.

## Conventions déjà présentes

Cent vingt conventions sont actuellement représentées, avec cent soixante-seize versions de modèles. Leur couverture porte sur les salaires minima, la classification nécessaire à leur calcul et certains compléments de rémunération ; la présence d’une convention ne signifie pas que toutes ses dispositions sont déjà modélisées. Elles sont regroupées par thème, puis classées par numéro IDCC.

### SERVICES, INGÉNIERIE & NUMÉRIQUE

| Convention | IDCC | Versions et dates d’effet | Règles présentes |
|---|---|---|---|
| [Salariés permanents des entreprises de travail temporaire](rules/1413-travail-temporaire/README.md) | 1413 | `2026.1` : 1er février 2026 | Minima mensuels des niveaux A à M, minimum majoré du niveau F en forfait jours, proratisation selon la quotité de travail ; détection des niveaux hors grille |
| [Distribution, logistique et services de proximité](rules/1408-distribution-logistique-energies/README.md) | 1408 | `2025.1` : 1er mai 2025 (avenant étendu) | Grille mensuelle de 16 coefficients, proratisée selon la quotité de travail ; prime d’ancienneté de 3 % à 15 % ; détection des coefficients hors grille |
| [Services de l’automobile (commerce, réparation, contrôle technique, écoles de conduite)](rules/1090-services-automobile/README.md) | 1090 | `2026.1` : 1er mai 2026 | Grille de 34 positions pour les ouvriers et employés (échelons 1 à 12), la maîtrise (échelons 17 à 25) et les cadres (niveaux I à V), proratisée selon la quotité de travail ; détection des échelons et niveaux hors grille |
| [Entreprises de prévention et de sécurité](rules/1351-prevention-securite/README.md) | 1351 | `2026.1` : 1er juillet 2026 | Grille de 25 positions pour trois catégories, prime d’ancienneté, majorations nuit et dimanche, paniers, indemnités et minimum de six heures par période |
| [Bureaux d’études techniques, cabinets d’ingénieurs-conseils et sociétés de conseils (Syntec)](rules/1486-syntec/README.md) | 1486 | `2025.1` : 1er janvier 2025 ; `2026.1` : 1er janvier 2026 ; `2026.2` : même date (correction) | Minima mensuels des ETAM et des ingénieurs et cadres selon leur coefficient ; contribution conventionnelle de formation professionnelle de 0,05 % ou 0,10 % selon l’effectif, ajoutée à la contribution légale ; détection des coefficients hors grille |
| [Organismes de formation](rules/1516-organismes-formation/README.md) | 1516 | `2025.1` : 1er janvier 2025 ; `2027.1` : 1er janvier 2027 | Grille de 31 paliers par fourchette de coefficient, minima annuels bruts convertis en minima mensuels et proratisés selon la quotité de travail ; détection des coefficients hors grille |
| [Organismes de tourisme](rules/1909-organismes-tourisme/README.md) | 1909 | `2026.1` : 1er janvier 2026 ; `2026.2` : 1er janvier 2026 | Grille mensuelle des niveaux 1.1/1.2 à 3.3, avec augmentation de la valeur du point au 1er juillet 2026 ; proratisation selon la quotité de travail ; frais de santé à 1,40 % du PMSS ; prévoyance conventionnelle employeur selon le statut cadre ; détection des niveaux hors grille |
| [Tourisme social et familial](rules/1316-tourisme-social-familial/README.md) | 1316 | `2026.1` : 1er janvier 2026 | Grille mensuelle des niveaux A à G, avec paliers au 1er février et au 1er mai 2026 ; proratisation selon la quotité de travail ; détection des niveaux hors grille |
| [Entreprises du bureau et du numérique (commerce de détail de papeterie, fournitures de bureau, bureautique, informatique et librairie)](rules/1539-bureau-numerique/README.md) | 1539 | `2025.1` : 1er septembre 2025 | Grille mensuelle de 12 niveaux (A1 à C4), minimum du niveau A2 pour le niveau A1 après un an d’ancienneté, proratisée selon la quotité de travail ; détection des niveaux hors grille |
| [ÉCLAT (animation, éducation populaire, sport)](rules/1518-eclat/README.md) | 1518 | `2026.1` : 1er janvier 2026 ; `2026.2` : 1er janvier 2026 | Grille mensuelle des groupes A à J, points de coordination du groupe C et ancienneté ; formation professionnelle à 2,10 % et formation des dirigeants bénévoles à 0,05 % de l’assiette |
| [Entreprises de logistique de communication écrite directe](rules/1611-logistique-communication-ecrite-directe/README.md) | 1611 | `2026.1` : 1er mai 2026 (accord étendu) | Grille mensuelle de 17 groupes I-A à III-G pour 151,67 heures, proratisée selon la quotité de travail ; le groupe III-H renvoie au SMIC et n’est pas modélisé |
| [Télécommunications](rules/2148-telecommunications/README.md) | 2148 | `2026.1` : 23 janvier 2026 (signataires) ; 18 avril 2026 (champ étendu) | 24 minima annuels des groupes A à G ; comparaison annuelle validée, contrôle intermédiaire si variable, contrôle SMIC mensuel distinct ; majorations et repos de nuit conditionnels |
| [Activités du déchet](rules/2149-activites-dechet/README.md) | 2149 | `2026.2` : 1er janvier 2026 | Minima mensuels des coefficients 100 à 132 et minima annuels des coefficients 150 à 170, fondés sur la dernière valeur du point officiellement publiée (18,67 €) ; proratisation selon la quotité de travail |
| [Coiffure et professions connexes](rules/2596-coiffure/README.md) | 2596 | `2026.1` : 1er mars 2026 ; `2026.2` : 1er mars 2026 | Grilles de 30 classifications des filières technique, esthétique-cosmétique, non technique et administrative, prime d’ancienneté de 36 € à 117 €, proratisation selon la quotité de travail ; détection des classifications hors grille |
| [Entreprises de propreté et services associés](rules/3043-entreprises-proprete/README.md) | 3043 | `2026.1` : 1er avril 2026 | Grille de 39 classifications, prime d'expérience, majorations de nuit, dimanche et jours fériés, repos compensateur de nuit et formule d'indemnité de transport ; proratisation selon la quotité de travail |
| [Entreprises de services à la personne](rules/3127-services-personne/README.md) | 3127 | `2024.1` : 20 juin 2024 | Grille de 10 emplois-repères, prime d'ancienneté, majorations de nuit, dimanche et jours fériés, garde de plus de trois enfants et indemnité kilométrique ; proratisation selon la quotité de travail |
| [Esthétique-cosmétique et enseignement associé](rules/3032-esthetique-cosmetique/README.md) | 3032 | `2026.1` : 1er juin 2026 (avenant étendu) | Grilles mensuelles des instituts/services généraux et de l’enseignement technique et professionnel, prime d’ancienneté de 44 € à 206 €, proratisation selon la quotité de travail ; détection des classifications hors grille |
| [Prestataires de services dans le domaine du secteur tertiaire](rules/2098-prestataires-tertiaire/README.md) | 2098 | `2026.2` : 1er août 2026 | Grille mensuelle 2026 de 23 coefficients de 120 à 550, proratisée selon la quotité de travail ; majoration de nuit occasionnelle, repos compensateur des travailleurs de nuit et détection des coefficients hors grille |
| [Notariat](rules/2205-notariat/README.md) | 2205 | `2026.1` : 1er mars 2026 (avenant salarial modélisé pour les employeurs signataires ou adhérents) | Grille mensuelle de 8 niveaux E à C4, valeur du point de 16,06 € et minima arrondis à l’euro supérieur ; proratisation selon la quotité de travail ; champ juridique et niveaux hors grille explicités |

### HÔTELLERIE, RESTAURATION & ALIMENTATION

| Convention | IDCC | Versions et dates d’effet | Règles présentes |
|---|---|---|---|
| [Industrie laitière](rules/0112-industrie-laitiere/README.md) | 0112 | `2026.1` : 1er février 2026 ; `2026.2` : 1er février 2026 (RAM au 1er janvier 2026) | Grilles mensuelle et annuelle de 28 positions, minima annuels distincts pour l'encadrement au forfait annuel, prorata mensuel conservé ; détection des classifications hors grille |
| [Boulangerie-pâtisserie (entreprises artisanales)](rules/0843-boulangerie-patisserie-artisanale/README.md) | 843 | `2026.1` : 1er février 2026 | Taux horaires minima de 10 coefficients selon trois zones (national, Île-de-France, Bouches-du-Rhône), appliqués aux heures du contrat, et minima annuels des cadres 1 et 2 convertis en minima mensuels ; détection des niveaux hors grille |
| [Restauration de collectivités](rules/1266-restauration-collective/README.md) | 1266 | `2025.1` : 1er juillet 2025 (effet général après extension) | Neuf niveaux horaires, mensuels et annuels distincts ; ancienneté employés, PAC/PSM conditionnelles, treizième mois, intermittence, coupures et détachement ; paritarisme annuel entreprise, SMIC et contrôles de champ/date |
| [Restauration rapide](rules/1501-restauration-rapide/README.md) | 1501 | `2025.1` : 1er juin 2025 | 11 taux horaires minima des niveaux I à IV, appliqués aux heures du contrat, et 3 minima annuels du niveau V (cadres) convertis en minima mensuels ; détection des niveaux et échelons hors grille |
| [Commerce de détail alimentaire non spécialisé](rules/1505-commerce-detail-alimentaire-non-specialise/README.md) | 1505 | `2026.5` : audit paie, grille au 1er août 2026 | Grille mensuelle de 11 niveaux, minima annuels des cadres au forfait jours, complémentaire santé à 1,51 % du PMSS répartie à parts égales, prévoyance non-cadres/cadres sur T1-T2 jusqu’à 4 PMSS, détection des niveaux hors grille |
| [Industrie et commerces en gros des viandes](rules/1534-industrie-commerces-gros-viandes/README.md) | 1534 | `2026.1` : 1er février 2026 | Grille mensuelle de 30 positions (10 niveaux de 3 échelons : ouvriers et employés, TAM, cadres), proratisée selon la quotité de travail ; détection des niveaux hors grille |
| [Métiers de la transformation des grains](rules/1930-transformation-grains/README.md) | 1930 | `2026.1` : 1er février 2026 | Rémunérations mensuelles minimum de 10 positions (niveaux I à V, VI.1, VI.2, VII à IX), proratisées selon la quotité de travail ; détection des classifications hors grille |
| [Industries de la transformation des volailles](rules/1938-industries-transformation-volailles/README.md) | 1938 | `2025.1` : 1er février 2025 (accord étendu) | Grille mensuelle de 32 coefficients de 120 à 700, proratisée selon la quotité de travail ; détection des coefficients hors grille |
| [Industries charcutières (salaison, charcuterie en gros, conserves de viandes)](rules/1586-industries-charcutieres/README.md) | 1586 | `2026.1` : 1er février 2026 | Grille mensuelle de 49 coefficients (de 125 à 700, ouvriers et employés, techniciens et agents de maîtrise, cadres), proratisée selon la quotité de travail ; détection des coefficients hors grille |
| [Fleuristes, vente et services des animaux familiers](rules/1978-fleuristes-animaux/README.md) | 1978 | `2026.1` : 1er août 2026 | Grille mensuelle de 21 positions (niveaux I à VII, échelons 1 à 3), proratisée selon la quotité de travail ; détection des niveaux hors grille |
| [Hôtels, cafés, restaurants (HCR)](rules/1979-hotels-cafes-restaurants/README.md) | 1979 | `2024.1` : 1er décembre 2024 | Minima horaires par niveau et échelon, conversion en minimum mensuel selon la durée du contrat ; détection des niveaux hors grille |
| [Commerce de détail et de gros à prédominance alimentaire](rules/2216-commerce-detail-gros-predominance-alimentaire/README.md) | 2216 | `2025.1` : 1er août 2025 ; `2026.1` et `2026.2` : 1er août 2026 | Salaire minimum mensuel garanti par niveau, pauses rémunérées comprises ; minima annuels sur 12 mois et forfait jours ; proratisation selon la quotité de travail |
| [Commerce de détail alimentaire spécialisé](rules/3237-commerce-detail-alimentaire-specialise/README.md) | 3237 | `2026.1` : 17 avril 2026 | Grille mensuelle de 11 niveaux (employés, agents de maîtrise et cadres), proratisée selon la quotité de travail ; détection des niveaux hors grille |
| [Cinq branches industries alimentaires diverses](rules/3109-industries-alimentaires-diverses/README.md) | 3109 | `2026.1` : 1er janvier 2026 (avenant étendu) | Grille mensuelle de 20 positions N1-E1 à N9-E1, proratisée selon la quotité de travail ; détection des positions hors grille |
| [Vins, cidres, jus de fruits, sirops, spiritueux et liqueurs de France](rules/0493-vins-cidres-spiritueux/README.md) | 493 | `2026.1` : 1er février 2026 (accord étendu) | Grille mensuelle de 21 positions 1A à 10A, proratisée selon la quotité de travail ; détection des positions hors grille |

### COMMERCE & DISTRIBUTION (NON ALIMENTAIRE)

| Convention | IDCC | Versions et dates d’effet | Règles présentes |
|---|---|---|---|
| [Commerces de gros](rules/0573-commerces-de-gros/README.md) | 573 | `2026.1` : 1er mars 2026 ; `2026.2` : 1er juillet 2026 | Grille de 28 positions (niveaux I à VI en minima mensuels, niveaux VII à X en minima annuels convertis en minima mensuels), proratisée selon la quotité de travail ; prévoyance non-cadres 0,62 % jusqu'à 4 plafonds (60/40 employeur-salarié) et cadres 1,50 % tranche A ; détection des niveaux hors grille |
| [Maisons à succursales de vente au détail d’habillement](rules/0675-succursales-habillement/README.md) | 675 | `2026.1` : 1er mai 2026 ; `2026.2` : 1er mai 2026 | Grille mensuelle de 9 catégories, prime d’ancienneté de 3 % à 15 %, minimum annuel majoré de 15 % pour les cadres au forfait jours, quotité et détection des catégories hors grille |
| [Commerces de gros de l'habillement, de la mercerie, de la chaussure et du jouet](rules/0500-commerces-gros-habillement/README.md) | 500 | `2024.1` : 1er décembre 2024 (avenant étendu) ; `2024.2` : même date (codes de classification sans espace) ; `2026.1` : 20 septembre 2026 (annexe étendue) | 19 minima mensuels des employés, agents de maîtrise et cadres, proratisés selon la quotité de travail ; détection des classifications hors grille |
| [Détaillants en chaussures](rules/0733-detaillants-chaussures/README.md) | 733 | `2026.1` : 1er juillet 2026 (avenant étendu) | Grille mensuelle de 9 catégories (employés, agents de maîtrise et cadres), proratisée selon la quotité de travail ; détection des catégories hors grille |
| [Entreprises de pompes funèbres](rules/0759-pompes-funebres/README.md) | 759 | `2020.4` : 1er janvier 2020 (accord étendu) | Grille mensuelle de 13 niveaux et positions avec paliers d’ancienneté à 3, 5, 10, 15, 20 et 25 ans, proratisée selon la quotité de travail ; audit des éléments de rémunération inclus ou exclus de la comparaison |
| [Jardineries et graineteries](rules/1760-jardineries-graineteries/README.md) | 1760 | `2026.1` : 1er juillet 2026 (accord étendu) | Grille mensuelle de 18 combinaisons de niveaux 1 à 8 et d'échelons, proratisée selon la quotité de travail ; détection des classifications hors grille |
| [Commerce de détail de l’habillement et des articles textiles](rules/1483-commerce-detail-habillement-textiles/README.md) | 1483 | `2026.2` : 1er octobre 2026 (accord étendu, barème Mayotte) | Barème national de 13 catégories, primes d’ancienneté des employés et des agents de maîtrise A1 et A2, minima des agents de maîtrise B et des cadres selon l’ancienneté ; barème spécifique Mayotte à compter du 1er octobre 2026 ; proratisation selon la quotité de travail ; détection des catégories hors grille |
| [Industries de l’habillement](rules/0247-industries-habillement/README.md) | 247 | `2026.2` : 1er mars 2026 | Annexes ouvriers, employés et ETAM avec paliers d’ancienneté ; minima annuels 2026 des cadres ; proratisation des minima mensuels et détection des niveaux hors grille |
| [Commerce de détail de l’horlogerie-bijouterie](rules/1487-commerce-detail-horlogerie-bijouterie/README.md) | 1487 | `2026.1` : 1er janvier 2026 | Grille mensuelle de 10 niveaux A à J, proratisée selon la quotité de travail ; détection des niveaux hors grille |
| [Commerce de détail non alimentaire](rules/1517-commerce-detail-non-alimentaire/README.md) | 1517 | `2026.1` : 1er juin 2026 | Grille mensuelle de 9 niveaux, proratisée selon la quotité de travail ; détection des niveaux hors grille |
| [Commerces de détail de papeterie, fournitures de bureau, bureautique, informatique et librairie](rules/1513-papeterie-librairie/README.md) | 1513 | `2026.1` : 1er août 2026 | Grille mensuelle de 10 coefficients, proratisée selon la quotité de travail ; détection des coefficients hors grille |
| [Distributeurs conseils hors domicile](rules/1536-distributeurs-conseils-hors-domicile/README.md) | 1536 | `2026.1` : 1er mars 2026 | Grille mensuelle de 24 positions (niveaux I à VI, échelons 1 à 4), proratisée selon la quotité de travail ; détection des classifications hors grille |
| [Sucreries, sucreries-distilleries et raffineries de sucre](rules/2728-sucreries/README.md) | 2728 | `2026.1` : 1er avril 2026 (accord étendu le 27 juin 2026) ; `2026.2` : mêmes minima + rémunérations spécifiques et primes | Grille de 17 salaires minima annuels des classes/groupes 1A à 7B, 8, 9 et 10, minima annuels spécifiques, prime de panier et prime de vacances |
| [Commerces et services de l’audiovisuel, de l’électronique et de l’équipement ménager](rules/1686-commerces-services-audiovisuel/README.md) | 1686 | `2026.1` : 1er mai 2026 ; `2026.2` : 1er mai 2026 | Grille de 16 positions (minima mensuels des niveaux I à IV en 3 échelons, rémunérations annuelles des 4 positions de cadres converties en minima mensuels), prévoyance globale 1,30 % du salaire brut, proratisation selon la quotité de travail ; détection des classifications hors grille |
| [Grands magasins et magasins populaires](rules/2156-grands-magasins/README.md) | 2156 | `2026.1` : 1er juin 2024 | Grille mensuelle de 12 positions (employés en 8 échelons, agent de maîtrise, cadres) et rémunérations minimales annuelles, toutes deux proratisées selon la quotité de travail ; détection des niveaux hors grille |
| [Commerce de l'ameublement](rules/1880-commerce-ameublement/README.md) | 1880 | `2026.1` : 1er juin 2026 (champ général) | Grille mensuelle des niveaux employés 1 à 5, proratisée selon la quotité de travail ; catégories agents de maîtrise et cadres explicitement hors périmètre |
| [Coopération maritime](rules/2494-cooperation-maritime/README.md) | 2494 | `2026.1` : 1er juillet 2026 (accord du 31 mars 2026 étendu) | Grille annuelle des niveaux 1 à 9 et échelons A/B des cadres, proratisée selon la quotité de travail ; comparaison conservée en €/an et classifications hors grille détectées |

### INDUSTRIE, MÉTALLURGIE & CHIMIE

| Convention | IDCC | Versions et dates d’effet | Règles présentes |
|---|---|---|---|
| [Industries textiles](rules/0018-industries-textiles/README.md) | 18 | `2026.1` : 1er juin 2026 | Grille mensuelle de 21 positions (niveaux 1 à 6 en échelons et positions I à IV), proratisée selon la quotité de travail ; détection des niveaux hors grille |
| [Industries chimiques](rules/0044-industries-chimiques/README.md) | 44 | `2026.2` : 1er septembre 2025 (santé) ; 1er janvier 2026 (salaires) | Barème de 23 coefficients (de 130 à 880), proratisé selon la quotité de travail ; minimum santé de branche à 1,50 % du PMSS (0,82 % en Alsace-Moselle) |
| [Industrie pharmaceutique](rules/0176-industrie-pharmaceutique/README.md) | 176 | `2026.1` : 1er janvier 2026 (accord étendu) | Grille mensuelle de 20 groupes et niveaux, pour 151,67 heures, proratisée selon la quotité de travail ; détection des groupes hors grille |
| [Plasturgie](rules/0292-plasturgie/README.md) | 292 | `2026.1` : 1er mars 2026 | Grille mensuelle de 15 coefficients (de 700 à 940), proratisée selon la quotité de travail ; détection des coefficients hors grille |
| [Produits pharmaceutiques](rules/1555-produits-pharmaceutiques/README.md) | 1555 | `2026.1` : 1er mars 2026 (signataires) ; 8 mai 2026 (champ étendu) | 13 rémunérations minimales mensuelles garanties des niveaux I.1 à II.7, 10 rémunérations annuelles garanties des niveaux III.1 à III.10, bornes de date et de champ juridique, proratisation mensuelle sans conversion annuelle |
| [Industrie du pétrole](rules/1388-industrie-petrole/README.md) | 1388 | `2026.1` / `2026.2` : 1er janvier 2026 | Minimum hiérarchique calculé par formule (valeur du point, majoration conventionnelle et surmajoration) pour les coefficients de 130 à 880, proratisé selon la quotité ; `2026.2` ajoute la RMAG de 23 550 €/an après six mois de présence continue ; détection des coefficients hors plage |
| [Fabrication de l’ameublement](rules/1411-fabrication-ameublement/README.md) | 1411 | `2026.1` : 1er juillet 2026 ; `2026.2` : 11 juillet 2026 | Grille mensuelle de 36 échelons (agents de production, fonctionnels, d’encadrement et cadres), proratisée selon la quotité de travail ; `2026.2` ajoute 0,50 % de formation professionnelle à partir de 10 salariés ; détection des échelons hors grille |
| [Maintenance, distribution et location de matériels](rules/1404-maintenance-distribution-location/README.md) | 1404 | `2026.1` : 1er mars 2026 (avenant étendu le 29 mai 2026) | Grille mensuelle de 22 niveaux A10 à C60, proratisée selon la quotité de travail ; détection des niveaux hors grille |
| [Industries de produits alimentaires élaborés](rules/1396-industries-produits-alimentaires-elabores/README.md) | 1396 | `2026.1` : 1er février 2026 (accord étendu) | 24 minima mensuels des coefficients 120 à 345 et 37 minima annuels des coefficients cadres 350 à 700, conversion annuelle en minimum mensuel et proratisation selon la quotité de travail ; détection des coefficients hors grille |
| [Expédition et exportation de fruits et légumes](rules/1405-expedition-exportation-fruits-legumes/README.md) | 1405 | `2026.1` : 1er avril 2026 (avenant étendu le 19 mai 2026) | Grille mensuelle des niveaux I à IX pour le secteur fruits et légumes, proratisée selon la quotité de travail ; le secteur des produits prêts à l'emploi n'est pas modélisé |
| [Métallurgie](rules/3248-metallurgie/README.md) | 3248 | `2026.1` : 1er janvier 2026 ; `2026.2` : 1er janvier 2026 | Barème national annuel des 18 classes d’emplois (A1 à I18), converti en minimum mensuel et proratisé selon la quotité de travail ; majorations explicites de 15 %/30 % pour forfait annuel en heures/jours ; détection des classes hors barème |
| [Production et transformation des papiers et cartons](rules/3238-production-transformation-papiers-cartons/README.md) | 3238 | `2026.2` : 1er janvier 2026 | Grille mensuelle OETAM de 15 coefficients et garantie annuelle de 22 779 €, proratisées selon la quotité de travail ; détection des coefficients hors grille |
| [Industrie de la chaussure](rules/1580-industrie-chaussure/README.md) | 1580 | `2026.1` : 1er janvier 2026 (accord étendu) | Grilles mensuelles des niveaux 1 à 3 et annuelles des niveaux 4 à 6 et positions cadres P1 à P4, converties en minimum mensuel et proratisées selon la quotité de travail ; détection des classifications hors grille |
| [Professions regroupées du cristal, du verre et du vitrail](rules/1821-cristal-verre-vitrail/README.md) | 1821 | `2026.2` : 1er janvier 2026 (accord étendu) | Grille mensuelle de 26 coefficients, proratisée selon la quotité de travail ; industrie du vitrail de l’annexe B exclue |

### BÂTIMENT & TRAVAUX PUBLICS

| Convention | IDCC | Versions et dates d’effet | Règles présentes |
|---|---|---|---|
| [Bâtiment — ouvriers des entreprises jusqu'à 10 salariés](rules/1596-batiment-ouvriers-petites-entreprises/README.md) | 1596 | `2026.1` : 1er mai 2026 | Grille mensuelle explicitement limitée au Centre-Val de Loire (7 coefficients), bornes de date et de catégorie ; congés payés CIBTP, chômage intempéries, OPPBTP et RNPC cadre isolés dans le namespace ; aucune extrapolation nationale |
| [Bâtiment — ouvriers des entreprises de plus de 10 salariés](rules/1597-batiment-ouvriers-plus-de-10/README.md) | 1597 | `2026.1` : 1er janvier 2026 ; `2026.3` : 1er avril 2026 | Grille mensuelle explicitement limitée à la Nouvelle-Aquitaine (7 coefficients), bornes de date et de catégorie ; CIBTP désormais conditionné à la caisse déclarée, chômage intempéries, OPPBTP et RNPC cadre isolés dans le namespace ; aucune extrapolation nationale |
| [Bâtiment — ETAM](rules/2609-batiment-etam/README.md) | 2609 | `2026.1` : 1er avril 2026 ; `2026.2` : 1er mai 2026 | Grilles mensuelles Corse et Occitanie (8 niveaux A à H), bornes de date, région et catégorie ; cotisations CIBTP, chômage intempéries plafonné au PMSS et OPPBTP isolés dans le namespace ; aucune correction RNPC cadre ni extrapolation nationale |
| [Bâtiment — cadres](rules/2420-batiment-cadres/README.md) | 2420 | `2026.1` : 1er février 2026, avenant non étendu | Grille mensuelle de 14 coefficients pour 39 heures, limitée aux employeurs signataires ou adhérents ; correction RNPC cadre BTP isolée (TA employeur 1,50 %, TB 2,40 % partagé) ; CIBTP, intempéries et OPPBTP non calculés |
| [Travaux publics — ouvriers](rules/1702-travaux-publics-ouvriers/README.md) | 1702 | `2026.3` : 1er janvier 2026, barèmes régionaux ouverts jusqu'au 4 septembre 2026 | Sept coefficients, dix barèmes annuels régionaux (63 cellules automatiques, 7 Pays de la Loire sous confirmation), sans conversion mensuelle ; dates/champ bloquants, prorata et comparaison annuelle validés, prime de vacances et congés d’ancienneté ; prévoyance employeur 1,72 % plafonnée à 3 PMSS ; caisses CIBTP/intempéries et OPPBTP hors couverture |
| [Travaux publics — ETAM](rules/2614-travaux-publics-etam/README.md) | 2614 | `2026.1` : 17 avril 2026 | Grille annuelle Île-de-France des niveaux A à H, minimums forfait-jours F à H, bornes de région/date/catégorie ; CIBTP, chômage intempéries et OPPBTP isolés dans le namespace ; aucune correction RNPC cadre ni extrapolation nationale |
| [Travaux publics — cadres](rules/3212-travaux-publics-cadres/README.md) | 3212 | `2024.1` : 1er janvier 2024 | Neuf minima annuels A1 à C2, grilles annuelles et forfait-jours distinctes ; correction RNPC cadre BTP isolée ; pas de conversion mensuelle ni de taux CIBTP/intempéries/OPPBTP inventés |
| [Économistes de la construction et métreurs-vérificateurs](rules/3213-economistes-construction/README.md) | 3213 | `2026.1` : 11 juillet 2026 (accord du 8 avril 2026 étendu) | Grille mensuelle des niveaux A1 à F (ETAM) et G à I (cadres), avec colonnes nationale hors Île-de-France et Île-de-France ; proratisation selon la quotité de travail ; audit des rubriques de paie sans correction conventionnelle |
| [Négoce des matériaux de construction](rules/3216-negoce-materiaux-construction/README.md) | 3216 | `2025.1` : 26 avril 2025 (avenant du 21 janvier 2025 étendu) | Grille mensuelle de 13 coefficients 165 à 350, proratisée selon la quotité de travail ; détection des coefficients hors grille ; prime d'ancienneté et autres rubriques non déduites automatiquement |

### TRANSPORT & LOGISTIQUE

| Convention | IDCC | Versions et dates d’effet | Règles présentes |
|---|---|---|---|
| [Personnel au sol des entreprises de transport aérien](rules/0275-transport-aerien-personnel-sol/README.md) | 275 | `2025.1` : 1er avril 2025 (employeurs signataires ou adhérents) | Grille mensuelle de 20 coefficients avec paliers au 1er septembre et au 1er novembre 2025, proratisation selon la quotité de travail ; indemnité de panier de 7,40 € exposée séparément ; coefficient hors grille et champ juridique explicites |
| [Transports routiers et activités auxiliaires du transport](rules/0016-transports-routiers/README.md) | 16 | `2026.1` : 1er juin 2026 | Grilles de 108 classifications des quatre sous-secteurs (marchandises, voyageurs, logistique, déménagement) avec paliers d’ancienneté, proratisées selon la quotité de travail ; détection des classifications hors grille |
| [Industrie de la fabrication des ciments](rules/3233-industrie-fabrication-ciments/README.md) | 3233 | `2026.1` : 9 juillet 2026 (champ étendu) | Grilles mensuelles des ouvriers et ETAM et des ingénieurs et cadres selon le coefficient ; proratisation selon la quotité de travail ; détection des coefficients hors grille |

### SANTÉ & ACTION SOCIALE

| Convention | IDCC | Versions et dates d’effet | Règles présentes |
|---|---|---|---|
| [Établissements privés à but non lucratif (CCN 51)](rules/0029-etablissements-prives-non-lucratifs/README.md) | 29 | `2026.1` : 1er janvier 2026 | Salaire de base (coefficient multiplié par la valeur du point de 4,568 €), proratisé selon la quotité de travail ; détection du coefficient absent |
| [Établissements et services pour personnes inadaptées et handicapées (CCN 66)](rules/0413-personnes-handicapees/README.md) | 413 | `2022.1` : 1er juillet 2022 ; `2026.1` : correction applicable au 1er juillet 2022 | Salaire indiciaire (coefficient multiplié par la valeur du point de 3,82 € ou de 3,93 € pour les adhérents à Nexem), plancher Nexem aux indices 403/413, indemnité de sujétion spéciale de 9,21 % pour les non-cadres, proratisation selon la quotité de travail ; détection du coefficient absent |
| [Cabinets médicaux](rules/1147-cabinets-medicaux/README.md) | 1147 | `2024.1` : 1er janvier 2024 | Grille mensuelle de 13 positions (de 4 à 16), proratisée selon la quotité de travail ; détection des positions hors grille |
| [Acteurs du lien social et familial (centres sociaux)](rules/1261-acteurs-lien-social-familial/README.md) | 1261 | `2026.1` : 1er janvier 2026 | Salaire socle annuel, points de pesée et points d'expérience professionnelle, convertis en minimum hiérarchique mensuel |
| [Cabinets dentaires](rules/1619-cabinets-dentaires/README.md) | 1619 | `2026.1` : 1er janvier 2026 | Taux horaires minima de 9 emplois (entretien, réception, secrétaire, aide et assistant dentaires, prothésistes de niveau 1 à 4) convertis en minima mensuels, proratisés selon la quotité de travail ; détection des emplois hors grille |
| [Prothésistes dentaires et personnels des laboratoires de prothèse dentaire](rules/0993-prothesistes-dentaires/README.md) | 993 | `2026.1` : 1er octobre 2026 (accord étendu) ; `2026.2` : même date (correction) | Grille mensuelle de 12 emplois et qualifications, proratisée selon la quotité de travail ; détection des qualifications hors grille ; audit explicite des rubriques de paie sans correction conventionnelle |
| [Pharmacie d’officine](rules/1996-pharmacie-officine/README.md) | 1996 | `2025.1` : 24 mai 2025 ; `2026.1` : 17 avril 2026 | Minima selon le coefficient, la valeur du point et le salaire garanti au coefficient 100 ; proratisation selon la quotité de travail |
| [Hospitalisation privée (cliniques privées à but lucratif)](rules/2264-hospitalisation-privee/README.md) | 2264 | `2023.1` : 1er janvier 2023 | Salaire de base (coefficient multiplié par la valeur du point de 7,26 €, à partir du coefficient 243), proratisé selon la quotité de travail ; détection du coefficient absent ou inférieur à 176 |
| [Aide, accompagnement, soins et services à domicile](rules/2941-aide-soins-domicile/README.md) | 2941 | `2026.1` : 1er juin 2026 (extension publiée le 23 juillet 2026) | Grilles intervention et support, base avec plancher SMIC, ECR diplôme et ancienneté ; tutorat, apprentissage et astreintes |

### BANQUE, ASSURANCE & FINANCE

| Convention | IDCC | Versions et dates d’effet | Règles présentes |
|---|---|---|---|
| [Sociétés d’assurances](rules/1672-societes-assurances/README.md) | 1672 | `2026.3` : 1er janvier 2026 | Rémunérations minimales annuelles des 7 classes, avec endpoint annuel proratisé et équivalent mensuel indicatif sur 12 mois ; détection des classes hors grille |
| [Banque](rules/2120-banque/README.md) | 2120 | `2026.1` : 1er avril 2026 | Salaires annuels minima des 11 niveaux (A à K) selon l’ancienneté (0, 5, 10, 15 et 20 ans), convertis en minimum mensuel sur 13 mensualités et proratisés selon la quotité de travail ; détection des niveaux hors grille |
| [Édition](rules/2121-edition/README.md) | 2121 | `2026.1` : 1er juillet 2026 (avenant étendu) | Grille mensuelle de 16 catégories employés, agents de maîtrise/techniciens et cadres, proratisée selon la quotité de travail ; détection des catégories hors grille |
| [Import-export](rules/0043-import-export/README.md) | 43 | `2026.1` : 1er mars 2026 (accord étendu le 13 mai 2026) | Grille mensuelle de 20 coefficients (E1 à E8, M9 à M12 et C13 à C20), proratisée selon la quotité de travail ; détection des coefficients hors grille |
| [Promotion immobilière](rules/1512-promotion-immobiliere/README.md) | 1512 | `2026.2` : 1er janvier 2026 (salaires, santé et prévoyance) ; `2026.3` : même date (correction) | Grille mensuelle fondée sur deux valeurs de point pour 13 coefficients ; minimum annuel distinct de 36 276 € pour les niveaux 4 à 6 au forfait de 218 jours ; santé à 2,60 % du PMSS répartie 50/50 ; prévoyance T1/T2 jusqu'à 4 PMSS ; coefficients hors grille signalés |
| [Cabinets d’experts-comptables et de commissaires aux comptes](rules/0787-experts-comptables/README.md) | 787 | `2026.1` : 1er mars 2026 | Minimum annuel selon le coefficient (131,54 € par point jusqu'au 164e, puis 79,85 €), équivalent mensuel proratisé, et minimum annuel distinct de l'indice 40 validé |
| [Sociétés d’expertises et d’évaluations](rules/0915-societes-expertises-evaluations/README.md) | 915 | `2026.1` : 29 mai 2026 (avenant étendu) | Dix minima annuels bruts des niveaux N 1 à N 10, proratisés selon la quotité de travail ; détection des niveaux hors grille |
| [Sociétés financières](rules/0478-societes-financieres/README.md) | 478 | `2026.1` : 1er juin 2026 (employeurs signataires ou adhérents) | Grille annuelle de 22 coefficients, colonne 0 à 3 ans, proratisée selon la quotité de travail ; détection des coefficients hors grille ; colonnes d'ancienneté supérieure non modélisées |
| [Activités de marchés financiers](rules/2931-activites-marches-financiers/README.md) | 2931 | `2026.1` : 1er janvier 2026 (employeurs signataires ou adhérents) | Sept minima mensuels des catégories I.A à III.C, proratisés selon la quotité de travail ; catégories hors grille et champ juridique explicites |
| [Entreprises de courtage d’assurances et de réassurances](rules/2247-courtage-assurances/README.md) | 2247 | `2025.1` : 1er juillet 2025 | Salaires annuels minima des 8 classes (A à H), convertis en minimum mensuel sur 13 mensualités et proratisés selon la quotité de travail ; détection des classes hors grille |
| [Personnel des agences générales d'assurances](rules/2335-agences-generales-assurances/README.md) | 2335 | `2026.1` : 1er janvier 2026 (signataires) ; 19 mars 2026 (champ étendu) | Sept salaires minima annuels bruts des classes 1 à 6 et 5 bis, bornes de date et de champ juridique, sans conversion mensuelle |

### CULTURE, MÉDIAS & AUTRES

| Convention | IDCC | Versions et dates d’effet | Règles présentes |
|---|---|---|---|
| [Agences de presse](rules/3221-agences-presse/README.md) | 3221 | `2026.2` : 1er juillet 2026 (signataires) ; 4 septembre 2026 (champ étendu) | Neuf salaires minima mensuels des groupes 1 à 9, bornes de date et de champ juridique, proratisation selon la quotité de travail ; détection des groupes hors grille |
| [Journalistes](rules/1480-journalistes/README.md) | 1480 | `2025.1` : 1er septembre 2025 (signataires) ; 19 septembre 2025 (champ étendu) | Huit salaires minima mensuels des groupes 1 à 8 des journalistes d’agences de presse, proratisation selon la quotité de travail ; détection des groupes hors grille |
| [Entreprises de publicité](rules/0086-publicite/README.md) | 86 | `2025.1` : 19 juin 2025 | Minima mensuels des employés, techniciens/agents de maîtrise et cadres selon les niveaux 1 à 4, proratisés selon la quotité de travail ; détection des niveaux hors grille |
| [Imprimeries de labeur et industries graphiques](rules/0184-imprimeries/README.md) | 184 | `2026.1` : 1er avril 2026 (accord étendu) | Grille mensuelle de 12 groupes et échelons, proratisée selon la quotité de travail ; détection des groupes hors grille |
| [Optique-lunetterie de détail](rules/1431-optique-lunetterie-detail/README.md) | 1431 | `2024.1` : 1er janvier 2024 | Deux grilles mensuelles étendues : coefficients numériques de la classification actuelle et niveaux A à K de la classification de l’avenant n° 8 ; proratisation selon la quotité de travail ; détection des coefficients hors grille |
| [Entreprises privées du spectacle vivant](rules/3090-spectacle-vivant-prive/README.md) | 3090 | `2025.2` : 1er septembre 2025 | Périmètre explicite des salariés permanents administratifs, commerciaux et techniques : grilles mensuelles des catégories et échelons vérifiés, proratisation selon la quotité ; artistes, intermittents et annexes exclus |
| [Entreprises techniques au service de la création et de l'événement — doublage](rules/2717-creation-evenement/README.md) | 2717 | `2024.1` : 1er juin 2024 | Minimum de 112,40 € brut par demi-journée pour 1 à 6 lignes et 1 rôle ; autres prestations et annexes explicitement hors grille ; audit des rubriques de paie sans correction conventionnelle |
| [Hôtellerie de plein air](rules/1631-hotellerie-plein-air/README.md) | 1631 | `2024.1` : 1er novembre 2024 (avenant étendu) | Grille mensuelle bornée de cinq coefficients sourcés, proratisée selon la quotité de travail ; coefficients non modélisés explicitement hors périmètre ; audit explicite des rubriques de paie sans correction conventionnelle |
| [Sport](rules/2511-sport/README.md) | 2511 | `2026.1` : 1er janvier 2026 | Groupes 1 à 6 mensuels et 7 à 8 annuels sans conversion mensuelle ; majorations temps partiel, prime d’ancienneté ; prévoyance et santé actualisées sur les endpoints standard ; héritage formation/AT/forfait/franchise neutralisé, allocations annuelles de branche à valider séparément |
| [Golf](rules/2021-golf/README.md) | 2021 | `2026.1` : 1er avril 2026 (accord étendu) | Grille mensuelle des groupes 1 à 7, proratisation selon la quotité ; minima annuels distincts pour les groupes 6 et 7 après deux ans d’ancienneté, sans conversion mensuelle |
| [Particuliers employeurs et emploi à domicile](rules/3239-particuliers-employeurs-emploi-domicile/README.md) | 3239 | `2026.2` : 1er novembre 2026 | Minima des 12 niveaux et certifications, socle assistant maternel par enfant, mensualisation, présence responsable de jour, heures additionnelles et prestations en nature |
| [Télédiffusion](rules/3241-telediffusion/README.md) | 3241 | `2026.2` : 1er juin 2026 | Minima journaliers bruts CDDU (8 heures), liste 1, niveaux 1 à 7-2, colonnes M1/M2 ; plancher du niveau 8 ; liste 2 et rubriques de paie générales hors périmètre |
| [Coopératives de consommateurs](rules/3205-cooperatives-consommateurs/README.md) | 3205 | `2026.1` : 1er mai 2026 (avenant étendu) ; `2026.2` : même date (correction) | Grille mensuelle des niveaux 1 à 12, proratisée selon la quotité de travail ; détection des niveaux hors grille ; audit explicite des rubriques de paie sans correction conventionnelle |
| [Librairie](rules/3013-librairie/README.md) | 3013 | `2026.1` : 1er avril 2026 (avenant étendu) ; `2026.2` : même date (correction) | Grille mensuelle des niveaux 1 à 12, proratisée selon la quotité de travail ; détection des niveaux hors grille ; audit explicite des rubriques de paie sans correction conventionnelle |
| [Presse quotidienne et hebdomadaire en régions](rules/3242-presse-regions/README.md) | 3242 | `2023.2` : 1er juillet 2023 | Grille mensuelle de 15 positions (ouvriers, 6 échelons d’employés, 8 sous-groupes de cadres) de l’accord du 30 juin 2023 (presse quotidienne régionale), proratisée selon la quotité de travail ; détection des positions hors grille |
| [Quincaillerie, fournitures industrielles, fers, métaux et équipement de la maison](rules/3243-quincaillerie/README.md) | 3243 | `2026.1` : 1er mai 2026 (avenant étendu) ; `2026.2` : même date (correction) | Grille mensuelle de 25 niveaux et échelons I.1 à IX.1, proratisée selon la quotité de travail ; détection des classifications hors grille ; audit explicite des rubriques de paie sans correction conventionnelle |
| [Commissaires de justice et sociétés de ventes volontaires](rules/3250-commissaires-justice/README.md) | 3250 | `2026.1` : 1er janvier 2026 (avenant applicable au champ de l'accord) ; `2026.2` : même date (correction) | Grille mensuelle de 29 catégories et coefficients, proratisée selon la quotité de travail ; champ juridique explicite, détection des classifications hors grille ; audit des rubriques de paie sans correction conventionnelle |
| [Industries de jeux, jouets, articles de fêtes et ornements de Noël, articles de puériculture, voitures d'enfants et modèles réduits](rules/1607-jeux-jouets/README.md) | 1607 | `2026.1` : 1er avril 2026 (avenant étendu) | Grille mensuelle de 22 coefficients, colonne 0 à 3 ans, proratisée selon la quotité de travail ; détection des coefficients hors grille ; colonnes d'ancienneté supérieure non modélisées |
| [Bricolage](rules/1606-bricolage/README.md) | 1606 | `2025.1` : 1er juillet 2025 (accord étendu ; application signataires au 1er mai) ; `2025.2` : même date (correction) | Grille mensuelle de 13 coefficients, proratisée selon la quotité de travail ; détection des coefficients hors grille ; audit explicite des rubriques de paie sans correction conventionnelle |
| [Activités industrielles de boulangerie et pâtisserie](rules/1747-boulangerie-industrielle/README.md) | 1747 | `2025.1` : 1er février 2025 | Grille mensuelle de 33 niveaux et échelons A1 à M, proratisée selon la quotité de travail ; détection des niveaux hors grille |
| [Activités industrielles de boulangerie et pâtisserie et professionnels de l’œuf](rules/3255-boulangerie-industrielle/README.md) | 3255 | `2025.1` : 1er février 2025 ; `2026.1` : 1er avril 2026 ; `2026.2` : même date (correction) | Grille mensuelle de 13 niveaux et échelons A1 à E3, proratisée selon la quotité de travail ; détection des niveaux hors grille |

### IMMOBILIER & HABITAT

| [Gardiens, concierges et employés d'immeubles](rules/1043-gardiens-concierges-employes-immeubles/README.md) | 1043 | `2025.1` : 1er mai 2025 (avenant n° 110 étendu) | Formules de salaire minimum des catégories A et B selon le coefficient, les heures ou les unités de valeur ; prime de tri sélectif ; avantage en nature logement et prix conventionnel de l'électricité ; paramètres contractuels explicitement fournis |

Les références des accords et de leurs arrêtés d’extension figurent dans les métadonnées de chaque fichier source.

## Organisation du dépôt

Les répertoires suivent le format `<idcc>-<nom-français-de-la-convention>` et les fichiers le format `<idcc>-<nom>.année.révision.publicodes`. Les noms de chemins utilisent des minuscules et des tirets, sans accents.

## Fonctionnement

### Sources et métadonnées

Chaque fichier `.publicodes` contient deux documents YAML séparés par `---` :

1. Les métadonnées de la version : `validFrom`, sa date d’entrée en vigueur, et `sources`, les références juridiques utilisées.
2. Les règles publicodes : paramètres, grilles et formules de calcul.

Les règles restent en français et sont regroupées sous l’espace de noms `salarié . convention collective . <valeur>`. Elles s’appuient sur les règles de `modele-social`, par exemple pour le statut cadre ou le temps de travail du contrat.

### Compilation et chargement

La commande `npm run compile-rules` :

- Vérifie le nom et le répertoire de chaque fichier, sa date d’effet et la présence de références juridiques.
- Vérifie le verrouillage des versions déjà enregistrées.
- Convertit les règles YAML en fichiers JSON dans `src/compiled/`.
- Génère un index des versions, triées par date d’effet puis par année et révision.

La commande `npm run build` lance cette compilation, puis produit le JavaScript ESM et les déclarations TypeScript dans `dist/`. Les fichiers générés ne sont pas suivis par Git.

Le package expose `COMPILED_VERSIONS`. Chaque version fournit `version`, `validFrom`, `contentHash`, `sources` et une fonction asynchrone `loadRules()`. Les règles JSON sont chargées à la demande : aucun parseur YAML n’est nécessaire dans l’application qui les consomme.

### Versions immuables

`rules/versions.lock.json` conserve l’empreinte de chaque version. Une version publiée ne doit jamais être modifiée ou supprimée : une correction ou une nouvelle grille donne lieu à un nouveau fichier, par exemple `1486-syntec.2025.2.publicodes`.

L’empreinte est calculée à partir de la date d’effet et des règles : SHA-256 de `JSON.stringify({ validFrom, rules })`, tronqué à 16 caractères hexadécimaux. Ce format conserve les empreintes historiques de JourDePaye. Les références juridiques sont exportées, mais ne font pas partie de cette empreinte.

Une nouvelle version est ajoutée au verrou lors de sa première compilation. Pendant son développement, vous pouvez retirer son entrée du verrou pour poursuivre les modifications, **uniquement si elle n’a jamais été publiée**. La compilation refuse une modification des règles ou de la date d’effet d’une version verrouillée, ainsi que la disparition de son fichier.

La version du package, par exemple `0.1.0`, est distincte des versions des conventions, comme `2025.1` : une distribution du package contient plusieurs conventions et leurs versions historiques.

### Intégration avec un moteur de calcul

Ces modèles complètent `modele-social`. Le package ne crée pas de moteur Publicodes et ne calcule pas, à lui seul, un bulletin de paie.

L’application qui l’utilise choisit la version applicable à la date souhaitée, ajoute si nécessaire la convention aux choix de `salarié . convention collective`, puis fusionne ses règles avec celles de `modele-social`. Elle doit refuser les définitions de règles en double, sauf les quatre exceptions structurelles Sport `2026.1` détaillées dans [son README](rules/2511-sport/README.md) et autorisées par clé/version exactes dans les tests. Pour modifier une règle de base, les modèles utilisent les mécanismes publicodes `remplace` ou `rend non applicable`.

Dans JourDePaye, `payroll-core` conserve le catalogue métier, la sélection de la version au premier jour de la période, la correspondance avec les données du salarié et le calcul de paie. Ces choix de période ne sont pas imposés par ce package.

## Utiliser le package

Le package n’est pas encore publié sur le registre npm. Il peut être installé depuis le dépôt public ; pour une installation reproductible, remplacez `<commit>` par le hash complet du commit choisi :

```sh
npm install "git+https://github.com/JourDePaye/conventions-collectives.git#<commit>"
```

L’installation depuis Git construit le package grâce au script `prepare`. Elle nécessite Node.js 24 ou plus récent, npm et Git. Les applications consommatrices doivent également disposer de versions compatibles de `publicodes` et de `modele-social` ; les tests actuels utilisent `publicodes@1.10.3` et `modele-social@11.1.0`.

Exemple de chargement d’une version précise :

```ts
import { COMPILED_VERSIONS } from "conventions-collectives";

const version = COMPILED_VERSIONS["1486-syntec"]?.find(
  (candidate) => candidate.version === "2025.1",
);
if (!version) throw new Error("Unknown agreement version");

const rules = await version.loadRules();
```

Le package distribue les règles JSON, le JavaScript, les déclarations TypeScript et les sources `.publicodes`. `npm pack` construit une archive installable localement, sans publication sur le registre npm.

## Développer et lancer les tests

Avec Node.js 24 ou plus récent :

```sh
git clone https://github.com/JourDePaye/conventions-collectives.git
cd conventions-collectives
npm ci
npm test
```

`npm ci` installe les dépendances verrouillées et construit le package. `npm test` compile d’abord les sources, puis exécute tous les fichiers `test/**/*.test.ts` avec le moteur de tests intégré à Node.js. Une erreur de compilation ou un test en échec fait échouer la commande.

Pour exécuter uniquement les tests des modèles :

```sh
npm run compile-rules
node --test test/models.test.ts
```

Pour exécuter uniquement les tests du compilateur :

```sh
node --test test/compile-collective-agreements.test.ts
```

Avant de proposer une contribution, lancez également :

```sh
npm run typecheck
npm run build
npm pack --dry-run
```

Ces commandes vérifient respectivement les types TypeScript, la construction du package et la liste des fichiers inclus dans son archive. La CI GitHub exécute les tests et ces vérifications à chaque push et pull request.

## Contribuer

Les contributions sont les bienvenues, qu’il s’agisse d’une nouvelle convention, d’une nouvelle grille, de dispositions encore absentes ou d’une amélioration des tests et de la documentation. Vous pouvez ouvrir une issue pour discuter d’un sujet ou proposer directement une pull request.

Pour ajouter ou enrichir un modèle :

1. Identifiez la convention, son IDCC, les textes applicables et leur date d’effet. Renseignez les accords et arrêtés d’extension dans `sources`.
2. Créez le répertoire et le fichier correspondant au nommage du dépôt. Pour une convention existante, ajoutez une nouvelle version sans modifier les versions publiées.
3. Écrivez les règles dans l’espace de noms de la convention, avec les conditions d’applicabilité nécessaires.
4. Ajoutez des cas de test dont les montants attendus viennent des textes de référence, indépendamment du fichier YAML. Étendez `test/models.test.ts` pour couvrir la nouvelle version.
5. Exécutez les tests et les vérifications ci-dessus, puis incluez le verrou mis à jour dans votre pull request.

Une nouvelle convention est automatiquement ajoutée à l’index lors de la compilation. Son intégration à une application de paie peut demander des adaptations supplémentaires dans cette application.
