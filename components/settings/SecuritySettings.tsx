'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChangePasswordModal } from './ChangePasswordModal';

export function SecuritySettings() {
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between py-3 border-b border-zinc-800">
        <div>
          <div className="font-medium">Change Password</div>
          <p className="text-sm text-zinc-400">
            Update your account password
          </p>
        </div>
        <Button
          onClick={() => setShowChangePassword(true)}
          variant="outline"
          className="!text-white !border-zinc-700 hover:!bg-zinc-800"
        >
          Change Password
        </Button>
      </div>

      <ChangePasswordModal 
        open={showChangePassword} 
        onOpenChange={setShowChangePassword} 
      />
    </>
  );
}

