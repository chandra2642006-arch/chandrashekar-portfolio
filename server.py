from flask import Flask, request, jsonify, send_from_directory
import os

# Point Flask to your frontend folder
app = Flask(__name__, static_folder='frontend')

# Copy AI suit coat profile portrait to assets
import shutil
src_suit = r'C:\Users\chand\.gemini\antigravity-ide\brain\db9fd207-3be5-4177-8dd0-91379cb3ffa2\suit_profile_photo_1787249329495.jpg'
dest_suit = os.path.join(os.getcwd(), 'frontend', 'assets', 'profile_avatar.jpg')
if os.path.exists(src_suit):
    try:
        shutil.copy(src_suit, dest_suit)
    except Exception:
        pass

# 1. Serve the main UI & Dedicated Portfolio Folder
@app.route('/')
def serve_index():
    return send_from_directory(os.path.join(app.static_folder, 'portfolio'), 'index.html')

@app.route('/portfolio')
@app.route('/portfolio/')
def serve_portfolio():
    return send_from_directory(os.path.join(app.static_folder, 'portfolio'), 'index.html')

@app.route('/portfolio/<path:path>')
def serve_portfolio_static(path):
    return send_from_directory(os.path.join(app.static_folder, 'portfolio'), path)

# 2. Serve general static files
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)


# 3. Download Excel Route
@app.route('/download/excel')
def download_excel():
    excel_path = os.path.join(os.getcwd(), 'Student_Team_Details.xlsx')
    if not os.path.exists(excel_path):
        import create_excel
    return send_from_directory(os.getcwd(), 'Student_Team_Details.xlsx', as_attachment=True)

# 4. The AI Brain API Endpoint
@app.route('/command', methods=['POST'])
def handle_command():
    data = request.json
    command = data.get('command', '').lower()
    
    response_text = ""

    # Our AI Logic
    if "excel" in command or "sheet" in command:
        excel_path = os.path.join(os.getcwd(), 'Student_Team_Details.xlsx')
        if not os.path.exists(excel_path):
            import subprocess
            subprocess.run(["python", "create_excel.py"])
        
        # Open Excel application on Windows
        try:
            os.system("start Student_Team_Details.xlsx")
            response_text = "📊 Opening Excel sheet (Student_Team_Details.xlsx)..."
        except Exception as e:
            response_text = f"Excel sheet created: Student_Team_Details.xlsx"
            
    elif "hello" in command:
        response_text = "Hello! How can I help you?"
    elif "calculator" in command:
        os.system("calc")
        response_text = "Opening Calculator..."
    elif "notepad" in command:
        os.system("notepad")
        response_text = "Opening Notepad..."
    elif "bye" in command:
        response_text = "Powering down. Goodbye!"
    else:
        response_text = "Command not recognized. Try 'create excel', 'notepad', 'calculator', or 'hello'."

    return jsonify({"response": response_text})

if __name__ == '__main__':
    app.run(debug=True, port=5000)