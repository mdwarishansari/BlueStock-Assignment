import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Grid,
  MenuItem,
  Divider,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useCompany from '../../hooks/useCompany';
import ImageUploader from './ImageUploader';
import LoadingSpinner from '../common/LoadingSpinner';
import {
  INDUSTRY_OPTIONS,
  COUNTRY_OPTIONS,
  SOCIAL_PLATFORMS,
} from '../../utils/constants';
import {
  validateRequired,
  validateWebsite,
  validatePostalCode,
  validatePastDate,
} from '../../utils/validators';
import { formatDateForAPI } from '../../utils/formatters';

const steps = ['Basic Information', 'Address Details', 'Additional Information'];

/**
 * Company Registration Form Component
 * Multi-step form for company registration
 */
const CompanyRegistrationForm = () => {
  const { registerCompany, loading } = useCompany();
  const [activeStep, setActiveStep] = useState(0);
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
  } = useForm({
    mode: 'onBlur',
  });

  const handleNext = async () => {
    // Validate current step fields
    let fieldsToValidate = [];
    
    switch (activeStep) {
      case 0:
        fieldsToValidate = ['company_name', 'industry'];
        break;
      case 1:
        fieldsToValidate = ['address', 'city', 'state', 'country', 'postal_code'];
        break;
      case 2:
        fieldsToValidate = ['website', 'founded_date', 'description'];
        break;
      default:
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Append basic company data
      formData.append('company_name', data.company_name.trim());
      formData.append('address', data.address.trim());
      formData.append('city', data.city.trim());
      formData.append('state', data.state.trim());
      formData.append('country', data.country);
      formData.append('postal_code', data.postal_code.trim());
      formData.append('industry', data.industry);

      // Optional fields
      if (data.website) formData.append('website', data.website.trim());
      if (data.description) formData.append('description', data.description.trim());
      if (data.founded_date) {
        formData.append('founded_date', formatDateForAPI(data.founded_date));
      }

      // Social links
      const socialLinks = {};
      SOCIAL_PLATFORMS.forEach((platform) => {
        if (data[platform.key]) {
          socialLinks[platform.key] = data[platform.key].trim();
        }
      });
      if (Object.keys(socialLinks).length > 0) {
        formData.append('social_links', JSON.stringify(socialLinks));
      }

      // Append images
      if (logoFile) formData.append('logo', logoFile);
      if (bannerFile) formData.append('banner', bannerFile);

      await registerCompany(formData);
    } catch (error) {
      console.error('Company registration error:', error);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                placeholder="Enter your company name"
                disabled={loading}
                error={!!errors.company_name}
                helperText={errors.company_name?.message}
                {...register('company_name', {
                  required: 'Company name is required',
                  minLength: {
                    value: 2,
                    message: 'Company name must be at least 2 characters',
                  },
                })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Industry"
                disabled={loading}
                error={!!errors.industry}
                helperText={errors.industry?.message}
                defaultValue=""
                {...register('industry', {
                  required: 'Industry is required',
                })}
              >
                <MenuItem value="">Select Industry</MenuItem>
                {INDUSTRY_OPTIONS.map((industry) => (
                  <MenuItem key={industry} value={industry}>
                    {industry}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <ImageUploader
                label="Company Logo"
                type="logo"
                onImageSelect={(file) => setLogoFile(file)}
                onImageRemove={() => setLogoFile(null)}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <ImageUploader
                label="Company Banner"
                type="banner"
                onImageSelect={(file) => setBannerFile(file)}
                onImageRemove={() => setBannerFile(null)}
                disabled={loading}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                placeholder="Enter company address"
                multiline
                rows={2}
                disabled={loading}
                error={!!errors.address}
                helperText={errors.address?.message}
                {...register('address', {
                  required: 'Address is required',
                })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                placeholder="Enter city"
                disabled={loading}
                error={!!errors.city}
                helperText={errors.city?.message}
                {...register('city', {
                  required: 'City is required',
                })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State"
                placeholder="Enter state"
                disabled={loading}
                error={!!errors.state}
                helperText={errors.state?.message}
                {...register('state', {
                  required: 'State is required',
                })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Country"
                disabled={loading}
                error={!!errors.country}
                helperText={errors.country?.message}
                defaultValue=""
                {...register('country', {
                  required: 'Country is required',
                })}
              >
                <MenuItem value="">Select Country</MenuItem>
                {COUNTRY_OPTIONS.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Postal Code"
                placeholder="Enter postal code"
                disabled={loading}
                error={!!errors.postal_code}
                helperText={errors.postal_code?.message}
                {...register('postal_code', {
                  required: 'Postal code is required',
                  validate: validatePostalCode,
                })}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Website"
                placeholder="https://example.com"
                disabled={loading}
                error={!!errors.website}
                helperText={errors.website?.message}
                {...register('website', {
                  validate: validateWebsite,
                })}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="founded_date"
                control={control}
                rules={{
                  validate: validatePastDate,
                }}
                render={({ field }) => (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Founded Date
                    </Typography>
                    <DatePicker
                      selected={field.value}
                      onChange={field.onChange}
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      placeholderText="Select founding date"
                      maxDate={new Date()}
                      disabled={loading}
                      customInput={
                        <TextField
                          fullWidth
                          error={!!errors.founded_date}
                          helperText={errors.founded_date?.message}
                        />
                      }
                    />
                  </Box>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Description"
                placeholder="Tell us about your company"
                multiline
                rows={4}
                disabled={loading}
                error={!!errors.description}
                helperText={errors.description?.message}
                {...register('description')}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Social Media Links (Optional)
              </Typography>
            </Grid>

            {SOCIAL_PLATFORMS.map((platform) => (
              <Grid item xs={12} sm={6} key={platform.key}>
                <TextField
                  fullWidth
                  label={`${platform.label} URL`}
                  placeholder={`https://${platform.key}.com/yourcompany`}
                  disabled={loading}
                  {...register(platform.key)}
                />
              </Grid>
            ))}
          </Grid>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Registering company..." />;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Register Your Company
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Complete all steps to create your company profile
        </Typography>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mb: 4 }}>{renderStepContent(activeStep)}</Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0 || loading}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  Register Company
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CompanyRegistrationForm;