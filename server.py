import http.server
import json
import os
import sys
import socket
from datetime import datetime

class DynamicHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Trigger sync before serving index.json
        if self.path.startswith('/index.json'):
            print(f"[{datetime.now()}] Synchronizing index.json...")
            self.sync_index()
        
        return super().do_GET()

    def do_POST(self):
        if self.path == '/api/save':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                new_data = json.loads(post_data.decode('utf-8'))
                
                # Check for directory creation requirements
                docus_dir = new_data.get('docus_dir', 'data/cursados/')
                for cursado in new_data.get('cursados', []):
                    for clase in cursado.get('clases', []):
                        folder = clase.get('folder')
                        if folder:
                            folder_path = os.path.join(docus_dir, folder)
                            if not os.path.exists(folder_path):
                                print(f"Creating missing directory: {folder_path}")
                                os.makedirs(folder_path, exist_ok=True)

                # Save the new index.json
                with open('index.json', 'w', encoding='utf-8') as f:
                    json.dump(new_data, f, indent=2, ensure_ascii=False)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))
                print(f"[{datetime.now()}] index.json saved successfully via POST")
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
                print(f"[{datetime.now()}] Error saving index.json: {e}")
        else:
            self.send_response(404)
            self.end_headers()

    def sync_index(self):
        index_path = 'index.json'
        if not os.path.exists(index_path): return

        try:
            with open(index_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            docus_dir = data.get('docus_dir', 'data/cursados/')
            allowed_exts = data.get('allowed_extensions', ['.pdf', '.md', '.mp4'])
            cursados = data.get('cursados', [])

            if not os.path.exists(docus_dir): return

            changed = False
            for cursado in cursados:
                for clase in cursado.get('clases', []):
                    folder = clase.get('folder')
                    if not folder: continue
                    
                    folder_path = os.path.join(docus_dir, folder)
                    if os.path.exists(folder_path):
                        # Get all valid files in folder
                        files_on_disk = sorted([f for f in os.listdir(folder_path) 
                                              if os.path.isfile(os.path.join(folder_path, f)) 
                                              and any(f.endswith(ext) for ext in allowed_exts)])

                        # Existing document resources in JSON
                        current_docs = [r['archivo'] for r in clase.get('recursos', []) if r.get('tipo') == 'Documento']
                        
                        if set(files_on_disk) != set(current_docs):
                            print(f"Syncing class folder: {folder}")
                            # Filter out old Documento entries and add new ones from disk
                            new_recursos = [r for r in clase.get('recursos', []) if r.get('tipo') != 'Documento']
                            for f in files_on_disk:
                                new_recursos.append({"tipo": "Documento", "archivo": f})
                            
                            clase['recursos'] = new_recursos
                            changed = True

            if changed:
                with open(index_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                print("index.json synchronized with disk.")

        except Exception as e:
            print(f"Sync failed: {e}")

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

if __name__ == '__main__':
    port = 8000
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    
    # Automatic port fallback logic
    original_port = port
    while is_port_in_use(port):
        print(f"Port {port} is already in use.")
        port += 1
        if port > original_port + 10: # Try up to 10 ports
            print("Could not find an available port in range. Exiting.")
            sys.exit(1)
            
    if port != original_port:
        print(f"Using port {port} instead.")

    server_address = ('', port)
    httpd = http.server.HTTPServer(server_address, DynamicHandler)
    print(f"Dynamic DiploIA Server running on port {port}...")
    httpd.serve_forever()
