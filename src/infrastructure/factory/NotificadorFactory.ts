// PATRÓN: FACTORY METHOD
// Centraliza la creación de objetos — el cliente no sabe qué clase concreta se instancia

export interface Notificador {
  enviar(mensaje: string): void;
}

export class NotificadorEmail implements Notificador {
  enviar(mensaje: string): void {
    console.log(`  [Factory→Email] 📧 ${mensaje}`);
  }
}

export class NotificadorSMS implements Notificador {
  enviar(mensaje: string): void {
    console.log(`  [Factory→SMS] 📱 ${mensaje}`);
  }
}

export class NotificadorWhatsApp implements Notificador {
  enviar(mensaje: string): void {
    console.log(`  [Factory→WhatsApp] 💬 ${mensaje}`);
  }
}

export type TipoNotificador = "email" | "sms" | "whatsapp";

export class NotificadorFactory {
  static crear(tipo: TipoNotificador): Notificador {
    const mapa: Record<TipoNotificador, () => Notificador> = {
      email:     () => new NotificadorEmail(),
      sms:       () => new NotificadorSMS(),
      whatsapp:  () => new NotificadorWhatsApp(),
    };

    const fn = mapa[tipo];
    if (!fn) throw new Error(`Notificador desconocido: ${tipo}`);
    return fn();
  }
}
