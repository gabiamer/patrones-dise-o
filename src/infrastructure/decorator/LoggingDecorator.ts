// PATRÓN: DECORATOR
// Añade comportamiento a un objeto sin modificar su clase
// Se apilan como capas: DB real → Proxy (caché) → Decorator (logs)

import { Pedido } from "../../domain/builder/PedidoBuilder";
import { PedidoRepository } from "../repository/PedidoRepository";

export class LoggingDecorator implements PedidoRepository {
  constructor(private wrapped: PedidoRepository) {}

  guardar(pedido: Pedido): string {
    console.log(`  [Decorator] Guardando pedido de "${pedido.cliente}"...`);
    const id = this.wrapped.guardar(pedido);
    console.log(`  [Decorator] Pedido guardado con id: ${id}`);
    return id;
  }

  buscarPorId(id: string): Pedido | null {
    console.log(`  [Decorator] Buscando pedido ${id}...`);
    const pedido = this.wrapped.buscarPorId(id);
    console.log(`  [Decorator] Resultado: ${pedido ? "encontrado" : "no encontrado"}`);
    return pedido;
  }

  eliminar(id: string): void {
    console.log(`  [Decorator] Eliminando pedido ${id}...`);
    this.wrapped.eliminar(id);
    console.log(`  [Decorator] Pedido ${id} eliminado`);
  }

  listarTodos(): Pedido[] {
    const lista = this.wrapped.listarTodos();
    console.log(`  [Decorator] Listando todos: ${lista.length} pedidos`);
    return lista;
  }
}
