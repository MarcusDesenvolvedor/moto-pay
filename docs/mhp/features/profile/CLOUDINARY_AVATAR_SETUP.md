# Avatar Upload Configuration (Cloudinary)

## Flow

1. **Frontend** sends image directly to Cloudinary (unsigned upload)
2. **Cloudinary** returns `secure_url`
3. **Frontend** sends `secure_url` to backend
4. **Backend** validates URL, updates `avatar_url` in database and removes old image from Cloudinary

## Create Upload Preset

1. Access [Cloudinary Console](https://console.cloudinary.com/settings/upload/presets)
2. Click **Add upload preset**
3. Configure:
   - **Preset name**: `moto_pay_avatars` (or another name)
   - **Signing Mode**: **Unsigned**
   - **Folder**: `avatars`
   - **Allowed formats**: images (jpg, png, webp, gif)
4. Save the preset

## Environment Variables

Add to `.env`:

```
# Frontend (safe to expose)
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=moto_pay_avatars
```

## Validations

- **Type**: Images only (jpeg, png, webp, gif)
- **Size**: Maximum 5MB (web)
- **URL**: Backend validates that the URL is from Cloudinary before saving
