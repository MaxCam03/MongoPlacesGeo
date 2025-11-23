# Books API (Node + Express + MongoDB)

Pequeña API para gestionar libros usando Express y MongoDB.

Requisitos
- Node.js (v12+)
- MongoDB local (opcional) o una URI de MongoDB Atlas

Instrucciones (PowerShell)

1) Desde la raíz del proyecto instala dependencias:

```powershell
npm install
```

2) (Opcional) Si usas MongoDB Atlas, exporta la URI en la variable de entorno `MONGO_URI`:

```powershell
$env:MONGO_URI = "mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/mydb?retryWrites=true&w=majority"
```

Si no configuras `MONGO_URI`, la aplicación intentará conectarse a `mongodb://127.0.0.1:27017/booksdb`.

3) Ejecuta la aplicación:

```powershell
node app.js
```

Salida esperada:
- "Connected to MongoDB" si la conexión es exitosa.
- "Server listening on http://localhost:4000" (o el puerto definido en `PORT`).

Endpoints (base: http://localhost:4000/api/books)
- GET /api/books      -> listar libros
- POST /api/books     -> crear libro (JSON body: { title: string, description?: string })
- PATCH /api/books/:id -> actualizar descripción (JSON body: { description: string })
- DELETE /api/books/:id -> eliminar libro

Ejemplo rápido usando curl (PowerShell):

```powershell
# Crear
curl -Method POST -Body (ConvertTo-Json @{title='Mi libro'; description='Descripcion'}) -ContentType 'application/json' http://localhost:4000/api/books

# Listar
curl http://localhost:4000/api/books
```

Notas
- El archivo `modules/Book.js` contiene el esquema Mongoose con `title` requerido.
- Para producción, guarda credenciales de forma segura y no las pongas en el código fuente.
