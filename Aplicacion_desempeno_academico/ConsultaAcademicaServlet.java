
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/consulta")
public class ConsultaAcademicaServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Obtener los datos del formulario
        String studentId = request.getParameter("student-id");
        String studentName = request.getParameter("student-name");

        // Simulación de datos (estos vendrían de la base de datos)
        String[][] materias = {
            {"Matemáticas", "Aprobada"},
            {"Física", "Reprobada"},
            {"Programación", "Aprobada"}
        };

        String restricciones = "No puedes inscribirte en 'Cálculo' y 'Estadística' debido a Física reprobada.";

        // Enviar respuesta HTML dinámica
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        out.println("<!DOCTYPE html>");
        out.println("<html lang='es'>");
        out.println("<head><meta charset='UTF-8'><title>Resultados Académicos</title></head>");
        out.println("<body>");
        out.println("<h1>Resultados de " + studentName + " (" + studentId + ")</h1>");
        out.println("<table border='1'><tr><th>Materia</th><th>Estado</th></tr>");
        for (String[] materia : materias) {
            out.println("<tr><td>" + materia[0] + "</td><td>" + materia[1] + "</td></tr>");
        }
        out.println("</table>");
        out.println("<h3>Restricciones:</h3>");
        out.println("<p>" + restricciones + "</p>");
        out.println("</body>");
        out.println("</html>");
    }
}
