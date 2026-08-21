#!/usr/bin/env python3
import importlib.util
import os
import unittest

ROOT = os.path.join(os.path.dirname(__file__), "..")
spec = importlib.util.spec_from_file_location("tour_lights", os.path.join(ROOT, "tour-lights.py"))
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


class MatchTests(unittest.TestCase):
    def test_super_and_space(self):
        leds = ["Key: Left Windows", "Key: A", "Key: Space", "Key: Left Control"]
        self.assertEqual(mod.matching_indices(["Super", "Space"], leds), [0, 2])

    def test_left_arrow_not_left_windows(self):
        leds = ["Key: Left Windows", "Key: Left Arrow", "Key: Left Control"]
        self.assertEqual(mod.matching_indices(["Left"], leds), [1])

    def test_letter_t_not_control(self):
        leds = ["Key: Left Control", "Key: T", "Key: Tab"]
        self.assertEqual(mod.matching_indices(["T"], leds), [1])

    def test_skips_mouse(self):
        leds = ["Key: Left Windows", "Key: A"]
        self.assertEqual(mod.matching_indices(["Super", "Mouse L"], leds), [0])

    def test_ctrl_alt_tab(self):
        leds = ["Key: Left Control", "Key: Left Alt", "Key: Tab", "Key: Left Windows"]
        self.assertEqual(mod.matching_indices(["Ctrl", "Alt", "Tab"], leds), [0, 1, 2])


if __name__ == "__main__":
    unittest.main()
