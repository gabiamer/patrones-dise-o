// PATRÓN: STRATEGY
// Intercambia algoritmos en tiempo de ejecución sin cambiar el contexto

export interface EstrategiaDescuento {
  calcular(total: number): number;
  descripcion(): string;
}

export class SinDescuento implements EstrategiaDescuento {
  calcular(total: number): number {
    return total;
  }
  descripcion(): string {
    return "Sin descuento";
  }
}

export class DescuentoPorcentaje implements EstrategiaDescuento {
  constructor(private porcentaje: number) {}

  calcular(total: number): number {
    return total * (1 - this.porcentaje / 100);
  }
  descripcion(): string {
    return `Descuento del ${this.porcentaje}%`;
  }
}

export class DescuentoFijo implements EstrategiaDescuento {
  constructor(private monto: number) {}

  calcular(total: number): number {
    return Math.max(0, total - this.monto);
  }
  descripcion(): string {
    return `Descuento fijo de ${this.monto}`;
  }
}

// Contexto que usa la estrategia
export class Carrito {
  private estrategia: EstrategiaDescuento;

  constructor(estrategia: EstrategiaDescuento = new SinDescuento()) {
    this.estrategia = estrategia;
  }

  setEstrategia(e: EstrategiaDescuento): void {
    this.estrategia = e;
  }

  totalFinal(subtotal: number): number {
    const total = this.estrategia.calcular(subtotal);
    console.log(`  [Strategy] ${this.estrategia.descripcion()} => ${subtotal} -> ${total}`);
    return total;
  }
}
