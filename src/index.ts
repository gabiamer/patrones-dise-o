// =====================================================
//  PUNTO DE ENTRADA — Los 15 patrones en acción
// =====================================================

// --- Infraestructura ---
import { Database } from "./infrastructure/singleton/Database";
import { NotificadorFactory } from "./infrastructure/factory/NotificadorFactory";
import { PedidoRepositorySQL } from "./infrastructure/repository/PedidoRepository";
import { StripeAdapter } from "./infrastructure/adapter/StripeAdapter";
import { PedidoRepositoryProxy } from "./infrastructure/proxy/PedidoRepositoryProxy";
import { LoggingDecorator } from "./infrastructure/decorator/LoggingDecorator";

// --- Dominio ---
import { Precio } from "./domain/valueobject/Precio";
import { PedidoBuilder } from "./domain/builder/PedidoBuilder";
import { EventBus } from "./domain/observer/EventBus";
import { Carrito, DescuentoPorcentaje, DescuentoFijo } from "./domain/strategy/Carrito";
import { PedidoConEstado } from "./domain/state/PedidoEstado";
import { ExportadorCSV, ExportadorHTML } from "./domain/template/ExportadorReporte";

// --- Aplicación ---
import { CrearPedidoCommand, Historial } from "./application/command/CrearPedidoCommand";
import { ValidarStockHandler, AplicarDescuentoHandler, NotificarClienteHandler } from "./application/chain/PipelinePedido";
import { TiendaFacade } from "./application/facade/TiendaFacade";

const sep = (titulo: string) =>
  console.log(`\n${"─".repeat(50)}\n 📌 ${titulo}\n${"─".repeat(50)}`);


// ==========================================
// 1. SINGLETON
// ==========================================
sep("1. SINGLETON");
const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log("  ¿Misma instancia?", db1 === db2); // true


// ==========================================
// 2. FACTORY METHOD
// ==========================================
sep("2. FACTORY METHOD");
const notifEmail    = NotificadorFactory.crear("email");
const notifWhatsapp = NotificadorFactory.crear("whatsapp");
notifEmail.enviar("Hola desde Factory");
notifWhatsapp.enviar("Hola desde Factory");


// ==========================================
// 3. BUILDER
// ==========================================
sep("3. BUILDER");
const pedido = new PedidoBuilder()
  .setCliente("Ana Gabriel")
  .agregarProducto("Laptop")
  .agregarProducto("Mouse")
  .setTotal(new Precio(1500, "BOB"))
  .conEnvioExpress()
  .setNotas("Entregar en horario de mañana")
  .build();
console.log("  Pedido construido:", pedido.toString());


// ==========================================
// 4. VALUE OBJECT
// ==========================================
sep("4. VALUE OBJECT");
const p1 = new Precio(100, "BOB");
const p2 = new Precio(50, "BOB");
const p3 = p1.sumar(p2);
console.log(`  ${p1} + ${p2} = ${p3}`);
console.log("  ¿p1 igual a p2?", p1.igual(p2));
console.log("  ¿p1 mayor que p2?", p1.esMayorQue(p2));


// ==========================================
// 5. REPOSITORY + 6. PROXY + 7. DECORATOR
// ==========================================
sep("5. REPOSITORY  |  6. PROXY  |  7. DECORATOR");

// Capas apiladas: SQL real → caché (Proxy) → logs (Decorator)
const repoSQL    = new PedidoRepositorySQL(Database.getInstance());
const repoProxy  = new PedidoRepositoryProxy(repoSQL);    // Proxy
const repo       = new LoggingDecorator(repoProxy);        // Decorator

const idGuardado = repo.guardar(pedido);
console.log("  ID asignado:", idGuardado);

const encontrado1 = repo.buscarPorId(idGuardado); // MISS → va a DB
const encontrado2 = repo.buscarPorId(idGuardado); // HIT  → desde caché


// ==========================================
// 8. ADAPTER
// ==========================================
sep("8. ADAPTER");
const stripe = new StripeAdapter();
const resultado = stripe.cobrar(1500, "BOB");
console.log("  Pago exitoso:", resultado);


// ==========================================
// 9. OBSERVER
// ==========================================
sep("9. OBSERVER");
const bus = new EventBus();
bus.suscribir("pedido.creado", (d) => notifEmail.enviar(`Confirmación para ${d.clienteId}`));
bus.suscribir("pedido.creado", (d) => console.log(`  [Observer] Stock descontado para pedido ${d.id}`));
bus.publicar("pedido.creado", { clienteId: "Ana", id: idGuardado });


// ==========================================
// 10. STRATEGY
// ==========================================
sep("10. STRATEGY");
const carrito = new Carrito();
carrito.totalFinal(200);                                  // sin descuento: 200

carrito.setEstrategia(new DescuentoPorcentaje(20));
carrito.totalFinal(200);                                  // 20% off: 160

carrito.setEstrategia(new DescuentoFijo(30));
carrito.totalFinal(200);                                  // fijo -30: 170


// ==========================================
// 11. STATE
// ==========================================
sep("11. STATE");
const pedidoEstado = new PedidoConEstado();
pedidoEstado.estado.enviar();   // error: no pagado
pedidoEstado.estado.pagar();    // ok
pedidoEstado.estado.pagar();    // ya pagado
pedidoEstado.estado.enviar();   // ok
pedidoEstado.estado.cancelar(); // no cancelable


// ==========================================
// 12. TEMPLATE METHOD
// ==========================================
sep("12. TEMPLATE METHOD");
const datos = [
  { id: 1, nombre: "Laptop", precio: 1500 },
  { id: 2, nombre: "Mouse",  precio: 80   },
];

const csv  = new ExportadorCSV();
const html = new ExportadorHTML();
console.log("  CSV:\n", csv.exportar(datos));
console.log("  HTML:\n", html.exportar(datos));


// ==========================================
// 13. COMMAND (con undo)
// ==========================================
sep("13. COMMAND");
const historial = new Historial();
const cmd = new CrearPedidoCommand(repo, pedido);
historial.ejecutar(cmd);
historial.deshacer(); // deshace la creación
historial.deshacer(); // nada que deshacer


// ==========================================
// 14. CHAIN OF RESPONSIBILITY
// ==========================================
sep("14. CHAIN OF RESPONSIBILITY");
const validar   = new ValidarStockHandler();
const descontar = new AplicarDescuentoHandler();
const notificar = new NotificarClienteHandler();
validar.setNext(descontar).setNext(notificar);

console.log("  Solicitud normal (5 unidades, total 600):");
validar.manejar({ clienteId: "Ana", cantidad: 5, total: 600 });

console.log("\n  Solicitud bloqueada (200 unidades):");
validar.manejar({ clienteId: "Bob", cantidad: 200, total: 100 });


// ==========================================
// 15. FACADE
// ==========================================
sep("15. FACADE");
const tienda = new TiendaFacade(repo, stripe, notifWhatsapp, bus);
tienda.realizarCompra("cliente-99", ["Laptop", "Teclado"], 2000);

console.log("\n✅ Los 15 patrones ejecutados correctamente\n");
