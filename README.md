# Proyecto Gestión de la Programacion Académica

Aplicación web para la gestión de programación académica.

## Tecnologías
- Next.js
- Express.js
- MySQL


## Instalación

1. Clona el repositorio:

   <pre> git clone https://github.com/DACR-0/proyecto010.git </pre>
   
2. Instala dependencias:

    ```sh
     npm install
     ```
 
 3. Configura el archivo `.env`:

  
   ```sh
      NEXTAUTH_SECRET=clave
      NEXTAUTH_URL=http://localhost:0000         # URL de tu aplicación Next.js
      NEXT_PUBLIC_EXPRESS_API_URL=http://localhost:0000 # URL de tu API Express
      DB_HOST=localhost                          # Host de la base de datos
      DB_USER=xxx                                # Usuario de la base de datos
      DB_PASSWORD=xxx                            # Contraseña de la base de datos
      DB_NAME=xxx                                # Nombre de la base de datos
  ```
   

 4. Inicia el backend y frontend:
    
    Para el backend (Express):
    ```sh
      npm start
    ```
    Para el frontend (Next.js):
    ```sh
      npm run dev
    ```
    
 6. Accede a la aplicación:
    Abre tu navegador en http://localhost:3000 (o la URL que configuraste).
