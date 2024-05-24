INSERT INTO technique_weave (name, description) VALUES ('isacs väv', 'Mycket jobbig kedja');
INSERT INTO technique_weave (name, description) VALUES ('isacs väv 2', 'Mycket jobbig kedja 2');
INSERT INTO node (in_chain, parent_weave, name, description, technique, attack, participant) VALUES (1, 1, 'isacs nod', 'bra nod', 1, FALSE, 1);
INSERT INTO node (in_chain, parent_weave, name, description, technique, attack, participant) VALUES (1, 1, 'isacs andra nod', 'kanske bra nod', 1, TRUE, 2);
INSERT INTO node (in_chain, parent_weave, name, description, technique, attack, participant) VALUES (1, 1, 'isacs tredje nod', 'Den här berättelsen är tillägnad till alla dom som lever med alkoholister till föräldrar, förstår ni vad jag menar? Jag föddes i Halmstad bodde i Andersberg, dom andra byggde kojor när jag lärde mig att sno. Hemma var det bra ett tag, men morsan gick åt fel. Jag och mina syskon visste inte hur man skulle spela Sveriges livsroll, farsan stack och morsan börja supa, bara Gud visste hur det skulle sluta. Socialtjänsten kom in när jag var åtta, tände en cigarett och på marken jag spotta.', 1, FALSE, 2);
INSERT INTO node (in_chain, parent_weave, name, description, technique, attack, participant) VALUES (1, 1, 'isacs fjärde nod', 'Den här berättelsen är tillägnad till alla dom som lever med alkoholister till föräldrar, förstår ni vad jag menar? Jag föddes i Halmstad bodde i Andersberg, dom andra byggde kojor när jag lärde mig att sno. Hemma var det bra ett tag, men morsan gick åt fel. Jag och mina syskon visste inte hur man skulle spela Sveriges livsroll, farsan stack och morsan börja supa, bara Gud visste hur det skulle sluta. Socialtjänsten kom in när jag var åtta, tände en cigarett och på marken jag spotta.', 1, TRUE, 2);

INSERT INTO edges (from_node_id, to_node_id) VALUES (1, 2);
INSERT INTO edges (from_node_id, to_node_id) VALUES (1, 3);
INSERT INTO edges (from_node_id, to_node_id) VALUES (3, 1);
INSERT INTO technique_chain (name, description, parent_weave_id) VALUES ('första kedjan', 'En bra kedja med mycket gott', 1);
INSERT INTO technique_chain (name, description, parent_weave_id) VALUES ('andra kedjan', 'En bra kedja med mycket gott', 2);
INSERT INTO weave_representation (parent_weave_id, node_id, node_x_pos, node_y_pos) VALUES (1, 1, 12, 13);