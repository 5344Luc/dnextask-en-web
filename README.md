# dNextask-en

A ClickUp-style enterprise project management SaaS, built as a **Modular Monolith** using Clean Architecture principles on the backend and a decoupled React SPA on the frontend.

---

## Repositories

| Repo | Description | Status |
|---|---|---|
| `dnextask-en` | Laravel 12 backend (API) | ✅ Fully Complete |
| `dnextask-en-web` | React 18 + TypeScript frontend (SPA) | 🚧 In Progress (Phase-by-phase) |

---

## Tech Stack

### Backend
- **Framework:** Laravel 12.61.0, PHP 8.3
- **Database:** PostgreSQL 18.3 — three schemas (`auth`, `app`, `public`), three connections (`pgsql`, `pgsql_auth`, `pgsql_app`)
- **Auth:** Laravel Sanctum
- **Real-time:** Laravel Reverb (WebSockets)
- **Email:** Resend
- **IDs:** `ramsey/uuid` 4.9.2 (UUIDv7), human-readable `public_ids` (e.g. `TSK-260606000001`)
- **Queue:** Database driver

### Frontend
- **Build tool:** Vite
- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind v4 (`@tailwindcss/vite`, CSS-based `@theme`, no `tailwind.config.ts`)
- **Server state:** TanStack Query v5
- **Client state:** Zustand (persist middleware)
- **Routing:** TanStack Router (code-based, `createRoute()`)
- **Forms:** React Hook Form + Zod
- **Rich text:** TipTap (core/free)
- **Drag & drop:** `@dnd-kit/core`
- **Real-time:** Laravel Echo + Pusher JS
- **Icons:** Flaticon Uicons (`fi-rr` Regular Rounded default; `fi-tr`, `fi-br` used selectively)
- **Deploy target:** `dev.lucdnextask.ph`

---

## Architecture Rules (Backend — Non-Negotiable)

The backend follows a **Modular Clean Architecture**, enterprise-grade, similar in spirit to .NET Clean Architecture. Full ruleset below.

### 1. Core Rule
All features are implemented inside **Modules**, never in a flat `app/` structure. Each module is fully independent and contains a Domain, Application, Infrastructure, and Presentation layer.

### 2. Required Folder Structure
```
app/Modules/{ModuleName}/
├── Domain/
│   ├── Entities/
│   ├── ValueObjects/
│   ├── Enums/
│   ├── Repositories/
│   ├── Events/
│   ├── Exceptions/
│   └── Services/
├── Application/
│   ├── Commands/
│   ├── Queries/
│   ├── Handlers/
│   ├── DTOs/
│   └── Validators/
├── Infrastructure/
│   ├── Persistence/
│   │   ├── Models/
│   │   ├── Repositories/
│   │   ├── Migrations/
│   │   └── Seeders/
│   ├── ExternalServices/
│   ├── Notifications/
│   └── Queue/
└── Presentation/
    ├── Http/
    │   ├── Controllers/
    │   ├── Requests/
    │   ├── Resources/
    │   └── Middleware/
    └── Routes/
```

### 3. Module Isolation Rule
Modules must **not** directly access each other's internal layers. Cross-module communication happens only via Events (preferred), Interfaces, or DTOs. No direct Eloquent model usage across modules.

### 4. Domain First Rule
All business logic lives in the **Domain** layer — never in Controllers, Models, Requests, or Repository implementations.

### 5. Application Layer Rule (CQRS Style)
Every use case is a **Command** (write) or **Query** (read), executed by a **Handler**. Controllers only call Handlers.

### 6. Infrastructure Rule
Infrastructure only handles DB, external APIs, file storage, email/notifications, and queues — never business logic.

### 7. Presentation Layer Rule
Controllers are thin: HTTP handling, request validation, response formatting only. No business logic, no direct DB calls.

### 8. Repository Rule
Interfaces live in `Domain/Repositories`; implementations live in `Infrastructure/Persistence/Repositories`; bindings happen in Service Providers.

### 9. Testing Requirement (TDD Mandatory)
Every feature requires Unit tests (Domain logic), Feature tests (API endpoints), and Integration tests (Repositories, where applicable).

### 10. Default Module List
Task Management, Helpdesk/Ticketing, Recruitment/ATS, Asset Management, User/Auth, Notification, Activity Log.

### 11. Architecture Priority Rule
Domain correctness → Testability → Modularity → Performance → Framework convenience. Never sacrifice architecture for shortcuts.

