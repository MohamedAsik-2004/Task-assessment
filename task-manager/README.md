# TaskFlow — Task Management Web App

A responsive task management app built with React (functional components + hooks only).

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

To create a production build:

```bash
npm run build
npm run preview
```

## How it works

### Folder structure

```
src/
  components/
    Login.jsx               # Email/password validation, no backend
    Dashboard.jsx            # Owns filter/sort/modal UI state, derives stats
    TaskForm.jsx             # Add/Edit modal with validation
    TaskList.jsx             # Renders TaskItem list or empty state
    TaskItem.jsx             # Single task card
    SearchFilterBar.jsx      # Search input + status/priority/sort dropdowns
  App.jsx                    # Top-level state: auth flag + tasks array, routing
  main.jsx                   # ReactDOM root, wraps App in BrowserRouter
  index.css                  # All styling (plain CSS, no framework)
```

### State management

- `App.jsx` is the single source of truth for `isLoggedIn` and `tasks`.
  Both are lazily initialised from `localStorage` inside `useState(() => ...)`,
  and a `useEffect` on `tasks` writes them back to `localStorage` on every
  change — this is the entire persistence layer.
- Task data is passed down as props (`tasks`, `setTasks`) to `Dashboard`,
  which owns all the UI-only state (search term, filters, sort, which
  modal is open). This keeps the data flow one-directional and easy to
  trace: state lives at the top, actions are passed down as callbacks,
  and children call those callbacks instead of mutating anything directly.
- No Redux/Context was needed because the component tree is shallow —
  props are enough to keep it explainable.

### Search / filter / sort

All three live in `Dashboard.jsx` as a single `useMemo` pipeline:
`tasks -> filter by title -> filter by status -> filter by priority -> sort`.
Because it's memoised, this only re-runs when `tasks` or one of the
control values changes, not on every render.

### Validation

- Login: regex check for email shape, password length >= 6.
- Task form: title, due date, and priority are required. Errors are
  tracked in a small `errors` object and rendered under each field.

### Local storage

Two keys are used: `taskflow_tasks` (the task array) and `taskflow_auth`
(whether the user is logged in), so refreshing the page keeps both your
session and your data.

### Responsive design

Plain CSS with two breakpoints (900px for tablet, 560px for mobile):
the stat cards go from a 4-column to a 2-column grid, the toolbar and
filter bar stack vertically, and task cards stack their content instead
of sitting side-by-side.

## Notes for review

Everything is intentionally kept to plain hooks (useState, useEffect,
useMemo) and native array methods (filter, map, sort) rather than
extra libraries, so each piece of logic is easy to point to and explain.
