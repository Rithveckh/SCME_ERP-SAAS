# 🏢 SCME-ERP – Smart Community Management ERP (SaaS)

SCME-ERP is a **cloud-based Enterprise Resource Planning (ERP)** system for **Residential Communities**, built as a **multi-role SaaS platform** with real-world modules such as billing, service requests, inventory, staff, vendors, and **automated PDF invoicing**.

🔗 **Live Demo:** https://scme-erp.vercel.app

---

## 🧱 Tech Stack

- 🔐 **Authentication:** Clerk  
- 🗄 **Database:** Supabase (PostgreSQL)  
- 🚀 **Deployment:** Vercel  
- 🧩 **Framework:** Next.js 16 (App Router)  
- 🎨 **UI:** Tailwind CSS  
- 🧠 **Language:** TypeScript  

---

## ✨ Key Features

### 🔐 Authentication & RBAC
- Clerk-based login & signup
- Roles: **Admin, Resident, Staff, Vendor**
- Role-based menu & route protection (RBAC)
- Automatic user sync to Supabase (`user_profiles`)

---

### 🏠 Residents Module
- Add / view residents
- Flat-wise management
- Linked to billing & service requests

---

### 🛠 Service Requests
- Raise, assign, and track service requests
- Kanban workflow board  
  *(Open → In Progress → Completed)*
- Staff & vendor assignment

---

### 💰 Billing & Payments
- Monthly maintenance bill generation
- Automatic bill creation
- Online payment tracking
- Status updates *(Pending / Paid)*

---

### 📄 PDF Invoice Generation
- One-click PDF invoice download
- Server-side PDF generation
- Production-ready (Unicode **₹** support)

---

### 📦 Inventory Management
- Add inventory items
- Track stock levels
- Auto-deduction on usage
- Usage history tracking

---

### 👷 Staff Management
- Staff records
- Task assignment
- Workflow tracking

---

### 🧑‍🔧 Vendor Management
- Vendor registration
- Service category mapping
- Linked to service requests

---

### 📊 Admin Dashboard
- Unified control panel
- Workflow & metrics overview
- Role-aware navigation

---

## 🧩 System Architecture
```bash
Next.js (Frontend + API Routes)
|
Clerk Auth (RBAC, Sessions)
|
Supabase (PostgreSQL)
|
PDF Generator (Invoices)
|
Vercel (Cloud Hosting)
```
---

## 🗂 Project Structure
```bash
scme-erp-web/
│
├── app/
│ ├── api/
│ │ ├── billing/
│ │ ├── inventory/
│ │ ├── service-requests/
│ │ ├── payments/
│ │ ├── sync-user/
│ │ └── staff/
│ │
│ ├── dashboard/
│ │ ├── residents/
│ │ ├── requests/
│ │ ├── billing/
│ │ ├── payments/
│ │ ├── inventory/
│ │ ├── staff/
│ │ ├── vendors/
│ │ └── admin/
│
├── lib/
│ ├── supabase.ts
│ ├── roleGuard.ts
│ └── getBaseUrl.ts
│
└── middleware.ts # RBAC + Clerk
```

---

## ⚙️ Installation (Local Setup)

```bash
git clone https://github.com/Rithveckh/ERP-SaaS
cd scme-erp-web
npm install
npm run dev
```

Create .env.local
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```
---

## 🔄 Deployment
Auto-deployed via GitHub → Vercel
```bash
git add .
git commit -m "Deploy SCME-ERP"
git push origin main
```
---

## 🎓 Academic Relevance
This project demonstrates:
-SaaS Architecture
-Multi-Tenant ERP Design
-RBAC Security Model
-REST APIs using Next.js App Router
-Cloud Database (PostgreSQL)
-Server-side PDF Generation
-Workflow Automation
-Real-world Business Modules
-End-to-End DevOps Pipeline
---

## 👨‍💻 Author
Rithveckh D
B.Tech – Information Technology
Full Stack | Cloud | ERP | SaaS Systems
---

## 📌 Future Enhancements
-📱 Mobile App (React Native)
-💳 Payment Gateway Integration (Razorpay)
-🤖 AI-based Complaint Prioritization
-📈 Predictive Maintenance Analytics
-🧩 Multi-tenant SaaS Plans
---



This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
