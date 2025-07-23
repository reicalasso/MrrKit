# MrrKit

Prompt ile uygulama oluşturan AI destekli web platformu.

## 🎯 Amaç

MrrKit'in amacı, geliştiriciler, tasarımcılar ve yaratıcılar için doğal dil promptları kullanarak fonksiyonel yazılım uygulamaları oluşturabilecekleri sezgisel, AI destekli bir ortam sağlamaktır.

İnsan niyeti ile çalıştırılabilir kod arasındaki boşluğu doldurarak, MrrKit yazılım yaratma sürecini basitleştirmeyi, daha erişilebilir, eğlenceli ve ifade edici hale getirmeyi hedefler—tıpkı bir yazılımcının odaklanmış ve verimli çalışma anları gibi.

## 🚀 Özellikler

- **Doğal Dil'den Kod'a Dönüşüm**: Arayüz veya işlevselliğinizi sade Türkçe/İngilizce ile tanımlayın, MrrKit gerçek zamanlı olarak responsive, üretime hazır kod bileşenleri üretsin

- **Canlı Önizleme Ortamı**: Yerleşik görsel önizleme paneli ile promptlarınızdan üretilen bileşenleri anında görün ve etkileşim kurun

- **Modüler Bileşen Kütüphanesi**: Shadcn UI ve Tailwind CSS gibi modern kütüphaneler üzerine inşa edilmiş zengin, genişletilebilir UI bileşen seti

- **Sıfır Kurulum Deployment**: Vercel gibi servislerle entegrasyon sayesinde ürettiğiniz uygulamaları tek tıkla deploy edin—manuel kurulum gerektirmez

- **Komut Satırı Arkadaşı ("CatShell")**: Proje iskeletleri oluşturmak, şablonları yönetmek veya kendi terminal ortamınızda özel scriptler çalıştırmak isteyen ileri düzey kullanıcılar için CLI aracı

- **Stil ile Özelleştirme**: Minimalist'ten cyberpunk'a, kedi-ilhamlı tasarım sistemlerine kadar temalı yapılar desteği ile estetik ifade gücü

## 👥 Hedef Kitle

MrrKit, yazılımı hızlı ve yaratıcı şekilde oluşturmak isteyen geniş bir yaratıcı kitlesine yöneliktir:

**Frontend Geliştiriciler**  
Fikirleri prototiplemek veya akıllı otomasyon kullanarak tam UI'lar üretmek isteyen geliştiriciler.

**UI/UX Tasarımcılar**  
Düzenleri ve etkileşimleri sıfırdan kodlamak yerine açıklayarak tasarlamayı tercih eden tasarımcılar.

**Bağımsız Yapımcılar & Startup'lar**  
Büyük geliştirici ekipleri kurmadan MVP'ler oluşturmak ve ürünleri hızla piyasaya sürmek isteyen girişimciler.

**Eğitimciler & Öğrenciler**  
Uygulamalı, AI destekli deneyimler yoluyla web geliştirme kavramlarını öğrenmek veya öğretmek isteyen akademisyenler.

**Yaratıcı Teknoloji Uzmanları & Sanatçılar**  
Yazılım geliştirmeye daha ifade edici, akışkan ve estetik bir yaklaşım arayan yaratıcı profesyoneller.

## 🛠️ Teknoloji Yığını

**Frontend Framework: Next.js**  
Ölçeklenebilir uygulamalar için sunucu tarafı rendering ve verimli sayfa yönlendirmesi sağlar.

**Stil Sistemi: Tailwind CSS**  
Hızlı ve responsive UI geliştirme için utility-first CSS framework'ü.

**Bileşen Kütüphanesi: Shadcn UI**  
Tam özelleştirme için tasarlanmış headless, erişilebilir React bileşenleri.

**AI Entegrasyonu: OpenAI GPT-4 API**  
Doğal dil promptlarını işler ve React uyumlu JSX kod blokları üretir.

**Canlı Kod Çalıştırma: React Dynamic Rendering**  
Anında görsel geri bildirim için üretilen bileşenleri gerçek zamanlı olarak render eder.

**Deployment Platformu: Vercel**  
Otomatik önizlemeler ve production hosting ile sorunsuz deployment pipeline'ı.

## 🎯 Kullanım

1. Oluşturmak istediğiniz uygulamayı açıklayan bir prompt yazın
2. AI sizin için kodu üretsin
3. Gerçek zamanlı önizleme ile sonucu görün
4. Gerekirse promptu düzenleyip iyileştirin
5. Uygulamanızı dışa aktarın veya deploy edin

## 📦 Kurulum

```bash
# Repository'yi klonlayın
git clone https://github.com/username/MrrKit.git

# Proje dizinine gidin
cd MrrKit

# Dependencies'leri yükleyin
npm install

# Environment variables'ları ayarlayın (opsiyonel)
cp .env.local.example .env.local
# .env.local dosyasını editleyip OpenAI API key'inizi ekleyin

# Geliştirme sunucusunu başlatın
npm run dev
```

### Environment Variables

```bash
# .env.local
OPENAI_API_KEY=your_openai_api_key_here
```

**Not:** OpenAI API key olmadan da uygulama çalışır. Bu durumda mock responses kullanılır.

## 🔧 Troubleshooting

### OpenAI API Sorunları

**Model Erişim Hatası (404)**
- GPT-4 erişiminiz yoksa uygulama otomatik olarak GPT-3.5-turbo kullanacaktır
- Desteklenen modeller: `gpt-3.5-turbo`, `gpt-3.5-turbo-16k`, `gpt-4o-mini`

**API Key Hatası**
- OpenAI hesabınızda kredi bulunduğundan emin olun
- API key'in doğru formatta olduğunu kontrol edin
- Rate limit aşılmışsa biraz bekleyip tekrar deneyin

**Fallback Sistem**
- OpenAI API erişilemiyor ise otomatik olarak mock responses devreye girer
- Mock responses temel bileşenler için önceden tanımlanmış kodlar içerir

## 🚀 Hızlı Başlangıç

1. `http://localhost:3000` adresine gidin
2. Sol panelde istediğiniz uygulamayı açıklayan bir prompt yazın
3. "Kodu Üret" butonuna tıklayın
4. Sağ panelde önizlemeyi görün ve kodu inceleyin
5. Kodu kopyalayın veya dosya olarak indirin

**İpucu:** Daha detaylı prompt'lar daha iyi sonuçlar verir. Bileşenin özelliklerini, stilini ve davranışını açıkça belirtin.

## 🤝 Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır. Büyük değişiklikler için önce issue açarak tartışalım.

## 📄 Lisans

MIT License