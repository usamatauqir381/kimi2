import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AuthPage } from '@/pages/Auth';
import { Dashboard } from '@/pages/Dashboard';
import { ReportsPage } from '@/pages/Reports';
import { cn } from '@/lib/utils';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#0d4f42] border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

// Main Layout Component
function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'reports'>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className={cn(
        'transition-all duration-300',
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      )}>
        <Header />
        
        <main className="p-6">
          {currentView === 'dashboard' && (
            <Dashboard onNewReport={() => setCurrentView('reports')} />
          )}
          {currentView === 'reports' && (
            <ReportsPage />
          )}
        </main>
      </div>
    </div>
  );
}

// App Component with Router
function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
