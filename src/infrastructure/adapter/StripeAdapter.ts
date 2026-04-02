// PATRÓN: ADAPTER
// Traduce la interfaz de un servicio externo a la interfaz interna de tu app

// --- Interfaz interna (lo que tu app espera) ---
export interface ProcesadorPago {
  cobrar(monto: number, moneda: string): boolean;
  reembolsar(transaccionId: string): boolean;
}

// --- SDK externo de Stripe (interfaz que NO controlás) ---
class StripeSDK {
  chargeInCents(cents: number, currency: string): { success: boolean; chargeId: string } {
    console.log(`  [Adapter→StripeSDK] chargeInCents(${cents}, ${currency})`);
    return { success: true, chargeId: `ch_${Date.now()}` };
  }
  refund(chargeId: string): { refunded: boolean } {
    console.log(`  [Adapter→StripeSDK] refund(${chargeId})`);
    return { refunded: true };
  }
}

// --- Adapter: envuelve el SDK y habla el idioma de tu app ---
export class StripeAdapter implements ProcesadorPago {
  private sdk = new StripeSDK();
  private ultimoChargeId: string = "";

  cobrar(monto: number, moneda: string): boolean {
    // Convierte BOB → centavos y llama al SDK
    const resultado = this.sdk.chargeInCents(monto * 100, moneda);
    this.ultimoChargeId = resultado.chargeId;
    return resultado.success;
  }

  reembolsar(transaccionId: string): boolean {
    const resultado = this.sdk.refund(transaccionId);
    return resultado.refunded;
  }
}
