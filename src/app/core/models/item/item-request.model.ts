export interface ItemRequest {
    nome: string; // Nome do item
    idCategoria: number; // ID da categoria do item
    preco: number; // Preço do item
    descricao: string; // Descrição do item
    idCardapio: number; // ID do cardápio ao qual o item está vinculado
  }