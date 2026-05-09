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
  Maysan:       'ميسان',
};

export function getGovernorateName(key: string, lang: string): string {
  return lang === 'ar' ? (GOVERNORATE_AR[key] ?? key) : key;
}

export function getCitiesForGovernorate(governorate: string): string[] {
  return IRAQ_GOVERNORATES[governorate] || [];
}
