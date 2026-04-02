// PATRÓN: PROXY
// Controla el acceso al objeto real — aquí agrega caché transparente

import { Pedido } from "../../domain/builder/PedidoBuilder";
import { PedidoRepository } from "../repository/PedidoRepository";

export class PedidoRepositoryProxy implements PedidoRepository {
  private cache = new Map<string, Pedido>();

  constructor(private real: PedidoRepository) {}

  guardar(pedido: Pedido): string {
    const id = this.real.guardar(pedido);
    this.cache.set(id, pedido); // guarda en caché también
    return id;
  }

  buscarPorId(id: string): Pedido | null {
    if (this.cache.has(id)) {
      console.log(`  [Proxy] ✓ Cache HIT para ${id}`);
      return this.cache.get(id)!;
    }
    console.log(`  [Proxy] ✗ Cache MISS — consultando DB para ${id}`);
    const pedido = this.real.buscarPorId(id);
    if (pedido) this.cache.set(id, pedido);
    return pedido;
  }

  eliminar(id: string): void {
    this.cache.delete(id); // invalida caché
    this.real.eliminar(id);
  }

  listarTodos(): Pedido[] {
    return this.real.listarTodos();
  }
}
