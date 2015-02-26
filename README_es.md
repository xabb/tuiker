# tuiker
Interface gráfico de Django para Python Twitter Tools


Instalar python, django y sus dependencias
===

- Instalar python 2.7 para el sistema operativo con el que se trabaje.
	Debian/ubuntu y compañía: sudo apt-get install python
	Windows: https://www.python.org/downloads/
	Mac: ni idea, de eso no uso.
	
- Instalar gestor de paquetes PIP para python (como el gem de ruby, muy cómodo):
	Debian/ubuntu y similares: sudo apt-get install python-pip (https://pip.pypa.io/en/latest/installing.html)
	Windows: http://stackoverflow.com/questions/4750806/how-to-install-pip-on-windows (lo siento, hay que leer)
	Mac: tengo una profunda ignorancia sobre el tema pero si alguien me regala un Mac podré ponerle remedio :-P



Instalar tuiker
===

- Download/clone desde github el repositorio: https://github.com/impalah/tuiker
- Instalar todas las dependencias de tuiker
	* ¡OJO! Esta es una versión en desarrollo e instalará muchas cosas que no se usan.
	* El fichero requirements.txt está en la raiz de tuiker.
	* No me hago repsonsable de que empiecen a fallar otras aplicaciones de python (por versiones, sobre todo)... cada cual que asuma sus riesgos
	
	pip install -r requirements.txt

- Entrar en el directorio src/tuiker
- Asegurarse de que el proceso puede escribir en los directorios (normalmente chmod 755 pero cada cual que use lo que le convenga).
	* data
	* src (logs)
- Renombrar local_settings.py.sample a local_settings.py
- Configurar en local settings:
	- Database (se puede dejar por defecto y creará un fichero tuiker.db de sqlite3 en el directorio data)
	- SECRET_KEY y NEVERCACHE_KEY: http://www.miniwebtool.com/django-secret-key-generator/
	- ADMINS
	- ALLOWED_HOSTS (por defecto *)
	- Configuración de emails (no tocar por ahora porque va al log)
- Moverse al directorio src
- Crear la base de datos y el usuario admin principal:
	python manage.py syncdb

		Operations to perform:
  		Synchronize unmigrated apps: account, allauth, compressor, django_extensions, socialaccount, crispy_forms, bootstrap3
  		Apply all migrations: geonames, sessions, admin, sites, auth, reversion, contenttypes, colectivo
		Synchronizing apps without migrations:
  			Creating tables...
  			Installing custom SQL...
  			Installing indexes...
		Running migrations:
  			No migrations to apply.

		You have installed Django's auth system, and don't have any superusers defined.
		Would you like to create one now? (yes/no): yes
		Username (leave blank to use 'pakito'):
		Email address: mail@mail.com
		Password:
		Password (again):
		Superuser created successfully.

- Teóricamente está listo ya para lanzar.
	* Ir al directorio src
	En linux se puede usar el launch.sh
		Hay que poner las rutas absolutas al tornado_main.py
	También se puede usar el servicio tuiker.service y añadirlo al init.d (yo soy muy vago y uso webadmin para estas cosas)
	En Windows es ir a src/tuiker
		python tornado_main.py
		
- Si todo va bien se puede acceder (en local) usando http://localhost:9090
	* Si no se ha tocado ALLOWED_HOSTS se puede acceder también con el nombre/ip del host y el puerto 9090.
		Por ejemplo: http://pakito:9090


	
		

	
	
	
	
