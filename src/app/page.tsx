import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  Camera,
  BarChart3,
  Utensils,
  Zap,
  Shield,
  Users,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "../../supabase/server";
import Image from "next/image";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI-powered food tracking makes nutrition monitoring effortless
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Camera className="w-8 h-8" />,
                title: "Snap a Photo",
                description:
                  "Take a picture of your meal using your phone camera or upload an existing image",
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "AI Analysis",
                description:
                  "Our AI powered by Google Gemini instantly identifies food items and portion sizes",
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Get Nutrition Data",
                description:
                  "View detailed nutritional breakdown including calories, macros, and more",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="text-green-600 mb-6 flex justify-center">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-6">
                Effortless Food Tracking
              </h2>
              <p className="text-gray-600 mb-6">
                Our intuitive interface makes tracking your nutrition simple and
                accurate. No more guessing or manual entry - just snap, analyze,
                and track.
              </p>

              <ul className="space-y-4">
                {[
                  "Accurate food identification with AI",
                  "Detailed nutritional breakdown",
                  "Easy portion size adjustment",
                  "Track meals and progress over time",
                  "Works with virtually any food or meal",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="order-1 md:order-2 bg-white p-4 rounded-2xl shadow-lg">
              <div className="aspect-[9/16] relative rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src="https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80"
                  alt="App interface showing food analysis"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI-powered food tracking app offers everything you need for
              effortless nutrition monitoring
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Camera className="w-6 h-6" />,
                title: "Image Recognition",
                description: "Advanced AI identifies foods from photos",
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Nutrition Analysis",
                description: "Detailed breakdown of macros and calories",
              },
              {
                icon: <Utensils className="w-6 h-6" />,
                title: "Meal History",
                description: "Track and review your eating patterns",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Privacy First",
                description: "Your data stays private and secure",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-green-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Nutrition?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands who are making healthier choices with our AI-powered
            food tracking.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-green-600 bg-white rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Start Tracking Free
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
