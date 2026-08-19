"""Servidor local del tablero V3 modular.

Hace lo mismo que `python3 -m http.server`, pero enviando cabeceras que
desactivan la cache del navegador.

Por que existe: el tablero usa modulos ES (`type="module"`), que los navegadores
cachean de forma agresiva. Varias veces durante el desarrollo el navegador quedo
con una mezcla de codigo viejo y nuevo — pestanas que ya no existian, pantallas
que se quedaban solo con menu y header, cifras desactualizadas — sin que hubiera
ningun error en el codigo. Con `no-store` el navegador siempre revalida y lo que
se ve en pantalla corresponde al codigo que hay en disco.

Uso:
    python3 servidor-local.py [puerto] [directorio]
"""

import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

DEFAULT_PORT = 8055


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, fmt, *args):  # menos ruido en el log
        sys.stderr.write('%s - %s\n' % (self.address_string(), fmt % args))


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_PORT
    directory = sys.argv[2] if len(sys.argv) > 2 else '.'
    handler = partial(NoCacheHandler, directory=directory)
    with ThreadingHTTPServer(('127.0.0.1', port), handler) as httpd:
        print('Tablero V3 modular en http://localhost:%d/ (cache desactivada)' % port)
        httpd.serve_forever()


if __name__ == '__main__':
    main()
