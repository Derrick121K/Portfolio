STUDYFLOW FINAL PROTOTYPE — VERIFICATION RECORD
Student: Derrick Aaron Mohale Kapa
Student number: ST10445255
Module: HCN6222

FEATURES INCLUDED
- Dashboard with active, due-soon, overdue and completed summaries.
- Add and edit tasks with required-field validation.
- Task search, status filter and priority filter.
- Mark task complete or reopen; delete after confirmation.
- Month calendar with task events and month navigation.
- Multi-task study-plan sharing via clipboard/prompt fallback.
- Text-size, reduce-motion and high-contrast preferences.
- Browser notification permission request and page-open reminder checks.
- JSON backup export and import after confirmation.
- Responsive mobile layout and keyboard focus handling.

VERIFICATION BOUNDARIES
Browser notification delivery requires user permission in a secure context. Data is browser-local and is not synchronised. The app has no server authentication, central database or multi-user collaboration backend. WCAG conformance is not certified; manual testing with assistive technology and representative users remains recommended.

LOCAL RUN
Open index.html in a modern browser or use: python -m http.server 8000
