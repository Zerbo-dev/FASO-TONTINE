INSERT INTO users (full_name, phone, password)
VALUES
('Ali Ouedraogo', '70000000', 'test123'),
('Awa Kaboré', '71000000', 'test123'),
('Moussa Traoré', '72000000', 'test123');

INSERT INTO tontine_groups (name, amount, frequency, created_by)
VALUES
('Tontine Famille', 5000, 'mensuel', 1),
('Tontine Amis', 2000, 'hebdomadaire', 1);

INSERT INTO group_members (user_id, group_id, role)
VALUES
(1, 1, 'admin'),
(2, 1, 'member'),
(3, 1, 'member'),
(1, 2, 'admin');

INSERT INTO payments (user_id, group_id, amount, status, paid_at)
VALUES
(1, 1, 5000, 'paid', NOW()),
(2, 1, 5000, 'late', NULL),
(3, 1, 5000, 'pending', NULL);

INSERT INTO projects (title, description, location, requested_amount)
VALUES
('Forage communautaire', 'Construction d’un forage pour le quartier', 'Ouagadougou', 250000),
('Panneau solaire école', 'Installation de panneaux solaires pour une école', 'Koudougou', 400000);