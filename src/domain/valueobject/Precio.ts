// PATRÓN: VALUE OBJECT
// Inmutable, sin identidad, se compara por valor

export class Precio {
  constructor(
    private readonly monto: number,
    private readonly moneda: string
  ) {
    if (monto < 0) throw new Error("El precio no puede ser negativo");
  }

  sumar(otro: Precio): Precio {
    if (this.moneda !== otro.moneda)
      throw new Error("No se pueden sumar precios de distinta moneda");
    return new Precio(this.monto + otro.monto, this.moneda);
  }

  esMayorQue(otro: Precio): boolean {
    return this.monto > otro.monto;
  }

  igual(otro: Precio): boolean {
    return this.monto === otro.monto && this.moneda === otro.moneda;
  }

  getMonto(): number {
    return this.monto;
  }

  toString(): string {
    return `${this.monto} ${this.moneda}`;
  }
}
