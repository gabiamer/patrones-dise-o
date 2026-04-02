// PATRÓN: SINGLETON
// Garantiza una única instancia en toda la aplicación

export class Database {
  private static instancia: Database;
  private datos: Map<string, any> = new Map();

  // Constructor privado — nadie puede hacer "new Database()"
  private constructor() {
    console.log("  [Singleton] Conexión a base de datos creada (solo ocurre una vez)");
  }

  static getInstance(): Database {
    if (!Database.instancia) {
      Database.instancia = new Database();
    }
    return Database.instancia;
  }

  guardar(id: string, valor: any): void {
    this.datos.set(id, valor);
  }

  buscar(id: string): any {
    return this.datos.get(id) ?? null;
  }

  eliminar(id: string): void {
    this.datos.delete(id);
  }

  listar(): Map<string, any> {
    return this.datos;
  }
}
