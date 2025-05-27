import React from "react";
import Navbar from "../components/Navbar";
import Section from "../components/Section";
import Layanan from "../components/Layanan";
import Fitur from "../components/Fitur";
import Testimoni from "../components/Testimoni";
import Kontak from "../components/Kontak";
import Footer from "../components/Footer";


export default function HomePage() {
    return (
        <div>
            <Navbar />
            <Section />
            <Layanan />
            <Fitur />
            <Testimoni />
            <Kontak />
            <Footer />
        </div>
    );
}