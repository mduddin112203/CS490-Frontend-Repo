# CS490 Sakila Frontend

React frontend for the Sakila DVD Store management system.

## Prerequisites

- Node.js v18.x (recommended)
- npm package manager
- Backend API running on port 5001

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/mduddin112203/CS490-Frontend-Repo.git
   cd CS490-Frontend-Repo
   ```

2. **Install dependencies**
   ```bash
   npm ci
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

The application will open in your browser at `http://localhost:3000`

## Features

### Landing Page
- View top 5 rented films of all time
- View top 5 actors in the store
- Quick navigation to films and customers

### Films Management
- Browse all films with pagination
- Search films by title, actor name, or genre
- View detailed film information
- Rent films to customers

### Customer Management
- View all customers with pagination
- Search customers by ID, first name, or last name
- Add new customers
- Edit customer details
- Delete customers
- View customer rental history
- Process rental returns

### Actor Information
- View actor details
- See actor's filmography
- View actor's top rented films

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Backend Connection

The frontend connects to the backend API at `http://localhost:5001/api`. Make sure the backend server is running before starting the frontend.

If you change Node versions or see webpack plugin errors, clear and reinstall:
```bash
rm -rf node_modules
npm ci
```

## Browser Support

This application supports:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Technologies Used

- React 18.2.0
- React Router DOM
- Axios
- CSS3 with CSS Variables
- Responsive Design

## Development Notes

- Uses Node.js 18.x for optimal compatibility
- Responsive design works on desktop and mobile
- Dark theme with wine-red accents
- Professional UI/UX design