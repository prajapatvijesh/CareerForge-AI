import React, { useRef, useState } from 'react';
import { useUploadAvatar } from '../api/profile.api';

import { Camera, Loader2 } from 'lucide-react';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ currentAvatarUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadAvatar();
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so the same file can be selected again
    e.target.value = '';

    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name);
    if (!isImage) {
      setError('Please upload a valid image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    setError(null);
    uploadMutation.mutate(file, {
      onError: (err: any) => {
        setError(err?.response?.data?.message || err.message || 'Failed to upload avatar.');
      }
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-muted bg-muted flex items-center justify-center">
          {uploadMutation.isPending ? (
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          ) : currentAvatarUrl ? (
            <img src={currentAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <Camera className="w-12 h-12 text-muted-foreground opacity-50" />
          )}
        </div>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending}
          className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          type="button"
          aria-label="Upload Avatar"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>
      
      {error && <p className="text-sm text-destructive font-medium">{error}</p>}
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};
