# TaklifNoma.uz - Ma'lumotlar Omborini Tiklash Qo'llanmasi

## 🗄️ Ma'lumotlar Omborini To'liq Tiklash

### 1-qadam: SQL Script-ni Ishga Tushirish

Supabase Dashboard-da SQL Editor-ga o'ting va `database-full-restore.sql` faylini ishga tushiring:

```sql
-- Faylni to'liq nusxalang va Supabase SQL Editor-da ishga tushiring
```

### 2-qadam: Tiklash Natijasini Tekshirish

Script ishlagandan keyin quyidagi xabar ko'rinishi kerak:

```
======================================================
TaklifNoma.uz Database To'liq Tiklandi!
======================================================
Yaratilgan tablelar:
- profiles (2 ta)
- custom_templates (4 ta)
- invitations (0 ta)
- guests (0 ta)
- rsvps (0 ta)
- invitation_views (0 ta)
- template_categories (6 ta)
======================================================
Yaratilgan funksiyalar: 7 ta
Yaratilgan triggerlar: 8 ta
RLS: O'chirilgan (CRUD uchun to'liq ruxsat)
Permissions: Anon, Authenticated, Service Role - TO'LIQ
======================================================
Database tayyor! Test qiling: SELECT public.test_connection();
======================================================
```

### 3-qadam: Connection Test

SQL Editor-da quyidagi comandani ishlatib test qiling:

```sql
SELECT public.test_connection();
```

Natija:
```json
{
  "status": "success",
  "message": "TaklifNoma.uz database is working",
  "timestamp": "2024-01-19T10:30:00Z",
  "version": "2.0"
}
```

## 📋 Yaratilgan Tablelar

### 1. **profiles** - Foydalanuvchi Profillari
- `id` - UUID (auth.users ga bog'langan)
- `first_name`, `last_name`, `full_name` - Ism sharif
- `email`, `phone` - Aloqa ma'lumotlari
- `avatar_url` - Profil rasmi
- `settings`, `metadata` - Qo'shimcha ma'lumotlar

### 2. **invitations** - Taklifnomalar
- `id` - UUID
- `user_id` - Yaratuvchi
- `groom_name`, `bride_name` - Kuyov va kelin ismlari
- `wedding_date`, `wedding_time` - To'y sanasi va vaqti
- `venue`, `address` - Joy va manzil
- `slug` - URL uchun unique identifikator
- `view_count`, `rsvp_count` - Statistika

### 3. **custom_templates** - Shablonlar
- `id` - UUID
- `name`, `description` - Nom va tavsif
- `category` - Kategoriya (classic, modern, elegant, etc.)
- `colors`, `fonts`, `config` - Dizayn sozlamalari
- `is_public`, `is_featured` - Ommaviy va tanlov shablonlari
- `usage_count` - Foydalanish soni

### 4. **guests** - Mehmonlar
- `invitation_id` - Taklifnoma ID
- `name`, `email`, `phone` - Mehmon ma'lumotlari
- `plus_one` - Qo'shimcha mehmon

### 5. **rsvps** - Javoblar
- `invitation_id` - Taklifnoma ID
- `guest_name` - Mehmon ismi
- `will_attend` - Keladi/kelmaydi
- `message` - Xabar

### 6. **invitation_views** - Ko'rishlar (Analitika)
- `invitation_id` - Taklifnoma ID
- `visitor_ip`, `user_agent` - Tashrif ma'lumotlari
- `device_type`, `browser` - Qurilma ma'lumotlari

### 7. **template_categories** - Shablon Kategoriyalari
- `name` - Nom (classic, modern, elegant, floral, vintage, minimalist)
- `display_name` - Ko'rsatiladigan nom
- `icon`, `color` - Interfeys uchun

## ⚙️ Yaratilgan Funksiyalar

1. **`handle_updated_at()`** - Avtomatik updated_at yangilash
2. **`handle_new_user()`** - Yangi foydalanuvchi uchun profil yaratish
3. **`increment_invitation_views()`** - Ko'rishlar sonini oshirish
4. **`increment_template_usage()`** - Shablon ishlatilish sonini oshirish
5. **`update_rsvp_count()`** - RSVP sonini yangilash
6. **`test_connection()`** - Connection test
7. **`get_invitation_stats(uuid)`** - Taklifnoma statistikasi

## 🔧 Yaratilgan Triggerlar

1. **Updated_at triggerlar** - Barcha tablelar uchun avtomatik yangilanish vaqti
2. **User creation trigger** - Yangi auth.users uchun profil yaratish
3. **View increment trigger** - Ko'rishlar sonini avtomatik oshirish
4. **Template usage trigger** - Shablon ishlatilishini hisoblash
5. **RSVP count trigger** - RSVP sonini avtomatik yangilash

## 🔓 Ruxsatlar va Cheklovlar

- **RLS (Row Level Security): O'CHIRILGAN** - CRUD uchun to'liq ruxsat
- **Anonymous users: TO'LIQ RUXSAT** - Hamma tablelar va funksiyalarga
- **Authenticated users: TO'LIQ RUXSAT** - Barcha operatsiyalar
- **Service role: TO'LIQ RUXSAT** - Backend operatsiyalar uchun

## 📊 Avtomatik Kiritilgan Ma'lumotlar

### Template Categories:
- **classic** - Klassik shablonlar
- **modern** - Zamonaviy shablonlar  
- **elegant** - Nafis shablonlar
- **floral** - Gullar naqshli shablonlar
- **vintage** - Retro shablonlar
- **minimalist** - Minimal shablonlar

### Sample Templates:
- **Klassik Oq Shablon** - Traditional white design
- **Zamonaviy Ko'k Shablon** - Modern blue design
- **Gullar Shablon** - Floral design
- **Oltin Nafis Shablon** - Elegant gold design

### Test Profiles:
- **test@example.com** - Test User
- **demo@taklifnoma.uz** - Demo User

## 🚀 Frontend Integration

Tiklangan database bilan ishlash uchun yangi client:

```typescript
import { supabase, testDatabaseConnection } from "@/lib/supabaseRestored";

// Connection test
const result = await testDatabaseConnection();
console.log(result); // {success: true, message: "Database ready!"}

// Save invitation
const invitation = await saveInvitationToDatabase(data);

// Load invitations
const invitations = await loadInvitationsFromDatabase(userId);

// Get templates
const templates = await getTemplatesFromDatabase();
```

## ✅ To'liq Tekshirish

1. **Connection Test:**
   ```sql
   SELECT public.test_connection();
   ```

2. **Tables Check:**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   ORDER BY table_name;
   ```

3. **Functions Check:**
   ```sql
   SELECT routine_name FROM information_schema.routines 
   WHERE routine_schema = 'public' 
   ORDER BY routine_name;
   ```

4. **Triggers Check:**
   ```sql
   SELECT trigger_name, event_object_table 
   FROM information_schema.triggers 
   WHERE trigger_schema = 'public';
   ```

## 🎉 Tayyor!

Ma'lumotlar ombori to'liq tiklandi va CRUD operatsiyalar uchun tayyor!

- ✅ Barcha tablelar yaratildi
- ✅ Funksiyalar va triggerlar ishlaydi  
- ✅ Sample ma'lumotlar kiritildi
- ✅ Cheklovlar o'chirildi
- ✅ To'liq ruxsatlar berildi
- ✅ Frontend bilan integratsiya tayyor
