
import { Layout } from "@/components/layout/Layout";
import { Hero } from "@/components/marketing/Hero";
import { Features } from "@/components/marketing/Features";
import { Testimonials } from "@/components/marketing/Testimonials";
import { CTASection } from "@/components/marketing/CTASection";

// Let's create our landing page
const Index = () => {
  return (
    <Layout>
      <Hero />
      <Features />
      <Testimonials />
      <CTASection />
    </Layout>
  );
};

export default Index;
