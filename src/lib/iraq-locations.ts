export const IRAQ_GOVERNORATES: Record<string, string[]> = {
  Baghdad: [
    'Al-Karkh', 'Al-Rusafa', 'Adhamiya', 'Kadhimiya', 'Sadr City',
    'Mansour', 'Karrada', 'New Baghdad', 'Dora', 'Abu Ghraib',
    'Mahmoudiya', 'Taji', 'Nahrawan',
  ],
  Basra: [
    'Basra City', 'Abu Al-Khasib', 'Al-Qurna', 'Shatt Al-Arab',
    'Midaina', 'Al-Hartha', 'Al-Zubair', 'Safwan',
  ],
  Nineveh: [
    'Mosul', 'Sinjar', 'Talafar', 'Al-Hamdaniya', 'Sheikhan',
    'Tilkaif', 'Al-Baaj', 'Rabia',
  ],
  Erbil: [
    'Erbil City', 'Soran', 'Shaqlawa', 'Koya', 'Makhmur',
    'Gwer', 'Mergasor', 'Choman',
  ],
  Sulaymaniyah: [
    'Sulaymaniyah City', 'Halabja', 'Chamchamal', 'Ranya',
    'Kalar', 'Darbandikhan', 'Penjwin', 'Dokan',
  ],
  Duhok: [
    'Duhok City', 'Zakho', 'Amadiya', 'Shekhan', 'Akre',
    'Bardarash', 'Mangesh', 'Batifa',
  ],
  Kirkuk: [
    'Kirkuk City', 'Dibis', 'Al-Hawija', 'Daquq', 'Daur',
  ],
  Anbar: [
    'Ramadi', 'Fallujah', 'Haditha', 'Hit', 'Al-Qaim',
    'Rutba', 'Ana', 'Rawah', 'Khaldiyah',
  ],
  Diyala: [
    'Baquba', 'Khanaqin', 'Mandali', 'Balad Ruz', 'Miqdadiyah',
    'Al-Muqdadiyah', 'Kifri', 'Khalis',
  ],
  Saladin: [
    'Tikrit', 'Samarra', 'Baiji', 'Shirqat', 'Tuz Khurmatu',
    'Balad', 'Dujail', 'Al-Daur',
  ],
  Wasit: [
    'Kut', 'Al-Hay', 'Al-Kut', 'Badra', 'Zurbatiya',
    'Ali Al-Gharbi', 'Al-Muwaffaqiyah', 'Teeb',
  ],
  Babil: [
    'Hillah', 'Al-Mahawil', 'Al-Musayyib', 'Al-Hashimiyah',
    'Al-Qasim', 'Jurf Al-Sakhar', 'Niffar',
  ],
  Karbala: [
    'Karbala City', 'Ain Al-Tamur', 'Al-Hindiyah',
  ],
  Najaf: [
    'Najaf City', 'Kufa', 'Al-Manathira', 'Al-Abbasia',
    'Al-Mishkhab',
  ],
  Qadisiyyah: [
    'Diwaniyah', 'Afak', 'Al-Hamza', 'Al-Shamiya',
    'Al-Ghammas', 'Nuffar',
  ],
  Muthanna: [
    'Samawah', 'Rumaitha', 'Khidhir', 'Al-Warka',
  ],
  'Dhi Qar': [
    'Nasiriyah', 'Al-Chibayish', 'Al-Rifai', 'Al-Shatra',
    'Suk Al-Shuyukh', 'Qalat Sukkar',
  ],
  Maysan: [
    'Amara', 'Ali Al-Gharbi', 'Qalat Salih', 'Al-Kahla',
    'Al-Maimouna', 'Al-Mejar Al-Kabir',
  ],
};

export const GOVERNORATE_NAMES = Object.keys(IRAQ_GOVERNORATES);

export const GOVERNORATE_AR: Record<string, string> = {
  Baghdad:      'بغداد',
  Basra:        'البصرة',
  Nineveh:      'نينوى',
  Erbil:        'أربيل',
  Sulaymaniyah: 'السليمانية',
  Duhok:        'دهوك',
  Kirkuk:       'كركوك',
  Anbar:        'الأنبار',
  Diyala:       'ديالى',
  Saladin:      'صلاح الدين',
  Wasit:        'واسط',
  Babil:        'بابل',
  Karbala:      'كربلاء',
  Najaf:        'النجف',
  Qadisiyyah:   'القادسية',
  Muthanna:     'المثنى',
  'Dhi Qar':    'ذي قار',
  Maysan:       'ميسان',
};

