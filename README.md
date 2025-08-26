# Dozo-OS
# Planificador de Dietas

## Descripción del Proyecto
El Planificador de Dietas - Dôzo es una aplicación web diseñada para generar planes de dieta personalizados basados en las necesidades y preferencias del usuario. Este proyecto permite calcular las calorías diarias requeridas según factores como edad, sexo, peso, altura, nivel de actividad y objetivos (perder, mantener o ganar peso), además de adaptar las comidas según la ubicación, temporada, tipo de dieta, condiciones médicas y alergias.

## Algoritmo
El algoritmo utiliza la siguiente metodología:
1. **Cálculo de Calorías**: Se emplea la fórmula de BMR (Metabolismo Basal) ajustada con el multiplicador de actividad (TDEE) y modificada según el objetivo del usuario (±500 kcal).
2. **Distribución de Calorías**: Las calorías se distribuyen en bandas fijas:
   - Desayuno: 20%-25% (mínimo 20%, ideal 25% si está seleccionado).
   - Almuerzo: 30%-40% (mínimo 30%, ideal 35% si está seleccionado).
   - Cena: 20%-30% (mínimo 20%, ideal 30% si está seleccionado).
   - Snacks: 5%-10% total (100 kcal por snack, ajustado según cantidad).
   - Margen Flexible: 0%-10% (resto no asignado si las comidas principales no suman 90%).
3. **Selección de Alimentos**: Se simula una base de datos dinámica que selecciona alimentos según la ciudad, temporada, dieta (normal, vegetariana, vegana), condiciones (e.g., intolerancia a la lactosa, celiaquía) y alergias, con rotación aleatoria para variedad.
4. **Ajuste Dinámico**: Si se selecciona una sola comida, se respeta el mínimo de su banda y el resto se asigna al margen flexible (máximo 10%).

## Capacidades
- Genera planes de dieta personalizados para 1 a 30 días.
- Admite filtros por sexo, edad, peso, altura, nivel de actividad, objetivo, condiciones médicas, alergias y tipo de dieta.
- Ofrece alimentos estacionales según la ubicación (Santiago, Concepción, Viña del Mar, La Serena).
- Muestra la distribución de calorías por comida y un margen flexible para ajustes.
- Interfaz responsive con diseño limpio y funcional.

## Alcances
- Ideal para usuarios que buscan orientación general sobre su dieta, pero no reemplaza la consulta con un especialista (se advierte si los datos están fuera de rangos seguros: peso < 30kg o > 200kg, altura < 100cm o > 250cm, edad < 10 o > 100).
- Funciona offline una vez cargado en el navegador.
- Limitado a las ubicaciones y alimentos predefinidos; no incluye integración con bases de datos externas ni personalización avanzada.

## Instrucciones de Ejecución
1. **Requisitos**:
   - Un navegador web moderno (Chrome, Firefox, Edge, etc.).
   - Los archivos `index.html`, `script.js`, y `styles.css` en el mismo directorio.

2. **Preparación**:
   - Descarga o clona este repositorio en tu computadora.
   - Coloca el archivo `logo_dozo.png` en el mismo directorio que `index.html` (o ajusta la ruta en `<img src="logo_dozo.png">` si está en otra carpeta, e.g., `img/logo_dozo.png`).

3. **Ejecución**:
   - Abre el archivo `index.html` en tu navegador haciendo doble clic o arrastrándolo a la ventana del navegador.
   - Completa el formulario con tus datos (nombre, sexo, edad, peso, altura, nivel de actividad, objetivo, condiciones, alergias, tipo de dieta, ciudad, comidas y días).
   - Selecciona las comidas que deseas incluir y haz clic en "Generar Dieta".
   - Revisa el plan generado en la sección de resultados, que incluye la lista de alimentos y la distribución de calorías.

4. **Restablecimiento**:
   - Haz clic en "Restablecer" para limpiar el formulario y los resultados.

5. **Notas**:
   - Si encuentras errores, abre la consola del navegador (F12) y verifica los mensajes.
   - Ajusta las cantidades de alimentos según tus necesidades, ya que las porciones son estimaciones basadas en calorías.

## Contribuciones
Si deseas contribuir, puedes proponer mejoras como agregar más ubicaciones, alimentos o integraciones con APIs. Envía tus sugerencias o pull requests a través de un repositorio Git (si aplica).

## Licencia
Este proyecto es de uso libre para fines educativos y personales. No se garantiza su uso en contextos profesionales sin validación por un nutricionista.

---
*Última actualización: 26 de agosto de 2025, 02:40 PM -04*
