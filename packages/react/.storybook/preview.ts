import type { Preview } from '@storybook/react-vite'
import '../dist/styles.css'
import './fonts.css'

/**
 * Los cinco anchos de verificación obligatorios del sistema.
 *
 * No son "los tamaños de los dispositivos de moda": son los bordes donde el
 * diseño se rompe. El 320 es el piso real —no hay breakpoint por debajo, así
 * que todo componente tiene que sobrevivir ahí por diseño fluido— y el 1920 es
 * el techo, donde aparecen los problemas contrarios: texto que se estira sin
 * medida y rejillas que dejan huecos.
 *
 * Están aquí para que revisarlos sea un desplegable de la barra de
 * herramientas y no un "después lo miro".
 */
const VIEWPORTS = {
  piso320: { name: '320 · piso real', styles: { width: '320px', height: '900px' }, type: 'mobile' },
  movil375: { name: '375 · móvil', styles: { width: '375px', height: '812px' }, type: 'mobile' },
  tablet768: { name: '768 · tablet (md)', styles: { width: '768px', height: '1024px' }, type: 'tablet' },
  escritorio1280: {
    name: '1280 · escritorio',
    styles: { width: '1280px', height: '900px' },
    type: 'desktop',
  },
  techo1920: { name: '1920 · techo', styles: { width: '1920px', height: '1080px' }, type: 'desktop' },
} as const

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
    viewport: { options: VIEWPORTS },
    a11y: {
      // Los fallos de accesibilidad se muestran, no se silencian.
      test: 'error',
    },
    options: {
      storySort: {
        order: ['Fundamentos', ['Introducción', 'Colores', 'Tipografía', 'Espaciado'], 'Componentes'],
      },
    },
  },
}

export default preview
