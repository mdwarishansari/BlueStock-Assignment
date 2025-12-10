import { Box, Card, TextField, Button } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';

const ContactStep = ({ data, onNext, onBack, isLastStep }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      postal_code: data.postal_code,
      phone: data.phone || '',
      email: data.contact_email || '',
    },
  });

  const onSubmit = (formData) => {
    onNext(formData);
  };

  return (
    <Card sx={{ p: 4 }}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="Map Location"
          placeholder="Enter map location or address"
          {...register('address', { required: 'Address is required' })}
          error={!!errors.address}
          helperText={errors.address?.message}
          sx={{ mb: 3 }}
        />

        <Box sx={{ mb: 3 }}>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                country={'in'}
                value={field.value}
                onChange={(phone) => field.onChange(`+${phone}`)}
                inputStyle={{ width: '100%' }}
              />
            )}
          />
        </Box>

        <TextField
          fullWidth
          label="Email"
          type="email"
          placeholder="Email address"
          {...register('contact_email')}
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
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

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" size="large" onClick={onBack}>
            Previous
          </Button>
          <Button type="submit" variant="contained" size="large">
            {isLastStep ? 'Finish Editing →' : 'Save & Next →'}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default ContactStep;