import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Pagina = 'inicio' | 'restaurantes' | 'ferreterias' | 'bodegas' | 'salones';
type TipoComanda = 'manual' | 'digital';
type ControlStock = 'manual' | 'digital';
type NivelUrgencia = 'controlable' | 'atencion' | 'alto' | 'critico';
type EquipoId = 'android' | 'ios' | 'pc' | 'impresora-red' | 'wifi' | 'router';

interface EquipoOpcion {
  id: EquipoId;
  icono: string;
  etiqueta: string;
  detalle: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  pagina: Pagina = 'inicio';
  menuOpen = false;
  readonly whatsappBase = 'https://wa.me/51991602920';
  readonly precioPlanFull = 2500;
  readonly precioArrendamiento = 100;

  // Restaurante
  platosDia = 100;
  mozos = 4;
  mesas = 15;
  tipoComanda: TipoComanda = 'manual';
  readonly precioPromedio = 20;

  // Ferretería
  ferProductos = 1000;
  ferVentas = 40;
  ferControl: ControlStock = 'manual';

  // Bodega / minimarket
  bodProductos = 800;
  bodVentas = 80;
  bodControl: ControlStock = 'manual';

  // Salón
  salClientes = 180;
  salProfesionales = 3;
  salControl: ControlStock = 'manual';

  readonly equiposOpciones: EquipoOpcion[] = [
    { id: 'android', icono: '📱', etiqueta: 'Celular o tablet Android', detalle: 'Puede reutilizarse como terminal de venta si es compatible.' },
    { id: 'ios', icono: '📲', etiqueta: 'iPhone o iPad', detalle: 'Puede reutilizarse como terminal de venta si es compatible.' },
    { id: 'pc', icono: '💻', etiqueta: 'PC o laptop', detalle: 'Útil para reportes y configuración; no reemplaza el POS móvil.' },
    { id: 'impresora-red', icono: '🧾', etiqueta: 'Impresora Ethernet / red', detalle: 'La opción preferida para cocina o tickets, sujeta a compatibilidad.' },
    { id: 'wifi', icono: '📶', etiqueta: 'Internet con WiFi', detalle: 'Permite sincronización y administración remota.' },
    { id: 'router', icono: '🌐', etiqueta: 'Router / red local', detalle: 'Puede aprovecharse si la red es estable y suficiente.' }
  ];

  equiposSeleccionados = new Set<EquipoId>();

  ngOnInit() {
    this.actualizarPaginaDesdeHash(false);
  }

