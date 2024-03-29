import Header from "./header";
import Footer from "./footer";

export default function PageLayout({children}) {
    return (
        <div className="max-w-xl mx-auto p-5">
            <Header />
            <hr className="mb-16" />
                {children}
            <hr className="my-16" />
            <Footer />
        </div>
    )
}