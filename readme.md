# Co-Living Harmony  🏠

**Co-Living Harmony** is a centralized web dashboard designed to seamlessly manage shared living spaces. It aims to eliminate the friction commonly found in roommate situations by offering a unified interface for rent tracking, expense splitting, chore rotations, group communication, and managing overall house "vibes."

With dedicated, role-based views for the **House Admin** (Leaseholder/Manager) and the **Roommates** (Tenants), this platform ensures accountability, transparency, and a peaceful co-living experience.

---

## 🌟 Key Features

### 1. 🔐 Role-Based Access Control
The platform natively supports two distinct user roles, each with specialized permissions and views:
- **House Admin:** The creator of the house who dictates monthly rent, security deposits, and manages the house's UPI payment details. Admins have the authority to invite/remove roommates and approve/reject submitted rent receipts.
- **Roommate:** Invited members who can view their specific financial obligations, submit payment proofs, declare their availability, and interact with the shared house boards.

### 2. 💸 Financial Management & Rent Tracking
- **Automated Calculations:** Automatically divides total house rent or custom rent shares among active roommates.
- **Payment Submissions:** Roommates can securely submit screenshots of their UPI transactions for rent and security deposits directly through the dashboard.
- **Admin Approval Workflow:** Admins receive real-time notifications to review pending payment proofs. They can verify the screenshot and mark the payment as "Approved" or "Rejected" (Unpaid).

### 3. 📋 Shared Expense Splitting
Stop arguing over who bought the toilet paper. 
- **Required Items List:** Anyone in the house can add items that need to be purchased (e.g., groceries, cleaning supplies).
- **Purchased Items Tracker:** Once an item is bought, roommates log the purchase price and upload the bill/receipt.
- **Per-Head Division:** The dashboard automatically calculates total group expenses and divides them equally per head, maintaining a transparent ledger of who owes what.

### 4. 🧹 Chore Rotation
Keep the shared space clean without the nagging.
- **Task Assignment:** Create chores (e.g., "Take out trash", "Clean kitchen") and assign them to specific housemates.
- **Status Tracking:** Chores have visual statuses (Pending, Completed). Roommates can mark their assigned chores as done, providing visibility to the whole house.

### 5. 💬 House Chat Board
A built-in, real-time messaging system dedicated solely to house matters—keeping roommate communication separate from cluttered WhatsApp/iMessage groups.
- Post announcements, reminders, or casual messages.
- Messages are visually color-coded based on the sender's assigned avatar color.

### 6. 😊 Vibe Check (Status Indicators)
Respect boundaries and shared space etiquette. Roommates can update their current "Vibe" status, visually represented on the dashboard:
- **🟢 Free (😊):** Open to chat, hanging out in common areas.
- **🔵 Busy (📚):** Working or studying; approach with caution.
- **🔴 Do Not Disturb (🔕):** Needs absolute privacy; do not bother.

### 7. 🪪 Roommate Details & Agreements
- **Digital Rental Agreements:** Before a new roommate can join the dashboard, they must read and digitally accept the house's ground rules and rental agreement via their invite link.
- **Profile Cards:** Detailed views of every roommate's contact info, emergency numbers, and financial standing.
- **Invite System:** Admins can generate secure, unique Shareable Links or QR Codes to invite new members to the house.

---

## 🛠️ Technology Stack
Built as a modern, responsive, single-page application (SPA).

- **Frontend Interface:** 
  - **React.js (Vite)** 
  - **Component Architecture:** Using functional React components with React Hooks (`useState`, `useEffect`, `useRef`) for robust state management.
  - **Styling:** Custom Vanilla CSS utilizing a sleek, dark-themed "Glassmorphism" design system. Features smooth micro-animations, Apple-inspired blur effects (`backdrop-filter`), and responsive CSS Grid layouts. No heavy UI libraries.
  - **Utilities:** `qrcode.react` for generating dynamic join links.
- **Backend API:**
  - **Node.js runtime** powered by **Express.js**.
  - **RESTful Endpoints:** serving JSON payloads for authentication (`/api/auth/register-admin`, `/api/auth/login`) and data fetching (`/api/dashboard/:houseId`, etc).
- **Database:**
  - **MongoDB** integration using the **Mongoose** ODM.
  - Relational schema designs for `Users` (distinguishing between admin/roommate roles), `Houses` (tracking address, UPI, rent parameters), and `Chores/Expenses`.

---

## 🚀 How It Works (The User Journey)

1. **House Creation (Onboarding):** One person clicks "Create a New House" on the landing page. They fill out a multi-step form detailing the house name, address, their personal admin login, the house UPI ID, and the initial roster of roommates along with their expected rent/deposit shares.
2. **Inviting Members:** The Admin copies the generated invite links (or shows the QR code) to the respective roommates.
3. **Roommate Sign Up:** The roommate opens the link, reviews their expected financial contribution, legally accepts the "Rental Agreement", and defines their password.
4. **Daily Usage:** Both parties can now use the dual "Log In as Admin" or "Log In as Roommate" buttons to access their respective, tailored dashboards to check off chores, upload rent screenshots, and update their vibes.
