
export interface ItemResponse {
  idItem: number;
  nome: string;
  categoria: any;
  descricao: string;
  preco: number;
  imagemUrl?: string;
  semImagem?: boolean;
}
