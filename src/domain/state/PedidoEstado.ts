// PATRÓN: STATE
// El objeto cambia su comportamiento según su estado interno

export interface EstadoPedido {
  pagar(): void;
  enviar(): void;
  cancelar(): void;
  nombre(): string;
}

export class PedidoConEstado {
  estado: EstadoPedido;
  log: string[] = [];

  constructor() {
    this.estado = new EstadoPendiente(this);
    this.log.push(`Estado inicial: ${this.estado.nombre()}`);
  }

  registrar(msg: string): void {
    this.log.push(msg);
    console.log(`  [State] ${msg}`);
  }
}

export class EstadoPendiente implements EstadoPedido {
  constructor(private pedido: PedidoConEstado) {}

  pagar(): void {
    this.pedido.registrar("Pago recibido ✓");
    this.pedido.estado = new EstadoPagado(this.pedido);
    this.pedido.registrar(`Nuevo estado: ${this.pedido.estado.nombre()}`);
  }
  enviar(): void {
    this.pedido.registrar("Error: debe pagarse primero");
  }
  cancelar(): void {
    this.pedido.registrar("Pedido cancelado");
    this.pedido.estado = new EstadoCancelado(this.pedido);
  }
  nombre(): string { return "PENDIENTE"; }
}

export class EstadoPagado implements EstadoPedido {
  constructor(private pedido: PedidoConEstado) {}

  pagar(): void {
    this.pedido.registrar("Ya fue pagado");
  }
  enviar(): void {
    this.pedido.registrar("Pedido enviado ✓");
    this.pedido.estado = new EstadoEnviado(this.pedido);
    this.pedido.registrar(`Nuevo estado: ${this.pedido.estado.nombre()}`);
  }
  cancelar(): void {
    this.pedido.registrar("Cancelado — se emite reembolso");
    this.pedido.estado = new EstadoCancelado(this.pedido);
  }
  nombre(): string { return "PAGADO"; }
}

export class EstadoEnviado implements EstadoPedido {
  constructor(private pedido: PedidoConEstado) {}

  pagar(): void  { this.pedido.registrar("Ya fue pagado"); }
  enviar(): void { this.pedido.registrar("Ya fue enviado"); }
  cancelar(): void {
    this.pedido.registrar("No se puede cancelar — ya está en camino");
  }
  nombre(): string { return "ENVIADO"; }
}

export class EstadoCancelado implements EstadoPedido {
  constructor(private pedido: PedidoConEstado) {}

  pagar(): void   { this.pedido.registrar("Pedido cancelado, no se puede pagar"); }
  enviar(): void  { this.pedido.registrar("Pedido cancelado, no se puede enviar"); }
  cancelar(): void { this.pedido.registrar("Ya está cancelado"); }
  nombre(): string { return "CANCELADO"; }
}
