import { useState } from 'react';
import {
  Box,
  Card,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

const socialPlatforms = [
  { value: 'facebook', label: 'Facebook', icon: '📘' },
  { value: 'twitter', label: 'Twitter', icon: '🐦' },
  { value: 'instagram', label: 'Instagram', icon: '📷' },
  { value: 'youtube', label: 'Youtube', icon: '▶️' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
];

const SocialLinksStep = ({ data, onNext, onBack }) => {
  const [socialLinks, setSocialLinks] = useState(
    data.social_links && Object.keys(data.social_links).length > 0
      ? Object.entries(data.social_links).map(([platform, url]) => ({ platform, url }))
      : [{ platform: 'facebook', url: '' }]
  );

  const { handleSubmit } = useForm();

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: 'facebook', url: '' }]);
  };

  const removeSocialLink = (index) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const updateSocialLink = (index, field, value) => {
    const updated = [...socialLinks];
    updated[index][field] = value;
    setSocialLinks(updated);
  };

  const onSubmit = () => {
    const social_links = {};
    socialLinks.forEach((link) => {
      if (link.url) {
        social_links[link.platform] = link.url;
      }
    });
    onNext({ social_links });
  };

  return (
    <Card sx={{ p: 4 }}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        {socialLinks.map((link, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Social Link {index + 1}</InputLabel>
              <Select
                value={link.platform}
                onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                label={`Social Link ${index + 1}`}
              >
                {socialPlatforms.map((platform) => (
                  <MenuItem key={platform.value} value={platform.value}>
                    {platform.icon} {platform.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              placeholder="Profile link/url..."
              value={link.url}
              onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
            />

            <IconButton onClick={() => removeSocialLink(index)} disabled={socialLinks.length === 1}>
              <Close />
            </IconButton>
          </Box>
        ))}

        <Button
          fullWidth
          variant="outlined"
          startIcon={<Add />}
          onClick={addSocialLink}
          sx={{ mb: 3 }}
        >
          Add New Social Link
        </Button>

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

export default SocialLinksStep;