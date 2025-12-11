import { useState } from 'react';
import { Box, Card, TextField, Button, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import { Add, Close } from '@mui/icons-material';

const socialPlatforms = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'Youtube' },
  { value: 'linkedin', label: 'LinkedIn' },
];

const SocialLinksStep = ({ data, onNext, onBack }) => {
  const [links, setLinks] = useState(
    Object.keys(data.social_links).length
      ? Object.entries(data.social_links).map(([platform, url]) => ({ platform, url }))
      : [{ platform: 'facebook', url: '' }]
  );

  const addLink = () => setLinks([...links, { platform: 'facebook', url: '' }]);
  const removeLink = (i) => setLinks(links.filter((_, idx) => i !== idx));
  const update = (i, field, val) => {
    const u = [...links];
    u[i][field] = val;
    setLinks(u);
  };

  const handleSubmit = () => {
    const social_links = {};
    links.forEach((l) => {
      if (l.url.trim() !== '') social_links[l.platform] = l.url;
    });

    onNext({ social_links });
  };

  return (
    <Card sx={{ p: 4 }}>
      <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>

        {links.map((link, i) => (
          <Box key={i} display="flex" gap={2} mb={2}>
            <FormControl sx={{ width: 200 }}>
              <InputLabel>Platform</InputLabel>
              <Select value={link.platform} label="Platform" onChange={(e) => update(i, 'platform', e.target.value)}>
                {socialPlatforms.map((p) => (
                  <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              placeholder="Profile link..."
              value={link.url}
              onChange={(e) => update(i, 'url', e.target.value)}
            />

            <IconButton disabled={links.length === 1} onClick={() => removeLink(i)}>
              <Close />
            </IconButton>
          </Box>
        ))}

        <Button fullWidth variant="outlined" startIcon={<Add />} onClick={addLink} sx={{ mb: 3 }}>
          Add Social Link
        </Button>

        <Box display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={onBack}>Previous</Button>
          <Button variant="contained" type="submit">Save & Next →</Button>
        </Box>

      </Box>
    </Card>
  );
};

export default SocialLinksStep;