### 12. Golden Rule
**If logic doesn't belong to UI, database, or framework — it belongs to the Domain layer.**

> **P.S.** Do not proceed to the next step if the previous step is not yet completed.

---

## Backend — Completed Modules (14/14)

All modules below are **fully implemented, Postman-verified**, totaling **153 endpoints**.

| # | Module | Highlights |
|---|---|---|
| 1 | User / Auth | Sanctum-based auth, register/login/me/logout |
| 2 | Workspace | CRUD, members, plan gating |
| 3 | Space | CRUD, private spaces |
| 4 | Folder | CRUD, nested under Space |
| 5 | TaskList | CRUD, nested under Space/Folder |
| 6 | Task | CRUD, subtasks, assignees, status changes, plan gating |
| 7 | CustomField | EAV pattern — Text/Dropdown/Checkbox, attach/detach per list |
| 8 | TimeTracking | Start/stop timers, manual entries, workspace reports |
| 9 | Comment / Attachment | Threaded comments, file attachments on tasks/comments |
| 10 | ActivityLog | 26 events across 8 modules, single `ActivityLogListener` |
| 11 | Notification | Watch/unwatch tasks, preferences, Reverb broadcast, Resend email |
| 12 | Doc/Wiki | Nested docs, revisions, workspace + space scoped |
| 13 | Goal/OKR | Goals, key results, progress tracking |
| 14 | Chat | Slack-style channels (public/private/DM/group), threads, reactions, pin, presence, typing, unread counts, search — 8 Reverb broadcast events |
| — | Dashboard | 9 widget types, `WidgetDataResolver` strategy pattern, 5-min cache, sharing |

**Verified route prefix:** all backend routes are versioned under `/api/v1/...` (confirmed via `php artisan route:list`).

---

## Frontend — Phase-by-Phase Plan

The frontend (`dnextask-en-web`) is built **module by module**, following the same discipline as the backend's P.S. rule: **a phase is not considered complete until Create, Read, Update, and Delete (where applicable) are all working end-to-end against the real API.**

### ✅ Phase 0 — Foundation (Complete)
- Auth (Login/Register pages)
- AppShell (NavRail + SecondarySidebar + TopBar)
- WorkspacesPage
- WorkspaceHome dashboard (stat cards placeholder)
- Theme system — 9 themes (Light, Dark, Corporate, Bumblebee, Emerald, Garden, Lemonade, Sunset, Winter), DaisyUI-accurate OKLCH→hex palettes, no flash-on-reload
- Icon system — Flaticon Uicons (`fi-rr` default), swapped from Lucide React
- Collapsible sidebar with animation, ClickUp-style squircle "N" badge + expand/collapse toggle inside NavRail

### ✅ Phase A — Space Module (Complete)
- Create Space (modal)
- List Spaces (sidebar tree)
- Update Space (edit modal)
- Delete Space (confirmation dialog)
- Space Settings page — General tab (name/description/color/privacy), Members tab (read-only, inherits Workspace members — **no dedicated Space-members endpoint exists**), Danger Zone tab (delete with type-to-confirm)

### 🚧 Phase B — Folder Module (Next)
- Create Folder (modal — not yet built)
- List Folders (sidebar tree — working, read-only so far)
- Update Folder
- Delete Folder

### ⬜ Phase C — TaskList Module
- ✅ Create List
- ✅ List Lists (sidebar)
- ⬜ Update List
- ⬜ Delete List

### ⬜ Phase D — Task Module
- ✅ Create Task
- ✅ List view
- ✅ Board view (Kanban, `@dnd-kit`, drag-to-change-status)
- ✅ Calendar view (month grid, due-date grouping)
- ✅ Gantt view (timeline bars, today marker)
- ⬜ Task Detail page (comments, attachments, subtasks, custom fields)
- ⬜ Update Task (edit modal/inline)
- ⬜ Delete Task
- ⬜ Assignees (add/remove)

### ⬜ Phase E — CustomField Module
### ⬜ Phase F — TimeTracking Module
### ⬜ Phase G — Comment / Attachment Module
### ⬜ Phase H — ActivityLog Module
### ⬜ Phase I — Notification Module
### ⬜ Phase J — Doc/Wiki Module
### ⬜ Phase K — Goal/OKR Module
### ⬜ Phase L — Chat Module
### ⬜ Phase M — Dashboard Module (wire stat cards + widgets to live data)

---

## Deferred / Backlog Items

