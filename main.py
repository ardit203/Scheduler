import http.server, socketserver, webbrowser

from py import polish_data

if __name__ == "__main__":
    polish_data.main()

    # PORT = 9999
    # Handler = http.server.SimpleHTTPRequestHandler
    #
    # with socketserver.TCPServer(("", PORT), Handler) as httpd:
    #     webbrowser.open(f"http://localhost:{PORT}/index.html")
    #     httpd.serve_forever()
