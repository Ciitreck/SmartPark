import { createContext } from 'react';

/** Lo da un formulario con scroll: se llama cuando un campo recibe el foco, para mostrarlo. */
export const InputFocusContext = createContext<(() => void) | null>(null);
