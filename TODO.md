# Plan de Correcciones - AdminBot

## Problemas a Resolver:
1. Error 500 al guardar estudiante
2. Valores NaN en campos numéricos
3. Error de rutas (frontend calling /students but backend uses /api/students)
4.db.js file already exists - no issue

## Pasos de Corrección:

### 1. Frontend: students.js
- Cambiar fetch URLs de `/students` a `http://localhost:3000/api/students`
- Usar Number(valor) || 0 para evitar NaN
- Manejar errores correctamente

### 2. Backend: student.controller.js
- Limpiar NaN en campos numéricos: Number(asistencia) || 0
- Validar campos requeridos
- try/catch para manejo de errores

### 3. Backend: student.model.js
- Ya usa db.query() correctamente
- Verificar columnas coinciden con tabla estudiantes

### 4. Backend: students.route.js
- Rutas ya usan /students que con /api en app.js resulta /api/students
- Verificar que todo esté correcto

### 5. Backend: db.js
- Ya existe en Backend/config/db.js
- No necesita cambios

## Estado: COMPLETADO

### Archivos corregidos:
- ✓ Frontend/src/pages/students/students.js
- ✓ Backend/controllers/student.controller.js  
- ✓ Backend/models/student.model.js
- ✓ Backend/routes/students.route.js (ya estaba correcto)
- ✓ Backend/config/db.js (ya existía)
