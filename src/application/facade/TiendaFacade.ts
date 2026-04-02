// PATRÓN: FACADE
// Una interfaz simple sobre un subsistema complejo
// El cliente no necesita saber cómo funcionan los servicios internos

import { PedidoRepository } from "../../infrastructure/repository/PedidoRepository";
import { ProcesadorPago } from "../../infrastructure/adapter/StripeAdapter";
import { Notificador } from "../../infrastructure/factory/NotificadorFactory";
import { EventBus } from "../../domain/observer/EventBus";
import { PedidoBuilder } from "../../domain/builder/PedidoBuilder";
import { Precio } from "../../domain/valueobject/Precio";

// Servicios internos (el subsistema complejo que la fachada oculta)
class InventarioService {
  reservar(productoId: string): void {
    console.log(`  [Facade→Inventario] Producto "${productoId}" reservado`);
  }
  liberar(productoId: string): void {
    console.log(`  [Facade→Inventario] Producto "${productoId}" liberado`);
  }
}

class EnvioService {
  programar(clienteId: string, pedidoId: string): string {
    const guia = `GUIA-${Date.now()}`;
    console.log(`  [Facade→Envio] Envío programado: ${guia}`);
    return guia;
  }
}

// La Fachada — punto de entrada único para todo el flujo de compra
export class TiendaFacade {
  private inventario = new InventarioService();
  private envio = new EnvioService();

  constructor(
    private repo: PedidoRepository,
    private pago: ProcesadorPago,
    private notificador: Notificador,
    private bus: EventBus
  ) {}

  realizarCompra(clienteId: string, productos: string[], totalMonto: number): string {
    console.log(`  [Facade] Iniciando compra para "${clienteId}"...`);

    productos.forEach(p => this.inventario.reservar(p));

    const cobrado = this.pago.cobrar(totalMonto, "BOB");
    if (!cobrado) {
      productos.forEach(p => this.inventario.liberar(p));
      throw new Error("Pago rechazado");
    }

    const builder = new PedidoBuilder();
    builder.setCliente(clienteId);
    productos.forEach(p => builder.agregarProducto(p));
    builder.setTotal(new Precio(totalMonto, "BOB"));
    const pedido = builder.build();
    const pedidoId = this.repo.guardar(pedido);

    const guia = this.envio.programar(clienteId, pedidoId);
    this.notificador.enviar(`Tu pedido ${pedidoId} fue procesado. Guía: ${guia}`);
    this.bus.publicar("pedido.creado", { clienteId, id: pedidoId, guia });

    console.log(`  [Facade] Compra completada ✓`);
    return pedidoId;
  }
}
