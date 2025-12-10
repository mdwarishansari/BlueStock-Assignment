import { useSelector } from "react-redux";

export const useAuth = () => {
  const { user, token, isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );

  return {
    user,
    token,
    isAuthenticated,
    loading,
    isEmailVerified: user?.is_email_verified || false,
    isMobileVerified: user?.is_mobile_verified || false,
    hasCompany: user?.hasCompany || false,
  };
};

export default useAuth;