These are intentionally postponed and tagged, not forgotten:

| Item | Reason Deferred |
|---|---|
| Computed/System Fields (`aging_days`, `time_in_status_days`, `is_overdue`) | Requires `status_changed_at` column on tasks |
| True Formula Builder (user-defined expressions) | Airtable-tier complexity, needs dedicated design pass |
| TipTap collaborative editing | Needs infra planning (conflict resolution) |
| Google/Microsoft OAuth | Needs Google Cloud Console + Azure AD app registration |
| Slug-based URLs (Workspace has a slug column already; Space/List/Task do not) | Would require Domain-layer slug generation + collision handling per module, plus a parallel frontend routing refactor across every module already built. Deferred as its own dedicated phase **after** all CRUD phases (A–M) are complete, rather than retrofitted mid-stream. Current UUID-based URLs are enterprise-standard practice (same approach as Notion) and are not a functional problem. |
| Space-level member management UI | No dedicated `/spaces/{id}/members` backend endpoint exists — Spaces inherit Workspace membership by design. Settings page's Members tab is read-only/informational for this reason, not an unfinished feature. |

---

## Key Learnings & Hard-Won Fixes

### Backend
- `CommandHandlerInterface::handle()` return type must be `mixed`, not `void`
- `BaseValueObject::equals()` uses `instanceof` checks against `BaseValueObject`
- Domain exceptions need a `render()` method; shared exceptions live in `App\Shared\Exceptions`
- Routes are loaded via `glob()` in `bootstrap/app.php` only — never `loadRoutesFrom()` in Service Providers
- Self-referencing FKs are added in a second `Schema::table()` call, after `Schema::create()`
- `Carbon → DateTimeImmutable`: use `->toDateTimeString()`/`->toDateString()`, not a direct constructor pass
- `WidgetDataResolver` column names must match real Eloquent columns exactly (e.g. `status_id`/`status_category`, not `status`)

### Frontend
- **API base URL versioning:** all real backend routes are under `/api/v1/...`. `.env`'s `VITE_API_URL` is `http://localhost:8000/api` (no `/v1`) — so every hook must include `/v1` explicitly in its endpoint path. **Do not change `.env`** — earlier attempts to "fix" this by adding `/v1` to `.env` broke previously-working calls; the correct fix is `/v1` in each hook's URL string.
- Global `* { padding: 0; margin: 0 }` resets override Tailwind padding utilities — only `box-sizing: border-box` on `*`, `margin: 0` on `body` only.
- Backend login response field is `access_token`, not `token`; register requires `password_confirmation`.
- Theme flash-on-reload requires a synchronous inline script in `index.html <head>`, before React mounts — Zustand's `persist` rehydration alone is too late (runs after first paint).
- Dropdown/modal/toast backgrounds must use inline `style={{ backgroundColor: 'var(--color-base-100)' }}` rather than Tailwind arbitrary-value classes (`bg-[var(--color-base-100)]`) — more reliable for dynamically-toggled elements.
- `DragEndEvent`/`DragStartEvent` from `@dnd-kit/core` are TypeScript types, not runtime exports — must use `import type`.
- Flaticon Uicons valid prefixes are only: `rr, br, sr, rs, bs, ss, tr, ts, brands` — no `sc`, `rc`, or `tc` ("classic" is not a real corner-style, only rounded/straight exist).

---

## Postman Reference IDs

| Resource | ID |
|---|---|
| `workspaceId` | `019eb096-1f32-713b-8503-8af8f3155c92` |
| `spaceId` | `019eb660-6346-72c9-886f-9d088f15e2fa` |
| `listId` | `019ed3a5-9a91-7256-8c9a-0f849b79e7bd` |
| `taskId` | `019ed3ac-feff-71c3-b542-0b56580bcb9b` |

---

## Development Environment

- **OS:** Windows + PowerShell
- **Backend local URL:** `http://localhost:8000/api/v1`
- **Frontend dev server:** Vite (`npm run dev`)
- **Active git branch:** `feature/phase-5-task-module`

---

## Working Agreement

1. **Phase discipline:** a module's frontend phase is not "done" until Create, Read, Update, Delete (as applicable) all work against the live backend — verified in-browser, not assumed.
2. **Verify before fixing:** when a URL/endpoint mismatch is suspected, confirm against `php artisan route:list` (ground truth) before changing any frontend code or `.env`.
3. **One module at a time:** per the backend's own P.S. rule, we do not start a new module's frontend work until the current one is closed out.
