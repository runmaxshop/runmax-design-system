'use client'

/**
 * Navbar — T (transformacional).
 *
 * Es el primer componente T de la librería, y lo es porque cambia QUÉ se
 * renderiza, no cuánto mide: por encima de `md` es una barra horizontal con
 * mega menús que caen desde ella; por debajo, un cajón que se despliega desde
 * la hamburguesa y donde cada mega menú se pliega en acordeón.
 *
 * El mega menú abre al pasar el ratón y también al hacer clic. Las dos cosas,
 * no una: el hover es lo que espera quien viene con ratón, y el clic es lo
 * único que existe en táctil y con teclado.
 *
 * El DOM es EL MISMO en los dos casos —una sola lista, un solo panel por
 * ítem—, tal y como exige la regla de los componentes T. Duplicar la
 * navegación en dos árboles (`hidden md:block` junto a `md:hidden`) haría que
 * un lector de pantalla anunciara los enlaces dos veces, duplicaría el mapa
 * del sitio para el buscador y garantizaría que un día las dos copias dejen de
 * coincidir. Aquí solo cambia el CSS.
 */

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  // Con alias: sin él, el tipo de React tapa al `PointerEvent` del DOM que
  // usa el listener nativo de más abajo y `addEventListener` deja de compilar.
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { cn } from '../../lib/cn'
import { VisuallyHidden } from '../Text/Text'

export interface NavbarLink {
  label: string
  href: string
}

export interface NavbarColumn {
  /**
   * NO se renderiza como `<h2>`/`<h3>`. Un navbar aparece en todas las páginas
   * del sitio, y meter cuatro encabezados de sección en cada una destroza el
   * esquema del documento: alguien que navegue saltando de encabezado en
   * encabezado se choca con «Ropa, Calzado, Accesorios» antes de llegar al
   * contenido. Va como `<p>` y da nombre a su lista con `aria-labelledby`, que
   * es lo que hace falta para que el grupo se anuncie.
   */
  heading: string
  links: readonly NavbarLink[]
  /** El «Ver todo» del final de la columna. Si no va, la columna termina en el último enlace. */
  viewAll?: NavbarLink
}

export interface NavbarItem {
  label: string
  /**
   * Solo para los ítems sin mega menú. Un ítem con `columns` es un botón que
   * abre un panel, no un enlace: si fuera las dos cosas, un clic tendría dos
   * significados y con teclado no habría forma de elegir cuál.
   */
  href?: string
  /**
   * Las columnas del mega menú. El número de columnas NO es una prop: sale de
   * `columns.length`, así que las variantes de 3 y de 4 de Figma son el mismo
   * código.
   */
  columns?: readonly NavbarColumn[]
  /**
   * La pieza gráfica de la derecha del panel. Va como slot y no como `src`
   * porque quien la pone es quien sabe su tamaño, su `alt` y si es un `<img>`,
   * un `next/image` o una card entera. En móvil se oculta: dentro del cajón
   * empujaría los enlaces fuera de la pantalla.
   */
  promo?: ReactNode
}

export interface NavbarLinkRenderProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
}

export interface NavbarProps {
  items: readonly NavbarItem[]
  /**
   * El wordmark. Slot y no un `<img>` fijo: la librería no empaqueta assets de
   * marca, igual que no empaqueta iconos.
   */
  brand?: ReactNode
  brandHref?: string
  /** Nombre accesible del enlace del logo. Una imagen de marca sin nombre se anuncia como «enlace». */
  brandLabel?: string
  /**
   * Los iconos de la derecha —cuenta, carrito—. Van compuestos por la
   * aplicación con `IconButton`, porque saben cuántos productos hay en el
   * carrito y eso es negocio, no diseño.
   */
  actions?: ReactNode
  /**
   * La ruta actual. Marca el ítem correspondiente con `aria-current="page"`.
   * OJO: no es lo mismo que el ítem abierto. El subrayado dice «este menú está
   * desplegado» y desaparece al cerrarlo; `currentHref` dice «estás en esta
   * sección» y no se mueve.
   */
  currentHref?: string
  /** Nombre accesible del `<nav>`. Si hay más de un `<nav>` en la página, cada uno necesita el suyo. */
  label?: string
  /** Nombre accesible del botón hamburguesa. */
  menuLabel?: string
  /**
   * Escotilla para el enrutador de la aplicación. Por defecto son `<a>`; en
   * Next se pasa `({ href, ...rest }) => <Link href={href} {...rest} />` y los
   * enlaces del menú dejan de recargar la página. La librería no importa
   * `next/link` porque no sabe —ni debe saber— en qué framework vive.
   */
  renderLink?: (props: NavbarLinkRenderProps) => ReactNode
  className?: string
}

