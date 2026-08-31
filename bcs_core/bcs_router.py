"""
BCS Master Router (Optimized Master Prompt Engine)
Implements:
1. Strict Command Routing (MOBILE TASKS, LAPTOP TASKS, REASONING / PROBLEMS)
2. Parameter Extraction (Exact names, messages, app titles without modifying meaning)
3. Concise Verbal Feedback (< 10 words, plain text, no markdown bullets)
4. Missing Parameter Prompting (Asks concisely if required details are missing)
"""

import re
from typing import Dict, Any, Tuple, List, Optional
from .mobile_hub import MobileHub
from .laptop_node import LaptopNode
from .reasoning_engine import ReasoningEngine

class BCSRouter:
    SYSTEM_INSTRUCTION = """
    You are BCS, an ultra-precise, voice-first autonomous agent that controls a mobile device, a laptop, and solves technical problems.
    Your highest priorities are ACCURACY, SPEED, and ZERO AMBIGUITY.

    CORE OPERATING RULES:
    1. STRICT COMMAND ROUTING:
       - MOBILE TASKS: Direct phone calls, SMS, mobile apps (Instagram, Camera, Mobile YouTube). -> Call mobile tools.
       - LAPTOP TASKS: WhatsApp desktop messaging, opening PC apps (VS Code, Chrome, Spotify, Terminal), laptop volume, screenshots. -> Call laptop tools.
       - REASONING / PROBLEMS: Coding, debugging, math, circuit equations, SQL, definitions. -> Provide step-by-step reasoning first, then final result. If code requested, call file-writer tool.

    2. PARAMETER EXTRACTION:
       - Extract exact names, messages, app titles, and search queries from user's voice command.
       - For WhatsApp / Calls: Extract exact recipient name and exact message content without modifying user's meaning.

    3. CONCISE VERBAL FEEDBACK:
       - Keep spoken confirmations under 10 words.
       - Example good feedback: "Calling Rahul now." / "Sent WhatsApp message to Vinod." / "Opening VS Code on laptop."
       - Never output markdown formatting or bullet points when speaking back via voice unless asked.

    4. TOOL SELECTION RULES:
       - If a command requires multiple steps (e.g. "Open VS Code and text Mom"), trigger all required tools in sequence.
       - If action requires a missing parameter, briefly ask for the missing detail.
    """

    def __init__(self):
        self.mobile_hub = MobileHub()
        self.laptop_node = LaptopNode()
        self.reasoning_engine = ReasoningEngine()

    def clean_command(self, raw_prompt: str) -> str:
        """
        Fix #1: Clean voice transcript by stripping wake words, trailing punctuation, 
        so 'Dad.' -> 'Dad', 'Rahul?' -> 'Rahul', 'Mom!' -> 'Mom'.
        """
        prompt = raw_prompt.strip()
        prompt = re.sub(r'^(hey\s+bcs|bcs|hey\s+bcs\s+agent)[,\s!:]*', '', prompt, flags=re.IGNORECASE).strip()
        # Strip trailing punctuation marks
        prompt = re.sub(r'[\.\?\!\,\:\;\"]+$', '', prompt).strip()
        return prompt if prompt else raw_prompt.strip()

    def sanitize_spoken_feedback(self, text: str) -> str:
        """
        Rule 3: Ensure verbal feedback is under 10 words, plain text without markdown or bullets.
        """
        # Strip markdown symbols (*, _, #, `, >, -, +)
        clean_text = re.sub(r'[\*\_\#\`\>\-\+]', '', text).strip()
        words = clean_text.split()
        if len(words) > 9:
            clean_text = " ".join(words[:9]) + "."
        return clean_text

    def route_and_execute(self, raw_prompt: str) -> Dict[str, Any]:
        """
        Main entry point for BCS Agent.
        Parses voice prompt and routes accurately to Mobile, Laptop, Reasoning, or Dual-Node Execution.
        """
        command = self.clean_command(raw_prompt)
        cmd_lower = command.lower()

        # DUAL-NODE MULTI-EXECUTION ("open vs code and text mom", "call rahul on mobile then open vs code on laptop")
        if " then " in cmd_lower or " and then " in cmd_lower or (" on mobile" in cmd_lower and " on laptop" in cmd_lower) or ("open " in cmd_lower and " and text " in cmd_lower):
            parts = re.split(r'\s+then\s+|\s+and then\s+|\s+and text\s+', command, flags=re.IGNORECASE)
            if len(parts) >= 2:
                part1 = parts[0].strip()
                part2 = parts[1].strip()
                if "text" not in part2.lower() and "and text" in command.lower():
                    part2 = "text " + part2

                res1 = self._execute_single(part1)
                res2 = self._execute_single(part2)

                sp1 = self.sanitize_spoken_feedback(res1.get("spoken_response", ""))
                sp2 = self.sanitize_spoken_feedback(res2.get("spoken_response", ""))
                combined_spoken = self.sanitize_spoken_feedback(f"{sp1} {sp2}")

                return {
                    "agent": "BCS",
                    "wake_trigger": "Hey BCS",
                    "raw_prompt": raw_prompt,
                    "cleaned_command": command,
                    "routing_pipeline": {
                        "detected_intent": "DUAL_NODE_MULTI_INTENT",
                        "target_execution_node": "Mobile SIM Hub + Laptop Server Node",
                        "module_name": "Multi-Step Sequential Execution"
                    },
                    "execution_result": {
                        "status": "MULTI_STEP_SUCCESS",
                        "step_1": res1.get("execution_result"),
                        "step_2": res2.get("execution_result"),
                        "spoken_response": combined_spoken,
                        "details": "Multi-step command executed in sequence."
                    },
                    "spoken_response": combined_spoken,
                    "status": "SUCCESS"
                }

        return self._execute_single(command, raw_prompt=raw_prompt)

    def _execute_single(self, command: str, raw_prompt: Optional[str] = None) -> Dict[str, Any]:
        raw_prompt = raw_prompt or command
        cmd_lower = command.lower()

        # -------------------------------------------------------------
        # 1. MOBILE TASKS (Direct Phone Calls, SMS, Mobile Apps)
        # -------------------------------------------------------------
        if any(w in cmd_lower for w in ["call ", "dial ", "phone call", "ring ", "make a call"]):
            target = re.sub(r'^(call|dial|ring|make a call)\s+', '', command, flags=re.IGNORECASE)
            target = re.sub(r'\s+(on mobile|on phone|at|via)$', '', target, flags=re.IGNORECASE).strip()

            # Missing Parameter Rule: If recipient is missing
            if not target or target.lower() in ["someone", "person", "a call"]:
                exec_res = {
                    "module": "Mobile Communication Hub",
                    "status": "MISSING_PARAMETER",
                    "spoken_response": "Who would you like to call?"
                }
            else:
                exec_res = self.mobile_hub.initiate_phone_call(target)

            intent = "MOBILE_INTENT"
            target_node = "SIM Cellular Node"

        elif any(w in cmd_lower for w in ["send sms", "direct sms", "text message", "send text"]) and "whatsapp" not in cmd_lower:
            match = re.search(r'(?:sms|text)\s+([a-zA-Z0-9\s]+?)\s+(?:that|saying|message|with)\s+(.+)', command, re.IGNORECASE)
            if match:
                contact = match.group(1).strip()
                msg = match.group(2).strip()
                exec_res = self.mobile_hub.send_direct_sms(contact, msg)
            else:
                exec_res = {
                    "module": "Mobile Communication Hub",
                    "status": "MISSING_PARAMETER",
                    "spoken_response": "What message should I send?"
                }

            intent = "MOBILE_INTENT"
            target_node = "SIM Cellular Node"

        elif ("open " in cmd_lower or "launch " in cmd_lower) and any(kw in cmd_lower for kw in ["and search", "and play", "and find", "search for", "play "]) and any(app in cmd_lower for app in ["instagram", "youtube", "spotify", "camera"]):
            match = re.search(r'(?:open|launch)\s+([a-zA-Z0-9]+)\s+(?:and\s+)?(?:search\s+for|play|find)?\s*(.+)?', command, re.IGNORECASE)
            app_name = match.group(1).strip() if match else "instagram"
            query = match.group(2).strip() if match else "tech news"

            if "youtube" in app_name.lower() or "spotify" in app_name.lower():
                exec_res = self.mobile_hub.execute_deep_link(app_name, query)
            else:
                exec_res = self.mobile_hub.execute_accessibility_action(app_name, search_query=query)

            intent = "MOBILE_INTENT"
            target_node = "Android Accessibility & System Engine"

        elif ("open " in cmd_lower or "launch " in cmd_lower) and ("mobile" in cmd_lower or any(app in cmd_lower for app in ["instagram", "camera", "phone", "contacts", "messages", "maps", "settings"])):
            app_match = re.search(r'(?:open|launch)\s+([a-zA-Z0-9\s]+)', cmd_lower)
            app_name = app_match.group(1).replace("on mobile", "").strip() if app_match else command
            exec_res = self.mobile_hub.launch_android_app(app_name)
            intent = "MOBILE_INTENT"
            target_node = "Android PackageManager Registry"

        else:
            intent = None

        if intent == "MOBILE_INTENT":
            return self._build_response(raw_prompt, command, intent, target_node, exec_res)

        # -------------------------------------------------------------
        # 2. LAPTOP TASKS (WhatsApp Desktop, PC Apps, Volume, Screenshot)
        # -------------------------------------------------------------
        if "whatsapp" in cmd_lower or ("text " in cmd_lower and "on whatsapp" in cmd_lower):
            # Parameter Extraction for WhatsApp
            match = re.search(r'(?:whatsapp|text)\s+([a-zA-Z0-9\s]+?)\s+(?:on\s+whatsapp\s+)?(?:saying|that|message)?\s+(.+)', command, re.IGNORECASE)
            contact = match.group(1).replace("on whatsapp", "").strip() if match else ""
            msg = match.group(2).strip() if match else ""

            # Filter out noise words captured as contact
            if contact.lower() in ["text", "a whatsapp text", "message", "a text", "someone", ""]:
                contact = ""

            if contact and msg:
                exec_res = self.laptop_node.send_whatsapp_message(contact, msg)
            elif contact and not msg:
                exec_res = {
                    "module": "Laptop Desktop Automation",
                    "status": "MISSING_PARAMETER",
                    "spoken_response": f"What message for {contact.title()}?"
                }
            else:
                exec_res = {
                    "module": "Laptop Desktop Automation",
                    "status": "MISSING_PARAMETER",
                    "spoken_response": "Who would you like to text on WhatsApp?"
                }

            intent = "LAPTOP_INTENT"
            target_node = "Server Desktop Execution Engine"

        elif any(w in cmd_lower for w in ["open ", "launch ", "run ", "start "]) and any(app in cmd_lower for app in ["vscode", "vs code", "chrome", "spotify", "terminal", "cmd", "excel", "notepad", "calculator", "calc", "browser", "explorer", "edge", "laptop"]):
            app_match = re.search(r'(?:open|launch|run|start)\s+([a-zA-Z0-9\s]+)', cmd_lower)
            app_name = app_match.group(1).replace("on laptop", "").strip() if app_match else command
            exec_res = self.laptop_node.launch_application(app_name)
            intent = "LAPTOP_INTENT"
            target_node = "Server Desktop Execution Engine"

        elif any(w in cmd_lower for w in ["switch window", "alt tab", "alt+tab", "screenshot", "capture screen", "volume up", "volume down", "turn volume", "mute"]):
            exec_res = self.laptop_node.execute_hotkey_or_media(cmd_lower)
            intent = "LAPTOP_INTENT"
            target_node = "Server Desktop Execution Engine"

        elif any(w in cmd_lower for w in ["type this", "smart typing", "write in editor", "inject text", "paste text"]):
            text_payload = re.sub(r'^(type this|smart typing|write in editor|inject text|paste text)[:\s]*', '', command, flags=re.IGNORECASE)
            exec_res = self.laptop_node.smart_typing_injection(text_payload)
            intent = "LAPTOP_INTENT"
            target_node = "Server Desktop Execution Engine"

        if intent == "LAPTOP_INTENT":
            return self._build_response(raw_prompt, command, intent, target_node, exec_res)

        # -------------------------------------------------------------
        # 3. REASONING / PROBLEMS (Coding, Debugging, Math, Circuit, SQL)
        # -------------------------------------------------------------
        if any(w in cmd_lower for w in ["circuit", "rectifier", "op-amp", "opamp", "gain", "ripple", "boolean", "logic gate", "k-map", "solve", "formula", "math"]):
            exec_res = self.reasoning_engine.solve_circuit(command)
            intent = "REASONING_INTENT"
            target_node = "Gemini Reasoning Engine"

        elif any(w in cmd_lower for w in ["code", "script", "algorithm", "python", "c program", "sql", "query", "write code", "fix bug", "generate program"]):
            exec_res = self.reasoning_engine.generate_code_and_execute(command)
            intent = "REASONING_INTENT"
            target_node = "Gemini Reasoning Engine"

        else:
            exec_res = self.laptop_node.launch_application(command)
            intent = "LAPTOP_INTENT"
            target_node = "Server Desktop Execution Engine"

        return self._build_response(raw_prompt, command, intent, target_node, exec_res)

    def _build_response(self, raw_prompt: str, cleaned_command: str, intent: str, target_node: str, module_output: Dict[str, Any]) -> Dict[str, Any]:
        raw_spoken = module_output.get("spoken_response", "Command executed.")
        clean_spoken = self.sanitize_spoken_feedback(raw_spoken)

        return {
            "agent": "BCS",
            "system_instruction": "BCS Master Prompt Active",
            "wake_trigger": "Hey BCS",
            "raw_prompt": raw_prompt,
            "cleaned_command": cleaned_command,
            "routing_pipeline": {
                "detected_intent": intent,
                "target_execution_node": target_node,
                "module_name": module_output.get("module", "BCS Core")
            },
            "execution_result": module_output,
            "spoken_response": clean_spoken, # < 10 words, no markdown
            "status": "SUCCESS"
        }
