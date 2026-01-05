# MyFreeMusic - Frontend

Frontend monorepo cho ứng dụng nghe nhạc MyFreeMusic.

## Cấu trúc

```
apps/
├── web/        # React/Next.js
└── mobile/     # React Native

packages/
├── api-client/    # Shared API client
└── shared-types/  # TypeScript types
```

## Cài đặt

```bash
npm install
npm run dev:web     # Web app
npm run dev:mobile  # Mobile app
```

## TODO

- [ ] Khởi tạo web app với Vite/Next.js
- [ ] Khởi tạo mobile app với React Native
- [ ] Tích hợp HLS.js cho streaming

Xem thêm tại [README chung](../README.md).