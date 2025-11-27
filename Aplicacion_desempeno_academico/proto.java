//Nueva idea para el proyecto
Para migrar esta página web escrita en HTML y CSS a una aplicación Java, se pueden seguir varias opciones dependiendo de cómo quieras estructurarlo. A continuación, te propongo dos métodos comunes para aplicaciones web en Java:

1. **Usando Servlets y JSP (Java Server Pages) con HTML y CSS**:
   - Utilizarás **Java Servlets** para manejar la lógica de la aplicación y **JSP** para mostrar la vista HTML.
   
2. **Usando un Framework Web como Spring Boot**:
   - Puedes usar **Spring Boot** para crear una aplicación web que sirva una página HTML y gestione la lógica de la aplicación. Esta opción es más moderna y popular.

Voy a explicarte cómo hacerlo usando **Java Servlets y JSP** para que mantengas la misma estructura de HTML y CSS.

### 1. Estructura de Archivos

Organizaremos los archivos en un proyecto Java tradicional utilizando **Servlets** y **JSP**.

```
/webapp
    /WEB-INF
        web.xml
    /css
        estilos.css
    /images
        logotipoPUCESE.jpg
    /jsp
        index.jsp
    /servlets
        ConsultaAcademicaServlet.java
```

### 2. Configuración en `web.xml`

El archivo `web.xml` define la configuración del servlet. Aquí te muestro cómo configurarlo para tu servlet y la página JSP:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://java.sun.com/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://java.sun.com/xml/ns/javaee
             http://java.sun.com/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1">
    <servlet>
        <servlet-name>ConsultaAcademicaServlet</servlet-name>
        <servlet-class>servlets.ConsultaAcademicaServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>ConsultaAcademicaServlet</servlet-name>
        <url-pattern>/consulta</url-pattern>
    </servlet-mapping>
</web-app>
```

### 3. Página JSP (`index.jsp`)

Dentro de la carpeta `/jsp`, crea un archivo llamado `index.jsp` que contendrá la estructura de tu página HTML. Aquí está la migración de tu HTML a JSP:

```jsp
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consulta Academica</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/estilos.css">
</head>
<body>
    <div class="container">
        <header>
            <div class="header-content">
                <h1>Sistema de Desempeno Academico</h1>
                <p>Consulta tu estado academico y restricciones de inscripcion</p>
                <img src="${pageContext.request.contextPath}/images/logotipoPUCESE.jpg" alt="Logotipo PUCESE" class="background-logo">
            </div>
        </header>
        <main>
            <form action="${pageContext.request.contextPath}/consulta" method="POST">
                <label for="student-id">ID Universitario:</label>
                <input type="text" id="student-id" name="student-id" placeholder="Ingresa tu ID" required>
                
                <label for="student-name">Nombres:</label>
                <input type="text" id="student-name" name="student-name" placeholder="Ingresa tus nombres" required>
                
                <label for="student-name">Apellidos:</label>
                <input type="text" id="student-name" name="student-name" placeholder="Ingresa tus apellidos" required>
                
                <label for="student-name">Semestre:</label>
                <input type="number" id="student-name" name="student-name" placeholder="Ingresa tu semestre" required>
                
                <button type="submit">Consultar</button>
            </form>
            <div id="results" class="hidden">
                <h2>Resultados</h2>
                <p id="student-info"></p>
                <table>
                    <thead>
                        <tr>
                            <th>Materia</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody id="subjects-table">
                        <!-- Los datos se llenaran dinamicamente -->
                    </tbody>
                </table>
                <div id="restrictions">
                    <h3>Restricciones</h3>
                    <p id="restriction-info"></p>
                </div>
            </div>
        </main>
        <footer>
            <p>&copy; 2024 PUCESE. Todos los derechos reservados.</p>
        </footer>
    </div>
</body>
</html>
```

### 4. Servlet para manejar la consulta

Ahora, vamos a crear un servlet que se encargue de procesar los datos del formulario.

#### `ConsultaAcademicaServlet.java`

```java
package servlets;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class ConsultaAcademicaServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Obtener los parámetros del formulario
        String studentId = request.getParameter("student-id");
        String studentName = request.getParameter("student-name");
        String semester = request.getParameter("student-semester");
        
        // Aquí se pueden realizar las consultas a la base de datos o lógica de negocio
        String studentInfo = "ID: " + studentId + ", Nombre: " + studentName + ", Semestre: " + semester;
        
        // Pasar los resultados al JSP
        request.setAttribute("studentInfo", studentInfo);
        
        // Redirigir a la página de resultados
        RequestDispatcher dispatcher = request.getRequestDispatcher("/jsp/results.jsp");
        dispatcher.forward(request, response);
    }
}
```

#### Página de Resultados (`results.jsp`)

En el archivo `results.jsp`, mostrarías los resultados de la consulta realizada. Este archivo debe estar en la carpeta `/jsp` y puede verse de esta forma:

```jsp
<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page language="java" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resultados de la Consulta</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/estilos.css">
</head>
<body>
    <div class="container">
        <h2>Resultados</h2>
        <p>${studentInfo}</p>
        <table>
            <thead>
                <tr>
                    <th>Materia</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                <!-- Aquí se pueden añadir los resultados dinámicos -->
            </tbody>
        </table>
    </div>
</body>
</html>
```

### 5. CSS y Archivos Estáticos

La carpeta `css` debe contener el archivo `estilos.css` y la carpeta `images` debe contener la imagen `logotipoPUCESE.jpg`, como en tu diseño original.

### 6. Configuración del servidor

Este proyecto se puede ejecutar en un servidor de aplicaciones como **Apache Tomcat**. Necesitarás empaquetar tu aplicación en un archivo `.war` y desplegarlo en el servidor para que funcione correctamente.

---

### Resumen

- **HTML/JSP**: El HTML se usa tal cual con algunos cambios para integrar JSP.
- **Servlet**: El servlet maneja la lógica de negocio para la consulta y redirige a la vista de resultados.
- **CSS**: El archivo CSS se mantiene igual, solo asegúrate de que esté en la carpeta correcta.
- **Estructura**: El proyecto tiene una estructura básica para aplicaciones web Java.

Este es un enfoque inicial para que puedas migrar tu página HTML/CSS a una aplicación Java, y te permitirá tener la misma apariencia y funcionalidad en un entorno web con tecnologías Java.
