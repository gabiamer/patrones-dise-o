// PATRÓN: REPOSITORY
// La interfaz vive en el dominio — la implementación en infraestructura
// El dominio NUNCA depende de la base de datos concreta

import { Pedido } from "../../domain/builder/PedidoBuilder";
import { Database } from "../singleton/Database";

// --- Interfaz (dominio) ---
export interface PedidoRepository {
  guardar(pedido: Pedido): string;
  buscarPorId(id: string): Pedido | null;
  eliminar(id: string): void;
  listarTodos(): Pedido[];
}

// --- Implementación (infraestructura) ---
export class PedidoRepositorySQL implements PedidoRepository {
  constructor(private db: Database) {}

  guardar(pedido: Pedido): string {
    const id = `pedido-${Date.now()}`;
    this.db.guardar(id, pedido);
    return id;
  }

  buscarPorId(id: string): Pedido | null {
    return this.db.buscar(id);
  }

  eliminar(id: string): void {
    this.db.eliminar(id);
  }

  listarTodos(): Pedido[] {
    const todos: Pedido[] = [];
    this.db.listar().forEach((val) => todos.push(val));
    return todos;
  }
}
