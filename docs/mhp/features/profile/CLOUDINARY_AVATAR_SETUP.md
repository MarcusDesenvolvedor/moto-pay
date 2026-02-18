# Configuração do Upload de Avatar (Cloudinary)

## Fluxo

1. **Frontend** envia imagem diretamente ao Cloudinary (upload unsigned)
2. **Cloudinary** retorna `secure_url`
3. **Frontend** envia `secure_url` ao backend
4. **Backend** valida URL, atualiza `avatar_url` no banco e remove imagem antiga do Cloudinary

## Criar Upload Preset

1. Acesse [Cloudinary Console](https://console.cloudinary.com/settings/upload/presets)
2. Clique em **Add upload preset**
3. Configure:
   - **Preset name**: `moto_pay_avatars` (ou outro nome)
   - **Signing Mode**: **Unsigned**
   - **Folder**: `avatars`
   - **Allowed formats**: images (jpg, png, webp, gif)
4. Salve o preset

## Variáveis de Ambiente

Adicione ao `.env`:

```
# Frontend (seguro para expor)
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=seu_cloud_name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=moto_pay_avatars
```

## Validações

- **Tipo**: Apenas imagens (jpeg, png, webp, gif)
- **Tamanho**: Máximo 5MB (web)
- **URL**: Backend valida que a URL é do Cloudinary antes de salvar
