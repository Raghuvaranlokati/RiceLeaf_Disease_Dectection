import "./globals.css";
import Link from 'next/link';

export const metadata = {
  title: "Rice Leaf Disease Detector",
  description: "Detect diseases in rice leaves instantly using Machine Learning.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <nav className="navbar">
          <Link href="/" className="logo-text">🌾 RiceDetector</Link>
          <div className="nav-links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/contact" className="nav-link">Contact Admin</Link>
            <Link href="/messages" className="nav-link">Messages</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
