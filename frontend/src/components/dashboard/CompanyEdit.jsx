import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { updateCompanyProfile } from '../../store/slices/companySlice';

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Other',
];

const CompanyEdit = () => {
  const dispatch = useDispatch();
  const { company, loading } = useSelector((state) => state.company);

  const [logoPreview, setLogoPreview] = useState(company?.logo_url || null);
  const [bannerPreview, setBannerPreview] = useState(company?.banner_url || null);
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_name: company?.company_name || '',
      description: company?.description || '',
      industry: company?.industry || '',
      founded_date: company?.founded_date ? new Date(company.founded_date) : null,
      website: company?.website || '',
      address: company?.address || '',
      city: company?.city || '',
      state: company?.state || '',
      country: company?.country || '',
      postal_code: company?.postal_code || '',
    },
  });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    // Append files if changed
    if (logoFile) formData.append('logo', logoFile);
    if (bannerFile) formData.append('banner', bannerFile);

    // Append other fields
    Object.keys(data).forEach((key) => {
      if (key === 'founded_date' && data[key]) {
        formData.append(key, data[key].toISOString().split('T')[0]);
      } else if (data[key] !== null && data[key] !== '') {
        formData.append(key, data[key]);
      }
    });

    await dispatch(updateCompanyProfile(formData));
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Company Settings
      </Typography>

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {/* Logo & Banner Upload */}
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Logo & Banner Image
            </Typography>

            <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
              {/* Logo */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" gutterBottom>
                  Upload Logo
                </Typography>
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    position: 'relative',
                    height: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {logoPreview ? (
                    <>
                      <img
                        src={logoPreview}
                        alt="Logo"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                      <IconButton
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                        onClick={() => {
                          setLogoPreview(null);
                          setLogoFile(null);
                        }}
                      >
                        <Close />
                      </IconButton>
                    </>
                  ) : (
                    <Box>
                      <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Browse photo or drop here
                      </Typography>
                      <input
                        type="file"
                        accept="image/*"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer',
                        }}
                        onChange={handleLogoChange}
                      />
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Banner */}
              <Box sx={{ flex: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Banner Image
                </Typography>
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    position: 'relative',
                    height: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {bannerPreview ? (
                    <>
                      <img
                        src={bannerPreview}
                        alt="Banner"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                      />
                      <IconButton
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                        onClick={() => {
                          setBannerPreview(null);
                          setBannerFile(null);
                        }}
                      >
                        <Close />
                      </IconButton>
                    </>
                  ) : (
                    <Box>
                      <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Browse photo or drop here
                      </Typography>
                      <input
                        type="file"
                        accept="image/*"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer',
                        }}
                        onChange={handleBannerChange}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Company Details */}
            <TextField
              fullWidth
              label="Company Name"
              margin="normal"
              {...register('company_name', { required: 'Company name is required' })}
              error={!!errors.company_name}
              helperText={errors.company_name?.message}
            />

            <TextField
              fullWidth
              label="About Company"
              multiline
              rows={4}
              margin="normal"
              {...register('description')}
            />

            <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Industry</InputLabel>
                <Controller
                  name="industry"
                  control={control}
                  rules={{ required: 'Industry is required' }}
                  render={({ field }) => (
                    <Select {...field} label="Industry">
                      {industries.map((industry) => (
                        <MenuItem key={industry} value={industry}>
                          {industry}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>

              <Controller
                name="founded_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Founded Date"
                    customInput={<TextField fullWidth label="Founded Date" />}
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={50}
                  />
                )}
              />
            </Box>

            <TextField
              fullWidth
              label="Website"
              margin="normal"
              {...register('website')}
            />

            <TextField
              fullWidth
              label="Address"
              margin="normal"
              {...register('address', { required: 'Address is required' })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />

            <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
              <TextField
                fullWidth
                label="City"
                {...register('city', { required: 'City is required' })}
                error={!!errors.city}
                helperText={errors.city?.message}
              />
              <TextField
                fullWidth
                label="State"
                {...register('state', { required: 'State is required' })}
                error={!!errors.state}
                helperText={errors.state?.message}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="Country"
                {...register('country', { required: 'Country is required' })}
                error={!!errors.country}
                helperText={errors.country?.message}
              />
              <TextField
                fullWidth
                label="Postal Code"
                {...register('postal_code', { required: 'Postal code is required' })}
                error={!!errors.postal_code}
                helperText={errors.postal_code?.message}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                  </Button>
        </Box>
      </Box>
    </CardContent>
  </Card>
</Box>
);
};
export default CompanyEdit;