CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS types (
    type_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS assets (
    asset_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    type_id INT NOT NULL,
    FOREIGN KEY (type_id) REFERENCES types(type_id)
);

CREATE TABLE IF NOT EXISTS actions (
    action_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS holdings (
    holding_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    asset_id INT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    action_id INT NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    transaction_date DATE NOT NULL,
    FOREIGN KEY (action_id) REFERENCES actions(action_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (asset_id) REFERENCES assets(asset_id)
);

INSERT INTO actions (name)
SELECT 'BUY'
WHERE NOT EXISTS (SELECT 1 FROM actions WHERE name = 'BUY');

INSERT INTO actions (name)
SELECT 'SELL'
WHERE NOT EXISTS (SELECT 1 FROM actions WHERE name = 'SELL');

INSERT INTO users (firstname, lastname, email)
SELECT 'PRANAV', '', 'pranavmenon@2019'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'pranavmenon@2019');

INSERT INTO users (firstname, lastname, email)
SELECT 'ANUSHKA', '', 'anushka@2019'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'anushka@2019');

INSERT INTO users (firstname, lastname, email)
SELECT 'SHASHANK', '', 'shashank@2019'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'shashank@2019');

INSERT INTO users (firstname, lastname, email)
SELECT 'SRUTHI', '', 'sruthi@2019'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'sruthi@2019');

INSERT INTO types (name)
SELECT 'STOCK'
WHERE NOT EXISTS (SELECT 1 FROM types WHERE name = 'STOCK');

INSERT INTO types (name)
SELECT 'BOND'
WHERE NOT EXISTS (SELECT 1 FROM types WHERE name = 'BOND');

INSERT INTO types (name)
SELECT 'MUTUAL FUND'
WHERE NOT EXISTS (SELECT 1 FROM types WHERE name = 'MUTUAL FUND');


-- Seed stock assets for portfolio testing
INSERT INTO assets (name, type_id)
SELECT 'AAPL', t.type_id
FROM types t
WHERE t.name = 'STOCK'
  AND NOT EXISTS (SELECT 1 FROM assets WHERE name = 'AAPL');

INSERT INTO assets (name, type_id)
SELECT 'MSFT', t.type_id
FROM types t
WHERE t.name = 'STOCK'
  AND NOT EXISTS (SELECT 1 FROM assets WHERE name = 'MSFT');

INSERT INTO assets (name, type_id)
SELECT 'INTC', t.type_id
FROM types t
WHERE t.name = 'STOCK'
  AND NOT EXISTS (SELECT 1 FROM assets WHERE name = 'INTC');

 INSERT INTO assets (name, type_id)
 SELECT 'Govt. Bond', t.type_id
 FROM types t
 WHERE t.name = 'BOND'
   AND NOT EXISTS (SELECT 1 FROM assets WHERE name = 'Govt. Bond');

  INSERT INTO assets (name, type_id)
  SELECT 'VFIAX', t.type_id
  FROM types t
  WHERE t.name = 'MUTUAL FUND'
    AND NOT EXISTS (SELECT 1 FROM assets WHERE name = 'VFIAX');

-- Seed one BUY holding for PRANAV in AAPL for startup testing
INSERT INTO holdings (user_id, asset_id, quantity, action_id, price_per_unit, transaction_date)
SELECT u.user_id, a.asset_id, 10.00, ac.action_id, 180.00, CURRENT_DATE
FROM users u
JOIN assets a ON a.name = 'AAPL'
JOIN actions ac ON ac.name = 'BUY'
WHERE u.email = 'pranavmenon@2019'
  AND NOT EXISTS (
      SELECT 1
      FROM holdings h
      WHERE h.user_id = u.user_id
        AND h.asset_id = a.asset_id
        AND h.action_id = ac.action_id
        AND h.quantity = 10.00
        AND h.price_per_unit = 180.00
  );

