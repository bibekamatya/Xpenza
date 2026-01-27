# 💰 Xpenza (Expense Tracker)

A modern, full-stack expense tracking application built with Next.js 15, TypeScript, and MongoDB. Track your income and expenses, visualize spending patterns, and manage your budget effectively.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)

## Features

### Core Functionality
- **Transaction Management** - Add, edit, and delete income/expense transactions
- **Category System** - Organize transactions by predefined categories (Food, Transport, Shopping, Bills, etc.)
- **Date Filtering** - Filter by today, week, month, year, or custom date range
- **Search** - Real-time search with debouncing
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Pagination** - Efficient data loading with pagination

### Advanced Features
- **Reports & Analytics** - Visual insights with charts (trend analysis, category distribution, income vs expenses)
- **Export Data** - Export filtered transactions as CSV or PDF
- **Budget Tracking** - Set budgets and get alerts when approaching limits
- **Bulk Delete** - Select and delete multiple transactions at once
- **Real-time Updates** - Instant UI updates with optimistic rendering
- **Dark Theme** - Beautiful dark theme throughout

### User Experience
- **Google OAuth** - Secure authentication with Google Sign-In
- **Fast Performance** - Server-side rendering and optimized data fetching
- **PWA Ready** - Install as a mobile app with offline support
- **Modern UI** - Clean interface with smooth animations
- **Loading States** - Skeleton loaders for better UX
- **Empty States** - Helpful messages when no data

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **Lucide Icons** - Beautiful icon set

### Backend
- **Next.js Server Actions** - Type-safe server functions
- **MongoDB Atlas** - Cloud database
- **NextAuth.js** - Authentication
- **Zod** - Schema validation

### Tools & Libraries
- **React Hook Form** - Form management
- **React Hot Toast** - Notifications
- **jsPDF** - PDF generation
- **date-fns** - Date utilities

## Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account
- Google OAuth credentials

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/bibekamatya/Expense-Tracker.git
cd Expense-Tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
AUTH_SECRET=your_auth_secret
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret

# App URL
NEXTAUTH_URL=http://localhost:3000
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
expence-tracker/
├── app/                    # Next.js App Router
│   ├── actions/           # Server Actions
│   ├── api/               # API routes
│   ├── login/             # Login page
│   ├── reports/           # Reports page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── AddExpenseDialog.tsx
│   ├── BudgetAlert.tsx
│   ├── Filters.tsx
│   ├── Header.tsx
│   ├── Reports.tsx
│   ├── StatsCards.tsx
│   └── Transactions.tsx
├── contexts/              # React Context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configs
│   ├── auth.ts           # NextAuth configuration
│   ├── mongodb.ts        # Database connection
│   └── types.ts          # TypeScript types
└── public/               # Static assets
```

## Key Features Explained

### Smart Filtering
- Real-time search with debouncing
- Multiple filter combinations (type, category, date)
- Stats update dynamically based on active filters

### Bulk Operations
- Select multiple transactions with checkboxes
- Delete selected items in one action
- Clear visual feedback for selected items

### Reports & Analytics
- Period-based analysis (daily, weekly, monthly, yearly)
- Interactive charts (trend, category distribution, income vs expenses)
- Top transactions and spending insights
- Export filtered data to CSV/PDF

### Budget Management
- Set monthly budget limits
- Visual progress indicators
- Alerts when approaching or exceeding budget
- Real-time budget tracking

## Security

- Secure authentication with NextAuth.js
- Environment variables for sensitive data
- Server-side validation with Zod
- Protected API routes
- CSRF protection

## Mobile Experience

- Touch-optimized interface
- Swipeable bottom sheets
- Mobile-specific navigation
- Responsive charts and tables
- PWA support for offline access

## Design Highlights

- Consistent dark theme
- Smooth animations and transitions
- Loading states with skeletons
- Empty states with helpful messages

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/bibekamatya/Expense-Tracker)

## 👨‍💻 Author

**Bibek Amatya**
- GitHub: [@bibekamatya](https://github.com/bibekamatya)

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting
- MongoDB for the database
- All open-source contributors

---

Made with love by Bibek Amatya
