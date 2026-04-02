// PATRÓN: BUILDER
// Construye objetos complejos paso a paso con una API fluida

import { Precio } from "../valueobject/Precio";

export class Pedido {
  constructor(
    public readonly cliente: string,
    public readonly productos: string[],
    public readonly total: Precio,
    public readonly envioExpress: boolean,
    public readonly notas: string
  ) {}

  toString(): string {
    return `Pedido[cliente=${this.cliente}, productos=${this.productos.join(", ")}, total=${this.total}, express=${this.envioExpress}]`;
  }
}

export class PedidoBuilder {
  private cliente: string = "";
  private productos: string[] = [];
  private total: Precio = new Precio(0, "BOB");
  private envioExpress: boolean = false;
  private notas: string = "";

  setCliente(nombre: string): this {
    this.cliente = nombre;
    return this;
  }

  agregarProducto(producto: string): this {
    this.productos.push(producto);
    return this;
  }

  setTotal(precio: Precio): this {
    this.total = precio;
    return this;
  }

  conEnvioExpress(): this {
    this.envioExpress = true;
    return this;
  }

  setNotas(notas: string): this {
    this.notas = notas;
    return this;
  }

  build(): Pedido {
    if (!this.cliente) throw new Error("El pedido debe tener un cliente");
    if (this.productos.length === 0) throw new Error("El pedido debe tener al menos un producto");
    return new Pedido(this.cliente, this.productos, this.total, this.envioExpress, this.notas);
  }
}
