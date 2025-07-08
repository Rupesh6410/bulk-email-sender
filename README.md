# Bulk Email Sender

A modern web application built with Next.js that allows you to send bulk emails efficiently. This application provides an intuitive interface for managing email campaigns and tracking their performance.

## 🚀 Live Demo

Check out the live demo: [https://bulk-email-sender-eta.vercel.app/](https://bulk-email-sender-eta.vercel.app/)

## ✨ Features

- Send emails to multiple recipients at once
- Clean and responsive user interface
- Built with Next.js for optimal performance
- Easy to use and deploy
- Real-time email sending status
- Support for HTML email templates

## 🛠️ Technologies Used

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Email Service**: [Resend](https://resend.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A Resend API key (for sending emails)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/bulk-email-sender.git
   cd bulk-email-sender
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Create a `.env.local` file in the root directory and add your environment variables:
   ```
   RESEND_API_KEY=your_resend_api_key
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📝 Usage

1. Enter your email credentials
2. Add recipient email addresses (separated by commas)
3. Write your email subject and content
4. Click "Send Emails" to start sending
5. Track the progress in real-time

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fbulk-email-sender)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Resend](https://resend.com/) - For email sending capabilities
- [Tailwind CSS](https://tailwindcss.com/) - For styling