function defaultRenderLink({ href, ...rest }: NavbarLinkRenderProps) {
  return <a href={href} {...rest} />
}

export function Navbar({
  items,
  brand,
  brandHref = '/',
  brandLabel = 'Inicio',
  actions,
  currentHref,
  label = 'Navegación principal',
  menuLabel = 'Menú',
  renderLink = defaultRenderLink,
  className,
}: NavbarProps) {
  const baseId = useId()
  const navId = `${baseId}-nav`
  const rootRef = useRef<HTMLElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const focusDrawerOnOpen = useRef(false)

  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const closeAll = useCallback(() => {
    setOpenIndex(null)
    setDrawerOpen(false)
  }, [])

  // Cerrar con Escape, con un clic fuera y al llevarse el foco fuera de la
  // barra. Los tres son la misma promesa: que el menú no se quede abierto
  // tapando la página. El listener solo existe mientras hay algo abierto.
  useEffect(() => {
    if (openIndex === null && !drawerOpen) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      // Escape cierra de dentro hacia fuera —primero el panel, luego el
      // cajón— y devuelve el foco a lo que abrió cada cosa. Sin eso, quien
      // navega con teclado cierra el menú y el foco se queda flotando al
      // principio del documento.
      if (openIndex !== null) {
        const trigger = document.getElementById(`${baseId}-t${openIndex}`)
        setOpenIndex(null)
        trigger?.focus()
      } else {
        setDrawerOpen(false)
        toggleRef.current?.focus()
      }
    }

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) closeAll()
    }

    function onFocusIn(event: FocusEvent) {
      if (!rootRef.current?.contains(event.target as Node)) closeAll()
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('focusin', onFocusIn)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('focusin', onFocusIn)
    }
  }, [openIndex, drawerOpen, baseId, closeAll])

  // El cajón se abre DEBAJO de la barra pero está antes que la hamburguesa en
  // el DOM, así que tabular desde el botón se lo saltaría. Mover el foco
  // dentro al abrirlo es lo que hace que el orden de tabulación coincida con
  // lo que se ve. Solo pasa en móvil: en escritorio el botón no existe.
  useEffect(() => {
    if (!drawerOpen || !focusDrawerOnOpen.current) return
    focusDrawerOnOpen.current = false
    navRef.current?.querySelector<HTMLElement>('a, button')?.focus()
  }, [drawerOpen])

  // El mega menú abre al pasar el ratón por encima, como en Figma. Se filtra
  // por `pointerType` y no por una media query de ancho: lo que decide no es
  // el tamaño de la pantalla sino si hay un puntero de verdad. En táctil el
  // navegador emula un `pointerenter` justo antes del `click`, y sin este
  // filtro el primer toque abriría el panel y el clic lo cerraría acto
  // seguido.
  function handleItemPointerEnter(event: ReactPointerEvent<HTMLLIElement>, index: number, hasMenu: boolean) {
    if (event.pointerType !== 'mouse') return
    // Pasar por encima de un ítem sin menú cierra el que hubiera abierto: si
    // no, el panel de «Deportes» se quedaría colgando mientras el ratón está
    // sobre «Nosotros».
    setOpenIndex(hasMenu ? index : null)
  }

  // Cierra al salir de la barra ENTERA, no del ítem. El panel cuelga del
  // `<li>` y arranca justo donde acaba la barra, así que bajar el ratón hacia
  // los enlaces nunca lo atraviesa: no hace falta ningún retardo.
  function handleRootPointerLeave(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType !== 'mouse') return
    // Si alguien está dentro del panel con el teclado, el ratón no tiene
    // ninguna autoridad para cerrárselo: el foco se quedaría en un nodo que
    // acaba de desaparecer.
    if (rootRef.current?.contains(document.activeElement)) return
    setOpenIndex(null)
  }

  function toggleDrawer() {
    if (drawerOpen) {
      closeAll()
      return
    }
    focusDrawerOnOpen.current = true
    setDrawerOpen(true)
  }

  return (
    <header
      ref={rootRef}
      className={cn('rmx-navbar', className)}
      // La barra pasa de `bg-page` a `bg-surface` cuando hay algo abierto: es
      // lo que funde la barra con el panel blanco que le cae debajo.
      data-open={openIndex !== null || drawerOpen || undefined}
      // El cajón es un estado aparte del panel abierto: si no lo fuera, pasar
      // de escritorio a móvil con un mega menú desplegado escondería la
      // navegación entera.
      data-drawer={drawerOpen || undefined}
      onPointerLeave={handleRootPointerLeave}
    >
      <div className="rmx-navbar__bar">
        {brand &&
          renderLink({
            href: brandHref,
            className: 'rmx-navbar__brand',
            'aria-label': brandLabel,
            children: brand,
          })}

        <nav ref={navRef} id={navId} className="rmx-navbar__nav" aria-label={label}>
          <ul className="rmx-navbar__items">
            {items.map((item, index) => {
              const hasMenu = Boolean(item.columns?.length)
              const isOpen = openIndex === index
              const triggerId = `${baseId}-t${index}`
              const panelId = `${baseId}-p${index}`
              const headingId = `${baseId}-h${index}`
              const isCurrent = currentHref !== undefined && item.href === currentHref

              return (
                <li
                  className="rmx-navbar__item"
                  key={item.label}
                  data-open={isOpen || undefined}
                  onPointerEnter={(event) => handleItemPointerEnter(event, index, hasMenu)}
                >
                  {hasMenu ? (
                    <button
                      type="button"
                      id={triggerId}
                      className="rmx-navbar__trigger"
                      // El estado va en el atributo, no en una clase: es lo
                      // que anuncia un lector de pantalla y lo que usa el CSS
                      // para dibujar el subrayado, en ese orden.
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      aria-current={isCurrent ? 'page' : undefined}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                    >
                      {item.label}
                      <span className="rmx-navbar__chevron" aria-hidden="true" />
                    </button>
                  ) : (
                    renderLink({
                      href: item.href ?? '#',
                      id: triggerId,
                      className: 'rmx-navbar__trigger',
                      'aria-current': isCurrent ? 'page' : undefined,
                      onClick: closeAll,
                      children: item.label,
                    })
                  )}

                  {hasMenu && (
                    <div
                      className="rmx-navbar__panel"
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      // `hidden` y no una clase: saca el panel del orden de
                      // tabulación y del árbol de accesibilidad de verdad. Un
                      // panel escondido con `opacity: 0` sigue siendo
                      // tabulable, y ese es el fallo clásico del mega menú.
                      hidden={!isOpen}
                    >
                      <div className="rmx-navbar__panel-inner">
                        <div className="rmx-navbar__columns">
                          {item.columns?.map((column, columnIndex) => {
                            const columnHeadingId = `${headingId}-${columnIndex}`
                            return (
                              <div className="rmx-navbar__column" key={column.heading}>
                                <p className="rmx-navbar__column-heading" id={columnHeadingId}>
                                  {column.heading}
                                </p>
                                <ul className="rmx-navbar__links" aria-labelledby={columnHeadingId}>
                                  {column.links.map((link) => (
                                    <li key={link.href}>
                                      {renderLink({
                                        href: link.href,
                                        className: 'rmx-navbar__link',
                                        'aria-current': link.href === currentHref ? 'page' : undefined,
                                        // Con un enrutador de cliente la página
                                        // cambia sin desmontar el navbar, así
                                        // que sin esto el menú se quedaría
                                        // abierto sobre la página nueva.
                                        onClick: closeAll,
                                        children: link.label,
                                      })}
                                    </li>
                                  ))}
                                </ul>
                                {column.viewAll &&
                                  renderLink({
                                    href: column.viewAll.href,
                                    className: 'rmx-navbar__view-all',
                                    onClick: closeAll,
                                    children: column.viewAll.label,
                                  })}
                              </div>
                            )
                          })}
                        </div>
                        {item.promo && <div className="rmx-navbar__promo">{item.promo}</div>}
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {actions && <div className="rmx-navbar__actions">{actions}</div>}

        <button
          ref={toggleRef}
          type="button"
          className="rmx-navbar__toggle"
          aria-expanded={drawerOpen}
          aria-controls={navId}
          onClick={toggleDrawer}
        >
          <span className="rmx-navbar__burger" aria-hidden="true" />
          <VisuallyHidden>{menuLabel}</VisuallyHidden>
        </button>
      </div>
    </header>
  )
}
