'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangePasswordModal({ open, onOpenChange }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    // Validate password strength
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    // Validate new password is different
    if (currentPassword && currentPassword === newPassword) {
      setError('New password must be different from current password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First, verify current password by attempting to sign in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.email) {
        setError('Unable to verify your account. Please try again.');
        setIsLoading(false);
        return;
      }
      
      // Verify current password
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      
      if (verifyError) {
        setError('Current password is incorrect');
        setIsLoading(false);
        return;
      }
      
      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (updateError) {
        setError(updateError.message);
        setIsLoading(false);
      } else {
        setSuccess(true);
        toast({
          title: 'Password updated',
          description: 'Your password has been successfully changed.',
        });
        
        // Reset form and close after 2 seconds
        setTimeout(() => {
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setSuccess(false);
          onOpenChange(false);
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setSuccess(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-white">
        {!success ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                🔒 Change Password
              </DialogTitle>
              <DialogDescription className="text-zinc-400">
                Update your account password. Make sure to use a strong password.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-900/30 border border-red-800 text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              {/* Current Password */}
              <div className="space-y-2">
                <label htmlFor="current-password" className="text-sm text-zinc-400">
                  Current Password
                </label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="h-11 bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500"
                  placeholder="Enter your current password"
                  autoFocus
                />
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label htmlFor="new-password" className="text-sm text-zinc-400">
                  New Password
                </label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="h-11 bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500"
                  placeholder="Enter new password"
                />
                <p className="text-xs text-zinc-500">Minimum 8 characters</p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm text-zinc-400">
                  Confirm New Password
                </label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-11 bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500"
                  placeholder="Confirm new password"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 !bg-blue-600 hover:!bg-blue-700 !text-white"
                size="lg"
              >
                {isLoading ? 'Updating password...' : 'Update Password'}
              </Button>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <CheckCircle className="w-6 h-6 text-green-500" />
                Password Updated!
              </DialogTitle>
              <DialogDescription className="text-zinc-400">
                Your password has been successfully changed.
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 text-center">
              <p className="text-sm text-zinc-400">
                You can now use your new password to sign in.
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