INSERT INTO holdings (user_id, asset_id, quantity, action_id, price_per_unit, transaction_date)
SELECT u.user_id, a.asset_id, 5.00, ac.action_id, 180.00, CURRENT_DATE
FROM users u
JOIN assets a ON a.name = 'AAPL'
JOIN actions ac ON ac.name = 'SELL'
WHERE u.email = 'pranavmenon@2019'
  AND NOT EXISTS (
      SELECT 1
      FROM holdings h
      WHERE h.user_id = u.user_id
        AND h.asset_id = a.asset_id
        AND h.action_id = ac.action_id
        AND h.quantity = 5.00
        AND h.price_per_unit = 180.00
  );

INSERT INTO holdings (user_id, asset_id, quantity, action_id, price_per_unit, transaction_date)
SELECT u.user_id, a.asset_id, 10.00, ac.action_id, 180.00, CURRENT_DATE
FROM users u
JOIN assets a ON a.name = 'MSFT'
JOIN actions ac ON ac.name = 'BUY'
WHERE u.email = 'pranavmenon@2019'
  AND NOT EXISTS (
      SELECT 1
      FROM holdings h
      WHERE h.user_id = u.user_id
        AND h.asset_id = a.asset_id
        AND h.action_id = ac.action_id
        AND h.quantity = 10.00
        AND h.price_per_unit = 180.00
  );

  INSERT INTO holdings (user_id, asset_id, quantity, action_id, price_per_unit, transaction_date)
  SELECT u.user_id, a.asset_id, 10.00, ac.action_id, 180.00, CURRENT_DATE
  FROM users u
  JOIN assets a ON a.name = 'MSFT'
  JOIN actions ac ON ac.name = 'BUY'
  WHERE u.email = 'pranavmenon@2019'
    AND NOT EXISTS (
        SELECT 1
        FROM holdings h
        WHERE h.user_id = u.user_id
          AND h.asset_id = a.asset_id
          AND h.action_id = ac.action_id
          AND h.quantity = 20.00
          AND h.price_per_unit = 180.00
    );

      INSERT INTO holdings (user_id, asset_id, quantity, action_id, price_per_unit, transaction_date)
      SELECT u.user_id, a.asset_id, 10.00, ac.action_id, 180.00, CURRENT_DATE
      FROM users u
      JOIN assets a ON a.name = 'INTC'
      JOIN actions ac ON ac.name = 'BUY'
      WHERE u.email = 'pranavmenon@2019'
        AND NOT EXISTS (
            SELECT 1
            FROM holdings h
            WHERE h.user_id = u.user_id
              AND h.asset_id = a.asset_id
              AND h.action_id = ac.action_id
              AND h.quantity = 20.00
              AND h.price_per_unit = 180.00
        );

    INSERT INTO holdings (user_id, asset_id, quantity, action_id, price_per_unit, transaction_date)
          SELECT u.user_id, a.asset_id, 10.00, ac.action_id, 180.00, CURRENT_DATE
          FROM users u
          JOIN assets a ON a.name = 'VFIAX'
          JOIN actions ac ON ac.name = 'BUY'
          WHERE u.email = 'pranavmenon@2019'
            AND NOT EXISTS (
                SELECT 1
                FROM holdings h
                WHERE h.user_id = u.user_id
                  AND h.asset_id = a.asset_id
                  AND h.action_id = ac.action_id
                  AND h.quantity = 20.00
                  AND h.price_per_unit = 180.00
            );

    INSERT INTO holdings (user_id, asset_id, quantity, action_id, price_per_unit, transaction_date)
              SELECT u.user_id, a.asset_id, 20.00, ac.action_id, 150.00, CURRENT_DATE
              FROM users u
              JOIN assets a ON a.name = 'Govt. Bond'
              JOIN actions ac ON ac.name = 'BUY'
              WHERE u.email = 'pranavmenon@2019'
                AND NOT EXISTS (
                    SELECT 1
                    FROM holdings h
                    WHERE h.user_id = u.user_id
                      AND h.asset_id = a.asset_id
                      AND h.action_id = ac.action_id
                      AND h.quantity = 20.00
                      AND h.price_per_unit = 180.00
                );

