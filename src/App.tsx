import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "next-themes";
import { Loader2 } from "lucide-react";

// Lazy loading pages
const Index = lazy(() => import("./pages/Index"));
const Catalog = lazy(() => import("./pages/Catalog"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Auth = lazy(() => import("./pages/Auth"));
const Profile = lazy(() => import("./pages/Profile"));
const Checkout = lazy(() => import("./pages/Checkout"));
const About = lazy(() => import("./pages/About"));
const Contacts = lazy(() => import("./pages/Contacts"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminBanners = lazy(() => import("./pages/admin/AdminBanners"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));

// Help Pages
const HowToOrder = lazy(() => import("./pages/help/HowToOrder"));
const PaymentMethods = lazy(() => import("./pages/help/PaymentMethods"));
const Shipping = lazy(() => import("./pages/help/Shipping"));
const Returns = lazy(() => import("./pages/help/Returns"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <ThemeProvider attribute="class" defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/search" element={<SearchResults />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/banners" element={<AdminBanners />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/reviews" element={<AdminReviews />} />
                  
                  {/* Help Routes */}
                  <Route path="/help/how-to-order" element={<HowToOrder />} />
                  <Route path="/help/payment" element={<PaymentMethods />} />
                  <Route path="/help/shipping" element={<Shipping />} />
                  <Route path="/help/returns" element={<Returns />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;