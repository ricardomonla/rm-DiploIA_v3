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

    def sync_index(self):
        index_path = 'index.json'
        if not os.path.exists(index_path):
            print("Error: index.json not found.")
            return

        try:
            with open(index_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            docus_dir = data.get('docus_dir', 'Clases_DiploIA/')
            allowed_exts = data.get('allowed_extensions', ['.pdf', '.md', '.mp4'])
            clases = data.get('clases', [])

            # Get current folders in Clases_DiploIA
            if not os.path.exists(docus_dir):
                print(f"Error: Directory {docus_dir} not found.")
                return

            existing_folders = [d for d in os.listdir(docus_dir) if os.path.isdir(os.path.join(docus_dir, d))]
            
            # Map of folder -> class entry
            clases_map = {c['folder']: c for c in clases}

            # Update folders
            new_clases = []
            for folder in existing_folders:
                # Scan files in folder
                folder_path = os.path.join(docus_dir, folder)
                files = [f for f in os.listdir(folder_path) 
                        if os.path.isfile(os.path.join(folder_path, f)) 
                        and any(f.endswith(ext) for ext in allowed_exts)]
                files.sort()

                if folder in clases_map:
                    # Update existing class docus
                    clases_map[folder]['docus'] = files
                else:
                    # Create new class entry
                    print(f"New class detected: {folder}")
                    # Try to infer class number and name from folder name (e.g., C14_Diseño...)
                    class_num = ""
                    class_name = folder
                    if folder.startswith('C') and '_' in folder:
                        parts = folder.split('_', 1)
                        class_num = parts[0][1:].replace('e', '') # Simple hack for C10e
                        class_name = parts[1].replace('_', ' ')
                    
                    new_clases.append({
                        "folder": folder,
                        "youtube_id": "",
                        "campus_id": "",
                        "class_number": class_num,
                        "class_name": class_name,
                        "class_date": datetime.now().strftime("%d/%m/%Y"),
                        "docus": files
                    })

            # Re-assemble clases list
            final_clases = list(clases_map.values()) + new_clases
            
            # Remove classes whose folders are gone (optional, but keep it clean)
            final_clases = [c for c in final_clases if c['folder'] in existing_folders]

            # Sort classes: first by class_number (numeric), then by folder name
            def sort_key(c):
                num_str = "".join(filter(str.isdigit, c.get('class_number', '0')))
                num = int(num_str) if num_str else 999
                return (num, c['folder'])

            final_clases.sort(key=sort_key)

            data['clases'] = final_clases

            with open(index_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)

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
