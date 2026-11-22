const GAME_QUESTIONS = [
  {
    blockIndex: 1,
    question: "1. Blok: Binlerce veriyi cihazı dondurmadan, yalnızca ekranda görünür oldukları anda (Lazy Loading) oluşturan dinamik liste widget'ı hangisidir?",
    options: [
      "Standart ListView",
      "ListView.builder",
      "SingleChildScrollView"
    ],
    correctIndex: 1 // ListView.builder
  },
  {
    blockIndex: 2,
    question: "2. Blok: Material Design standartlarına uygun satır yapısı olan ListTile widget'ında, satırın en sağındaki ok ikonu veya anahtarı hangi parametre ile eklenir?",
    options: [
      "leading",
      "subtitle",
      "trailing"
    ],
    correctIndex: 2 // trailing
  },
  {
    blockIndex: 3,
    question: "3. Blok: Column içinde ListView.builder kullanırken sınırsız yükseklik (RenderBox) hatası almamak için liste mutlaka hangi widget ile sarmalanmalıdır?",
    options: [
      "Expanded",
      "Divider",
      "CircleAvatar"
    ],
    correctIndex: 0 // Expanded
  },
  {
    blockIndex: 4,
    question: "4. Blok: GridView.builder yapılandırmasında bir satırda yan yana kaç kutu (sütun) olacağını hangi parametre belirler?",
    options: [
      "childAspectRatio",
      "crossAxisCount",
      "mainAxisSpacing"
    ],
    correctIndex: 1 // crossAxisCount
  },
  {
    blockIndex: 5,
    question: "5. Blok: Liste elemanları arasına otomatik çizgi (Divider) veya boşluk koyan ve en son öğenin altına gereksiz çizgi çizmeyen yapı hangisidir?",
    options: [
      "ListView.separated",
      "GridView.count",
      "CustomScrollView"
    ],
    correctIndex: 0 // ListView.separated
  },
  {
    blockIndex: 6,
    question: "6. Blok: Listeyi animasyonlu şekilde başa veya belirli bir konuma kaydırmak için ScrollController ile hangi metot kullanılır?",
    options: [
      "dispose()",
      "onDismissed()",
      "animateTo()"
    ],
    correctIndex: 2 // animateTo()
  },
  {
    blockIndex: 7,
    question: "7. Blok: iOS tarzı arayüzlerde liste uçlarına gelindiğinde esnek yaylanma efekti veren ScrollPhysics sınıfı hangisidir?",
    options: [
      "ClampingScrollPhysics",
      "BouncingScrollPhysics",
      "NeverScrollableScrollPhysics"
    ],
    correctIndex: 1 // BouncingScrollPhysics
  },
  {
    blockIndex: 8,
    question: "8. Blok: Liste öğelerini parmakla sağa veya sola kaydırarak ekrandan silmeyi veya arşivlemeyi sağlayan etkileşimli widget hangisidir?",
    options: [
      "Dismissible",
      "RefreshIndicator",
      "SliverAppBar"
    ],
    correctIndex: 0 // Dismissible
  },
  {
    blockIndex: 9,
    question: "9. Blok: RefreshIndicator widget'ında listeyi aşağı çekince çalışan 'onRefresh' parametresi mutlaka hangi türde bir fonksiyon almalıdır?",
    options: [
      "void (Senkron)",
      "Future (Asenkron)",
      "Timer (Gecikmeli)"
    ],
    correctIndex: 1 // Future (Asenkron)
  },
  {
    blockIndex: 10,
    question: "10. Blok: Sıralanabilir ve silinebilir dinamik listelerde öğelerin yeri değiştiğinde Flutter'ın doğru widget'ı tanımasını sağlayan kimlik yapısı nedir?",
    options: [
      "Anahtarlar (Keys / ValueKey)",
      "itemExtent",
      "CircularProgressIndicator"
    ],
    correctIndex: 0 // Anahtarlar (Keys / ValueKey)
  },
  {
    blockIndex: 11,
    question: "11. Blok: CustomScrollView içinde esnek üst başlık (SliverAppBar), ızgara ve listeyi tek kaydırma alanında birleştiren mimari yapı hangisidir?",
    options: [
      "Expanded",
      "Sliver",
      "ListTile"
    ],
    correctIndex: 1 // Sliver
  },
  {
    blockIndex: 12,
    question: "12. Blok (Final Sorusu): Uzun listelerde kullanıcı arama yaparken her harfe bastığında sunucuyu yormamak için 300ms bekleyen gecikme tekniğine ne ad verilir?",
    options: [
      "Pagination (Sayfalama)",
      "Lazy Loading",
      "Debounce Tekniği"
    ],
    correctIndex: 2 // Debounce Tekniği
  }
];
