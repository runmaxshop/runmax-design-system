import type { Preview } from '@storybook/react-vite'
import '../dist/styles.css'
import './fonts.css'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
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
