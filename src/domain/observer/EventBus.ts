// PATRÓN: OBSERVER
// Publicar y suscribirse a eventos — desacopla quien emite de quien escucha

type Listener<T = any> = (data: T) => void;

export class EventBus {
  private listeners: Record<string, Listener[]> = {};

  suscribir(evento: string, fn: Listener): void {
    if (!this.listeners[evento]) {
      this.listeners[evento] = [];
    }
    this.listeners[evento].push(fn);
    console.log(`  [Observer] suscriptor añadido a "${evento}"`);
  }

  desuscribir(evento: string, fn: Listener): void {
    if (this.listeners[evento]) {
      this.listeners[evento] = this.listeners[evento].filter(l => l !== fn);
    }
  }

  publicar(evento: string, data: any): void {
    console.log(`  [Observer] publicando "${evento}"`);
    const suscriptores = this.listeners[evento] ?? [];
    if (suscriptores.length === 0) {
      console.log(`  [Observer] sin suscriptores para "${evento}"`);
      return;
    }
    suscriptores.forEach(fn => fn(data));
  }
}
