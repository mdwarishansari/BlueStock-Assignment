import { Box, Card, TextField, Button } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';

const FoundingInfoStep = ({ data, onNext, onBack }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      industry: data.industry,
      founded_date: data.founded_date,
      website: data.website,
    },
  });

  const onSubmit = (formData) => {
    const cleaned = {
      industry: formData.industry,
      founded_date: formData.founded_date,
      website: formData.website,
    };
    onNext(cleaned);
  };

  return (
    <Card sx={{ p: 4 }}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>

        <TextField
          fullWidth
          label="Industry"
          {...register('industry', { required: 'Industry is required' })}
          error={!!errors.industry}
          helperText={errors.industry?.message}
          sx={{ mb: 3 }}
        />

        <Controller
          name="founded_date"
          control={control}
          render={({ field }) => (
            <DatePicker
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              dateFormat="yyyy-MM-dd"
              customInput={<TextField fullWidth label="Founded Date" />}
              showYearDropdown
            />
          )}
        />

        <TextField
          fullWidth
          label="Company Website"
          {...register('website')}
          sx={{ my: 3 }}
        />

        <Box display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={onBack}>Previous</Button>
          <Button type="submit" variant="contained">Save & Next →</Button>
        </Box>

      </Box>
    </Card>
  );
};

export default FoundingInfoStep;
