
# Sistema de proveedores
# CRUD Nodejs y Mysql

Pagina web la cual es capaz del control de proveedores, manejo de productos, empleados y transporte de una empŕesa con las funciones CRUD en todo momento, creada con nodeJS y esta conectada a la base de datos E-R.

<h5> Tecnologias y librearias que se utilizo:</h5>

[Expressjs](https://expressjs.com/es/ "Expressjs")
[Nodejs](https://nodejs.org/es/ "Node js")
[Bootstrap](https://getbootstrap.com/ "Bootstrap")
[Mysql](https://www.mysql.com/ "Mysql")
[Morgan](https://www.npmjs.com/package/morgan "Morgan")
## Compatibilidad con MySQL moderno (MySQL 8+)

Este proyecto se actualizó para funcionar con versiones modernas de MySQL (por ejemplo MySQL 8) usando el cliente `mysql2`. Además, el servidor ahora intentará inicializar la base de datos automáticamente al iniciar (ejecuta los scripts dentro de `database/db.sql`) si no existe.

Cómo iniciar:
```
npm install
npm run dev
```

Si prefieres no inicializar automáticamente la base de datos, abre `src/init-db.js` y ajusta o elimina la llamada a la función de inicialización en `src/app.js`.

Credenciales por defecto (si no hay usuarios):

- idUsuario: 1
- Contraseña: admin123

Nota sobre nombres de usuario
- Los `idUsuario` deben ser alfanuméricos (letras y/o números, sin espacios), hasta 50 caracteres.
	El registro fallará si el usuario ya existe o si el nombre de usuario no cumple la validación.

Nota: Estas credenciales se crean automáticamente al iniciar la app si no se detecta ningún usuario en la tabla `tb_Usuarios`. Puedes cambiarlas después desde la UI de registro o desde el script SQL.


<h2>Imagenes del proyecto</h2>

<img width="1348" height="630" alt="image" src="https://github.com/user-attachments/assets/66fd6aac-4984-4483-97b2-0e3021bc9dee" />

<img width="1173" height="609" alt="image" src="https://github.com/user-attachments/assets/08a72c21-43e5-448b-b58b-4151dea7c944" />

<img width="1345" height="645" alt="image" src="https://github.com/user-attachments/assets/49992e27-de99-4327-9549-3af392c68a14" />

<img width="1313" height="622" alt="image" src="https://github.com/user-attachments/assets/8171579d-8b04-4d01-928e-43db3bfce3d4" />

<img width="1319" height="609" alt="image" src="https://github.com/user-attachments/assets/d220dad6-9e7c-425b-bd7e-3cf5cd40c456" />

<img width="1365" height="609" alt="image" src="https://github.com/user-attachments/assets/e2510171-745e-473e-9cb6-6f1711c6e950" />
<img width="1351" height="630" alt="image" src="https://github.com/user-attachments/assets/ef5b2f78-377d-42d3-85c7-38761b89f0c7" />

<img width="1348" height="591" alt="image" src="https://github.com/user-attachments/assets/cec9778b-4100-4c04-9675-bc8493b9ff3b" />

<img width="1352" height="646" alt="image" src="https://github.com/user-attachments/assets/f98f20a7-1d40-458e-b5d9-568f2b2c490e" />

<img width="1349" height="350" alt="image" src="https://github.com/user-attachments/assets/313ddde8-548a-4fc1-ad17-3e7074749de8" />



