--automatizando imc
DELIMITER //
CREATE TRIGGER calcular_imc
BEFORE INSERT ON imc
FOR EACH ROW
BEGIN
  SET NEW.imc = NEW.peso / (NEW.altura * NEW.altura);
END //
DELIMITER ;