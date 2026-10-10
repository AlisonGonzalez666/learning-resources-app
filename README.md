# App de Gestión de Recursos de Aprendizaje - Tercer Desafío Práctico
"Learning Resources App"

Esta Aplicación está desarrollada con React Native con Expo para poder gestionar recursos de aprendizaje, como Libros, Videos, Artículos de Ingeniería de Sistemas.

---

## 📌 Información del Proyecto
- **Materia:** Desarrollo de Aplicaciones Móviles / DPS
- **Alumno:** González González, Alison Valeria / GG220710
- **Desafío:** Tercer Desafío Práctico (App Gestión de Recursos de Aprendizaje)
- **Tecnologías:** React Native, Expo, React Navigation, React Native Paper, AsyncStorage.

---

## Enlace del video demostrativo

https://drive.google.com/file/d/10iseJ1cABlyLH5SWYUxPMFlhlEJfcFIi/view?usp=sharing

---

## ⚙️ ¿Cómo funciona?

La aplicación opera mediante un sistema de autenticación y control de roles que adapta la interfaz de usuario de forma dinámica:

1. **Autenticación y Sesión (`AuthContext`):**
   - El usuario inicia sesión o se registra a través de `LoginScreen` y `RegisterScreen`.
   - El sistema almacena y valida las credenciales utilizando el contexto de la aplicación, identificando si el usuario ingresa con rol de **Estudiante** o **Docente**.

2. **Módulo de Estudiante:**
   - **Consulta de Recursos (`ResourceListScreen`):** Muestra un listado general de todo el material educativo disponible en formato de tarjetas interactivas (`ResourceCard`).
   - **Favoritos (`FavoritesScreen`):** Permite a los estudiantes marcar y guardar recursos de su interés para consultarlos rápidamente.
   - **Calificaciones e Interacción:** Los usuarios pueden interactuar abriendo los enlaces externos de los recursos en el navegador del dispositivo y calificarlos mediante un sistema interactivo de estrellas (1 a 5).

3. **Módulo de Docente:**
   - **Panel de Control (`TeacherDashboardScreen`):** Ofrece una vista administrativa para la gestión y supervisión de los contenidos educativos.
   - **Formulario de Recursos (`ResourceFormScreen`):** Permite a los profesores registrar nuevos recursos, editar los ya existentes o eliminarlos del sistema, manteniendo el catálogo actualizado.
  
## 🚀 ¿Cómo correr el proyecto localmente?

Sigue estos pasos para clonar y ejecutar la aplicación en tu entorno de desarrollo:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/AlisonGonzalez666/learning-resources-app.git](https://github.com/AlisonGonzalez666/learning-resources-app.git)
