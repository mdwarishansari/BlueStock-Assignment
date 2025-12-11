import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  LinearProgress,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import CompanyInfoStep from '../components/company/CompanyInfoStep';
import FoundingInfoStep from '../components/company/FoundingInfoStep';
import SocialLinksStep from '../components/company/SocialLinksStep';
import ContactStep from '../components/company/ContactStep';
import SetupComplete from '../components/company/SetupComplete';
import { registerCompany } from '../store/slices/companySlice';
import { fetchUserProfile } from '../store/slices/authSlice';

const steps = ['Company Info', 'Founding Info', 'Social Media Profile', 'Contact'];

const CompanySetup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.company);
  const [activeStep, setActiveStep] = useState(0);
  
  // ✅ FIX: Initialize with ALL required fields
  const [companyData, setCompanyData] = useState({
    // Step 1: Company Info
    logo: null,
    banner: null,
    company_name: '',
    description: '',
    industry: '',
    
    // Step 2: Founding Info
    founded_date: null,
    website: '',
    
    // Step 3: Social Links
    social_links: {},
    
    // Step 4: Contact (REQUIRED FIELDS)
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    phone: '',
    contact_email: '',
  });
  
  const [isComplete, setIsComplete] = useState(false);

  const progress = ((activeStep + 1) / steps.length) * 100;

  // ✅ FIX: Accumulate data from each step
  const handleNext = (stepData) => {
    console.log('Step data received:', stepData);
    
    // Merge new step data with existing data
    const updatedData = { ...companyData, ...stepData };
    setCompanyData(updatedData);
    
    console.log('Updated company data:', updatedData);
    
    if (activeStep === steps.length - 1) {
      // Last step - submit with ALL accumulated data
      handleSubmit(updatedData);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (finalData) => {
    console.log('Submitting final data:', finalData);
    
    const formData = new FormData();
    
    // ✅ Append files first
    if (finalData.logo) {
      formData.append('logo', finalData.logo);
    }
    if (finalData.banner) {
      formData.append('banner', finalData.banner);
    }
    
    // ✅ Append ALL required text fields
    const requiredFields = {
      company_name: finalData.company_name,
      address: finalData.address,
      city: finalData.city,
      state: finalData.state,
      country: finalData.country,
      postal_code: finalData.postal_code,
      industry: finalData.industry,
    };
    
    // Add required fields
    Object.entries(requiredFields).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });
    
    // ✅ Add optional fields if they exist
    if (finalData.description) {
      formData.append('description', finalData.description);
    }
    if (finalData.website) {
      formData.append('website', finalData.website);
    }
    if (finalData.phone) {
      formData.append('phone', finalData.phone);
    }
    if (finalData.contact_email) {
      formData.append('contact_email', finalData.contact_email);
    }
    if (finalData.founded_date) {
      formData.append('founded_date', finalData.founded_date.toISOString().split('T')[0]);
    }
    
    // ✅ Add social links as JSON string
    if (finalData.social_links && Object.keys(finalData.social_links).length > 0) {
      formData.append('social_links', JSON.stringify(finalData.social_links));
    }
    
    // Debug: Log FormData contents
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, ':', value);
    }

    const result = await dispatch(registerCompany(formData));
    
    if (result.type === 'company/register/fulfilled') {
      // Refresh user profile to update hasCompany flag
      await dispatch(fetchUserProfile());
      setIsComplete(true);
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <CompanyInfoStep
            data={companyData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 1:
        return (
          <FoundingInfoStep
            data={companyData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <SocialLinksStep
            data={companyData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <ContactStep
            data={companyData}
            onNext={handleNext}
            onBack={handleBack}
            isLastStep
          />
        );
      default:
        return null;
    }
  };

  if (isComplete) {
    return <SetupComplete onNavigate={() => navigate('/dashboard')} />;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            🧳 Jobpilot
          </Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary">
              Setup Progress
            </Typography>
            <Typography variant="h6" color="primary" fontWeight="bold">
              {Math.round(progress)}% Completed
            </Typography>
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ mb: 4, height: 8, borderRadius: 4 }}
        />

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    display: { xs: 'none', md: 'block' },
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStep()}
      </Container>
    </Box>
  );
};

export default CompanySetup;