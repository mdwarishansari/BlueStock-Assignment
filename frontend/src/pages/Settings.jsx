import React, { useState } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Divider,
  Avatar,
  IconButton,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { selectUser } from '../store/slices/authSlice';
import { selectCompany } from '../store/slices/companySlice';
import useAuth from '../hooks/useAuth';
import useCompany from '../hooks/useCompany';
import ImageUploader from '../components/company/ImageUploader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  GENDER_OPTIONS,
  INDUSTRY_OPTIONS,
  COUNTRY_OPTIONS,
  SOCIAL_PLATFORMS,
} from '../utils/constants';
import {
  validateMobile,
  validateWebsite,
  validatePostalCode,
} from '../utils/validators';
import { formatDateForAPI } from '../utils/formatters';
import { getInitials } from '../utils/formatters';

/**
 * Settings Page
 */
const Settings = () => {
  const user = useSelector(selectUser);
  const company = useSelector(selectCompany);
  const { updateProfile, loading: authLoading } = useAuth();
  const { updateCompanyProfile, loading: companyLoading } = useCompany();
  const [activeTab, setActiveTab] = useState(0);
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const {
    register: registerUser,
    handleSubmit: handleUserSubmit,
    control: userControl,
    formState: { errors: userErrors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      full_name: user?.full_name || '',
      gender: user?.gender || 'm',
      mobile_no: user?.mobile_no?.replace('+', '') || '',
    },
  });

  const {
    register: registerCompany,
    handleSubmit: handleCompanySubmit,
    control: companyControl,
    formState: { errors: companyErrors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: company
      ? {
          company_name: company.company_name || '',
          address: company.address || '',
          city: company.city || '',
          state: company.state || '',
          country: company.country || '',
          postal_code: company.postal_code || '',
          website: company.website || '',
          industry: company.industry || '',
          founded_date: company.founded_date ? new Date(company.founded_date) : null,
          description: company.description || '',
          ...Object.fromEntries(
            SOCIAL_PLATFORMS.map((p) => [
              p.key,
              company.social_links?.[p.key] || '',
            ])
          ),
        }
      : {},
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const onUserSubmit = async (data) => {
    try {
      await updateProfile({
        full_name: data.full_name.trim(),
        gender: data.gender,
        mobile_no: '+' + data.mobile_no,
      });
    } catch (error) {
      console.error('Update user profile error:', error);
    }
  };

  const onCompanySubmit = async (data) => {
    try {
      const formData = new FormData();

      // Append company data
      formData.append('company_name', data.company_name.trim());
      formData.append('address', data.address.trim());
      formData.append('city', data.city.trim());
      formData.append('state', data.state.trim());
      formData.append('country', data.country);
      formData.append('postal_code', data.postal_code.trim());
      formData.append('industry', data.industry);

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

      // Append images if changed
      if (logoFile) formData.append('logo', logoFile);
      if (bannerFile) formData.append('banner', bannerFile);

      await updateCompanyProfile(formData);
    } catch (error) {
      console.error('Update company profile error:', error);
    }
  };

  if (!user) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage your account and company settings
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Personal Information" />
          {company && <Tab label="Company Information" />}
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Personal Information Tab */}
          {activeTab === 0 && (
            <form onSubmit={handleUserSubmit(onUserSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        backgroundColor: 'primary.main',
                        fontSize: '2rem',
                      }}
                    >
                      {getInitials(user.full_name)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{user.full_name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    disabled={authLoading}
                    error={!!userErrors.full_name}
                    helperText={userErrors.full_name?.message}
                    {...registerUser('full_name', {
                      required: 'Full name is required',
                    })}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={user.email}
                    disabled
                    helperText="Email cannot be changed"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Gender"
                    disabled={authLoading}
                    error={!!userErrors.gender}
                    helperText={userErrors.gender?.message}
                    {...registerUser('gender', {
                      required: 'Gender is required',
                    })}
                  >
                    {GENDER_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="mobile_no"
                    control={userControl}
                    rules={{
                      required: 'Mobile number is required',
                      validate: (value) => {
                        const result = validateMobile('+' + value);
                        return result === true ? true : result;
                      },
                    }}
                    render={({ field }) => (
                      <PhoneInput
                        {...field}
                        country={'in'}
                        disabled={authLoading}
                        inputStyle={{
                          width: '100%',
                          height: '56px',
                        }}
                      />
                    )}
                  />
                  {userErrors.mobile_no && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {userErrors.mobile_no.message}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={authLoading}
                  >
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}

          {/* Company Information Tab */}
          {activeTab === 1 && company && (
            <form onSubmit={handleCompanySubmit(onCompanySubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Company Images
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <ImageUploader
                    label="Company Logo"
                    currentImage={company.logo_url}
                    type="logo"
                    onImageSelect={(file) => setLogoFile(file)}
                    onImageRemove={() => setLogoFile(null)}
                    disabled={companyLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <ImageUploader
                    label="Company Banner"
                    currentImage={company.banner_url}
                    type="banner"
                    onImageSelect={(file) => setBannerFile(file)}
                    onImageRemove={() => setBannerFile(null)}
                    disabled={companyLoading}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    disabled={companyLoading}
                    error={!!companyErrors.company_name}
                    helperText={companyErrors.company_name?.message}
                    {...registerCompany('company_name', {
                      required: 'Company name is required',
                    })}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Industry"
                    disabled={companyLoading}
                    error={!!companyErrors.industry}
                    helperText={companyErrors.industry?.message}
                    {...registerCompany('industry', {
                      required: 'Industry is required',
                    })}
                  >
                    {INDUSTRY_OPTIONS.map((industry) => (
                      <MenuItem key={industry} value={industry}>
                        {industry}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    multiline
                    rows={2}
                    disabled={companyLoading}
                    error={!!companyErrors.address}
                    helperText={companyErrors.address?.message}
                    {...registerCompany('address', {
                      required: 'Address is required',
                    })}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="City"
                    disabled={companyLoading}
                    error={!!companyErrors.city}
                    helperText={companyErrors.city?.message}
                    {...registerCompany('city', {
                      required: 'City is required',
                    })}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="State"
                    disabled={companyLoading}
                    error={!!companyErrors.state}
                    helperText={companyErrors.state?.message}
                    {...registerCompany('state', {
                      required: 'State is required',
                    })}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Country"
                    disabled={companyLoading}
                    error={!!companyErrors.country}
                    helperText={companyErrors.country?.message}
                    {...registerCompany('country', {
                      required: 'Country is required',
                    })}
                  >
                    {COUNTRY_OPTIONS.map((country) => (
                      <MenuItem key={country} value={country}>
                        {country}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    disabled={companyLoading}
                    error={!!companyErrors.postal_code}
                    helperText={companyErrors.postal_code?.message}
                    {...registerCompany('postal_code', {
                      required: 'Postal code is required',
                      validate: validatePostalCode,
                    })}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Website"
                    disabled={companyLoading}
                    error={!!companyErrors.website}
                    helperText={companyErrors.website?.message}
                    {...registerCompany('website', {
                      validate: validateWebsite,
                    })}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="founded_date"
                    control={companyControl}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        placeholderText="Founded Date"
                        maxDate={new Date()}
                        disabled={companyLoading}
                        customInput={<TextField fullWidth label="Founded Date" />}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    disabled={companyLoading}
                    {...registerCompany('description')}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Social Media Links
                  </Typography>
                </Grid>

                {SOCIAL_PLATFORMS.map((platform) => (
                  <Grid item xs={12} md={6} key={platform.key}>
                    <TextField
                      fullWidth
                      label={`${platform.label} URL`}
                      disabled={companyLoading}
                      {...registerCompany(platform.key)}
                    />
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={companyLoading}
                  >
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Box>
      </Paper>

      {(authLoading || companyLoading) && (
        <LoadingSpinner fullScreen message="Saving changes..." />
      )}
    </Box>
  );
};

export default Settings;