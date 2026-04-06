# CareFlow – Smart Hospital & Patient Platform

## Overview
A web prototype simulating a dual-sided healthcare platform:
- **Patient Side** – symptom input, AI triage, queue status
- **Hospital/Staff Side** – live dashboard, doctor availability, patient flow

## Tech Stack
- Pure HTML, CSS, JavaScript (no frameworks, must work on GitHub Pages)
- Simulate AI responses with mock logic (no real API needed for prototype)
- Mobile-responsive design

## Pages & Features

### 1. Patient Portal (`/patient`)
- Symptom input form (text + checklist)
- "AI Triage" result screen showing: urgency level, suggested department, estimated wait
- Queue status screen showing position and live updates (simulated)
- SMS fallback message shown as a UI panel

### 2. Hospital Dashboard (`/dashboard`)
- Live patient queue table (name, symptoms, triage level, department, wait time)
- Department status cards (Emergency, General, Pediatrics, etc.)
- Doctor availability toggle (Available / Busy / Off Duty)
- Bottleneck alert banner when a department queue exceeds 5 patients

### 3. Shared Logic
- LocalStorage to pass patient data between pages (simulates a database)
- Color-coded triage: Red (Critical), Orange (Urgent), Green (Non-urgent)
- Auto-refresh dashboard every 10 seconds (simulated)

## Design Style
- Clean, clinical white + blue color palette
- Large tap-friendly buttons (mobile first)
- Simple sans-serif font (Inter or system font)
