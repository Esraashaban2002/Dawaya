import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";


export default function Layout() {
    return <>
        <Navbar />
        <div className="mx-auto max-w-[1280px] px-4 py-10">
            <Outlet></Outlet>
        </div>
        <Footer />
    </>

}
