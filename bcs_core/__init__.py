"""
BCS Agent: Unified Voice-First Ecosystem
Package initializer for BCS Core components:
- bcs_router: Intent Classification & Routing Engine
- mobile_hub: Module A - Mobile Communication Hub
- laptop_node: Module B - Laptop Desktop Automation Engine
- reasoning_engine: Module C - The Problem-Solving Engine
"""

from .mobile_hub import MobileHub
from .laptop_node import LaptopNode
from .reasoning_engine import ReasoningEngine
from .bcs_router import BCSRouter

__all__ = ["MobileHub", "LaptopNode", "ReasoningEngine", "BCSRouter"]
