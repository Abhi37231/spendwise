import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      const res = await api.put('/profile', { name, email });
      updateUser(res.data);
      setToast({ message: 'Profile updated successfully!', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      setToast({ message: 'Failed to update profile.', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setToast({ message: 'New passwords do not match.', type: 'error' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    try {
      setPasswordLoading(true);
      await api.put('/profile/password', { currentPassword, newPassword });
      setToast({ message: 'Password updated successfully!', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setToast(null), 3000);
    } catch (error: any) {
      setToast({ message: error.response?.data?.message || 'Failed to update password.', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 text-white transition-opacity ${toast.type === 'success' ? 'bg-success' : 'bg-destructive'}`}>
          {toast.message}
        </div>
      )}

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile & Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <Button variant="outline" type="button" size="sm">Change Avatar</Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                  />
                </div>
                
                <Button type="submit" disabled={profileLoading}>
                  {profileLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your app experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Theme</Label>
                  <p className="text-sm text-muted-foreground">Select your preferred appearance.</p>
                </div>
                <select 
                  className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as any)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <Label className="text-base">Currency</Label>
                  <p className="text-sm text-muted-foreground">Default currency for expenses.</p>
                </div>
                <div className="flex h-10 w-32 items-center justify-center rounded-md border border-input bg-muted px-3 py-2 text-sm">
                  ₹ INR
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Ensure your account remains secure.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    value={currentPassword} 
                    onChange={e => setCurrentPassword(e.target.value)} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    required 
                  />
                </div>
                
                <Button type="submit" disabled={passwordLoading}>
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Sign out</h4>
                  <p className="text-sm text-muted-foreground">Sign out of your account on this device.</p>
                </div>
                <Button variant="outline" onClick={logout}>Log out</Button>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-destructive/20">
                <div>
                  <h4 className="font-medium text-destructive">Delete account</h4>
                  <p className="text-sm text-muted-foreground">Permanently delete your data.</p>
                </div>
                <Button variant="destructive">Delete</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
