const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const port = 3000;

const pool = new Pool({
    user: 'postgres', // Seu usuário do PostgreSQL
    host: 'localhost',
    database: 'livros', // Nome do seu banco de dados
    password: 'matheus123', // Sua senha do PostgreSQL
    port: 5432, // Porta padrão do PostgreSQL
});



app.use(express.static(path.join(__dirname, 'src')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'inicial.html'));
});

app.get('/tabela', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'tabela.html'));
});

// Rota para cadastrar pessoa
app.post('/', async (req, res) => {
    const { nome, cargo } = req.body;

    if (!nome || !cargo) {
        return res.status(400).json({ message: "Nome e cargo são obrigatórios" });
    }

    const query = 'INSERT INTO pessoas (nome, cargo) VALUES ($1, $2) RETURNING *';
    const values = [nome, cargo];

    try {
        const result = await pool.query(query, values);
        res.status(201).json({ message: "Cadastro realizado com sucesso!", pessoa: result.rows[0] });
    } catch (error) {
        console.error("Erro ao cadastrar:", error);
        res.status(500).json({ message: "Erro no servidor" });
    }
});

app.get('/pegapessoas', async(req,res) =>{
try {

    const result = await pool.query('SELECT * FROM pessoas');
    res.json(result.rows);
} catch (err) {
    res.status(400).send(err);
}

})

// Rota para atualizar uma pessoa
app.put('/atualizar/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, cargo } = req.body;

    if (!nome || !cargo) {
        return res.status(400).json({ message: "Nome e cargo são obrigatórios" });
    }

    try {
        const query = 'UPDATE pessoas SET nome = $1, cargo = $2 WHERE id = $3 RETURNING *';
        const values = [nome, cargo, id];

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Registro não encontrado" });
        }

        res.status(200).json({ message: "Registro atualizado com sucesso!", pessoa: result.rows[0] });
    } catch (error) {
        console.error("Erro ao atualizar:", error);
        res.status(500).json({ message: "Erro no servidor" });
    }
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});