import type { FC } from "react";
import { Container } from "./Container";
import { Header } from "./Header";

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout: FC<PageLayoutProps> = (props) => {
  const { children } = props;
  return (
    <div className="min-h-screen bg-gray-50/50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="py-8">
        <Container>{children}</Container>
      </main>
    </div>
  );
};
