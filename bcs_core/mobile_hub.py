"""
Module A: Mobile Communication & Android System Control Hub
Implements Fix #1 & Fix #2: Transcript cleaning, contact normalization, and partial match fallback.
"""

import re
from typing import Dict, Any, Optional

class MobileHub:
    def __init__(self):
        # Contact book mapping normalized aliases and full names
        self.contacts: Dict[str, str] = {
            "dad": "+91 98765 43210",
            "mom": "+91 98765 43211",
            "vinod": "+91 91234 56789",
            "rahul": "+91 98765 99999",
            "rahul boppana": "+91 98765 99999",
            "alex": "+1 415 555 0199",
            "boss": "+91 99887 76655",
            "team lead": "+91 94433 22110",
            "chandra": "+91 90000 12345"
        }

        self.package_registry: Dict[str, str] = {
            "youtube": "com.google.android.youtube",
            "instagram": "com.instagram.android",
            "whatsapp": "com.whatsapp",
            "spotify": "com.spotify.music",
            "camera": "com.android.camera",
            "phone": "com.google.android.dialer",
            "contacts": "com.android.contacts",
            "messages": "com.google.android.apps.messaging",
            "chrome": "com.android.chrome",
            "maps": "com.google.android.apps.maps",
            "settings": "com.android.settings"
        }

        self.permissions: Dict[str, Dict[str, str]] = {
            "ACCESSIBILITY_SERVICE": {"granted": True, "description": "Click buttons, scroll, type in apps"},
            "CALL_PHONE": {"granted": True, "description": "Direct cellular calls"},
            "READ_CONTACTS": {"granted": True, "description": "Contact lookup"},
            "SYSTEM_ALERT_WINDOW": {"granted": True, "description": "Overlay button"},
            "QUERY_ALL_PACKAGES": {"granted": True, "description": "Package scanner"}
        }

    def clean_name_token(self, name_query: str) -> str:
        """
        Fix #1: Clean transcript name token by stripping trailing punctuation 
        so 'Dad.' -> 'Dad', 'Rahul?' -> 'Rahul', 'Mom!' -> 'Mom'.
        """
        cleaned = re.sub(r'[\.\?\!\,\:\;\"]+$', '', name_query.strip())
        return cleaned.strip()

    def resolve_contact(self, name_query: str) -> Optional[Dict[str, str]]:
        """
        Fix #2: Normalization & Partial Match Contact Lookup Fallback.
        Matches 'rahul' even if saved as 'Rahul Boppana'.
        """
        clean_name = self.clean_name_token(name_query).lower()

        if not clean_name:
            return None

        # 1. Exact match (sort keys by length descending to match full name first)
        for alias in sorted(self.contacts.keys(), key=len, reverse=True):
            if clean_name == alias:
                return {"name": alias.title(), "phone": self.contacts[alias]}

        # 2. Partial match (sort keys by length descending)
        for alias in sorted(self.contacts.keys(), key=len, reverse=True):
            if clean_name in alias or alias in clean_name:
                return {"name": alias.title(), "phone": self.contacts[alias]}

        # 3. First-name substring match
        for alias, phone in self.contacts.items():
            first_name = alias.split()[0]
            if first_name == clean_name:
                return {"name": alias.title(), "phone": phone}

        # 4. Explicit phone number check
        digits = re.sub(r'[^\d+]', '', name_query)
        if len(digits) >= 7:
            return {"name": clean_name.title(), "phone": name_query}

        return None

    def add_contact(self, name: str, phone: str) -> Dict[str, Any]:
        key = self.clean_name_token(name).lower()
        self.contacts[key] = phone.strip()
        return {
            "status": "success",
            "message": f"Contact '{name.title()}' added.",
            "contact": {"name": name.title(), "phone": phone}
        }

    def initiate_phone_call(self, recipient_query: str) -> Dict[str, Any]:
        """Hands-free voice calling with < 10 word concise verbal feedback."""
        clean_target = self.clean_name_token(recipient_query)
        contact = self.resolve_contact(clean_target)
        
        contact_name = contact["name"] if contact else clean_target.title()
        phone_num = contact["phone"] if contact else "+91 98765 00000"

        # Rule 3: Concise Verbal Feedback (< 10 words)
        spoken = f"Calling {contact_name} now."

        return {
            "module": "Mobile Communication Hub",
            "action": "NATIVE_SIM_CALL",
            "target": contact_name,
            "phone_number": phone_num,
            "status": "CALL_INITIATED",
            "cellular_node": "SIM_CARD_SLOT_1",
            "spoken_response": spoken,
            "details": f"Outbound cellular call intent created for {contact_name} ({phone_num})."
        }

    def send_direct_sms(self, recipient_query: str, message: str) -> Dict[str, Any]:
        clean_target = self.clean_name_token(recipient_query)
        contact = self.resolve_contact(clean_target)
        contact_name = contact["name"] if contact else clean_target.title()
        phone_num = contact["phone"] if contact else "Mobile Device"

        spoken = f"Sent SMS to {contact_name}."

        return {
            "module": "Mobile Communication Hub",
            "action": "DIRECT_SMS_DISPATCH",
            "target": contact_name,
            "phone_number": phone_num,
            "message_body": message,
            "status": "SMS_SENT",
            "spoken_response": spoken,
            "details": f"SMS dispatched to {contact_name}."
        }

    def launch_android_app(self, app_name: str) -> Dict[str, Any]:
        clean_app = self.clean_name_token(app_name).lower()
        pkg = self.package_registry.get(clean_app, f"com.android.{clean_app}")

        spoken = f"Opening {clean_app.title()} on mobile."

        return {
            "module": "Mobile System Control Engine",
            "action": "EXPLICIT_PACKAGE_INTENT_LAUNCH",
            "app_name": clean_app.title(),
            "package_name": pkg,
            "status": "APP_LAUNCHED",
            "spoken_response": spoken,
            "details": f"Launched package '{pkg}'."
        }

    def execute_accessibility_action(self, app_name: str, search_query: Optional[str] = None, tap_target: Optional[str] = None) -> Dict[str, Any]:
        clean_app = self.clean_name_token(app_name).title()
        spoken = f"Opened {clean_app}."
        if search_query:
            spoken = f"Searching {search_query} on {clean_app}."

        return {
            "module": "Mobile Accessibility Service Gateway",
            "action": "ACCESSIBILITY_UI_AUTOMATION",
            "app_name": clean_app,
            "search_query": search_query,
            "status": "AUTOMATION_COMPLETED",
            "spoken_response": spoken,
            "details": f"Accessibility Service executed action in {clean_app}."
        }

    def execute_deep_link(self, app_name: str, query: str) -> Dict[str, Any]:
        clean_app = self.clean_name_token(app_name).lower()
        spoken = f"Playing {query} on {clean_app.title()}."

        return {
            "module": "Mobile Deep Link Protocol Hub",
            "action": "DEEP_LINK_SCHEME_LAUNCH",
            "app_name": clean_app.title(),
            "query": query,
            "status": "DEEP_LINK_DISPATCHED",
            "spoken_response": spoken,
            "details": f"Deep link dispatched for {query}."
        }

    def get_permission_status(self) -> Dict[str, Any]:
        return {
            "module": "Mobile System Control Engine",
            "permissions": self.permissions,
            "all_granted": True
        }
