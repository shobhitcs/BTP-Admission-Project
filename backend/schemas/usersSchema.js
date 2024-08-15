var usersSchema = `(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    branch VARCHAR(255) NOT NULL,
    isAdmin BOOLEAN NOT NULL DEFAULT false,
    FOREIGN KEY (branch) REFERENCES branches(branch) ON DELETE CASCADE
)`;

module.exports = { usersSchema };
