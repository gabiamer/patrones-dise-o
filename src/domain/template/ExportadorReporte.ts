// PATRÓN: TEMPLATE METHOD
// Define el esqueleto de un algoritmo; las subclases completan los pasos

export interface ProductoData {
  id: number;
  nombre: string;
  precio: number;
}

// Clase abstracta con el esqueleto fijo
export abstract class ExportadorReporte {

  // El template method — NO se sobreescribe
  exportar(datos: ProductoData[]): string {
    const cabecera = this.generarCabecera();
    const cuerpo   = this.generarCuerpo(datos);
    const pie      = this.generarPie(datos);
    return [cabecera, cuerpo, pie].filter(Boolean).join("\n");
  }

  // Pasos abstractos — las subclases los implementan
  protected abstract generarCabecera(): string;
  protected abstract generarCuerpo(datos: ProductoData[]): string;
  protected abstract generarPie(datos: ProductoData[]): string;
}

// Subclase CSV
export class ExportadorCSV extends ExportadorReporte {
  protected generarCabecera(): string {
    return "id,nombre,precio";
  }
  protected generarCuerpo(datos: ProductoData[]): string {
    return datos.map(d => `${d.id},${d.nombre},${d.precio}`).join("\n");
  }
  protected generarPie(datos: ProductoData[]): string {
    return `# Total: ${datos.length} registros`;
  }
}

// Subclase HTML
export class ExportadorHTML extends ExportadorReporte {
  protected generarCabecera(): string {
    return "<table>\n  <tr><th>ID</th><th>Nombre</th><th>Precio</th></tr>";
  }
  protected generarCuerpo(datos: ProductoData[]): string {
    return datos
      .map(d => `  <tr><td>${d.id}</td><td>${d.nombre}</td><td>${d.precio}</td></tr>`)
      .join("\n");
  }
  protected generarPie(datos: ProductoData[]): string {
    return `  <tfoot><tr><td colspan="3">Total: ${datos.length} productos</td></tr></tfoot>\n</table>`;
  }
}
