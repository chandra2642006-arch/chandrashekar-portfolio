"""
BCS Agent Server (`bcs_server.py`)
Flask backend server for the BCS Agent Unified Voice-First Ecosystem.
Handles real-time commands, routing to Mobile/Laptop/Reasoning nodes, contact sync, and file delivery.
"""

import os
from flask import Flask, request, jsonify, send_from_directory, send_file
from bcs_core.bcs_router import BCSRouter

app = Flask(__name__, static_folder='frontend')

try:
    from flask_cors import CORS
    CORS(app)
except ImportError:
    @app.after_request
    def add_cors_headers(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
        response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
        return response

router = BCSRouter()

# -------------------------------------------------------------
# 1. Frontend Web & Mobile Dashboard Routes
# -------------------------------------------------------------
@app.route('/')
@app.route('/bcs')
def serve_bcs_dashboard():
    """Serves the main voice-first BCS dashboard UI."""
    return send_from_directory(app.static_folder, 'bcs_dashboard.html')

@app.route('/<path:path>')
def serve_static_assets(path):
    """Serves static frontend assets (bcs_style.css, bcs_app.js, images, etc.)."""
    return send_from_directory(app.static_folder, path)


# -------------------------------------------------------------
# 2. Main BCS Command Routing Endpoint
# -------------------------------------------------------------
@app.route('/api/bcs/command', methods=['POST'])
def process_bcs_command():
    """
    Primary voice & text intent command handler.
    Receives prompt, runs BCS Routing Logic, executes action, and returns response payload.
    """
    data = request.json or {}
    raw_prompt = data.get('command') or data.get('prompt') or ''

    if not raw_prompt:
        return jsonify({
            "status": "ERROR",
            "message": "Empty command prompt received. Please speak or type a command."
        }), 400

    result = router.route_and_execute(raw_prompt)
    return jsonify(result)


# -------------------------------------------------------------
# 3. Telemetry & Node Status Endpoint
# -------------------------------------------------------------
@app.route('/api/bcs/status', methods=['GET'])
def get_node_status():
    """Returns active connectivity status of Mobile Node, Laptop Node, and Reasoning Engine."""
    return jsonify({
        "agent": "BCS",
        "brain": "Gemini 2.5 (Multimodal + Tool Calling + Reasoning)",
        "wake_trigger": "Hey BCS",
        "nodes": {
            "mobile_node": {
                "name": "Mobile Communication Hub",
                "status": "CONNECTED",
                "interface": "Cellular SIM + SMS Gateway",
                "contacts_synced": len(router.mobile_hub.contacts)
            },
            "laptop_node": {
                "name": "Laptop Desktop Automation",
                "status": "ACTIVE_RECEIVER",
                "platform": os.name,
                "services": ["WhatsApp Automation", "App Launcher", "Hotkeys", "Smart Typing"]
            },
            "reasoning_node": {
                "name": "Problem-Solving Engine",
                "status": "READY",
                "capabilities": ["Rectifiers", "Op-Amps", "Logic Gates/K-Maps", "Python/C/SQL Generation"]
            }
        }
    })


# -------------------------------------------------------------
# 4. Contact Management API
# -------------------------------------------------------------
@app.route('/api/bcs/contacts', methods=['GET', 'POST'])
def manage_contacts():
    if request.method == 'POST':
        data = request.json or {}
        name = data.get('name')
        phone = data.get('phone')
        if not name or not phone:
            return jsonify({"status": "ERROR", "message": "Name and phone are required"}), 400
        res = router.mobile_hub.add_contact(name, phone)
        return jsonify(res)
    else:
        contacts_formatted = [
            {"name": name.title(), "phone": phone} 
            for name, phone in router.mobile_hub.contacts.items()
        ]
        return jsonify({"status": "SUCCESS", "contacts": contacts_formatted})


# -------------------------------------------------------------
# 5. Direct Module Action Endpoints
# -------------------------------------------------------------
@app.route('/api/bcs/mobile/permissions', methods=['GET'])
def get_mobile_permissions():
    """Returns status audit of native mobile system permissions."""
    return jsonify(router.mobile_hub.get_permission_status())

@app.route('/api/bcs/mobile/accessibility', methods=['POST'])
def run_mobile_accessibility():
    """Triggers Android Accessibility Service UI automation."""
    data = request.json or {}
    app_name = data.get('app_name', 'instagram')
    query = data.get('search_query', 'tech news')
    res = router.mobile_hub.execute_accessibility_action(app_name, search_query=query)
    return jsonify(res)

@app.route('/api/bcs/mobile/deeplink', methods=['POST'])
def run_mobile_deeplink():
    """Fires direct app scheme deep links."""
    data = request.json or {}
    app_name = data.get('app_name', 'youtube')
    query = data.get('query', 'quicksort explanation')
    res = router.mobile_hub.execute_deep_link(app_name, query)
    return jsonify(res)

@app.route('/api/bcs/whatsapp', methods=['POST'])
def direct_whatsapp():
    data = request.json or {}
    contact = data.get('contact', 'Vinod')
    message = data.get('message', 'Hello from BCS Agent!')
    res = router.laptop_node.send_whatsapp_message(contact, message)
    return jsonify(res)

@app.route('/api/bcs/reasoning/circuit', methods=['POST'])
def direct_circuit_solver():
    data = request.json or {}
    query = data.get('query', 'Full wave rectifier peak voltage 15V')
    res = router.reasoning_engine.solve_circuit(query)
    return jsonify(res)


# -------------------------------------------------------------
# 6. File Download Endpoint (Generated Code & Excel files)
# -------------------------------------------------------------
@app.route('/api/bcs/download/<filename>')
def download_generated_file(filename):
    file_path = os.path.join(os.getcwd(), filename)
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    return jsonify({"status": "ERROR", "message": f"File '{filename}' not found."}), 404


if __name__ == '__main__':
    print("[BCS Agent] Backend Server starting on http://127.0.0.1:5000")
    print("[BCS Agent] Wake Trigger: 'Hey BCS'")
    app.run(host='0.0.0.0', port=5000, debug=True)
