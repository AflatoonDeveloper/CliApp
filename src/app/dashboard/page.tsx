import DashboardNavbar from "@/components/dashboard-navbar";
import {
  InfoIcon,
  UserCircle,
  Camera,
  History,
  BarChart3,
  Settings,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import Link from "next/link";
import Image from "next/image";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Welcome Section */}
          <header className="bg-white rounded-xl p-6 border shadow-sm">
            <div className="flex items-center gap-4">
              <UserCircle size={48} className="text-green-600" />
              <div>
                <h1 className="text-2xl font-bold">
                  Welcome, {user.user_metadata.full_name || user.email}
                </h1>
                <p className="text-gray-600">
                  Track your nutrition with AI-powered food analysis
                </p>
              </div>
            </div>
          </header>

          {/* Quick Actions */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/dashboard/upload"
                className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Camera className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Analyze Food</h3>
                  <p className="text-gray-600 text-sm">
                    Upload a photo of your meal for instant analysis
                  </p>
                </div>
              </Link>

              <Link
                href="/dashboard"
                className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <History className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Meal History</h3>
                  <p className="text-gray-600 text-sm">
                    View your past meals and nutrition data
                  </p>
                </div>
              </Link>

              <Link
                href="/dashboard"
                className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Nutrition Insights</h3>
                  <p className="text-gray-600 text-sm">
                    See trends and patterns in your nutrition
                  </p>
                </div>
              </Link>
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="bg-white rounded-xl p-6 border shadow-sm">
              <div className="flex flex-col gap-4">
                <div className="text-center py-8">
                  <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="font-medium text-lg mb-2">
                    No recent activity
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Upload your first meal to get started
                  </p>
                  <Link
                    href="/dashboard/upload"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Analyze Food
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Tips Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Nutrition Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl overflow-hidden border shadow-sm">
                <div className="aspect-video relative">
                  <Image
                    src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80"
                    alt="Healthy meal prep"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Meal Prep Basics
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Learn how to prepare healthy meals in advance to stay on
                    track with your nutrition goals.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl overflow-hidden border shadow-sm">
                <div className="aspect-video relative">
                  <Image
                    src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80"
                    alt="Balanced nutrition"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Understanding Macros
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Discover how balancing proteins, carbs, and fats can help
                    you achieve your health goals.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
