# Blog App

A modern, full-stack blog application built with TypeScript, Express, and PostgreSQL. This application features user authentication, post management, comment systems, and admin functionality.

## 🚀 Features

### Core Features

- **User Authentication**: Secure authentication system using Better Auth
- **Post Management**: Create, read, update, and delete blog posts
- **Comment System**: Nested comments with reply functionality and moderation
- **User Roles**: Support for USER and ADMIN roles
- **View Tracking**: Automatic view count tracking for posts
- **Post Status**: Draft, Published, and Archived post states

### Technical Features

- **TypeScript**: Full type safety throughout the application
- **Prisma ORM**: Modern database toolkit with PostgreSQL
- **Express.js**: Fast, unopinionated web framework
- **Bun Runtime**: High-performance JavaScript runtime
- **Validation**: Input validation using Zod schemas
- **Logging**: Structured logging with Winston
- **Email Support**: Email functionality with Nodemailer and Mailgen

## 🛠️ Tech Stack

### Backend

- **Runtime**: Bun
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Better Auth
- **Validation**: Zod
- **Logging**: Winston
- **Email**: Nodemailer + Mailgen

### Development

- **Language**: TypeScript
- **Package Manager**: Bun
- **Database Migrations**: Prisma Migrate

## 📋 Prerequisites

- **Node.js** (v18 or higher) or **Bun** runtime
- **PostgreSQL** database
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Blog-App
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/blog_app"

# Server
PORT=8080

# Auth (Better Auth)
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:8080"

# Email Configuration (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
FROM_EMAIL="noreply@yourdomain.com"
FROM_NAME="Blog App"
```

### 4. Database Setup

Generate Prisma client and run migrations:

```bash
bun prisma generate
bun prisma migrate dev
```

### 5. Seed Admin User

Create an admin user:

```bash
bun run seed:admin
```

### 6. Start Development Server

```bash
bun run dev
```

The server will start on `http://localhost:8080`

## 📁 Project Structure

```
src/
├── app/
│   ├── app.ts              # Main Express app configuration
│   ├── config/             # Environment and app configuration
│   ├── helpers/            # Utility helper functions
│   ├── lib/                # Core libraries (auth, logger, etc.)
│   ├── middlewares/        # Express middleware
│   ├── modules/            # Feature modules
│   │   ├── comment/        # Comment management
│   │   ├── health/         # Health check endpoints
│   │   └── post/           # Post management
│   ├── script/             # Database scripts and seeds
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── validation/         # Zod validation schemas
├── server.ts               # Server entry point
└── ...
prisma/
├── schema.prisma           # Prisma database schema
└── migrations/             # Database migration files
```

## 🗄️ Database Schema

### Core Models

#### Post

- `id`: UUID primary key
- `title`: Post title (225 chars max)
- `content`: Full post content
- `thumbnail`: Optional thumbnail URL
- `isFeatured`: Featured post flag
- `status`: Post status (DRAFT, PUBLISHED, ARCHIVED)
- `tags`: Array of post tags
- `views`: View count tracker
- `authorId`: Foreign key to User
- `timestamps`: Created and updated timestamps

#### Comment

- `id`: UUID primary key
- `content`: Comment content
- `authorId`: Foreign key to User
- `postId`: Foreign key to Post
- `parentId`: Optional self-reference for nested replies
- `status`: Comment moderation status (APPROVED, REJECTED)
- `timestamps`: Created and updated timestamps

#### User

- `id`: User ID (compatible with auth system)
- `name`: User display name
- `email`: User email (unique)
- `emailVerified`: Email verification status
- `image`: Optional profile image
- `role`: User role (USER, ADMIN)
- `phone`: Optional phone number
- `status`: Account status (ACTIVE, etc.)
- `timestamps`: Created and updated timestamps

## 🔐 Authentication

The application uses Better Auth for secure authentication:

- **Session Management**: Secure session handling
- **Role-Based Access**: USER and ADMIN roles
- **Email Verification**: Optional email verification
- **Password Security**: Secure password hashing

## 📚 API Endpoints

### Posts

- `GET /posts` - Get all posts (with pagination)
- `GET /posts/:id` - Get single post (increments view count)
- `POST /posts` - Create new post (authenticated users)
- `PUT /posts/:postId` - Update post (author/admin)
- `DELETE /posts/:postId` - Delete post (author/admin)
- `GET /posts/author/:authorId` - Get posts by author
- `GET /posts/static` - Get static posts (admin only)

### Comments

- `GET /comments` - Get comments (with filtering)
- `POST /comments` - Create comment (authenticated users)
- `PUT /comments/:commentId` - Update comment (author/admin)
- `DELETE /comments/:commentId` - Delete comment (author/admin)

### Health

- `GET /health` - Application health check

## 🧪 Development

### Running Tests

```bash
# Add test commands when implemented
bun test
```

### Database Management

```bash
# Generate Prisma client
bun prisma generate

# Create new migration
bun prisma migrate dev --name <migration-name>

# Reset database
bun prisma migrate reset

# View database
bun prisma studio
```

### Code Quality

```bash
# Type checking
bun tsc --noEmit

# Linting (add ESLint configuration)
bun run lint
```

## 🔧 Configuration

### Environment Variables

| Variable             | Description                  | Required |
| -------------------- | ---------------------------- | -------- |
| `DATABASE_URL`       | PostgreSQL connection string | Yes      |
| `PORT`               | Server port (default: 8080)  | No       |
| `BETTER_AUTH_SECRET` | Authentication secret key    | Yes      |
| `BETTER_AUTH_URL`    | Application URL for auth     | Yes      |
| `SMTP_HOST`          | Email server host            | No       |
| `SMTP_PORT`          | Email server port            | No       |
| `SMTP_USER`          | Email server username        | No       |
| `SMTP_PASS`          | Email server password        | No       |

## 🚀 Deployment

### Environment Setup

1. Set production environment variables
2. Build the application:
   ```bash
   bun build
   ```
3. Run database migrations:
   ```bash
   bun prisma migrate deploy
   ```
4. Start the production server:
   ```bash
   bun start
   ```

### Docker (Optional)

Create a `Dockerfile` for containerized deployment:

```dockerfile
FROM oven/bun:latest

WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun prisma generate

EXPOSE 8080
CMD ["bun", "src/server.ts"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit them
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**

   - Check PostgreSQL is running
   - Verify DATABASE_URL is correct
   - Ensure database exists

2. **Authentication Issues**

   - Verify BETTER_AUTH_SECRET is set
   - Check BETTER_AUTH_URL matches your domain

3. **Migration Errors**

   - Ensure database is accessible
   - Check migration files for conflicts
   - Reset database if needed: `bun prisma migrate reset`

4. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing process: `lsof -ti:8080 | xargs kill`

## 📞 Support

For support and questions, please open an issue in the repository or contact the development team.
