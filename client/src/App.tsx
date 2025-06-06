import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Landing from "@/pages/Landing";

// Import all pages
import Dashboard from "@/pages/Dashboard";
import Orders from "@/pages/Orders";
import NewOrder from "@/pages/NewOrder";
import Collection from "@/pages/Collection";
import SampleCollection from "@/pages/SampleCollection";
import Collectors from "@/pages/Collectors";
import Results from "@/pages/Results";
import Delivery from "@/pages/Delivery";
import History from "@/pages/History";
import PatientHistory from "@/pages/PatientHistory";
import SurveyReports from "@/pages/SurveyReports";
import WeeklyPerformance from "@/pages/WeeklyPerformance";
import CollectorProfiles from "@/pages/CollectorProfiles";
import ReportsAnalytics from "@/pages/ReportsAnalytics";
import Tasks from "@/pages/Tasks";
import Inventory from "@/pages/Inventory";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

// New comprehensive modules
import Patients from "@/pages/Patients";
import CRM from "@/pages/CRM";
import Organizational from "@/pages/Organizational";
import TestPackages from "@/pages/TestPackages";
import Equipment from "@/pages/Equipment";

import Notifications from "@/pages/Notifications";
import HR from "@/pages/HR";
import HRShifts from "@/pages/HRShifts";
import HRPayroll from "@/pages/HRPayroll";
import HRPerformance from "@/pages/HRPerformance";
import AccessManagement from "@/pages/AccessManagement";
import UserProfile from "@/pages/UserProfile";
import AccountSettings from "@/pages/AccountSettings";
import SecurityPrivacy from "@/pages/SecurityPrivacy";
import HelpSupport from "@/pages/HelpSupport";
import EmployeeList from "@/pages/EmployeeList";
import TaskList from "@/pages/TaskList";

// AI-Powered Tools
import AIDiagnosis from "@/pages/AIDiagnosis";
import TestReminders from "@/pages/TestReminders";
import InsuranceAPI from "@/pages/InsuranceAPI";

import { queryClient } from "@/lib/queryClient";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Check for demo bypass
  const urlParams = new URLSearchParams(window.location.search);
  const bypassAuth = urlParams.get('bypass') === 'true';

  if ((isLoading || !isAuthenticated) && !bypassAuth) {
    return <Landing />;
  }

  return (
    <Layout>
      <Switch>
        {/* Main Dashboard */}
        <Route path="/" component={Dashboard} />
        
        {/* Order Management */}
        <Route path="/orders" component={Orders} />
        <Route path="/new-order" component={NewOrder} />
        
        {/* Patients & Clients */}
        <Route path="/patients" component={Patients} />
        <Route path="/crm" component={CRM} />
        <Route path="/survey-reports" component={SurveyReports} />
        <Route path="/organizational" component={Organizational} />
        
        {/* Lab Operations */}
        <Route path="/collection" component={Collection} />
        <Route path="/sample-collection" component={SampleCollection} />
        <Route path="/collectors" component={Collectors} />
        <Route path="/collector-profiles" component={CollectorProfiles} />
        <Route path="/test-packages" component={TestPackages} />
        <Route path="/results" component={Results} />
        <Route path="/delivery" component={Delivery} />
        
        {/* Inventory & Equipment */}
        <Route path="/inventory" component={Inventory} />
        <Route path="/equipment" component={Equipment} />
        
        {/* Reports & Analytics */}
        <Route path="/reports" component={Reports} />
        <Route path="/reports-analytics" component={ReportsAnalytics} />
        <Route path="/weekly-performance" component={WeeklyPerformance} />

        <Route path="/notifications" component={Notifications} />
        
        {/* Human Resources */}
        <Route path="/hr" component={HR} />
        <Route path="/employee-list" component={EmployeeList} />
        <Route path="/hr-shifts" component={HRShifts} />
        <Route path="/hr-payroll" component={HRPayroll} />
        <Route path="/hr-performance" component={HRPerformance} />
        
        {/* Task Management */}
        <Route path="/tasks" component={Tasks} />
        
        {/* AI-Powered Tools */}
        <Route path="/ai-diagnosis" component={AIDiagnosis} />
        <Route path="/test-reminders" component={TestReminders} />
        <Route path="/insurance-api" component={InsuranceAPI} />
        
        {/* System Settings */}
        <Route path="/settings" component={Settings} />
        <Route path="/access-management" component={AccessManagement} />
        
        {/* User Profile & Account */}
        <Route path="/profile" component={UserProfile} />
        <Route path="/account-settings" component={AccountSettings} />
        <Route path="/security-privacy" component={SecurityPrivacy} />
        <Route path="/help-support" component={HelpSupport} />
        
        {/* Legacy routes for compatibility */}
        <Route path="/history" component={PatientHistory} />
        <Route path="/services" component={TestPackages} />
        
        {/* 404 Page */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Router />
          <Toaster />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;