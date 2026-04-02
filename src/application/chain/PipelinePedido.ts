// PATRÓN: CHAIN OF RESPONSIBILITY
// Cadena de handlers — cada uno decide si procesa la solicitud o la pasa al siguiente

export interface SolicitudPedido {
  clienteId: string;
  cantidad: number;
  total: number;
  aprobado?: boolean;
}

// Handler base abstracto
export abstract class Handler {
  private siguiente?: Handler;

  setNext(handler: Handler): Handler {
    this.siguiente = handler;
    return handler; // permite encadenar: a.setNext(b).setNext(c)
  }

  protected pasar(solicitud: SolicitudPedido): void {
    if (this.siguiente) {
      this.siguiente.manejar(solicitud);
    } else {
      console.log("  [Chain] Fin de la cadena");
    }
  }

  abstract manejar(solicitud: SolicitudPedido): void;
}

// Handler 1: valida el stock
export class ValidarStockHandler extends Handler {
  manejar(solicitud: SolicitudPedido): void {
    if (solicitud.cantidad > 100) {
      console.log(`  [Chain] ✗ ValidarStock: sin stock suficiente (${solicitud.cantidad})`);
      return; // corta la cadena
    }
    console.log(`  [Chain] ✓ ValidarStock: stock OK`);
    this.pasar(solicitud);
  }
}

// Handler 2: aplica descuento si el total es alto
export class AplicarDescuentoHandler extends Handler {
  manejar(solicitud: SolicitudPedido): void {
    if (solicitud.total > 500) {
      solicitud.total *= 0.9;
      console.log(`  [Chain] ✓ AplicarDescuento: 10% aplicado, nuevo total: ${solicitud.total}`);
    } else {
      console.log(`  [Chain] ✓ AplicarDescuento: total bajo el umbral, sin descuento`);
    }
    this.pasar(solicitud);
  }
}

// Handler 3: notifica al cliente
export class NotificarClienteHandler extends Handler {
  manejar(solicitud: SolicitudPedido): void {
    solicitud.aprobado = true;
    console.log(`  [Chain] ✓ NotificarCliente: email enviado a cliente ${solicitud.clienteId}, total final: ${solicitud.total}`);
    this.pasar(solicitud);
  }
}
