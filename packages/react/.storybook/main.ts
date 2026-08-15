import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    // Audita cada historia contra axe-core en el propio navegador. Es la razón
    // principal de usar Storybook aquí y no una página de demo a mano: los
    // fallos de accesibilidad se ven mientras se diseña, no en una auditoría
    // seis meses después.
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal(config) {
    // Los componentes llevan `'use client'` porque la app anfitriona es Next y
    // los necesita marcados. Rollup avisa de que ignora la directiva al
    // empaquetar Storybook, cosa que aquí da igual: silenciamos ESE aviso en
    // concreto para que no tape avisos que sí importan.
    config.build ??= {}
    config.build.rollupOptions ??= {}
    config.build.rollupOptions.onwarn = (warning, warn) => {
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
      warn(warning)
    }
    return config
  },
  typescript: {
    // Las props de la documentación salen de los tipos y los comentarios del
    // propio componente: si el tipo cambia, la doc cambia. Documentación que no
    // se puede desincronizar del código.
    reactDocgen: 'react-docgen-typescript',
  },
}

export default config
