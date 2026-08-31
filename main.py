import subprocess
import os

print("🤖 My AI is ready!")

while True:
    command = input("You: ").lower().strip()

    if command == "hello":
        print("AI: Hello! How can I help you?")

    elif "excel" in command or "sheet" in command:
        print("AI: Creating and opening Excel sheet (Student_Team_Details.xlsx)...")
        if not os.path.exists("Student_Team_Details.xlsx"):
            subprocess.run(["python", "create_excel.py"])
        os.system("start Student_Team_Details.xlsx")

    elif "calculator" in command:
        print("AI: Opening Calculator...")
        subprocess.Popen("calc.exe")

    elif "notepad" in command:
        print("AI: Opening Notepad...")
        subprocess.Popen("notepad.exe")

    elif command == "bye":
        print("AI: Goodbye!")
        break

    else:
        print("AI: I don't understand that yet. Try 'create excel', 'notepad', 'calculator', or 'hello'.")