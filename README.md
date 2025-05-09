# Alexandria - API de Biblioteca

Esta es una API RESTful para un sistema de gestión de biblioteca, construida con Node.js, Express, TypeScript y MongoDB.

## Características

- Autenticación y autorización basada en JWT
- CRUD completo para libros
- Roles de usuario (usuario normal y administrador)
- Soft delete para usuarios y libros
- Documentación de API
- Construida con TypeScript para un mejor desarrollo y mantenimiento

## Tecnologías utilizadas

- Node.js
- Express
- TypeScript
- MongoDB con Mongoose
- JWT para autenticación
- bcrypt para encriptación de contraseñas

## Requisitos previos

- Node.js (v14+)
- MongoDB (local o en la nube)
- npm o yarn

## Instalación

1. Clonar el repositorio:
   ```
   git clone https://github.com/your-username/alexandria.git
   cd alexandria
   ```

2. Instalar dependencias:
   ```
   npm install
   ```

3. Crear un archivo `.env` en la raíz del proyecto:
   ```
   PORT=8080
   NODE_ENV=development
   MONGO_URI=tu_uri_de_mongodb
   JWT_SECRET=tu_jwt_secret
   ```

4. Compilar el proyecto:
   ```
   npm run build
   ```

5. Iniciar el servidor:
   ```
   npm start
   ```

Para desarrollo, puedes usar:
```
npm run dev
```

## Pruebas de la API

Puedes probar los endpoints de la API utilizando herramientas como Postman, cURL o cualquier otro cliente HTTP.

### Ejemplos con cURL

#### Autenticación

1. **Registrar un usuario normal** (el rol 'user' se asigna por defecto si no se especifica):
   ```bash
   curl -X POST http://localhost:8000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Usuario Normal",
       "email": "usuario@ejemplo.com",
       "password": "123456"
     }'
   ```

2. **Registrar un usuario especificando el rol** (puede ser 'user' o 'admin'):
   ```bash
   curl -X POST http://localhost:8000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Usuario Admin",
       "email": "admin@ejemplo.com",
       "password": "123456",
       "role": "admin"
     }'
   ```

3. **Iniciar sesión** (obtener token JWT):
   ```bash
   curl -X POST http://localhost:8000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "usuario@ejemplo.com",
       "password": "123456"
     }'
   ```

4. **Ver perfil** (requiere token de autenticación):
   ```bash
   curl -X GET http://localhost:8000/api/auth/profile \
     -H "Authorization: Bearer TU_TOKEN_JWT"
   ```

5. **Desactivar usuario** (soft delete - solo el propio usuario o un administrador puede hacerlo):
   ```bash
   curl -X DELETE http://localhost:8000/api/auth/ID_USUARIO \
     -H "Authorization: Bearer TU_TOKEN_JWT"
   ```

#### Libros

1. **Obtener todos los libros** (solo se muestran libros activos):
   ```bash
   curl -X GET http://localhost:8000/api/books
   ```

2. **Crear un libro** (requiere token de administrador):
   ```bash
   curl -X POST http://localhost:8000/api/books \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer TOKEN_ADMIN" \
     -d '{
       "title": "Don Quijote",
       "author": "Miguel de Cervantes",
       "isbn": "9788420412146",
       "publishedYear": 1605,
       "genre": "Novela",
       "quantity": 5
     }'
   ```

3. **Obtener un libro por ID** (solo funciona para libros activos):
   ```bash
   curl -X GET http://localhost:8000/api/books/ID_DEL_LIBRO
   ```

4. **Actualizar un libro** (requiere token de administrador):
   ```bash
   curl -X PUT http://localhost:8000/api/books/ID_DEL_LIBRO \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer TOKEN_ADMIN" \
     -d '{
       "quantity": 10
     }'
   ```

5. **Desactivar un libro** (soft delete - requiere token de administrador):
   ```bash
   curl -X DELETE http://localhost:8000/api/books/ID_DEL_LIBRO \
     -H "Authorization: Bearer TOKEN_ADMIN"
   ```

#### Préstamos

1. **Crear un préstamo** (requiere autenticación, solo usuarios activos pueden pedir libros activos):
   ```bash
   curl -X POST http://localhost:8000/api/loans \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer TU_TOKEN_JWT" \
     -d '{
       "bookId": "ID_DEL_LIBRO"
     }'
   ```

2. **Ver préstamos propios** (requiere autenticación, solo muestra préstamos de libros activos):
   ```bash
   curl -X GET http://localhost:8000/api/loans/myloans \
     -H "Authorization: Bearer TU_TOKEN_JWT"
   ```