export const CITY_AR: Record<string, string> = {
  // Baghdad
  'Al-Karkh': 'الكرخ', 'Al-Rusafa': 'الرصافة', 'Adhamiya': 'الأعظمية',
  'Kadhimiya': 'الكاظمية', 'Sadr City': 'مدينة الصدر', 'Mansour': 'المنصور',
  'Karrada': 'الكرادة', 'New Baghdad': 'بغداد الجديدة', 'Dora': 'الدورة',
  'Abu Ghraib': 'أبو غريب', 'Mahmoudiya': 'المحمودية', 'Taji': 'الطارمية',
  'Nahrawan': 'النهروان',
  // Basra
  'Basra City': 'البصرة', 'Abu Al-Khasib': 'أبو الخصيب', 'Al-Qurna': 'القرنة',
  'Shatt Al-Arab': 'شط العرب', 'Midaina': 'المدينة', 'Al-Hartha': 'الهارثة',
  'Al-Zubair': 'الزبير', 'Safwan': 'صفوان',
  // Nineveh
  'Mosul': 'الموصل', 'Sinjar': 'سنجار', 'Talafar': 'تلعفر',
  'Al-Hamdaniya': 'الحمدانية', 'Sheikhan': 'شيخان', 'Tilkaif': 'تلكيف',
  'Al-Baaj': 'البعاج', 'Rabia': 'ربيعة',
  // Erbil
  'Erbil City': 'أربيل', 'Soran': 'سوران', 'Shaqlawa': 'شقلاوة',
  'Koya': 'كوية', 'Makhmur': 'مخمور', 'Gwer': 'كوير',
  'Mergasor': 'مرگسر', 'Choman': 'چومان',
  // Sulaymaniyah
  'Sulaymaniyah City': 'السليمانية', 'Halabja': 'حلبجة', 'Chamchamal': 'چمچمال',
  'Ranya': 'رانية', 'Kalar': 'كلار', 'Darbandikhan': 'دربنديخان',
  'Penjwin': 'پنجوين', 'Dokan': 'دوكان',
  // Duhok
  'Duhok City': 'دهوك', 'Zakho': 'زاخو', 'Amadiya': 'العمادية',
  'Shekhan': 'شيخان', 'Akre': 'عقرة', 'Bardarash': 'بردرش',
  'Mangesh': 'منكيش', 'Batifa': 'باطوفة',
  // Kirkuk
  'Kirkuk City': 'كركوك', 'Dibis': 'دبس', 'Al-Hawija': 'الحويجة',
  'Daquq': 'داقوق', 'Daur': 'الدور',
  // Anbar
  'Ramadi': 'الرمادي', 'Fallujah': 'الفلوجة', 'Haditha': 'حديثة',
  'Hit': 'هيت', 'Al-Qaim': 'القائم', 'Rutba': 'الرطبة',
  'Ana': 'عانة', 'Rawah': 'راوة', 'Khaldiyah': 'الخالدية',
  // Diyala
  'Baquba': 'بعقوبة', 'Khanaqin': 'خانقين', 'Mandali': 'مندلي',
  'Balad Ruz': 'بلد روز', 'Miqdadiyah': 'المقدادية',
  'Al-Muqdadiyah': 'المقدادية', 'Kifri': 'كفري', 'Khalis': 'الخالص',
  // Saladin
  'Tikrit': 'تكريت', 'Samarra': 'سامراء', 'Baiji': 'بيجي',
  'Shirqat': 'الشرقاط', 'Tuz Khurmatu': 'طوز خورماتو',
  'Balad': 'بلد', 'Dujail': 'الدجيل', 'Al-Daur': 'الدور',
  // Wasit
  'Kut': 'الكوت', 'Al-Hay': 'الحي', 'Al-Kut': 'الكوت',
  'Badra': 'بدرة', 'Zurbatiya': 'زرباطية', 'Ali Al-Gharbi': 'علي الغربي',
  'Al-Muwaffaqiyah': 'الموفقية', 'Teeb': 'طيب',
  // Babil
  'Hillah': 'الحلة', 'Al-Mahawil': 'المحاويل', 'Al-Musayyib': 'المسيب',
  'Al-Hashimiyah': 'الهاشمية', 'Al-Qasim': 'القاسم',
  'Jurf Al-Sakhar': 'جرف الصخر', 'Niffar': 'نفر',
  // Karbala
  'Karbala City': 'كربلاء', 'Ain Al-Tamur': 'عين التمر', 'Al-Hindiyah': 'الهندية',
  // Najaf
  'Najaf City': 'النجف', 'Kufa': 'الكوفة', 'Al-Manathira': 'المناذرة',
  'Al-Abbasia': 'العباسية', 'Al-Mishkhab': 'المشخاب',
  // Qadisiyyah
  'Diwaniyah': 'الديوانية', 'Afak': 'عفك', 'Al-Hamza': 'الحمزة',
  'Al-Shamiya': 'الشامية', 'Al-Ghammas': 'الغماس', 'Nuffar': 'نفر',
  // Muthanna
  'Samawah': 'السماوة', 'Rumaitha': 'الرميثة', 'Khidhir': 'الخضر',
  'Al-Warka': 'الوركاء',
  // Dhi Qar
  'Nasiriyah': 'الناصرية', 'Al-Chibayish': 'الجبايش', 'Al-Rifai': 'الرفاعي',
  'Al-Shatra': 'الشطرة', 'Suk Al-Shuyukh': 'سوق الشيوخ',
  'Qalat Sukkar': 'قلعة سكر',
  // Maysan
  'Amara': 'العمارة', 'Qalat Salih': 'قلعة صالح', 'Al-Kahla': 'الكحلاء',
  'Al-Maimouna': 'الميمونة', 'Al-Mejar Al-Kabir': 'المجر الكبير',
};

export function getGovernorateName(key: string, lang: string): string {
  return lang === 'ar' ? (GOVERNORATE_AR[key] ?? key) : key;
}

export function getCityName(city: string, lang: string): string {
  return lang === 'ar' ? (CITY_AR[city] ?? city) : city;
}

export function getCitiesForGovernorate(governorate: string): string[] {
  return IRAQ_GOVERNORATES[governorate] || [];
}
