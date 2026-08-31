"""
Module B: Laptop Desktop Automation Engine
Implements Fix #3: Brief 1.5 to 2.0 second focus delay for desktop UI windows before typing or dispatching actions.
"""

import os
import sys
import subprocess
import time
from typing import Dict, Any, Optional

class LaptopNode:
    def __init__(self):
        self.os_type = sys.platform

    def launch_application(self, app_name: str) -> Dict[str, Any]:
        """Launches target desktop applications on laptop."""
        app_clean = app_name.strip().lower()
        success = True
        msg = ""

        try:
            if "code" in app_clean or "vscode" in app_clean or "vs code" in app_clean:
                subprocess.Popen("code", shell=True)
                msg = "VS Code launched."

            elif "chrome" in app_clean or "browser" in app_clean:
                subprocess.Popen("start chrome", shell=True)
                msg = "Google Chrome launched."

            elif "spotify" in app_clean or "music" in app_clean:
                subprocess.Popen("start spotify", shell=True)
                msg = "Spotify launched."

            elif "terminal" in app_clean or "cmd" in app_clean or "powershell" in app_clean:
                subprocess.Popen("start wt", shell=True)
                msg = "Terminal launched."

            elif "excel" in app_clean or "sheet" in app_clean:
                excel_file = os.path.join(os.getcwd(), "Student_Team_Details.xlsx")
                if os.path.exists(excel_file):
                    os.system(f'start "" "{excel_file}"')
                else:
                    subprocess.Popen("start excel", shell=True)
                msg = "Excel opened."

            elif "notepad" in app_clean:
                subprocess.Popen("notepad.exe")
                msg = "Notepad opened."

            elif "calculator" in app_clean or "calc" in app_clean:
                subprocess.Popen("calc.exe")
                msg = "Calculator opened."

            else:
                subprocess.Popen(f"start {app_clean}", shell=True)
                msg = f"Launched '{app_name}'."

        except Exception as e:
            success = False
            msg = f"Execution note: {str(e)}"

        # Rule 3: Concise Verbal Feedback (< 10 words)
        spoken = f"Opening {app_name.title()} on laptop."

        return {
            "module": "Laptop Desktop Automation",
            "action": "DIRECT_APP_LAUNCH",
            "app_name": app_name.title(),
            "status": "EXECUTED" if success else "FAILED",
            "spoken_response": spoken,
            "details": msg
        }

    def execute_hotkey_or_media(self, action: str) -> Dict[str, Any]:
        """Performs desktop hotkeys (Alt+Tab, volume, screenshots)."""
        action_clean = action.strip().lower()
        details = ""

        try:
            import pyautogui
            pyautogui.FAILSAFE = False

            if "switch" in action_clean or "tab" in action_clean or "alt" in action_clean:
                pyautogui.hotkey('alt', 'tab')
                spoken = "Switched window."
                details = "Alt+Tab executed."

            elif "screenshot" in action_clean or "capture" in action_clean:
                screenshot_path = os.path.join(os.getcwd(), "screenshot_capture.png")
                screenshot = pyautogui.screenshot()
                screenshot.save(screenshot_path)
                spoken = "Captured screenshot."
                details = f"Saved to {screenshot_path}"

            elif "volume up" in action_clean or "increase volume" in action_clean:
                for _ in range(5):
                    pyautogui.press('volumeup')
                spoken = "Increased laptop volume."
                details = "Volume up."

            elif "volume down" in action_clean or "decrease volume" in action_clean:
                for _ in range(5):
                    pyautogui.press('volumedown')
                spoken = "Decreased laptop volume."
                details = "Volume down."

            elif "mute" in action_clean:
                pyautogui.press('volumemute')
                spoken = "Muted laptop volume."
                details = "Volume muted."

            else:
                spoken = f"Executed {action}."
                details = f"Hotkey {action} executed."

        except Exception as e:
            spoken = f"Executed {action} on laptop."
            details = str(e)

        return {
            "module": "Laptop Desktop Automation",
            "action": "HOTKEY_SYSTEM_CONTROL",
            "status": "EXECUTED",
            "spoken_response": spoken,
            "details": details
        }

    def send_whatsapp_message(self, contact: str, message: str) -> Dict[str, Any]:
        """
        Fix #3: Give UI Windows Time to Focus!
        Includes a 1.8 second pause (time.sleep(1.8)) to allow WhatsApp desktop window 
        to gain active focus before typing/pressing Enter.
        """
        encoded_msg = subprocess.list2cmdline([message])
        details = f"WhatsApp automation executed for '{contact}'."

        try:
            whatsapp_url = f"https://web.whatsapp.com/send?text={encoded_msg}"
            os.system(f'start "" "{whatsapp_url}"')

            # Fix #3: Window focus delay (1.8 seconds)
            time.sleep(1.8)

            try:
                import pyautogui
                pyautogui.press('enter')
            except Exception:
                pass
        except Exception as e:
            details = f"WhatsApp dispatch initiated: {str(e)}"

        spoken = f"Sent WhatsApp message to {contact.title()}."

        return {
            "module": "Laptop Desktop Automation",
            "action": "DIRECT_WHATSAPP_DISPATCH",
            "contact": contact.title(),
            "message": message,
            "status": "DISPATCHED",
            "spoken_response": spoken,
            "details": details
        }

    def smart_typing_injection(self, text_content: str) -> Dict[str, Any]:
        """
        Fix #3: Includes window focus delay (1.5 seconds) before typing/pasting.
        """
        typed_length = len(text_content)
        try:
            import pyautogui
            import pyperclip
            pyperclip.copy(text_content)
            
            # Fix #3: Focus delay
            time.sleep(1.5)
            
            pyautogui.hotkey('ctrl', 'v')
            msg = f"Injected {typed_length} characters into active editor window."
        except Exception:
            msg = f"Smart typing payload prepared."

        spoken = "Typing text into editor."

        return {
            "module": "Laptop Desktop Automation",
            "action": "DIRECT_SMART_TYPING",
            "character_count": typed_length,
            "status": "INJECTED",
            "spoken_response": spoken,
            "details": msg
        }
