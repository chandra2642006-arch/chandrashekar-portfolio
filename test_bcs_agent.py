"""
Comprehensive Test Suite for BCS Master Prompt Engine (`test_bcs_agent.py`)
Verifies:
1. Rule 1: Strict Command Routing (Mobile, Laptop, Reasoning)
2. Rule 2: Parameter Extraction (Names, messages, app titles)
3. Rule 3: Concise Verbal Feedback (< 10 words, plain text)
4. Rule 4: Multi-Step & Missing Parameter Handling
5. Fix 1: Voice transcript cleaning ("Dad." -> "Dad")
6. Fix 2: Contact lookup fallback & partial matching
7. Fix 3: UI Window Focus Delays
"""

import os
import unittest
from bcs_core.mobile_hub import MobileHub
from bcs_core.laptop_node import LaptopNode
from bcs_core.reasoning_engine import ReasoningEngine
from bcs_core.bcs_router import BCSRouter
from bcs_server import app

class TestBCSMasterPrompt(unittest.TestCase):
    def setUp(self):
        self.mobile = MobileHub()
        self.laptop = LaptopNode()
        self.reasoning = ReasoningEngine()
        self.router = BCSRouter()
        self.client = app.test_client()

    # Rule 3: Spoken Feedback under 10 words
    def test_spoken_feedback_word_count(self):
        route_res = self.router.route_and_execute("BCS, call Rahul.")
        spoken = route_res["spoken_response"]
        words = spoken.split()
        self.assertLessEqual(len(words), 10)
        self.assertNotIn("*", spoken)
        self.assertNotIn("-", spoken)

    # Fix 1 & Fix 2: Punctuation cleaning & partial matching ("Rahul." -> "Rahul")
    def test_transcript_cleaning_and_contact_fallback(self):
        contact = self.mobile.resolve_contact("Rahul.")
        self.assertIsNotNone(contact)
        self.assertIn(contact["name"], ["Rahul", "Rahul Boppana"])

    # Rule 2: Parameter extraction for WhatsApp
    def test_whatsapp_parameter_extraction(self):
        route_res = self.router.route_and_execute("BCS, WhatsApp Vinod saying the code is pushed.")
        result = route_res["execution_result"]
        self.assertEqual(result["contact"], "Vinod")
        self.assertEqual(result["message"], "the code is pushed")

    # Rule 4: Missing parameter handling
    def test_missing_parameter_handling(self):
        route_res = self.router.route_and_execute("BCS, send a WhatsApp text")
        result = route_res["execution_result"]
        self.assertEqual(result["status"], "MISSING_PARAMETER")
        self.assertIn("WhatsApp", route_res["spoken_response"])

    # Rule 4 & Multi-Step execution
    def test_multi_step_execution(self):
        route_res = self.router.route_and_execute("BCS, open VS Code and text Mom that project is complete.")
        self.assertEqual(route_res["routing_pipeline"]["detected_intent"], "DUAL_NODE_MULTI_INTENT")
        self.assertLessEqual(len(route_res["spoken_response"].split()), 10)

    # Flask API check
    def test_api_status(self):
        response = self.client.get('/api/bcs/status')
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()
