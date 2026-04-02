// PATRÓN: COMMAND
// Encapsula una operación como objeto — permite undo/redo y colas de tareas

import { Pedido } from "../../domain/builder/PedidoBuilder";
import { PedidoRepository } from "../../infrastructure/repository/PedidoRepository";

// Interfaz base
export interface Command {
  execute(): void;
  undo(): void;
  descripcion(): string;
}

// Comando concreto
export class CrearPedidoCommand implements Command {
  private pedidoId?: string;

  constructor(
    private repo: PedidoRepository,
    private pedido: Pedido
  ) {}

  execute(): void {
    this.pedidoId = this.repo.guardar(this.pedido);
    console.log(`  [Command] Pedido creado con id: ${this.pedidoId}`);
  }

  undo(): void {
    if (this.pedidoId) {
      this.repo.eliminar(this.pedidoId);
      console.log(`  [Command] Pedido ${this.pedidoId} revertido`);
    }
  }

  descripcion(): string {
    return `CrearPedido para "${this.pedido.cliente}"`;
  }
}

// Historial de comandos (undo/redo)
export class Historial {
  private pila: Command[] = [];

  ejecutar(cmd: Command): void {
    console.log(`  [Historial] Ejecutando: ${cmd.descripcion()}`);
    cmd.execute();
    this.pila.push(cmd);
  }

  deshacer(): void {
    const ultimo = this.pila.pop();
    if (ultimo) {
      console.log(`  [Historial] Deshaciendo: ${ultimo.descripcion()}`);
      ultimo.undo();
    } else {
      console.log("  [Historial] Nada que deshacer");
    }
  }
}
