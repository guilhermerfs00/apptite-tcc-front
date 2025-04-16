// src/app/core/models/pedido/pedido-visual.model.ts

import { PedidoResponse } from "../services/pedido.service";

export interface PedidoVisual extends PedidoResponse {
  tempoDecorrido: string;
}
