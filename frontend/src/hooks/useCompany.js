import { useSelector } from "react-redux";

export const useCompany = () => {
  const { company, loading, setupProgress } = useSelector(
    (state) => state.company
  );

  return {
    company,
    loading,
    setupProgress,
    hasCompany: !!company,
    companyName: company?.company_name || "",
    companyLogo: company?.logo_url || null,
    companyBanner: company?.banner_url || null,
  };
};

export default useCompany;
