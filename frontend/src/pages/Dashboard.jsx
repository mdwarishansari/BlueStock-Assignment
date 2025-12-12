import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../components/layout/DashboardLayout';
import Overview from '../components/dashboard/Overview';
import ProfileEdit from '../components/dashboard/ProfileEdit';
import CompanyEdit from '../components/dashboard/CompanyEdit';
import VerificationTab from '../components/dashboard/VerificationTab';
import { fetchUserProfile } from '../store/slices/authSlice';
import { fetchCompanyProfile } from '../store/slices/companySlice';

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch fresh user and company data on mount
    dispatch(fetchUserProfile());
    dispatch(fetchCompanyProfile());
  }, [dispatch]);

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/profile-edit" element={<ProfileEdit />} />
        <Route path="/company-edit" element={<CompanyEdit />} />
        {/* ✅ FIX: Always show verification route - component handles visibility */}
        <Route path="/verification" element={<VerificationTab />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;