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
            <section id="beranda">
                <Section />
            </section>
            <section id="layanan">
                <Layanan />
            </section>
            <section id="fitur">
                <Fitur />
            </section>
            <section id="testimoni">
                <Testimoni />
            </section>
            <section id="kontak">
                <Kontak />
            </section>
            <Footer />
        </div>
    );
}