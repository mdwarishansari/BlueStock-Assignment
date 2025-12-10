import { Box, Card, TextField, Button, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Other',
];

const teamSizes = ['1-10', '11-50', '51-200', '201-500', '500+'];

const FoundingInfoStep = ({ data, onNext, onBack }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      industry: data.industry,
      founded_date: data.founded_date,
      website: data.website,
      team_size: data.team_size || '',
    },
  });

  const onSubmit = (formData) => {
    onNext(formData);
  };

  return (
    <Card sx={{ p: 4 }}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl fullWidth error={!!errors.industry}>
            <InputLabel>Organization Type</InputLabel>
            <Controller
              name="organization_type"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select {...field} label="Organization Type">
                  <MenuItem value="private">Private</MenuItem>
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="non-profit">Non-Profit</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          <FormControl fullWidth error={!!errors.industry}>
            <InputLabel>Industry Types</InputLabel>
            <Controller
              name="industry"
              control={control}
              rules={{ required: 'Industry is required' }}
              render={({ field }) => (
                <Select {...field} label="Industry Types">
                  {industries.map((industry) => (
                    <MenuItem key={industry} value={industry}>
                      {industry}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Team Size</InputLabel>
            <Controller
              name="team_size"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select {...field} label="Team Size">
                  {teamSizes.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Controller
            name="founded_date"
            control={control}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
                customInput={<TextField fullWidth label="Year of Establishment" />}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={50}
              />
            )}
          />

          <TextField
            fullWidth
            label="Company Website"
            placeholder="Website url..."
            {...register('website')}
          />
        </Box>

        <TextField
          fullWidth
          label="Company Vision"
          multiline
          rows={4}
          placeholder="Tell us about your company vision..."
          {...register('vision')}
          sx={{ mb: 3 }}
        />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" size="large" onClick={onBack}>
            Previous
          </Button>
          <Button type="submit" variant="contained" size="large">
            Save & Next →
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default FoundingInfoStep;