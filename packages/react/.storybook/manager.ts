import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'

/**
 * Marca de la propia documentación.
 *
 * Que la herramienta que explica el sistema de diseño se vea genérica manda el
 * mensaje contrario al que queremos: si la marca importa, importa también aquí.
 */
addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Sistema de diseño de RunMax',
    brandUrl: 'https://runmaxshop.com',
    brandTarget: '_blank',

    colorPrimary: '#252324',
    colorSecondary: '#88CC00',

    appBg: '#F2F2EE',
    appContentBg: '#FFFFFF',
    appBorderColor: '#DEDEDE',
    appBorderRadius: 10,

    fontBase: '"Barlow", system-ui, sans-serif',
    fontCode: 'ui-monospace, SFMono-Regular, Menlo, monospace',

    textColor: '#151515',
    textInverseColor: '#FFFFFF',

    barTextColor: '#5C5A54',
    barSelectedColor: '#252324',
    barBg: '#FFFFFF',

    inputBg: '#FFFFFF',
    inputBorder: '#DEDEDE',
    inputTextColor: '#252324',
    inputBorderRadius: 8,
  }),
})
