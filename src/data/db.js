// Datos iniciales para simular una base de datos
const initialData = {
    users: [
      {
        id: 1,
        name: "Admin",
        email: "adminnn@example.com",
        password: "admin123", // En producción NUNCA almacenes contraseñas en texto plano
        role: "admin"
      },
      {
        id: 2,
        name: "Usuario Demo",
        email: "user@example.com",
        password: "demo123",
        role: "user"
      }
    ],
    surveys: [] // Aquí puedes añadir encuestas iniciales si lo necesitas
  };
  
  // Función para inicializar la "base de datos" en localStorage
  export const initDB = () => {
    if (!localStorage.getItem('db')) {
      localStorage.setItem('db', JSON.stringify(initialData));
    }
  };
  
  // Funciones para interactuar con los usuarios
  export const userDB = {
    // Buscar usuario por email
    findByEmail: (email) => {
      const db = JSON.parse(localStorage.getItem('db'));
      return db.users.find(user => user.email === email);
    },
    
    // Crear nuevo usuario
    create: (userData) => {
      const db = JSON.parse(localStorage.getItem('db'));
      const newUser = {
        id: Date.now(),
        ...userData,
        role: 'user' // Por defecto todos son usuarios normales
      };
      db.users.push(newUser);
      localStorage.setItem('db', JSON.stringify(db));
      return newUser;
    },
    
    // Verificar credenciales
    authenticate: (email, password) => {
      const user = userDB.findByEmail(email);
      if (user && user.password === password) {
        return user;
      }
      return null;
    }
  };