-- Additional dated holdings for time-series testing
INSERT INTO holdings (user_id, asset_id, quantity, action_id, price_per_unit, transaction_date)
SELECT u.user_id, a.asset_id, 8.00, ac.action_id, 170.00, '2026-07-01'
FROM users u
JOIN assets a ON a.name = 'AAPL'
JOIN actions ac ON ac.name = 'BUY'
WHERE u.email = 'pranavmenon@2019'
  AND NOT EXISTS (
      SELECT 1
      FROM holdings h
      WHERE h.user_id = u.user_id
        AND h.asset_id = a.asset_id
        AND h.action_id = ac.action_id
        AND h.quantity = 8.00
        AND h.price_per_unit = 170.00
        AND h.transaction_date = '2026-07-01'
  );

INSERT INTO holdings (user_id, asset_id, quantity, action_id, price_per_unit, transaction_date)
SELECT u.user_id, a.asset_id, 3.00, ac.action_id, 175.00, '2026-07-10'
FROM users u
JOIN assets a ON a.name = 'AAPL'
JOIN actions ac ON ac.name = 'SELL'
WHERE u.email = 'pranavmenon@2019'
  AND NOT EXISTS (
      SELECT 1
      FROM holdings h
      WHERE h.user_id = u.user_id
        AND h.asset_id = a.asset_id
        AND h.action_id = ac.action_id
        AND h.quantity = 3.00
        AND h.price_per_unit = 175.00
        AND h.transaction_date = '2026-07-10'
  );

INSERT INTO holdings (user_id, asset_id, quantity, action_id, price_per_unit, transaction_date)
SELECT u.user_id, a.asset_id, 6.00, ac.action_id, 320.00, '2026-07-20'
FROM users u
JOIN assets a ON a.name = 'MSFT'
JOIN actions ac ON ac.name = 'BUY'
WHERE u.email = 'pranavmenon@2019'
  AND NOT EXISTS (
      SELECT 1
      FROM holdings h
      WHERE h.user_id = u.user_id
        AND h.asset_id = a.asset_id
        AND h.action_id = ac.action_id
        AND h.quantity = 6.00
        AND h.price_per_unit = 320.00
        AND h.transaction_date = '2026-07-20'
  );

INSERT INTO holdings (user_id, asset_id, quantity, action_id, price_per_unit, transaction_date)
SELECT u.user_id, a.asset_id, 4.00, ac.action_id, 45.00, '2026-07-28'
FROM users u
JOIN assets a ON a.name = 'INTC'
JOIN actions ac ON ac.name = 'BUY'
WHERE u.email = 'pranavmenon@2019'
  AND NOT EXISTS (
      SELECT 1
      FROM holdings h
      WHERE h.user_id = u.user_id
        AND h.asset_id = a.asset_id
        AND h.action_id = ac.action_id
        AND h.quantity = 4.00
        AND h.price_per_unit = 45.00
        AND h.transaction_date = '2026-07-28'
  );

INSERT INTO holdings (user_id, asset_id, quantity, action_id, price_per_unit, transaction_date)
SELECT u.user_id, a.asset_id, 4.00, ac.action_id, 90.00, '2026-07-28'
FROM users u
JOIN assets a ON a.name = 'INTC'
JOIN actions ac ON ac.name = 'BUY'
WHERE u.email = 'pranavmenon@2019'
  AND NOT EXISTS (
      SELECT 1
      FROM holdings h
      WHERE h.user_id = u.user_id
        AND h.asset_id = a.asset_id
        AND h.action_id = ac.action_id
        AND h.quantity = 4.00
        AND h.price_per_unit = 45.00
        AND h.transaction_date = '2026-07-28'
  );

INSERT INTO holdings (user_id, asset_id, quantity, action_id, price_per_unit, transaction_date)
SELECT u.user_id, a.asset_id, 4.00, ac.action_id, 40.00, '2026-05-28'
FROM users u
JOIN assets a ON a.name = 'INTC'
JOIN actions ac ON ac.name = 'BUY'
WHERE u.email = 'pranavmenon@2019'
  AND NOT EXISTS (
      SELECT 1
      FROM holdings h
      WHERE h.user_id = u.user_id
        AND h.asset_id = a.asset_id
        AND h.action_id = ac.action_id
        AND h.quantity = 4.00
        AND h.price_per_unit = 45.00
        AND h.transaction_date = '2026-05-28'
  );