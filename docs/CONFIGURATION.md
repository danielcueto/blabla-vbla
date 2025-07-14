# Configuración del Proyecto

## Estructura de Configuración

El proyecto utiliza un sistema de configuración centralizada que combina variables de entorno con configuración tipada.

### 1. Variables de Entorno (`.env`)

Las variables de entorno se definen en el archivo `.env` en la raíz del proyecto:

```properties
REACT_NATIVE_API_BASE_URL=https://api.example.com
DEVELOPMENT_ANDROID_API_BASE_URL=http://10.0.2.2:3000
DEVELOPMENT_IOS_API_BASE_URL=http://localhost:3000
NODE_ENV=development
REQUEST_TIMEOUT=10000
CAMERA_SNAPSHOT_TIMEOUT=5000
ASYNC_OP_TIMEOUT=5000
SNAPSHOT_QUALITY=0.8
```

### 2. Configuración Centralizada (`src/config/config.ts`)

Este archivo importa las variables de entorno y las exporta con tipos y validaciones:

```typescript
export const API_BASE_URL: string = 
  NODE_ENV === 'production'
    ? REACT_NATIVE_API_BASE_URL
    : getDefaultDevHost()

export const REQUEST_TIMEOUT_MS = parseInt(REQUEST_TIMEOUT, 10) || 15000
```

## Cómo Usar la Configuración

### ✅ Forma Correcta - Usar configuración centralizada

```typescript
import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '../../config/config';

// Usar las constantes exportadas
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
});
```

### ❌ Forma Incorrecta - Usar react-native-config directamente

```typescript
import Config from 'react-native-config';

// NO HACER ESTO
const api = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: Number(Config.REQUEST_TIMEOUT),
});
```

## Ventajas de la Configuración Centralizada

1. **Tipado**: TypeScript puede verificar que las configuraciones existen
2. **Validación**: Se pueden agregar validaciones en tiempo de compilación
3. **Transformación**: Se pueden convertir strings a números, validar URLs, etc.
4. **Centralización**: Un solo lugar para manejar toda la configuración
5. **Inteligencia**: El editor puede autocompletar y detectar errores

## Formato de Respuesta de la API

Todas las respuestas de la API siguen esta estructura:

```typescript
interface ApiResponse<T> {
  code: number;
  status: string;
  message: string;
  data: T;
}
```

### Ejemplo de respuesta de login:

```json
{
  "code": 200,
  "status": "success", 
  "message": "Login successful",
  "data": {
    "access_token": "token",
    "isFirstLogin": false
  }
}
```

### Cómo manejar las respuestas:

```typescript
const response = await apiService.login(credentials);

// Verificar el estado de la respuesta
if (response.code !== 200 || response.status !== 'success') {
  throw new Error(response.message || 'Request failed');
}

// Acceder a los datos
const { access_token, isFirstLogin } = response.data;
```
