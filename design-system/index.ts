// Entry del sistema de diseño Antoky (bundle para claude.ai/design). El sitio no lo importa.
// Reemplaza las rutas /assets/... por data URIs embebidos antes de que cualquier componente renderice.
import { assets } from "../components/assets";
import { embeddedAssets } from "./assets.generated";

Object.assign(assets, embeddedAssets);

export { assets };
export { Page } from "../components/Page";
export { Button } from "../components/Button";
export { Chip } from "../components/Chip";
export { ChipList } from "../components/ChipList";
export { Eyebrow } from "../components/Eyebrow";
export { SectionHeading } from "../components/SectionHeading";
export { ValueList } from "../components/ValueList";
export { Logo } from "../components/Logo";
export { Header } from "../components/Header";
export { Hero } from "../components/Hero";
export { Marquee } from "../components/Marquee";
export { FeatureCard } from "../components/FeatureCard";
export { ImageCard } from "../components/ImageCard";
export { ProductCard } from "../components/ProductCard";
export { StepCard } from "../components/StepCard";
export { ProcessSteps } from "../components/ProcessSteps";
export { FounderCard } from "../components/FounderCard";
export { Founders, founders } from "../components/Founders";
export { ContactInfo } from "../components/ContactInfo";
export { ContactForm } from "../components/ContactForm";
export { Footer } from "../components/Footer";
export { FooterLogo } from "../components/FooterLogo";
export { Loader } from "../components/Loader";
export { Aura } from "../components/Aura";
