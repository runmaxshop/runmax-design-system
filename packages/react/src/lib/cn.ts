/**
 * Une nombres de clase ignorando lo que no sea una cadena con contenido.
 *
 * Va a mano en vez de traer `clsx` porque es lo único que necesitamos de esa
 * dependencia, y una librería de diseño con cero dependencias de runtime es una
 * librería que no le impone nada a quien la instale.
 *
 * Acepta `unknown` a propósito: el patrón `condicion && 'clase'` produce el
 * valor original de la condición cuando es falsa —`0`, `''`, `NaN`—, no `false`.
 * Filtrar por tipo en vez de por veracidad evita que un `0` acabe impreso como
 * nombre de clase.
 */
export function cn(...parts: unknown[]): string {
  return parts.filter((part): part is string => typeof part === 'string' && part !== '').join(' ')
}
