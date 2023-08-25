const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // Middleware para tratar o corpo das solicitações JSON

const lista_produtos = {
  produtos: [
    { id: 1, descricao: "Arroz parboilizado 5Kg", valor: 25.00, marca: "Tio João" },
    { id: 2, descricao: "Maionese 250gr", valor: 7.20, marca: "Helmans" },
    { id: 3, descricao: "Iogurte Natural 200ml", valor: 2.50, marca: "Itambé" },
    { id: 4, descricao: "Batata Maior Palha 300gr", valor: 15.20, marca: "Chipps" },
    { id: 5, descricao: "Nescau 400gr", valor: 8.00, marca: "Nestlé" },
  ]
}

function formatarProduto(id, descricao, valor, marca) {
  return {
    id: id,
    descricao: descricao,
    valor: valor,
    marca: marca
  };
}

// Rota para obter a lista de produtos
app.get('/produtos', (req, res) => {
  const produtosFormatados = lista_produtos.produtos.map(produto =>
    formatarProduto(produto.id, produto.descricao, produto.valor, produto.marca)
  );
  res.status(200).json(produtosFormatados);
});


// Rota para obter um produto específico por ID
app.get('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const produto = lista_produtos.produtos.find(p => p.id === id);
  if (!produto) {
    res.status(200).json({ error: 'Produto não encontrado' });
  } else {
    res.status(200).json(produto);
  }
});

// Rota para incluir um novo produto
app.post('/produtos', (req, res) => {
  const novoProduto = req.body;
  novoProduto.id = lista_produtos.produtos.length + 1; // Defina o id explicitamente

  // Criar um novo objeto com a ordem desejada das propriedades
  const resposta = {
    id: novoProduto.id,
    descricao: novoProduto.descricao,
    valor: novoProduto.valor,
    marca: novoProduto.marca,
  };

  lista_produtos.produtos.push(novoProduto);
  res.status(201).json(resposta);
});


// Rota para alterar um produto existente por ID
app.put('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const produtoIndex = lista_produtos.produtos.findIndex(p => p.id === id);
  if (produtoIndex === -1) {
    res.status(404).json({ error: 'Produto não encontrado' });
  } else {
    const produtoAtualizado = { ...req.body, id };
    lista_produtos.produtos[produtoIndex] = produtoAtualizado;
    
    const produtoFormatado = formatarProduto(
      produtoAtualizado.id,
      produtoAtualizado.descricao,
      produtoAtualizado.valor,
      produtoAtualizado.marca
    );

    res.status(200).json(produtoFormatado);
  }
});


// Rota para excluir um produto por ID
app.delete('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const produtoIndex = lista_produtos.produtos.findIndex(p => p.id === id);
  if (produtoIndex === -1) {
    res.status(404).json({ error: 'Produto não encontrado' });
  } else {
    lista_produtos.produtos.splice(produtoIndex, 1);
    res.status(200).json({ message: 'Produto excluído com sucesso' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
