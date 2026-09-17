import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import ServiceDetail from "@/pages/service-detail";
import NotFound from "@/pages/not-found";
import {
  VehicleQuotePage, LifePage, GapCoverPage, FuneralPage,
  BundlePage, WillsEstatePage, InvestmentsPage,
} from "@/pages/action-page";
import NewsPage from "@/pages/news";
import ArticlePage from "@/pages/article";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminEditor from "@/pages/admin/editor";
import { RequireAuth } from "@/components/admin/require-auth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/services/:id" component={ServiceDetail} />
      <Route path="/get-a-quote/vehicle" component={VehicleQuotePage} />
      <Route path="/get-a-quote/life" component={LifePage} />
      <Route path="/get-a-quote/gap-cover" component={GapCoverPage} />
      <Route path="/get-a-quote/funeral" component={FuneralPage} />
      <Route path="/get-a-quote/bundle" component={BundlePage} />
      <Route path="/wills-estate-enquiry" component={WillsEstatePage} />
      <Route path="/investments-enquiry" component={InvestmentsPage} />

      {/* Public news */}
      <Route path="/news" component={NewsPage} />
      <Route path="/news/:slug" component={ArticlePage} />

      {/* Admin content studio */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin">
        <RequireAuth>
          <AdminDashboard />
        </RequireAuth>
      </Route>
      <Route path="/admin/posts/new">
        <RequireAuth>
          <AdminEditor />
        </RequireAuth>
      </Route>
      <Route path="/admin/posts/:id/edit">
        <RequireAuth>
          <AdminEditor />
        </RequireAuth>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
