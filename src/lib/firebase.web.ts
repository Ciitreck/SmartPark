import { getAuth } from 'firebase/auth';

import { app } from './firebase-config';

// En web, Firebase guarda la sesión en el navegador por defecto
export { app };
export const auth = getAuth(app);
