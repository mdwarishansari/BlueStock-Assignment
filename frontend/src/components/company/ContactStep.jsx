import { Box, Card, TextField, Button } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';

const ContactStep = ({ data, onNext, onBack, isLastStep }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
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
    const { phone, email, ...clean } = formData;
    onNext(clean);
  };

  return (
    <Card sx={{ p: 4 }}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>

        <TextField
          fullWidth
          label="Address"
          {...register('address', { required: 'Address is required' })}
          error={!!errors.address}
          helperText={errors.address?.message}
          sx={{ mb: 3 }}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <PhoneInput country="in" value={field.value} onChange={(p) => field.onChange(`+${p}`)} inputStyle={{ width: '100%' }} />
          )}
        />

        <TextField fullWidth label="Email" {...register('contact_email')} sx={{ my: 3 }} />

        <Box display="flex" gap={2} mb={3}>
          <TextField fullWidth label="City" {...register('city', { required: 'City is required' })} />
          <TextField fullWidth label="State" {...register('state', { required: 'State is required' })} />
        </Box>

        <Box display="flex" gap={2}>
          <TextField fullWidth label="Country" {...register('country', { required: 'Country is required' })} />
          <TextField fullWidth label="Postal Code" {...register('postal_code', { required: 'Postal code is required' })} />
        </Box>

        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button variant="outlined" onClick={onBack}>Previous</Button>
          <Button type="submit" variant="contained">{isLastStep ? 'Finish →' : 'Next →'}</Button>
        </Box>

      </Box>
    </Card>
  );
};

export default ContactStep;
