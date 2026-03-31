--Trigger feita para automatizar o calculo do imc
DELIMITER $$

CREATE TRIGGER calcular_imc
BEFORE INSERT ON aluno
FOR EACH ROW
BEGIN
    SET NEW.alu_imc = 
        CASE 
            WHEN NEW.alu_peso IS NOT NULL AND NEW.alu_altura IS NOT NULL 
            THEN NEW.alu_peso / (NEW.alu_altura * NEW.alu_altura)
            ELSE NULL
        END;
END$$

DELIMITER ;