  @HostListener('window:hashchange')
  onHashChange() {
    this.actualizarPaginaDesdeHash(true);
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu() { this.menuOpen = false; }

  wa(message: string) {
    return `${this.whatsappBase}?text=${encodeURIComponent(message)}`;
  }

  private actualizarPaginaDesdeHash(scroll: boolean) {
    const slug = window.location.hash.replace(/^#\/?/, '').split(/[/?]/)[0].toLowerCase();
    const mapa: Record<string, Pagina> = {
      '': 'inicio',
      inicio: 'inicio',
      restaurantes: 'restaurantes',
      restaurante: 'restaurantes',
      ferreterias: 'ferreterias',
      ferreteria: 'ferreterias',
      bodegas: 'bodegas',
      bodega: 'bodegas',
      minimarket: 'bodegas',
      salones: 'salones',
      salon: 'salones'
    };
    this.pagina = mapa[slug] ?? 'inicio';
    this.menuOpen = false;
    this.actualizarSeo();
    if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private actualizarSeo() {
    const datos: Record<Pagina, { title: string; description: string }> = {
      inicio: {
        title: 'AGNE | Analiza y ordena tu negocio',
        description: 'Elige tu tipo de negocio y obtén un diagnóstico orientativo para restaurantes, ferreterías, bodegas, minimarkets y salones de belleza.'
      },
      restaurantes: {
        title: 'Sistema y diagnóstico para restaurantes | AGNE',
        description: 'Calcula fugas operativas en restaurantes y cevicherías y conoce cómo ordenar pedidos, comandas, ventas y stock simple.'
      },
      ferreterias: {
        title: 'Sistema y diagnóstico para ferreterías | AGNE',
        description: 'Evalúa la complejidad operativa de tu ferretería y ordena ventas, catálogo, códigos de barras y stock básico por producto.'
      },
      bodegas: {
        title: 'Sistema y diagnóstico para bodegas y minimarkets | AGNE',
        description: 'Evalúa ventas, catálogo y control de stock simple para bodegas y minimarkets con una operación más ordenada.'
      },
      salones: {
        title: 'Sistema y diagnóstico para salones de belleza | AGNE',
        description: 'Evalúa la carga operativa de tu salón y organiza clientes, servicios, ventas e historial de atención.'
      }
    };
    const actual = datos[this.pagina];
    document.title = actual.title;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta) meta.content = actual.description;
  }

  clampValue(value: number, min: number, max: number) {
    const safe = Number.isFinite(Number(value)) ? Math.round(Number(value)) : min;
    return Math.min(Math.max(safe, min), max);
  }

  normalizarRestaurante() {
    this.platosDia = this.clampValue(this.platosDia, 10, 2000);
    this.mozos = this.clampValue(this.mozos, 1, 100);
    this.mesas = this.clampValue(this.mesas, 1, 500);
  }

  stepPlatos(delta: number) {
    this.platosDia = this.clampValue(this.platosDia + delta, 10, 2000);
  }

  stepMozos(delta: number) {
    this.mozos = this.clampValue(this.mozos + delta, 1, 100);
  }

  stepMesas(delta: number) {
    this.mesas = this.clampValue(this.mesas + delta, 1, 500);
  }

  get cargaPorMozo() {
    return this.platosDia / Math.max(this.mozos, 1);
  }

  get cargaPorMesa() {
    return this.platosDia / Math.max(this.mesas, 1);
  }

  private get factorMozos() {
    const carga = this.cargaPorMozo;
    if (carga <= 25) return 0.85;
    if (carga <= 40) return 1;
    if (carga <= 60) return 1.15;
    return 1.3;
  }

  private get factorMesas() {
    const carga = this.cargaPorMesa;
    if (carga <= 4) return 0.85;
    if (carga <= 7) return 1;
    if (carga <= 10) return 1.12;
    return 1.25;
  }

  get factorPresion() {
    const combinado = (this.factorMozos * 0.70) + (this.factorMesas * 0.30);
    return Math.min(1.30, Math.max(0.85, combinado));
  }

  private calcularPerdidaMensual(tipo: TipoComanda) {
    const tasas = tipo === 'manual'
      ? { pedidos: 0.008, cobros: 0.005, demoras: 0.010 }
      : { pedidos: 0.003, cobros: 0.002, demoras: 0.004 };
    const perdidaPorPlato =
      (tasas.pedidos * this.precioPromedio * 0.60) +
      (tasas.cobros * this.precioPromedio * 0.25) +
      (tasas.demoras * this.precioPromedio);
    return this.platosDia * 30 * this.factorPresion * perdidaPorPlato;
  }

  get perdidaMensual() {
    this.normalizarRestaurante();
    return Math.round(this.calcularPerdidaMensual(this.tipoComanda));
  }

  get perdidaAnual() {
    return this.perdidaMensual * 12;
  }

  get potencialRecuperable() {
    if (this.tipoComanda === 'digital') return 0;
    return Math.max(0, Math.round(this.calcularPerdidaMensual('manual') - this.calcularPerdidaMensual('digital')));
  }

  get nivelUrgencia(): NivelUrgencia {
    if (this.perdidaMensual < 300) return 'controlable';
    if (this.perdidaMensual < 600) return 'atencion';
    if (this.perdidaMensual < 1200) return 'alto';
    return 'critico';
  }

  get nivelUrgenciaLabel() {
    switch (this.nivelUrgencia) {
      case 'controlable': return 'CONTROLABLE';
      case 'atencion': return 'ATENCIÓN';
      case 'alto': return 'ALTO';
      default: return 'CRÍTICO';
    }
  }

  get nivelUrgenciaEmoji() {
    switch (this.nivelUrgencia) {
      case 'controlable': return '🙂';
      case 'atencion': return '😕';
      case 'alto': return '😟';
      default: return '😣';
    }
  }

  get mensajeUrgencia() {
    switch (this.nivelUrgencia) {
      case 'controlable': return 'La fuga estimada todavía es contenida, pero conviene corregirla antes de que empiece a crecer mes a mes.';
      case 'atencion': return 'La fuga mensual ya merece atención. Corregirla ahora evita que se convierta en una pérdida mucho más costosa.';
      case 'alto': return 'La fuga estimada ya representa una cantidad importante cada mes. Seguir postergando la corrección hace que el dinero perdido se siga acumulando.';
      default: return 'La fuga estimada ya está en un nivel crítico. Cada semana que pasa puede seguir acumulando dinero que el negocio ya generó.';
    }
  }

  get urgencyPosition() {
    switch (this.nivelUrgencia) {
      case 'controlable': return '12.5%';
      case 'atencion': return '37.5%';
      case 'alto': return '62.5%';
      default: return '87.5%';
    }
  }

  toggleEquipo(id: EquipoId, checked: boolean) {
    if (checked) this.equiposSeleccionados.add(id);
    else this.equiposSeleccionados.delete(id);
  }

  equipoSeleccionado(id: EquipoId) {
    return this.equiposSeleccionados.has(id);
  }

  get equiposSeleccionadosTexto() {
    const seleccionados = this.equiposOpciones.filter(e => this.equiposSeleccionados.has(e.id));
    return seleccionados.length ? seleccionados.map(e => `• ${e.etiqueta}`).join('\n') : '• No indicó equipos todavía';
  }

  get whatsappRestaurante() {
    const comanda = this.tipoComanda === 'manual' ? 'Manual / papel' : 'Sistema digital';
    return this.wa(`Hola AGNE, hice el diagnóstico para mi restaurante/cevichería.\n\n📊 OPERACIÓN\n• Platos por día: ${this.platosDia}\n• Mozos por turno: ${this.mozos}\n• Mesas: ${this.mesas}\n• Comandas: ${comanda}\n\n📉 ESTIMACIÓN\n• Pérdida estimada: S/ ${this.perdidaMensual} al mes\n• Nivel: ${this.nivelUrgenciaLabel}\n\n🧰 EQUIPOS QUE YA TENGO\n${this.equiposSeleccionadosTexto}\n\nQuiero analizar mi operación y saber qué necesito implementar.`);
  }

  private scoreCatalogo(productos: number, ventas: number, control: ControlStock) {
    let score = productos > 3000 ? 3 : productos > 1000 ? 2 : productos > 300 ? 1 : 0;
    score += ventas > 150 ? 3 : ventas > 60 ? 2 : ventas > 20 ? 1 : 0;
    if (control === 'manual') score += 2;
    return score;
  }

  private nivelComplejidad(score: number) {
    if (score <= 2) return 'CONTROLABLE';
    if (score <= 4) return 'ATENCIÓN';
    if (score <= 6) return 'ALTA';
    return 'CRÍTICA';
  }

  private copyComplejidad(score: number, rubro: string) {
    if (score <= 2) return `La operación de tu ${rubro} todavía puede manejarse con relativa facilidad, pero conviene ordenar la información antes de crecer.`;
    if (score <= 4) return `Ya hay suficiente movimiento como para que depender de memoria, papel o archivos separados empiece a generar puntos ciegos.`;
    if (score <= 6) return `El volumen de productos y ventas ya hace difícil mantener control consistente sin una operación digital organizada.`;
    return `La complejidad es crítica: catálogo, movimiento diario y control manual pueden hacer que saber qué se vendió y qué queda sea cada vez más difícil.`;
  }

  normalizarFerreteria() {
    this.ferProductos = this.clampValue(this.ferProductos, 10, 50000);
    this.ferVentas = this.clampValue(this.ferVentas, 1, 5000);
  }

  get ferScore() {
    this.normalizarFerreteria();
    return this.scoreCatalogo(this.ferProductos, this.ferVentas, this.ferControl);
  }

  get ferNivel() { return this.nivelComplejidad(this.ferScore); }
  get ferMensaje() { return this.copyComplejidad(this.ferScore, 'ferretería'); }
  get whatsappFerreteria() {
    return this.wa(`Hola AGNE, hice el diagnóstico para mi ferretería.\n\n• Productos diferentes: ${this.ferProductos}\n• Ventas/tickets por día: ${this.ferVentas}\n• Control actual: ${this.ferControl === 'manual' ? 'Manual / memoria / Excel' : 'Sistema digital'}\n• Complejidad estimada: ${this.ferNivel}\n\nQuiero ordenar ventas, catálogo, códigos de barras y stock básico por producto.`);
  }

  normalizarBodega() {
    this.bodProductos = this.clampValue(this.bodProductos, 10, 30000);
    this.bodVentas = this.clampValue(this.bodVentas, 1, 5000);
  }

  get bodScore() {
    this.normalizarBodega();
    return this.scoreCatalogo(this.bodProductos, this.bodVentas, this.bodControl);
  }

  get bodNivel() { return this.nivelComplejidad(this.bodScore); }
  get bodMensaje() { return this.copyComplejidad(this.bodScore, 'bodega o minimarket'); }
  get whatsappBodega() {
    return this.wa(`Hola AGNE, hice el diagnóstico para mi bodega/minimarket.\n\n• Productos diferentes: ${this.bodProductos}\n• Ventas/tickets por día: ${this.bodVentas}\n• Control actual: ${this.bodControl === 'manual' ? 'Manual / memoria / Excel' : 'Sistema digital'}\n• Complejidad estimada: ${this.bodNivel}\n\nQuiero ordenar ventas y stock simple por producto.`);
  }

  normalizarSalon() {
    this.salClientes = this.clampValue(this.salClientes, 1, 10000);
    this.salProfesionales = this.clampValue(this.salProfesionales, 1, 100);
  }

  get salScore() {
    this.normalizarSalon();
    let score = this.salClientes > 600 ? 3 : this.salClientes > 250 ? 2 : this.salClientes > 100 ? 1 : 0;
    score += this.salProfesionales > 10 ? 2 : this.salProfesionales > 4 ? 1 : 0;
    if (this.salControl === 'manual') score += 2;
    return score;
  }

  get salNivel() { return this.nivelComplejidad(this.salScore); }
  get salMensaje() {
    if (this.salScore <= 2) return 'Tu salón todavía puede organizarse con relativa facilidad. Es un buen momento para construir historial antes de que crezca la operación.';
    if (this.salScore <= 4) return 'Ya hay suficientes clientes y atenciones como para que recordar preferencias, visitas y servicios empiece a ser poco confiable.';
    if (this.salScore <= 6) return 'La operación ya necesita una base ordenada de clientes, servicios y ventas para no depender de memoria o mensajes dispersos.';
    return 'La complejidad es crítica: varios profesionales, muchos clientes y control manual vuelven difícil mantener continuidad y seguimiento.';
  }

  get whatsappSalon() {
    return this.wa(`Hola AGNE, hice el diagnóstico para mi salón de belleza.\n\n• Clientes/atenciones al mes: ${this.salClientes}\n• Profesionales: ${this.salProfesionales}\n• Historial actual: ${this.salControl === 'manual' ? 'Manual / WhatsApp / memoria' : 'Sistema digital'}\n• Complejidad estimada: ${this.salNivel}\n\nQuiero organizar clientes, servicios y ventas.`);
  }
}