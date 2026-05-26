-- Contrainte unique pour éviter les doublons lors des réinsertions
alter table fit_food_items add constraint fit_food_items_name_key unique (name);

-- Aliments inspirés des plans M&S (Clean Bulk, IIFYM)
insert into fit_food_items (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, category) values
  -- Viandes & Volailles
  ('Blanc de dinde cuit',            135, 30.0, 0.0, 1.5, 'Viandes'),
  ('Escalope de poulet',             165, 31.0, 0.0, 3.6, 'Viandes'),
  ('Boeuf haché 5%',                 150, 28.0, 0.0, 5.0, 'Viandes'),
  ('Boeuf haché 15%',                215, 26.0, 0.0, 12.0, 'Viandes'),
  ('Steak haché 5%',                 164, 27.0, 0.0, 5.5, 'Viandes'),
  ('Rôti de dinde',                  135, 29.0, 0.0, 1.5, 'Viandes'),
  ('Jambon blanc dégraissé',         115, 21.0, 1.0, 3.0, 'Viandes'),
  ('Dinde deli (tranches)',          115, 23.0, 1.0, 2.0, 'Viandes'),
  ('Rosbif tranché',                 120, 25.0, 0.0, 2.5, 'Viandes'),
  ('Beef jerky',                     310, 33.0, 11.0, 15.0, 'Viandes'),
  ('Filet de poulet mariné',        148, 27.0, 2.0, 3.0, 'Viandes'),
  ('Cuisse de poulet sans peau',     175, 26.0, 0.0, 7.5, 'Viandes'),

  -- Poissons
  ('Cabillaud cuit',                  82, 18.0, 0.0, 0.7, 'Poissons'),
  ('Colin cuit',                      90, 19.0, 0.0, 1.0, 'Poissons'),
  ('Sardines à l huile',             208, 25.0, 0.0, 11.0, 'Poissons'),
  ('Maquereau cuit',                 205, 19.0, 0.0, 14.0, 'Poissons'),
  ('Moules cuites',                  86, 12.0, 4.0, 2.2, 'Poissons'),
  ('Crevettes cuites',               99, 24.0, 0.0, 0.3, 'Poissons'),

  -- Œufs & Produits laitiers
  ('Blancs d oeufs liquides',        48, 10.0, 0.7, 0.0, 'Œufs'),
  ('Oeufs durs',                     155, 13.0, 1.1, 11.0, 'Œufs'),
  ('Fromage blanc 3%',               63, 7.0, 4.0, 3.0, 'Produits laitiers'),
  ('Fromage blanc 20%',              112, 7.0, 4.0, 8.0, 'Produits laitiers'),
  ('Yaourt nature 0%',               42, 4.5, 5.0, 0.2, 'Produits laitiers'),
  ('Skyr nature',                    64, 11.0, 4.0, 0.2, 'Produits laitiers'),
  ('Lait demi-écrémé',               47, 3.2, 4.8, 1.6, 'Produits laitiers'),
  ('Lait écrémé',                    35, 3.5, 5.0, 0.1, 'Produits laitiers'),
  ('Emmental râpé',                 379, 29.0, 0.0, 29.0, 'Produits laitiers'),
  ('Mozzarella light',              254, 26.0, 1.0, 16.0, 'Produits laitiers'),
  ('Fromage frais type St Môret',   240, 7.0, 3.0, 23.0, 'Produits laitiers'),

  -- Féculents & Céréales
  ('Riz basmati cuit',               130, 2.7, 28.0, 0.3, 'Féculents'),
  ('Riz sauvage cuit',               101, 4.0, 21.0, 0.3, 'Féculents'),
  ('Sarrasin cuit (kasha)',          92, 3.4, 20.0, 0.6, 'Féculents'),
  ('Boulgour cuit',                  83, 3.1, 18.0, 0.2, 'Féculents'),
  ('Semoule cuite',                  112, 3.4, 24.0, 0.2, 'Féculents'),
  ('Patate douce au four',           90, 2.0, 21.0, 0.1, 'Féculents'),
  ('Purée de pommes de terre',       85, 1.8, 18.0, 0.8, 'Féculents'),
  ('Flocons de pomme de terre',      340, 7.0, 78.0, 0.5, 'Féculents'),
  ('Pâtes complètes cuites',         124, 5.3, 25.0, 0.5, 'Féculents'),
  ('Pâtes de lentilles cuites',      140, 9.0, 24.0, 0.5, 'Féculents'),
  ('Galettes de riz complet',        380, 8.0, 80.0, 3.0, 'Céréales'),
  ('Pain de mie complet',            247, 9.0, 44.0, 4.0, 'Céréales'),
  ('Pain aux céréales',             250, 9.5, 43.0, 4.5, 'Céréales'),
  ('Wrap tortilla complet',          290, 9.0, 48.0, 6.0, 'Céréales'),
  ('Muesli sans sucre',             350, 10.0, 62.0, 6.0, 'Céréales'),
  ('Granola maison',                 420, 10.0, 55.0, 18.0, 'Céréales'),
  ('Céréales Special K',             380, 6.0, 84.0, 1.5, 'Céréales'),

  -- Légumineuses
  ('Haricots rouges cuits',         127, 8.7, 23.0, 0.5, 'Légumineuses'),
  ('Haricots noirs cuits',          132, 8.9, 24.0, 0.5, 'Légumineuses'),
  ('Edamame cuit',                  121, 12.0, 9.0, 5.0, 'Légumineuses'),
  ('Lentilles vertes cuites',       116, 9.0, 20.0, 0.4, 'Légumineuses'),
  ('Lentilles corail cuites',       100, 7.6, 17.0, 0.4, 'Légumineuses'),
  ('Pois cassés cuits',             118, 8.3, 21.0, 0.4, 'Légumineuses'),

  -- Légumes
  ('Tomates cerises',                 18, 0.9, 3.0, 0.2, 'Légumes'),
  ('Concombre',                       15, 0.7, 2.2, 0.1, 'Légumes'),
  ('Poivron rouge',                   31, 1.0, 6.0, 0.3, 'Légumes'),
  ('Carotte crue',                    41, 0.9, 10.0, 0.2, 'Légumes'),
  ('Courgette cuite',                 17, 1.2, 3.0, 0.2, 'Légumes'),
  ('Haricots verts cuits',            35, 1.8, 7.0, 0.1, 'Légumes'),
  ('Petits pois cuits',               81, 5.4, 14.0, 0.4, 'Légumes'),
  ('Maïs doux',                       96, 3.4, 19.0, 1.5, 'Légumes'),
  ('Champignons de Paris',            22, 3.1, 3.3, 0.3, 'Légumes'),
  ('Asperges cuites',                 20, 2.2, 4.0, 0.1, 'Légumes'),
  ('Avocat (1/2 = 75g)',             160, 2.0, 8.5, 15.0, 'Légumes'),
  ('Salade de blé',                  20, 1.9, 3.0, 0.2, 'Légumes'),
  ('Roquette',                        25, 2.6, 3.7, 0.3, 'Légumes'),
  ('Oignon',                         40, 1.1, 9.0, 0.1, 'Légumes'),
  ('Ail',                           149, 6.4, 33.0, 0.5, 'Légumes'),

  -- Fruits
  ('Fraise',                          32, 0.7, 8.0, 0.3, 'Fruits'),
  ('Myrtilles',                       57, 0.7, 14.0, 0.3, 'Fruits'),
  ('Framboises',                      52, 1.2, 12.0, 0.7, 'Fruits'),
  ('Mûres',                           43, 1.4, 10.0, 0.5, 'Fruits'),
  ('Orange',                          47, 0.9, 12.0, 0.1, 'Fruits'),
  ('Pamplemousse',                    42, 0.8, 11.0, 0.1, 'Fruits'),
  ('Ananas',                          50, 0.5, 13.0, 0.1, 'Fruits'),
  ('Kiwi',                            61, 1.1, 15.0, 0.5, 'Fruits'),
  ('Mangue',                          60, 0.8, 15.0, 0.4, 'Fruits'),
  ('Raisin',                          69, 0.7, 18.0, 0.2, 'Fruits'),
  ('Cerises',                         50, 1.0, 12.0, 0.3, 'Fruits'),
  ('Figues fraîches',                 74, 0.8, 19.0, 0.3, 'Fruits'),
  ('Dattes Medjool',                 282, 2.0, 75.0, 0.4, 'Fruits'),
  ('Compote de pommes sans sucre',    52, 0.3, 12.0, 0.1, 'Fruits'),
  ('Abricot sec',                    241, 3.4, 63.0, 0.5, 'Fruits'),

  -- Oléagineux & Graines
  ('Noix de Grenoble',               654, 15.0, 14.0, 65.0, 'Olégineux'),
  ('Noix de cajou',                  553, 18.0, 30.0, 44.0, 'Olégineux'),
  ('Noisettes',                      628, 15.0, 17.0, 61.0, 'Olégineux'),
  ('Graines de chia',                486, 17.0, 42.0, 31.0, 'Olégineux'),
  ('Graines de lin',                 534, 18.0, 29.0, 42.0, 'Olégineux'),
  ('Graines de courge',              559, 30.0, 11.0, 49.0, 'Olégineux'),
  ('Graines de tournesol',           584, 21.0, 20.0, 51.0, 'Olégineux'),
  ('Amandes effilées',               579, 21.0, 22.0, 50.0, 'Olégineux'),
  ('Purée de cacahuète',            588, 25.0, 20.0, 50.0, 'Olégineux'),

  -- Huiles & Matières grasses
  ('Huile de colza',                 884, 0.0, 0.0, 100.0, 'Matières grasses'),
  ('Huile de coco',                  862, 0.0, 0.0, 93.0, 'Matières grasses'),
  ('Beurre doux',                    740, 0.5, 0.1, 82.0, 'Matières grasses'),
  ('Vinaigrette allégée',            200, 0.5, 5.0, 20.0, 'Matières grasses'),

  -- Compléments
  ('Whey isolate (poudre)',          390, 90.0, 3.0, 2.0, 'Compléments'),
  ('Caséine (poudre)',               380, 85.0, 4.0, 2.0, 'Compléments'),
  ('Gainer (poudre)',                400, 25.0, 68.0, 4.0, 'Compléments'),
  ('Barre protéinée',                380, 30.0, 40.0, 12.0, 'Compléments'),
  ('BCAA 2:1:1 (poudre)',            20, 5.0, 0.0, 0.0, 'Compléments'),
  ('Créatine monohydrate',           0, 0.0, 0.0, 0.0, 'Compléments'),

  -- Épices & Condiments
  ('Sauce soja légère',              55, 5.0, 5.0, 0.5, 'Condiments'),
  ('Vinaigre balsamique',            88, 0.5, 17.0, 0.0, 'Condiments'),
  ('Moutarde',                       66, 4.0, 5.0, 4.0, 'Condiments'),
  ('Ketchup sans sucre',             30, 1.0, 6.0, 0.1, 'Condiments'),
  ('Sauce tomate (passata)',         35, 1.5, 6.0, 0.5, 'Condiments'),
  ('Levure maltée (flocons)',       350, 45.0, 40.0, 5.0, 'Condiments'),

  -- Boissons
  ('Gatorade (20oz/591ml)',          27, 0.0, 7.0, 0.0, 'Boissons'),
  ('Eau de coco',                    19, 0.2, 4.0, 0.0, 'Boissons'),
  ('Jus d orange pressé',            45, 0.7, 10.0, 0.2, 'Boissons')
on conflict (name) do nothing;
