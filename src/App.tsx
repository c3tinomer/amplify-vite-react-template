// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress
} from '@mui/material';
import { Auth } from 'aws-amplify';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    dob: '',
    language: ''
  });
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setProfile({
          email: user.attributes.email,
          firstName: user.attributes.given_name || '',
          lastName: user.attributes.family_name || '',
          address: user.attributes.address || '',
          dob: user.attributes.birthdate || '',
          language: user.attributes['custom:language'] || ''
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  // Handle profile updates
  const handleInputChange = (field, value) => {
    setProfile((prevProfile) => ({ ...prevProfile, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await Auth.updateUserAttributes(await Auth.currentAuthenticatedUser(), {
        given_name: profile.firstName,
        family_name: profile.lastName,
        address: profile.address,
        birthdate: profile.dob,
        'custom:language': profile.language
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  // Handle profile deletion
  const handleDelete = async () => {
    try {
      setDeleting(true);
      await Auth.deleteUser();
      alert('Profile deleted successfully.');
      // Redirect to logout or login page
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('Failed to delete profile.');
    } finally {
      setDeleting(false);
      setOpenDialog(false);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Email Address"
              value={profile.email}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="First Name"
              value={profile.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Last Name"
              value={profile.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              value={profile.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Date of Birth"
              value={profile.dob}
              onChange={(e) => handleInputChange('dob', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Language Preference"
              value={profile.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setOpenDialog(true)}
            >
              Delete Profile
            </Button>
          </Grid>
        </Grid>
      )}
      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirm Profile Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your profile? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="secondary"
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProfilePage;

/**
 * Suggested Folder Structure:
 * 
 * src/
 * ├── components/
 * │   ├── ProfilePage.js         // Profile page component (current file)
 * │   ├── Header.js              // Header component
 * │   ├── Footer.js              // Footer component
 * ├── assets/                   // Static assets (images, logos, etc.)
 * ├── i18n/                     // Internationalization files
 * │   ├── en.json               // English translations
 * │   ├── fr.json               // French translations
 * ├── styles/                   // Custom styles (CSS/SASS)
 * │   ├── theme.js              // MUI theme configuration
 * ├── utils/                    // Utility functions
 * │   ├── authHelpers.js        // Authentication helpers for Amplify
 * │   ├── apiHelpers.js         // API interaction utilities
 * ├── App.js                    // Main app component
 * ├── aws-exports.js            // AWS Amplify configuration file
 * ├── index.js                  // React entry point
 * ├── package.json              // Project metadata and dependencies
 */
