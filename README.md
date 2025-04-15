# BiteBox

A comprehensive restaurant platform that revolutionizes the online food ordering experience.

## Tech Stack

![React.js](https://img.shields.io/badge/-React.js-61DAFB?style=flat-square&logo=react&logoColor=black)
![Shadcn](https://img.shields.io/badge/-Shadcn-000000?style=flat-square&logo=shadcn&logoColor=white)
![Tailwind](https://img.shields.io/badge/-Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![MySQL](https://img.shields.io/badge/-MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?style=flat-square&logo=express&logoColor=white)
![Stripe](https://img.shields.io/badge/-Stripe-008CDD?style=flat-square&logo=stripe&logoColor=white)
![Clerk](https://img.shields.io/badge/-Clerk-6C47FF?style=flat-square&logo=clerk&logoColor=white)
![Socket.io](https://img.shields.io/badge/-Socket.io-010101?style=flat-square&logo=socket.io&logoColor=white)
![Redux](https://img.shields.io/badge/-Redux-764ABC?style=flat-square&logo=redux&logoColor=white)
![Recharts](https://img.shields.io/badge/-Recharts-22B5BF?style=flat-square&logo=recharts&logoColor=white)
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white)

## Overview

BiteBox is a comprehensive restaurant platform that revolutionizes the online food ordering experience. It features an intuitive user interface for browsing menus, customizing orders, and secure checkout through Stripe integration. The admin dashboard provides restaurant owners with real-time order tracking, inventory management, and sales analytics.

## Features

- **User-Friendly Interface**: Intuitive menu browsing and order customization
- **Secure Payments**: Integrated with Stripe for safe transactions
- **Admin Dashboard**: Comprehensive tools for restaurant management
- **Real-Time Updates**: Live order tracking and notifications
- **Inventory Management**: Keep track of stock and availability
- **Sales Analytics**: Data-driven insights for business growth

## Technical Architecture

- **Frontend**: Built with React.js and styled using Tailwind CSS with Shadcn components
- **State Management**: React-Redux for efficient state handling
- **Backend**: Express and Node.js powering the API
- **Database**: MySQL for reliable data storage
- **Real-Time Communications**: Socket.io for instant order updates
- **Authentication**: Secured with Clerk
- **Data Visualization**: Recharts for analytics reporting

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/NaveedAfraz/BiteBox.git
   cd bitebox
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn install
   ```

3. Configure environment variables
   ```
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Set up the database
   ```
   npm run setup-db
   # or
   yarn setup-db
   ```

5. Start the development server
   ```
   npm run dev
   # or
   yarn dev
   ```

## Deployment

Detailed deployment instructions can be found in the [Deployment Guide](./docs/deployment.md).

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for more details.


## Contact

For questions or support, please open an issue or contact the project maintainers.

---

[Visit Project Website](https://bite-box-three.vercel.app/)
