import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MessengerProvider } from "@/context/MessengerContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Feed from "@/pages/feed";
import Reels from "@/pages/reels";
import Watch from "@/pages/watch";
import Profile from "@/pages/profile";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }
  
  return <Component />;
}

function PublicOnlyRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Redirect to="/feed" />;
  }
  
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <PublicOnlyRoute component={Home} />} />
      <Route path="/feed" component={() => <ProtectedRoute component={Feed} />} />
      <Route path="/reels" component={() => <ProtectedRoute component={Reels} />} />
      <Route path="/watch" component={() => <ProtectedRoute component={Watch} />} />
      <Route path="/profile" component={() => <ProtectedRoute component={Profile} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <MessengerProvider>
            <Toaster />
            <Router />
          </MessengerProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;