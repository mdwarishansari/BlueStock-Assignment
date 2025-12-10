import { useState, useEffect } from 'react';
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
  const [companyData, setCompanyData] = useState({
    logo: null,
    banner: null,
    company_name: '',
    description: '',
    industry: '',
    founded_date: null,
    website: '',
    social_links: {},
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
  });
  const [isComplete, setIsComplete] = useState(false);

  const progress = ((activeStep + 1) / steps.length) * 100;

  const handleNext = (data) => {
    setCompanyData((prev) => ({ ...prev, ...data }));
    
    if (activeStep === steps.length - 1) {
      // Last step - submit
      handleSubmit({ ...companyData, ...data });
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (finalData) => {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(finalData).forEach((key) => {
      if (key === 'logo' || key === 'banner') {
        if (finalData[key]) {
          formData.append(key, finalData[key]);
        }
      } else if (key === 'social_links') {
        formData.append(key, JSON.stringify(finalData[key]));
      } else if (key === 'founded_date' && finalData[key]) {
        formData.append(key, finalData[key].toISOString().split('T')[0]);
      } else if (finalData[key] !== null && finalData[key] !== '') {
        formData.append(key, finalData[key]);
      }
    });

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
        {/* Header */}
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

        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ mb: 4, height: 8, borderRadius: 4 }}
        />

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
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

        {/* Step Content */}
        {renderStep()}
      </Container>
    </Box>
  );
};

export default CompanySetup;