import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import { updateUserProfile } from '../../store/slices/authSlice';

const ProfileEdit = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      full_name: user?.full_name || '',
      gender: user?.gender || 'm',
      mobile_no: user?.mobile_no || '',
    },
  });

  const onSubmit = async (data) => {
    await dispatch(updateUserProfile(data));
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Profile Settings
      </Typography>

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Full Name"
              margin="normal"
              {...register('full_name', { required: 'Full name is required' })}
              error={!!errors.full_name}
              helperText={errors.full_name?.message}
            />

            <FormControl fullWidth margin="normal">
              <Controller
                name="mobile_no"
                control={control}
                rules={{ required: 'Mobile number is required' }}
                render={({ field }) => (
                  <PhoneInput
                    country={'in'}
                    value={field.value}
                    onChange={(phone) => field.onChange(`+${phone}`)}
                    inputStyle={{ width: '100%' }}
                  />
                )}
              />
              {errors.mobile_no && (
                <Typography color="error" variant="caption">
                  {errors.mobile_no.message}
                </Typography>
              )}
            </FormControl>

            <FormControl component="fieldset" margin="normal">
              <FormLabel component="legend">Gender</FormLabel>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    <FormControlLabel value="m" control={<Radio />} label="Male" />
                    <FormControlLabel value="f" control={<Radio />} label="Female" />
                    <FormControlLabel value="o" control={<Radio />} label="Other" />
                  </RadioGroup>
                )}
              />
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
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

export default ProfileEdit;