import { useState } from 'react';
import { Box, Card, TextField, Button, Typography, IconButton } from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

const CompanyInfoStep = ({ data, onNext }) => {
  const [logoPreview, setLogoPreview] = useState(data.logo ? URL.createObjectURL(data.logo) : null);
  const [bannerPreview, setBannerPreview] = useState(data.banner ? URL.createObjectURL(data.banner) : null);
  const [logoFile, setLogoFile] = useState(data.logo);
  const [bannerFile, setBannerFile] = useState(data.banner);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      company_name: data.company_name,
      description: data.description,
      industry: data.industry,
      website: data.website,
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

  const onSubmit = (formData) => {
    onNext({
      ...formData,
      logo: logoFile,
      banner: bannerFile,
    });
  };

  return (
    <Card sx={{ p: 4 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Company Information
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        
        {/* Logo + Banner Upload */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
          {/* Logo */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" gutterBottom>Upload Logo</Typography>
            <Box
              sx={{
                border: '2px dashed',
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
                  <img src={logoPreview} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                  <IconButton
                    size="small"
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    onClick={() => { setLogoPreview(null); setLogoFile(null); }}
                  >
                    <Close />
                  </IconButton>
                </>
              ) : (
                <Box>
                  <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">Upload or drop logo</Typography>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0 }}
                    onChange={handleLogoChange}
                  />
                </Box>
              )}
            </Box>
          </Box>

          {/* Banner */}
          <Box sx={{ flex: 2 }}>
            <Typography variant="body2" gutterBottom>Upload Banner</Typography>
            <Box
              sx={{
                border: '2px dashed',
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
                  <img src={bannerPreview} alt="Banner" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                  <IconButton
                    size="small"
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    onClick={() => { setBannerPreview(null); setBannerFile(null); }}
                  >
                    <Close />
                  </IconButton>
                </>
              ) : (
                <Box>
                  <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">Upload or drop banner</Typography>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0 }}
                    onChange={handleBannerChange}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <TextField
          fullWidth
          label="Company Name"
          {...register('company_name', { required: 'Company name is required' })}
          error={!!errors.company_name}
          helperText={errors.company_name?.message}
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          label="About Company"
          multiline
          rows={4}
          {...register('description')}
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          label="Industry"
          {...register('industry', { required: 'Industry is required' })}
          error={!!errors.industry}
          helperText={errors.industry?.message}
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          label="Website"
          {...register('website')}
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" size="large">Save & Next →</Button>
        </Box>

      </Box>
    </Card>
  );
};

export default CompanyInfoStep;