3. **Ver todos los préstamos** (requiere token de administrador, solo muestra préstamos de usuarios y libros activos):
   ```bash
   curl -X GET http://localhost:8000/api/loans \
     -H "Authorization: Bearer TOKEN_ADMIN"
   ```

4. **Devolver un libro prestado** (requiere autenticación):
   ```bash
   curl -X PUT http://localhost:8000/api/loans/ID_DEL_PRESTAMO/return \
     -H "Authorization: Bearer TU_TOKEN_JWT"
   ```

### Uso con Postman

1. **Configuración del entorno**:
   - Crea una variable de entorno `base_url` con valor `http://localhost:8000`
   - Después de hacer login, guarda el token en una variable de entorno `jwt_token`

2. **Colección de solicitudes**:
   - Organiza tus solicitudes en carpetas: Autenticación, Libros, Préstamos
   - Para rutas protegidas, configura la autenticación en la pestaña "Authorization" seleccionando "Bearer Token" y usando la variable `{{jwt_token}}`

## Datos de ejemplo

Puedes cargar datos de ejemplo en la base de datos con:
```
npm run data:import
```

Para eliminar todos los datos:
```
npm run data:destroy
```

### Credenciales para pruebas

- **Admin:**
  - Email: admin@example.com
  - Password: 123456

- **Usuario normal:**
  - Email: john@example.com
  - Password: 123456

- **Usuario normal 2:**
  - Email: jane@example.com
  - Password: 123456

- **Usuario inactivo (desactivado):**
  - Email: inactive@example.com
  - Password: 123456

## Estructura del proyecto

```
alexandria/
├── src/
│   ├── config/         # Configuraciones (DB, etc.)
│   ├── controllers/    # Controladores
│   ├── data/           # Datos de ejemplo y seeders
│   ├── middleware/     # Middleware personalizado
│   ├── models/         # Modelos de Mongoose
│   ├── routes/         # Definiciones de rutas
│   ├── types/          # Tipos de TypeScript
│   └── app.ts          # Punto de entrada
├── dist/               # Código compilado
├── node_modules/       # Dependencias
├── .env                # Variables de entorno
├── package.json        # Dependencias y scripts
├── tsconfig.json       # Configuración de TypeScript
└── README.md           # Documentación
```

## API Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar un nuevo usuario (rol opcional: 'user' o 'admin')
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil de usuario (requiere autenticación)
- `DELETE /api/auth/:id` - Desactivar un usuario (requiere ser el mismo usuario o un administrador)

### Libros

- `GET /api/books` - Obtener todos los libros activos
- `GET /api/books/:id` - Obtener un libro activo por ID
- `POST /api/books` - Crear un nuevo libro (requiere rol de administrador)
- `PUT /api/books/:id` - Actualizar un libro activo (requiere rol de administrador)
- `DELETE /api/books/:id` - Desactivar un libro (requiere rol de administrador)

### Préstamos

- `GET /api/loans` - Obtener todos los préstamos de usuarios y libros activos (requiere rol de administrador)
- `GET /api/loans/myloans` - Obtener préstamos del usuario actual (requiere autenticación)
- `POST /api/loans` - Crear un nuevo préstamo (requiere autenticación)
- `PUT /api/loans/:id/return` - Devolver un libro prestado (requiere autenticación)

## Soft Delete

Esta API implementa "soft delete" para usuarios y libros, lo que significa:

1. **Usuarios desactivados**:
   - No pueden iniciar sesión
   - Sus tokens de autenticación dejan de funcionar
   - No aparecen en las listas de usuarios
   - Solo pueden ser desactivados por ellos mismos o por un administrador

2. **Libros desactivados**:
   - No aparecen en las búsquedas de libros
   - No pueden ser prestados
   - Pueden ser devueltos si ya estaban en préstamo

Esta estrategia permite mantener la integridad de los datos históricos mientras se oculta información que ya no debe ser accesible.

## Problemas conocidos y soluciones

### Problemas con los tipos de terceros

Si encuentras errores relacionados con los tipos de módulos como bcryptjs o jsonwebtoken, puedes:

1. Usar la sintaxis de importación require con anotación @ts-ignore:
   ```typescript
   // @ts-ignore
   const bcrypt = require('bcryptjs');
   ```

2. O ajustar tsconfig.json para ser menos estricto con las importaciones:
   ```json
   {
     "compilerOptions": {
       // ... otras opciones
       "noImplicitAny": false
     }
   }
   ```

3. O crear archivos de declaración personalizados en src/types/

### Problemas con MongoDB

Si tienes problemas para conectar a MongoDB:

1. Asegúrate de que el servicio de MongoDB esté en ejecución
2. Verifica que la URL de conexión en el archivo .env sea correcta
3. Si usas MongoDB Atlas, asegúrate de que tu IP esté en la lista blanca

## Licencia

ISC 