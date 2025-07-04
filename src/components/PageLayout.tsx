import Header from "./Header";
import Footer from "./Footer";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-xl mx-auto p-5">
      <Header />
      <hr className="mb-16" />
      {children}
      <hr className="my-16" />
      <Footer />
    </div>
  );
}
