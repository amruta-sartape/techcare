import {
  Profile,
  ServiceItem,
  Device,
  Technician,
  ServiceRequest,
  Appointment,
  Message,
  NotificationItem,
  Invoice,
  Warranty,
  Review,
  InventoryItem
} from '../types';

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'user-customer-1',
    user_id: 'auth-customer-1',
    email: 'amit.shinde@example.com',
    full_name: 'Amit Shinde',
    role: 'customer',
    phone: '+91 94220 33819',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    address: 'Prabhat Nagar, Link Road',
    city: 'Pandharpur',
    state: 'Maharashtra',
    postal_code: '413304',
    created_at: '2026-01-15T08:30:00Z',
  },
  {
    id: 'user-tech-1',
    user_id: 'auth-tech-1',
    email: 'rohan.deshmukh@techcare.in',
    full_name: 'Rohan Deshmukh',
    role: 'technician',
    phone: '+91 98220 14592',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    address: 'Industrial Estate, Station Road',
    city: 'Pandharpur',
    state: 'Maharashtra',
    postal_code: '413304',
    created_at: '2025-11-01T10:00:00Z',
  },
  {
    id: 'user-admin-1',
    user_id: 'auth-admin-1',
    email: 'amrutasartape27@gmail.com',
    full_name: 'Amruta Vaibhav Sartape',
    role: 'admin',
    phone: '+91 70833 81807',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    address: 'Station Road, Near Shivaji Chowk',
    city: 'Pandharpur',
    state: 'Maharashtra',
    postal_code: '413304',
    created_at: '2025-08-10T09:00:00Z',
  },
  {
    id: 'user-customer-2',
    user_id: 'auth-customer-2',
    email: 'amruta.sartape@techclient.in',
    full_name: 'Amruta Sartape',
    role: 'customer',
    phone: '+91 98223 45120',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    address: 'Station Road, Near Mahavir Nagar',
    city: 'Pandharpur',
    state: 'Maharashtra',
    postal_code: '413304',
    created_at: '2026-02-01T10:00:00Z',
  },
  {
    id: 'user-customer-3',
    user_id: 'auth-customer-3',
    email: 'rohit.deshmukh@solapurtech.com',
    full_name: 'Rohit Deshmukh',
    role: 'customer',
    phone: '+91 97645 88219',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    address: 'Saat Rasta, South Sadar Bazar',
    city: 'Solapur',
    state: 'Maharashtra',
    postal_code: '413001',
    created_at: '2026-02-04T11:30:00Z',
  },
  {
    id: 'user-customer-4',
    user_id: 'auth-customer-4',
    email: 'priya.patil@puneventures.in',
    full_name: 'Priya Patil',
    role: 'customer',
    phone: '+91 94231 10984',
    avatar_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200',
    address: 'High Street, Baner IT Corridor',
    city: 'Pune',
    state: 'Maharashtra',
    postal_code: '411045',
    created_at: '2026-02-08T09:15:00Z',
  },
  {
    id: 'user-customer-5',
    user_id: 'auth-customer-5',
    email: 'vikram.kadam@kolhapuragro.in',
    full_name: 'Vikram Kadam',
    role: 'customer',
    phone: '+91 98500 76231',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    address: 'Shahupuri 3rd Lane, Station Road',
    city: 'Kolhapur',
    state: 'Maharashtra',
    postal_code: '416001',
    created_at: '2026-02-11T14:45:00Z',
  },
  {
    id: 'user-customer-6',
    user_id: 'auth-customer-6',
    email: 'sneha.jadhav@sanglidesign.co',
    full_name: 'Sneha Jadhav',
    role: 'customer',
    phone: '+91 99752 44309',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    address: 'College Road, Vishrambag',
    city: 'Sangli',
    state: 'Maharashtra',
    postal_code: '416415',
    created_at: '2026-02-14T16:20:00Z',
  },
  {
    id: 'user-customer-7',
    user_id: 'auth-customer-7',
    email: 'aditya.kulkarni@mumbaisys.io',
    full_name: 'Aditya Kulkarni',
    role: 'customer',
    phone: '+91 98201 65432',
    avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200',
    address: 'G Block, Bandra Kurla Complex (BKC)',
    city: 'Mumbai',
    state: 'Maharashtra',
    postal_code: '400051',
    created_at: '2026-02-18T10:30:00Z',
  },
  {
    id: 'user-customer-8',
    user_id: 'auth-customer-8',
    email: 'neha.shinde@pandharpurmed.org',
    full_name: 'Neha Shinde',
    role: 'customer',
    phone: '+91 91580 39811',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    address: 'Shivaji Chowk, Old Karad Naka',
    city: 'Pandharpur',
    state: 'Maharashtra',
    postal_code: '413304',
    created_at: '2026-02-22T08:00:00Z',
  },
  {
    id: 'user-customer-9',
    user_id: 'auth-customer-9',
    email: 'akash.pawar@solapurfab.in',
    full_name: 'Akash Pawar',
    role: 'customer',
    phone: '+91 96041 87290',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    address: 'Plot 42, MIDC Industrial Area',
    city: 'Solapur',
    state: 'Maharashtra',
    postal_code: '413006',
    created_at: '2026-02-25T13:10:00Z',
  },
  {
    id: 'user-customer-10',
    user_id: 'auth-customer-10',
    email: 'pooja.more@punetechlabs.com',
    full_name: 'Pooja More',
    role: 'customer',
    phone: '+91 98902 44781',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    address: 'Phase 1 Tech Park, Hinjewadi',
    city: 'Pune',
    state: 'Maharashtra',
    postal_code: '411057',
    created_at: '2026-03-01T15:00:00Z',
  },
  {
    id: 'user-customer-11',
    user_id: 'auth-customer-11',
    email: 'rahul.chavan@kolhapurlogistics.com',
    full_name: 'Rahul Chavan',
    role: 'customer',
    phone: '+91 97654 32109',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    address: 'Plot 12, Tarabai Park',
    city: 'Kolhapur',
    state: 'Maharashtra',
    postal_code: '416003',
    created_at: '2026-03-05T11:40:00Z',
  },
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    name: 'Laptop Repair',
    slug: 'laptop-repair',
    category: 'Hardware Repair',
    description: 'Specialized motherboard logic repair, liquid damage ultrasonic cleaning, screen replacements, and hinge rebuilds.',
    starting_price: 1499.0,
    estimated_duration: '24 - 48 hours',
    common_issues: [
      'Cracked or flickering LCD/OLED display',
      'Battery not charging or draining fast',
      'Spilled liquid on keyboard or touchpad',
      'Overheating, loud fans, thermal throttling',
      'Broken hinge or structural chassis damage'
    ],
    included_items: [
      'Multi-point diagnostic bench inspection',
      'Micro-soldering & component level repair',
      'Dust removal & Arctic MX-4 thermal repasting',
      '90-day parts and labor warranty'
    ],
    faqs: [
      {
        question: 'Will my data remain confidential and intact during repair?',
        answer: 'Yes. All data drives are isolated or protected by strict enterprise nondisclosure policies. We never wipe drives without your express permission.'
      },
      {
        question: 'Do you use genuine OEM replacement parts?',
        answer: 'We exclusively source Tier-1 OEM or genuine certified components with manufacturer verification.'
      }
    ],
    is_active: true,
    icon: 'Laptop'
  },
  {
    id: 'srv-2',
    name: 'Desktop Repair',
    slug: 'desktop-repair',
    category: 'Hardware Repair',
    description: 'Workstation and custom PC troubleshooting, power supply diagnostics, GPU diagnostics, and hardware replacements.',
    starting_price: 1199.0,
    estimated_duration: '24 hours',
    common_issues: [
      'No power / PC turns on then immediately shuts off',
      'Random blue screens (BSOD) under load',
      'GPU artifacting, coil whine, or display dropouts',
      'Power supply unit (PSU) rail failure',
      'CMOS corruption and BIOS loop'
    ],
    included_items: [
      'Bench-level oscilloscope power rail test',
      'MemTest86 memory stress analysis',
      'AIDA64 / FurMark stability burn-in test',
      'Cable management cleanup'
    ],
    faqs: [
      {
        question: 'Can you work on custom liquid-cooled loops?',
        answer: 'Yes, our certified Level 3 technicians can flush, pressure-test, and refill custom water loops.'
      }
    ],
    is_active: true,
    icon: 'Monitor'
  },
  {
    id: 'srv-3',
    name: 'Mobile Device Repair',
    slug: 'mobile-repair',
    category: 'Mobile Devices',
    description: 'Smartphones and tablet screen swaps, battery replacements, charging port micro-soldering, and sensor repair.',
    starting_price: 899.0,
    estimated_duration: '1 - 2 hours',
    common_issues: [
      'Shattered front glass or digitizer touch dead spots',
      'Swollen or degraded Li-ion battery pack',
      'Loose or burnt USB-C / Lightning port',
      'Microphone or speaker muffled / buzzing',
      'FaceID or Biometric sensor calibration error'
    ],
    included_items: [
      'Original OLED / Retina display assembly',
      'IP68 water-resistant adhesive re-sealing',
      'Battery health verification report',
      'Same-day expedited turnaround'
    ],
    faqs: [
      {
        question: 'Does screen replacement maintain True Tone and touch response?',
        answer: 'Yes, we reprogram display serial data using dedicated EEPROM programmers to preserve True Tone and auto-brightness.'
      }
    ],
    is_active: true,
    icon: 'Smartphone'
  },
  {
    id: 'srv-4',
    name: 'Printer & Scanner Service',
    slug: 'printer-scanner-service',
    category: 'Office Equipment',
    description: 'Commercial and consumer laser printer servicing, roller kit overhaul, optical scanner alignment, and driver fixes.',
    starting_price: 799.0,
    estimated_duration: '24 hours',
    common_issues: [
      'Persistent paper jams in pickup rollers',
      'Streaking, ghosting, or faded laser prints',
      'Network scanning timeout and SMB share errors',
      'Fuser unit overheating error code (E001/50.x)',
      'Waste toner box overflow'
    ],
    included_items: [
      'Pickup roller rejuvenation and chemical cleaning',
      'Optical mirror and mirror-polygon mirror dust removal',
      'Firmware update and test print calibration',
      'Spooler network re-indexing'
    ],
    faqs: [
      {
        question: 'Do you offer on-site enterprise printer visits?',
        answer: 'Yes, our dispatch technicians bring OEM maintenance kits directly to your office location.'
      }
    ],
    is_active: true,
    icon: 'Printer'
  },
  {
    id: 'srv-5',
    name: 'Networking & Wi-Fi',
    slug: 'networking-wifi',
    category: 'Infrastructure',
    description: 'Enterprise mesh Wi-Fi 6/7 deployment, router & firewall security hardening, VLAN segmentation, and dead-zone elimination.',
    starting_price: 1299.0,
    estimated_duration: '2 - 4 hours',
    common_issues: [
      'Wi-Fi signal drops during Zoom calls or VoIP calls',
      'Sub-optimal throughput despite Gigabit internet ISP',
      'IoT smart devices dropping offline constantly',
      'Double NAT errors and port forwarding issues',
      'Unsecured rogue access points'
    ],
    included_items: [
      'RF spectrum heatmap analysis',
      'Channel interference optimization',
      'Firewall rule review and WPA3 security setup',
      'Cat6a/Cat7 patch cable certification'
    ],
    faqs: [
      {
        question: 'Can you set up guest networks isolated from office workstations?',
        answer: 'Yes, we configure isolated 802.1Q VLANs with strict firewall rules so visitors cannot access private NAS or work computers.'
      }
    ],
    is_active: true,
    icon: 'Wifi'
  },
  {
    id: 'srv-6',
    name: 'Software & OS Support',
    slug: 'software-os-support',
    category: 'Software',
    description: 'Operating system reinstallation, malware eradication, registry cleanups, driver conflicts, and software deployment.',
    starting_price: 699.0,
    estimated_duration: '2 - 4 hours',
    common_issues: [
      'Windows/macOS bootloops or "Automatic Repair" loops',
      'Ransomware, adware popups, or trojan infections',
      'Software crashes on launch with DLL runtime errors',
      'Corrupted user profile and permission lockout',
      'Driver conflict causing black screens on wake'
    ],
    included_items: [
      'Deep forensic rootkit & trojan scan',
      'System file integrity repair (SFC / DISM)',
      'Clean OS installation with license activation',
      'Essential productivity runtime package installation'
    ],
    faqs: [
      {
        question: 'Can this be done remotely?',
        answer: 'Yes! Remote encrypted screen share support is available for most software and OS troubleshooting tasks.'
      }
    ],
    is_active: true,
    icon: 'Code'
  },
  {
    id: 'srv-7',
    name: 'Data Recovery',
    slug: 'data-recovery',
    category: 'Critical Services',
    description: 'Cleanroom recovery from dropped hard drives, failed SSDs, formatted partitions, RAID arrays, and flash media.',
    starting_price: 2499.0,
    estimated_duration: '48 - 72 hours',
    common_issues: [
      'Hard drive clicking, beeping, or not spinning',
      'SSD in read-only lock or controller panic state (0 MB)',
      'Accidentally formatted partition or deleted folder',
      'Degraded RAID-5/RAID-10 NAS storage pool',
      'BitLocker or FileVault partition raw corrupted'
    ],
    included_items: [
      'Non-destructive bit-for-bit drive cloning',
      'Clean-bench head and platter inspection',
      'Extracted file tree preview before payment',
      'High-speed transfer to encrypted external media'
    ],
    faqs: [
      {
        question: 'What is your "No Data, No Recovery Fee" policy?',
        answer: 'If our specialists cannot recover your critical files, you do not pay the recovery fee. Only the initial intake evaluation fee applies.'
      }
    ],
    is_active: true,
    icon: 'Database'
  },
  {
    id: 'srv-8',
    name: 'Device Maintenance',
    slug: 'device-maintenance',
    category: 'Preventative',
    description: 'Comprehensive preventative deep clean, thermal pad replacement, port decontamination, and performance tuning.',
    starting_price: 599.0,
    estimated_duration: '2 hours',
    common_issues: [
      'Accumulated dust blocking heatsink fins',
      'Dried thermal compound causing 95°C+ temperatures',
      'Sticky keys or jammed USB/HDMI ports',
      'Sluggish startup with 100% disk usage',
      'Bloatware consuming excess RAM'
    ],
    included_items: [
      'High-pressure ESD-safe vacuum & brush clean',
      'Premium liquid thermal paste re-application',
      'Port contact deoxidation & tension check',
      'Startup program & registry trim'
    ],
    faqs: [
      {
        question: 'How often should laptops or gaming PCs be repasted?',
        answer: 'We recommend preventative cleaning and thermal paste renewal every 12 to 18 months for optimal longevity.'
      }
    ],
    is_active: true,
    icon: 'ShieldCheck'
  },
  {
    id: 'srv-9',
    name: 'IT Setup & Installation',
    slug: 'it-setup-installation',
    category: 'Infrastructure',
    description: 'End-to-end workstation rollout, monitor arm mounting, enterprise VPN, automated cloud backup, and printer setup.',
    starting_price: 1999.0,
    estimated_duration: '3 - 5 hours',
    common_issues: [
      'New office desks needing clean, zero-cable routing',
      'Configuring dual 4K monitors and Thunderbolt docks',
      'Setting up automated daily local + cloud backup',
      'Deploying secure remote VPN for remote employees',
      'Centralized NAS setup with user access tiers'
    ],
    included_items: [
      'Full physical unboxing & ergonomic mounting',
      'Cable trunking & under-desk spine management',
      'Automated 3-2-1 backup verification',
      'Staff onboarding and user credentials handover'
    ],
    faqs: [
      {
        question: 'Can you migrate data and software from old PCs to new ones?',
        answer: 'Yes! We perform byte-accurate user profile migrations including browser bookmarks, email clients, and application preferences.'
      }
    ],
    is_active: true,
    icon: 'Server'
  }
];

export const INITIAL_DEVICES: Device[] = [
  {
    id: 'dev-1',
    user_id: 'user-customer-1',
    device_type: 'Laptop',
    brand: 'Apple',
    model: 'MacBook Pro 16" (M2 Pro, 32GB RAM)',
    serial_number: 'C02G90XXMD6M',
    purchase_date: '2023-04-10',
    warranty_status: 'active',
    notes: 'Primary developer workstation. Space Gray chassis, dual monitor setup.',
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=300',
    created_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 'dev-2',
    user_id: 'user-customer-1',
    device_type: 'Desktop',
    brand: 'Custom Build',
    model: 'AMD Ryzen 9 7950X / RTX 4080 Workstation',
    serial_number: 'RIG-7950-4080',
    purchase_date: '2023-11-20',
    warranty_status: 'active',
    notes: 'Used for 3D simulation and machine learning inference. Corsair 5000D case.',
    image_url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=300',
    created_at: '2026-02-05T14:30:00Z',
  },
  {
    id: 'dev-3',
    user_id: 'user-customer-1',
    device_type: 'Mobile',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max 256GB',
    serial_number: 'F17HK92PNP',
    purchase_date: '2023-10-01',
    warranty_status: 'expiring_soon',
    notes: 'Natural Titanium. Minor scuff on lower bezel.',
    image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=300',
    created_at: '2026-02-10T11:15:00Z',
  },
  {
    id: 'dev-4',
    user_id: 'user-customer-1',
    device_type: 'Printer',
    brand: 'Brother',
    model: 'HL-L8360CDW Color Laser',
    serial_number: 'U64201F8N123456',
    purchase_date: '2022-06-18',
    warranty_status: 'expired',
    notes: 'High-volume office document printer. Located in Bay 2.',
    image_url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=300',
    created_at: '2026-02-12T09:00:00Z',
  },
  {
    id: 'dev-5',
    user_id: 'user-customer-2',
    device_type: 'Laptop',
    brand: 'Apple',
    model: 'MacBook Air 13" (M2, 16GB RAM)',
    serial_number: 'C02H189KMD6R',
    purchase_date: '2023-08-14',
    warranty_status: 'active',
    notes: 'Starlight aluminum chassis. Used for daily business accounts & inventory.',
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=300',
    created_at: '2026-02-01T10:00:00Z',
  },
  {
    id: 'dev-6',
    user_id: 'user-customer-3',
    device_type: 'Laptop',
    brand: 'Lenovo',
    model: 'ThinkPad P1 Gen 5 Workstation',
    serial_number: 'PF3X892A',
    purchase_date: '2023-05-19',
    warranty_status: 'active',
    notes: 'Intel Core i7-12800H, RTX A2000. Right hinge stress fractured.',
    image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=300',
    created_at: '2026-02-04T11:30:00Z',
  },
  {
    id: 'dev-7',
    user_id: 'user-customer-4',
    device_type: 'Laptop',
    brand: 'Dell',
    model: 'XPS 15 9530 (3.5K OLED Touch)',
    serial_number: 'DL-9530-OLED-42',
    purchase_date: '2023-09-12',
    warranty_status: 'expiring_soon',
    notes: 'Platinum Silver with black carbon fiber palmrest. Display banding on lower third.',
    image_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=300',
    created_at: '2026-02-08T09:15:00Z',
  },
  {
    id: 'dev-8',
    user_id: 'user-customer-5',
    device_type: 'Laptop',
    brand: 'HP',
    model: 'EliteBook 840 G9',
    serial_number: '5CG2490XLL',
    purchase_date: '2022-11-05',
    warranty_status: 'expired',
    notes: 'Enterprise fleet unit with encrypted Kioxia NVMe SSD partition.',
    image_url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=300',
    created_at: '2026-02-11T14:45:00Z',
  },
  {
    id: 'dev-9',
    user_id: 'user-customer-6',
    device_type: 'Laptop',
    brand: 'ASUS',
    model: 'ROG Zephyrus G14 (RTX 4060)',
    serial_number: 'GA402X-2023-08',
    purchase_date: '2023-07-22',
    warranty_status: 'active',
    notes: 'AniMe Matrix White lid. Severe thermal throttling under rendering load.',
    image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=300',
    created_at: '2026-02-14T16:20:00Z',
  },
  {
    id: 'dev-10',
    user_id: 'user-customer-7',
    device_type: 'Desktop',
    brand: 'Apple',
    model: 'iMac 24" M3 (4.5K Retina Display)',
    serial_number: 'C02KP921M308',
    purchase_date: '2024-01-10',
    warranty_status: 'active',
    notes: 'Blue colorway with color-matched Magic Keyboard and Trackpad.',
    image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=300',
    created_at: '2026-02-18T10:30:00Z',
  },
  {
    id: 'dev-11',
    user_id: 'user-customer-8',
    device_type: 'Tablet',
    brand: 'Apple',
    model: 'iPad Pro 12.9" (M2, 256GB Cellular)',
    serial_number: 'DMPX4099M2',
    purchase_date: '2023-03-28',
    warranty_status: 'expired',
    notes: 'Liquid Retina XDR mini-LED panel. USB-C port pin damaged.',
    image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=300',
    created_at: '2026-02-22T08:00:00Z',
  },
  {
    id: 'dev-12',
    user_id: 'user-customer-9',
    device_type: 'Desktop',
    brand: 'Custom Build',
    model: 'Ryzen 7 7800X3D / RTX 4070 Gaming Rig',
    serial_number: 'RIG-7800X-MIDC',
    purchase_date: '2023-12-15',
    warranty_status: 'active',
    notes: 'Lian Li O11 Dynamic EVO case. Surged after MIDC Solapur industrial voltage dip.',
    image_url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=300',
    created_at: '2026-02-25T13:10:00Z',
  },
  {
    id: 'dev-13',
    user_id: 'user-customer-10',
    device_type: 'Laptop',
    brand: 'Microsoft',
    model: 'Surface Pro 9 (Intel Evo i7, 16GB)',
    serial_number: '039842124553',
    purchase_date: '2023-06-30',
    warranty_status: 'expiring_soon',
    notes: 'Forest Green Signature Keyboard with Slim Pen 2. Touch screen digitizer glitch.',
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=300',
    created_at: '2026-03-01T15:00:00Z',
  },
  {
    id: 'dev-14',
    user_id: 'user-customer-11',
    device_type: 'Printer',
    brand: 'Brother',
    model: 'HL-L8360CDW Enterprise Color Laser',
    serial_number: 'U64201F8N998877',
    purchase_date: '2022-04-10',
    warranty_status: 'expired',
    notes: 'Heavy logistics dispatch documentation printer. Fuser unit jammed.',
    image_url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=300',
    created_at: '2026-03-05T11:40:00Z',
  },
  {
    id: 'dev-15',
    user_id: 'user-customer-2',
    device_type: 'Mobile',
    brand: 'Samsung',
    model: 'Galaxy S23 Ultra (256GB Phantom Black)',
    serial_number: 'RF8WA1099JK',
    purchase_date: '2023-04-12',
    warranty_status: 'active',
    notes: 'Primary executive phone with 200MP camera setup. Camera module calibrated.',
    image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=300',
    created_at: '2026-02-05T09:30:00Z',
  },
  {
    id: 'dev-16',
    user_id: 'user-customer-2',
    device_type: 'Tablet',
    brand: 'Apple',
    model: 'iPad Air 10.9" (5th Gen, M1, 64GB Space Grey)',
    serial_number: 'DMPQ9821M1',
    purchase_date: '2023-09-20',
    warranty_status: 'active',
    notes: 'Used for inventory checks and digital invoice sign-offs.',
    image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=300',
    created_at: '2026-01-10T14:00:00Z',
  },
];

export const INITIAL_TECHNICIANS: Technician[] = [
  {
    id: 'tech-1',
    profile_id: 'user-tech-1',
    full_name: 'Rohan Deshmukh',
    email: 'rohan.deshmukh@techcare.in',
    phone: '+91 98220 14592',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    specialties: ['Logic Board Repair', 'Micro-soldering', 'MacBook Architecture', 'Data Recovery'],
    experience_years: 9,
    rating: 4.96,
    completed_jobs_count: 342,
    active_status: true,
    current_workload: 3,
    certifications: ['Apple Certified Mac Technician (ACMT)', 'CompTIA A+', 'IPC-A-610 Soldering Specialist']
  },
  {
    id: 'tech-2',
    profile_id: 'user-tech-2',
    full_name: 'Priya Patil',
    email: 'priya.patil@techcare.in',
    phone: '+91 97630 44812',
    avatar_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200',
    specialties: ['Enterprise Networking', 'Wi-Fi 7 Optimization', 'Firewall Deployment', 'Windows Server'],
    experience_years: 7,
    rating: 4.92,
    completed_jobs_count: 288,
    active_status: true,
    current_workload: 2,
    certifications: ['Cisco CCNA', 'Ubiquiti Enterprise Wireless (UEWA)', 'CompTIA Network+']
  },
  {
    id: 'tech-3',
    profile_id: 'user-tech-3',
    full_name: 'Vikram Shinde',
    email: 'vikram.shinde@techcare.in',
    phone: '+91 95450 78231',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    specialties: ['Custom PC Builds', 'GPU Diagnostics', 'Laser Printer Servicing', 'Storage Arrays'],
    experience_years: 5,
    rating: 4.88,
    completed_jobs_count: 194,
    active_status: true,
    current_workload: 2,
    certifications: ['CompTIA A+', 'HP Certified Laser Specialist']
  }
];

export const INITIAL_SERVICE_REQUESTS: ServiceRequest[] = [
  {
    id: 'req-1',
    request_number: 'TC-9482',
    user_id: 'user-customer-1',
    customer_name: 'Amit Shinde',
    customer_email: 'amit.shinde@example.com',
    customer_phone: '+91 94220 33819',
    device_id: 'dev-1',
    device: INITIAL_DEVICES[0],
    service_id: 'srv-1',
    service_name: 'Laptop Repair',
    problem_description: 'MacBook screen stays dark with keyboard backlight on. An external monitor over HDMI displays fine, but the built-in display has no image or backlight after a slight drop.',
    urgency: 'High',
    status: 'Repair In Progress',
    preferred_date: '2026-03-12',
    preferred_time_slot: '10:00 AM - 12:00 PM',
    assigned_technician_id: 'tech-1',
    assigned_technician: INITIAL_TECHNICIANS[0],
    estimated_cost: 3850.0,
    final_cost: 3850.0,
    diagnosis: 'Inspected under microscope: eDP display connector latch was unseated and pin 4 (backlight enable) was bent. Motherboard GPU rail is intact.',
    service_notes: 'Pins realigned under trinocular microscope, high-density contact re-soldered, display assembly re-seated and tested for 3 hours continuous loop.',
    attachments: [
      {
        id: 'att-1',
        request_id: 'req-1',
        file_name: 'microscope_edp_pin_damage.jpg',
        file_url: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&q=80&w=400',
        file_size: 2450000,
        file_type: 'image/jpeg',
        uploaded_at: '2026-03-10T14:20:00Z'
      }
    ],
    history: [
      {
        id: 'hist-1',
        request_id: 'req-1',
        status: 'Request Created',
        notes: 'Customer submitted ticket via Web Portal with symptom telemetry.',
        changed_by_name: 'Amit Shinde',
        changed_by_role: 'customer',
        created_at: '2026-03-10T09:15:00Z'
      },
      {
        id: 'hist-2',
        request_id: 'req-1',
        status: 'Technician Assigned',
        notes: 'Automated dispatch assigned senior logic technician Rohan Deshmukh based on Apple ACMT specialty.',
        changed_by_name: 'System Dispatch',
        changed_by_role: 'admin',
        created_at: '2026-03-10T09:30:00Z'
      },
      {
        id: 'hist-3',
        request_id: 'req-1',
        status: 'Technician Accepted',
        notes: 'Technician accepted assignment and queued bench slot.',
        changed_by_name: 'Rohan Deshmukh',
        changed_by_role: 'technician',
        created_at: '2026-03-10T09:35:00Z'
      },
      {
        id: 'hist-4',
        request_id: 'req-1',
        status: 'Technician On The Way',
        notes: 'Technician dispatched for priority on-site pickup.',
        changed_by_name: 'Rohan Deshmukh',
        changed_by_role: 'technician',
        created_at: '2026-03-10T10:15:00Z'
      },
      {
        id: 'hist-5',
        request_id: 'req-1',
        status: 'Device Received',
        notes: 'Device logged into TechCare Maharashtra Central Lab, serial verified.',
        changed_by_name: 'Rohan Deshmukh',
        changed_by_role: 'technician',
        created_at: '2026-03-10T11:00:00Z'
      },
      {
        id: 'hist-6',
        request_id: 'req-1',
        status: 'Diagnosis',
        notes: 'Hardware telemetry completed: eDP pin 4 bent, panel intact.',
        changed_by_name: 'Rohan Deshmukh',
        changed_by_role: 'technician',
        created_at: '2026-03-10T13:45:00Z'
      },
      {
        id: 'hist-7',
        request_id: 'req-1',
        status: 'Repair In Progress',
        notes: 'Micro-soldering pin re-attachment and thermal overhaul underway.',
        changed_by_name: 'Rohan Deshmukh',
        changed_by_role: 'technician',
        created_at: '2026-03-10T15:30:00Z'
      }
    ],
    created_at: '2026-03-10T09:15:00Z',
    updated_at: '2026-03-10T15:30:00Z'
  },
  {
    id: 'req-2',
    request_number: 'TC-9419',
    user_id: 'user-customer-1',
    customer_name: 'Amit Shinde',
    customer_email: 'amit.shinde@example.com',
    customer_phone: '+91 94220 33819',
    device_id: 'dev-3',
    device: INITIAL_DEVICES[2],
    service_id: 'srv-3',
    service_name: 'Mobile Device Repair',
    problem_description: 'Battery health dropped to 74% and phone gets warm during 4K video recording.',
    urgency: 'Medium',
    status: 'Ready',
    preferred_date: '2026-03-08',
    preferred_time_slot: '02:00 PM - 04:00 PM',
    assigned_technician_id: 'tech-3',
    assigned_technician: INITIAL_TECHNICIANS[2],
    estimated_cost: 2499.0,
    final_cost: 2499.0,
    diagnosis: 'Battery reached 820 recharge cycles. Chemical aging confirmed via battery controller cycle logs.',
    service_notes: 'Replaced with genuine OEM Li-Ion pack. IP68 acoustic gasket refreshed, diagnostic diagnostics passed 100%.',
    history: [
      {
        id: 'hist-20',
        request_id: 'req-2',
        status: 'Request Created',
        notes: 'Customer scheduled battery renewal service.',
        changed_by_name: 'Amit Shinde',
        changed_by_role: 'customer',
        created_at: '2026-03-07T11:00:00Z'
      },
      {
        id: 'hist-21',
        request_id: 'req-2',
        status: 'Device Received',
        notes: 'Check-in completed.',
        changed_by_name: 'Vikram Shinde',
        changed_by_role: 'technician',
        created_at: '2026-03-08T14:10:00Z'
      },
      {
        id: 'hist-22',
        request_id: 'req-2',
        status: 'Repair In Progress',
        notes: 'Battery swap and hermetic sealing performed.',
        changed_by_name: 'Vikram Shinde',
        changed_by_role: 'technician',
        created_at: '2026-03-08T15:00:00Z'
      },
      {
        id: 'hist-23',
        request_id: 'req-2',
        status: 'Ready',
        notes: 'Device calibrated and sanitized. Ready for pickup.',
        changed_by_name: 'Vikram Shinde',
        changed_by_role: 'technician',
        created_at: '2026-03-08T16:30:00Z'
      }
    ],
    created_at: '2026-03-07T11:00:00Z',
    updated_at: '2026-03-08T16:30:00Z'
  },
  {
    id: 'req-3',
    request_number: 'TC-9104',
    user_id: 'user-customer-1',
    customer_name: 'Amit Shinde',
    customer_email: 'amit.shinde@example.com',
    customer_phone: '+91 94220 33819',
    device_id: 'dev-2',
    device: INITIAL_DEVICES[1],
    service_id: 'srv-8',
    service_name: 'Device Maintenance',
    problem_description: 'Annual deep clean and liquid cooling loop check for Ryzen workstation.',
    urgency: 'Low',
    status: 'Completed',
    preferred_date: '2026-02-15',
    preferred_time_slot: '09:00 AM - 11:00 AM',
    assigned_technician_id: 'tech-1',
    assigned_technician: INITIAL_TECHNICIANS[0],
    estimated_cost: 1499.0,
    final_cost: 1499.0,
    diagnosis: 'Radiator dust accumulation reduced airflow by ~35%. Thermal paste on AM5 IHS was mildly baked.',
    service_notes: 'Ultrasonic fan blade clean, Arctic MX-6 repasting, stress test passed at 71°C max peak load.',
    history: [
      {
        id: 'hist-30',
        request_id: 'req-3',
        status: 'Request Created',
        notes: 'Maintenance service booked.',
        changed_by_name: 'Amit Shinde',
        changed_by_role: 'customer',
        created_at: '2026-02-14T09:00:00Z'
      },
      {
        id: 'hist-31',
        request_id: 'req-3',
        status: 'Completed',
        notes: 'Job completed successfully and signed off.',
        changed_by_name: 'Rohan Deshmukh',
        changed_by_role: 'technician',
        created_at: '2026-02-15T12:00:00Z'
      }
    ],
    created_at: '2026-02-14T09:00:00Z',
    updated_at: '2026-02-15T12:00:00Z'
  },
  {
    id: 'req-4',
    request_number: 'TC-8102',
    user_id: 'user-customer-2',
    customer_name: 'Amruta Sartape',
    customer_email: 'amruta.sartape@techclient.in',
    customer_phone: '+91 98223 45120',
    device_id: 'dev-5',
    device: INITIAL_DEVICES[4],
    service_id: 'srv-1',
    service_name: 'Laptop Repair',
    problem_description: 'Chai spill over upper left keyboard area. Device powered off abruptly. Requires ultrasonic PCB de-oxidation and component repair.',
    urgency: 'High',
    status: 'Repair In Progress',
    preferred_date: '2026-03-11',
    preferred_time_slot: '11:00 AM - 01:00 PM',
    assigned_technician_id: 'tech-1',
    assigned_technician: INITIAL_TECHNICIANS[0],
    estimated_cost: 3200.0,
    final_cost: 3200.0,
    diagnosis: 'Liquid ingress detected on 3V3_G3H power rail capacitors near audio daughterboard connector. Ultrasonic bath completed.',
    service_notes: 'Ultrasonic cleaning in Branson EC-960 bath with pure DI water. Replacing 2 dried decoupling capacitors.',
    history: [
      {
        id: 'hist-40',
        request_id: 'req-4',
        status: 'Request Created',
        notes: 'Customer submitted emergency liquid damage report.',
        changed_by_name: 'Amruta Sartape',
        changed_by_role: 'customer',
        created_at: '2026-03-10T11:00:00Z'
      },
      {
        id: 'hist-41',
        request_id: 'req-4',
        status: 'Technician Assigned',
        notes: 'Assigned to logic specialist Rohan Deshmukh.',
        changed_by_name: 'System Dispatch',
        changed_by_role: 'admin',
        created_at: '2026-03-10T11:15:00Z'
      },
      {
        id: 'hist-42',
        request_id: 'req-4',
        status: 'Device Received',
        notes: 'Device checked in at Pandharpur cleanroom bench.',
        changed_by_name: 'Rohan Deshmukh',
        changed_by_role: 'technician',
        created_at: '2026-03-10T13:00:00Z'
      },
      {
        id: 'hist-43',
        request_id: 'req-4',
        status: 'Repair In Progress',
        notes: 'Micro-soldering replacement capacitors on 3V3 rail.',
        changed_by_name: 'Rohan Deshmukh',
        changed_by_role: 'technician',
        created_at: '2026-03-11T10:00:00Z'
      }
    ],
    created_at: '2026-03-10T11:00:00Z',
    updated_at: '2026-03-11T10:00:00Z'
  },
  {
    id: 'req-5',
    request_number: 'TC-7940',
    user_id: 'user-customer-3',
    customer_name: 'Rohit Deshmukh',
    customer_email: 'rohit.deshmukh@solapurtech.com',
    customer_phone: '+91 97645 88219',
    device_id: 'dev-6',
    device: INITIAL_DEVICES[5],
    service_id: 'srv-1',
    service_name: 'Laptop Repair',
    problem_description: 'Right display hinge cracked loose from carbon magnesium top chassis. Keys W, E, R intermittently failing.',
    urgency: 'Medium',
    status: 'Repair In Progress',
    preferred_date: '2026-03-09',
    preferred_time_slot: '02:00 PM - 04:00 PM',
    assigned_technician_id: 'tech-1',
    assigned_technician: INITIAL_TECHNICIANS[0],
    estimated_cost: 4600.0,
    final_cost: 4600.0,
    diagnosis: 'Brass hinge anchor screw posts sheared from magnesium top cover. Membrane track on keyboard damaged.',
    service_notes: 'OEM Lenovo FRU 5M11D31994 chassis sub-assembly and backlit keyboard dispatched from Mumbai warehouse.',
    history: [
      {
        id: 'hist-50',
        request_id: 'req-5',
        status: 'Request Created',
        notes: 'Hardware hinge failure reported by Solapur corporate user.',
        changed_by_name: 'Rohit Deshmukh',
        changed_by_role: 'customer',
        created_at: '2026-03-08T10:30:00Z'
      },
      {
        id: 'hist-51',
        request_id: 'req-5',
        status: 'Device Received',
        notes: 'Courier delivery verified from Solapur.',
        changed_by_name: 'Rohan Deshmukh',
        changed_by_role: 'technician',
        created_at: '2026-03-09T14:00:00Z'
      },
      {
        id: 'hist-52',
        request_id: 'req-5',
        status: 'Repair In Progress',
        notes: 'Structural hinge reconstruction and replacement underway.',
        changed_by_name: 'Rohan Deshmukh',
        changed_by_role: 'technician',
        created_at: '2026-03-10T12:00:00Z'
      }
    ],
    created_at: '2026-03-08T10:30:00Z',
    updated_at: '2026-03-10T12:00:00Z'
  },
  {
    id: 'req-6',
    request_number: 'TC-8215',
    user_id: 'user-customer-4',
    customer_name: 'Priya Patil',
    customer_email: 'priya.patil@puneventures.in',
    customer_phone: '+91 94231 10984',
    device_id: 'dev-7',
    device: INITIAL_DEVICES[6],
    service_id: 'srv-1',
    service_name: 'Laptop Repair',
    problem_description: 'Horizontal flickering banding on 3.5K OLED touchscreen after bag dropped during Pune-Pandharpur commute.',
    urgency: 'High',
    status: 'Diagnosis',
    preferred_date: '2026-03-12',
    preferred_time_slot: '10:00 AM - 12:00 PM',
    assigned_technician_id: 'tech-1',
    assigned_technician: INITIAL_TECHNICIANS[0],
    estimated_cost: 6500.0,
    final_cost: 6500.0,
    diagnosis: 'Testing eDP 40-pin ribbon harness and panel T-con board. Panel glass itself is uncracked.',
    service_notes: 'Bench testing on Rigol oscilloscope for signal voltage drop on differential pair 2.',
    history: [
      {
        id: 'hist-60',
        request_id: 'req-6',
        status: 'Request Created',
        notes: 'Client registered display distortion ticket from Baner, Pune.',
        changed_by_name: 'Priya Patil',
        changed_by_role: 'customer',
        created_at: '2026-03-11T08:00:00Z'
      },
      {
        id: 'hist-61',
        request_id: 'req-6',
        status: 'Diagnosis',
        notes: 'Multi-meter probe checks on eDP display rail underway.',
        changed_by_name: 'Rohan Deshmukh',
        changed_by_role: 'technician',
        created_at: '2026-03-12T09:30:00Z'
      }
    ],
    created_at: '2026-03-11T08:00:00Z',
    updated_at: '2026-03-12T09:30:00Z'
  },
  {
    id: 'req-7',
    request_number: 'TC-7431',
    user_id: 'user-customer-5',
    customer_name: 'Vikram Kadam',
    customer_email: 'vikram.kadam@kolhapuragro.in',
    customer_phone: '+91 98500 76231',
    device_id: 'dev-8',
    device: INITIAL_DEVICES[7],
    service_id: 'srv-7',
    service_name: 'Data Recovery',
    problem_description: 'Laptop stopped booting, showing "3F0 BootDevice Not Found". Contains critical agricultural co-operative accounts database.',
    urgency: 'Critical',
    status: 'Completed',
    preferred_date: '2026-02-28',
    preferred_time_slot: '09:00 AM - 11:00 AM',
    assigned_technician_id: 'tech-1',
    assigned_technician: INITIAL_TECHNICIANS[0],
    estimated_cost: 5500.0,
    final_cost: 5500.0,
    diagnosis: 'Kioxia NVMe SSD experienced controller firmware corruption. NAND chips desoldered and read via specialized PC-3000 Flash station.',
    service_notes: '100% of accounting databases and certificates successfully recovered. Cloned onto new Samsung 980 Pro SSD and verified.',
    history: [
      {
        id: 'hist-70',
        request_id: 'req-7',
        status: 'Request Created',
        notes: 'Critical recovery request logged by Kolhapur Agro.',
        changed_by_name: 'Vikram Kadam',
        changed_by_role: 'customer',
        created_at: '2026-02-27T16:00:00Z'
      },
      {
        id: 'hist-71',
        request_id: 'req-7',
        status: 'Completed',
        notes: 'Full database recovery successful, data handed over on secure encrypted media.',
        changed_by_name: 'Rohan Deshmukh',
        changed_by_role: 'technician',
        created_at: '2026-03-01T17:00:00Z'
      }
    ],
    created_at: '2026-02-27T16:00:00Z',
    updated_at: '2026-03-01T17:00:00Z'
  },
  {
    id: 'req-8',
    request_number: 'TC-8349',
    user_id: 'user-customer-6',
    customer_name: 'Sneha Jadhav',
    customer_email: 'sneha.jadhav@sanglidesign.co',
    customer_phone: '+91 99752 44309',
    device_id: 'dev-9',
    device: INITIAL_DEVICES[8],
    service_id: 'srv-8',
    service_name: 'Device Maintenance',
    problem_description: 'GPU throttles heavily down to 300MHz during architectural AutoCAD 3D rendering. Fans sound like an airplane with high-pitched whine.',
    urgency: 'Medium',
    status: 'Technician Assigned',
    preferred_date: '2026-03-13',
    preferred_time_slot: '03:00 PM - 05:00 PM',
    assigned_technician_id: 'tech-1',
    assigned_technician: INITIAL_TECHNICIANS[0],
    estimated_cost: 1850.0,
    final_cost: 1850.0,
    diagnosis: 'Liquid metal TIM migrated away from center die; right radial exhaust fan bearing wobbles.',
    service_notes: 'Queued for liquid metal thermal repasting barrier insulation and dual high-speed fan replacement.',
    history: [
      {
        id: 'hist-80',
        request_id: 'req-8',
        status: 'Request Created',
        notes: 'Thermal maintenance booked from Vishrambag, Sangli.',
        changed_by_name: 'Sneha Jadhav',
        changed_by_role: 'customer',
        created_at: '2026-03-11T14:20:00Z'
      },
      {
        id: 'hist-81',
        request_id: 'req-8',
        status: 'Technician Assigned',
        notes: 'Assigned to Rohan Deshmukh for bench intake.',
        changed_by_name: 'System Dispatch',
        changed_by_role: 'admin',
        created_at: '2026-03-11T14:40:00Z'
      }
    ],
    created_at: '2026-03-11T14:20:00Z',
    updated_at: '2026-03-11T14:40:00Z'
  },
  {
    id: 'req-9',
    request_number: 'TC-7612',
    user_id: 'user-customer-7',
    customer_name: 'Aditya Kulkarni',
    customer_email: 'aditya.kulkarni@mumbaisys.io',
    customer_phone: '+91 98201 65432',
    device_id: 'dev-10',
    device: INITIAL_DEVICES[9],
    service_id: 'srv-6',
    service_name: 'Software & OS Support',
    problem_description: 'Stuck on Apple logo progress bar at 100% after power outage. Recovery partition error -1008F.',
    urgency: 'Medium',
    status: 'Completed',
    preferred_date: '2026-02-20',
    preferred_time_slot: '01:00 PM - 03:00 PM',
    assigned_technician_id: 'tech-1',
    assigned_technician: INITIAL_TECHNICIANS[0],
    estimated_cost: 1200.0,
    final_cost: 1200.0,
    diagnosis: 'Corrupted APFS container header and broken T2/Secure Enclave authorization token.',
    service_notes: 'DFU mode firmware revive performed using Apple Configurator 2. macOS Sonoma reinstalled preserving all customer user files.',
    history: [
      {
        id: 'hist-90',
        request_id: 'req-9',
        status: 'Request Created',
        notes: 'Remote ticket created from BKC, Mumbai.',
        changed_by_name: 'Aditya Kulkarni',
        changed_by_role: 'customer',
        created_at: '2026-02-19T10:00:00Z'
      },
      {
        id: 'hist-91',
        request_id: 'req-9',
        status: 'Completed',
        notes: 'APFS restore verified and Apple silicon boot token renewed.',
        changed_by_name: 'Rohan Deshmukh',
        changed_by_role: 'technician',
        created_at: '2026-02-20T16:30:00Z'
      }
    ],
    created_at: '2026-02-19T10:00:00Z',
    updated_at: '2026-02-20T16:30:00Z'
  },
  {
    id: 'req-10',
    request_number: 'TC-8501',
    user_id: 'user-customer-8',
    customer_name: 'Neha Shinde',
    customer_email: 'neha.shinde@pandharpurmed.org',
    customer_phone: '+91 91580 39811',
    device_id: 'dev-11',
    device: INITIAL_DEVICES[10],
    service_id: 'srv-3',
    service_name: 'Mobile Device Repair',
    problem_description: 'USB-C charging port loose and Apple Pencil magnetic wireless charging coil stopped syncing.',
    urgency: 'High',
    status: 'Repair In Progress',
    preferred_date: '2026-03-12',
    preferred_time_slot: '11:30 AM - 01:30 PM',
    assigned_technician_id: 'tech-1',
    assigned_technician: INITIAL_TECHNICIANS[0],
    estimated_cost: 3400.0,
    final_cost: 3400.0,
    diagnosis: 'Physical wear on USB-C receptacle center tongue; Apple Pencil side inductive coil ribbon torn.',
    service_notes: 'Micro-soldered replacement 24-pin USB-C connector. Wireless charging module installed and tested with 2nd gen Apple Pencil.',
    history: [
      {
        id: 'hist-100',
        request_id: 'req-10',
        status: 'Request Created',
        notes: 'Medical tablet intake from Shivaji Chowk clinic, Pandharpur.',
        changed_by_name: 'Neha Shinde',
        changed_by_role: 'customer',
        created_at: '2026-03-11T12:00:00Z'
      },
      {
        id: 'hist-101',
        request_id: 'req-10',
        status: 'Repair In Progress',
        notes: 'Micro-soldering USB-C port harness on bench.',
        changed_by_name: 'Rohan Deshmukh',
        changed_by_role: 'technician',
        created_at: '2026-03-12T11:00:00Z'
      }
    ],
    created_at: '2026-03-11T12:00:00Z',
    updated_at: '2026-03-12T11:00:00Z'
  },
  {
    id: 'req-11',
    request_number: 'TC-7780',
    user_id: 'user-customer-9',
    customer_name: 'Akash Pawar',
    customer_email: 'akash.pawar@solapurfab.in',
    customer_phone: '+91 96041 87290',
    device_id: 'dev-12',
    device: INITIAL_DEVICES[11],
    service_id: 'srv-2',
    service_name: 'Desktop Repair',
    problem_description: 'PC completely dead after sudden power surge in MIDC Solapur industrial feeder line. No LEDs on motherboard.',
    urgency: 'Critical',
    status: 'Completed',
    preferred_date: '2026-03-02',
    preferred_time_slot: '10:00 AM - 12:00 PM',
    assigned_technician_id: 'tech-1',
    assigned_technician: INITIAL_TECHNICIANS[0],
    estimated_cost: 4200.0,
    final_cost: 4200.0,
    diagnosis: 'PSU MOV varistor clamped and blew the primary fuse; 12V EPS rail surge arrested by motherboard TVS protection diode.',
    service_notes: 'Replaced TVS surge diode on ASUS B650 motherboard. Swapped power supply for Corsair RM850e 80+ Gold. All SSDs and RTX 4070 intact.',
    history: [
      {
        id: 'hist-110',
        request_id: 'req-11',
        status: 'Request Created',
        notes: 'Industrial workstation surge failure logged.',
        changed_by_name: 'Akash Pawar',
        changed_by_role: 'customer',
        created_at: '2026-03-01T09:00:00Z'
      },
      {
        id: 'hist-111',
        request_id: 'req-11',
        status: 'Completed',
        notes: 'Burn-in stability test passed: 4 hours Prime95 and FurMark.',
        changed_by_name: 'Rohan Deshmukh',
        changed_by_role: 'technician',
        created_at: '2026-03-03T18:00:00Z'
      }
    ],
    created_at: '2026-03-01T09:00:00Z',
    updated_at: '2026-03-03T18:00:00Z'
  },
  {
    id: 'req-12',
    request_number: 'TC-8610',
    user_id: 'user-customer-10',
    customer_name: 'Pooja More',
    customer_email: 'pooja.more@punetechlabs.com',
    customer_phone: '+91 98902 44781',
    device_id: 'dev-13',
    device: INITIAL_DEVICES[12],
    service_id: 'srv-1',
    service_name: 'Laptop Repair',
    problem_description: 'Touch digitizer has ghost touches along the bottom edge; kickstand friction hinges are loose.',
    urgency: 'Medium',
    status: 'Technician Accepted',
    preferred_date: '2026-03-14',
    preferred_time_slot: '02:00 PM - 04:00 PM',
    assigned_technician_id: 'tech-1',
    assigned_technician: INITIAL_TECHNICIANS[0],
    estimated_cost: 5200.0,
    final_cost: 5200.0,
    diagnosis: 'Digitizer controller IC N-Trig flex has microscopic crack near display connector.',
    service_notes: 'Surface Pro 9 PixelSense display assembly prepared for precision thermal vacuum separation.',
    history: [
      {
        id: 'hist-120',
        request_id: 'req-12',
        status: 'Request Created',
        notes: 'Ticket registered from Hinjewadi Tech Park, Pune.',
        changed_by_name: 'Pooja More',
        changed_by_role: 'customer',
        created_at: '2026-03-12T15:00:00Z'
      },
      {
        id: 'hist-121',
        request_id: 'req-12',
        status: 'Technician Accepted',
        notes: 'Accepted by Rohan Deshmukh for bench intake.',
        changed_by_name: 'Rohan Deshmukh',
        changed_by_role: 'technician',
        created_at: '2026-03-12T15:30:00Z'
      }
    ],
    created_at: '2026-03-12T15:00:00Z',
    updated_at: '2026-03-12T15:30:00Z'
  },
  {
    id: 'req-13',
    request_number: 'TC-8422',
    user_id: 'user-customer-11',
    customer_name: 'Rahul Chavan',
    customer_email: 'rahul.chavan@kolhapurlogistics.com',
    customer_phone: '+91 97654 32109',
    device_id: 'dev-14',
    device: INITIAL_DEVICES[13],
    service_id: 'srv-4',
    service_name: 'Printer Repair & Servicing',
    problem_description: 'Repeated paper jam 0x82 inside fuser unit and vertical black toner streaks on shipping dispatch waybills.',
    urgency: 'High',
    status: 'Device Received',
    preferred_date: '2026-03-11',
    preferred_time_slot: '09:30 AM - 11:30 AM',
    assigned_technician_id: 'tech-1',
    assigned_technician: INITIAL_TECHNICIANS[0],
    estimated_cost: 2900.0,
    final_cost: 2900.0,
    diagnosis: 'Fuser heat pressure sleeve delaminated; waste toner box overflowed into laser mirror assembly.',
    service_notes: 'Replaced Brother OEM fuser unit LU9215001 and pickup feed roller kit. Cleaned optical polygon mirror.',
    history: [
      {
        id: 'hist-130',
        request_id: 'req-13',
        status: 'Request Created',
        notes: 'Urgent logistics printer breakdown reported from Kolhapur.',
        changed_by_name: 'Rahul Chavan',
        changed_by_role: 'customer',
        created_at: '2026-03-11T09:00:00Z'
      },
      {
        id: 'hist-131',
        request_id: 'req-13',
        status: 'Device Received',
        notes: 'Heavy logistics printer received at diagnostic bay.',
        changed_by_name: 'Rohan Deshmukh',
        changed_by_role: 'technician',
        created_at: '2026-03-11T14:00:00Z'
      }
    ],
    created_at: '2026-03-11T09:00:00Z',
    updated_at: '2026-03-11T14:00:00Z'
  },
  {
    id: 'req-14',
    request_number: 'TC-8720',
    user_id: 'user-customer-3',
    customer_name: 'Rohit Deshmukh',
    customer_email: 'rohit.deshmukh@solapurtech.com',
    customer_phone: '+91 97645 88219',
    device_id: 'dev-6',
    device: INITIAL_DEVICES[5],
    service_id: 'srv-5',
    service_name: 'Network & Wi-Fi Setup',
    problem_description: 'Solapur tech hub core VLAN gateway dropping packets during peak shifts. On-site network diagnostic and telemetry profiling requested.',
    urgency: 'High',
    status: 'Technician On The Way',
    preferred_date: '2026-03-14',
    preferred_time_slot: '10:00 AM - 12:00 PM',
    assigned_technician_id: 'tech-1',
    assigned_technician: INITIAL_TECHNICIANS[0],
    estimated_cost: 2400.0,
    final_cost: 2400.0,
    diagnosis: 'Technician in transit via Solapur Highway. Fluke LinkRunner AT 2000 and optical SFP+ tester on board.',
    service_notes: 'En route in service van. Live telematics dispatch active. ETA 25 minutes.',
    history: [
      {
        id: 'hist-140',
        request_id: 'req-14',
        status: 'Request Created',
        notes: 'Network gateway packet loss ticket logged from Solapur.',
        changed_by_name: 'Rohit Deshmukh',
        changed_by_role: 'customer',
        created_at: '2026-03-14T08:00:00Z'
      },
      {
        id: 'hist-141',
        request_id: 'req-14',
        status: 'Technician Assigned',
        notes: 'Assigned to field network certified tech Rohan Deshmukh.',
        changed_by_name: 'System Dispatch',
        changed_by_role: 'admin',
        created_at: '2026-03-14T08:30:00Z'
      },
      {
        id: 'hist-142',
        request_id: 'req-14',
        status: 'Technician Accepted',
        notes: 'Job accepted. Equipment packed in vehicle.',
        changed_by_name: 'Rohan Deshmukh',
        changed_by_role: 'technician',
        created_at: '2026-03-14T08:45:00Z'
      },
      {
        id: 'hist-143',
        request_id: 'req-14',
        status: 'Technician On The Way',
        notes: 'Technician departed Pandharpur center en route to Solapur facility.',
        changed_by_name: 'Rohan Deshmukh',
        changed_by_role: 'technician',
        created_at: '2026-03-14T09:15:00Z'
      }
    ],
    created_at: '2026-03-14T08:00:00Z',
    updated_at: '2026-03-14T09:15:00Z'
  },
  {
    id: 'req-15',
    request_number: 'TC-8890',
    user_id: 'user-customer-6',
    customer_name: 'Sneha Jadhav',
    customer_email: 'sneha.jadhav@sanglidesign.co',
    customer_phone: '+91 99752 44309',
    device_id: 'dev-9',
    device: INITIAL_DEVICES[8],
    service_id: 'srv-8',
    service_name: 'Device Maintenance',
    problem_description: 'Thermal overhaul completed. Liquid metal reapplied with barrier insulation; dual high-speed fans calibrated.',
    urgency: 'Medium',
    status: 'Ready',
    preferred_date: '2026-03-13',
    preferred_time_slot: '03:00 PM - 05:00 PM',
    assigned_technician_id: 'tech-1',
    assigned_technician: INITIAL_TECHNICIANS[0],
    estimated_cost: 1850.0,
    final_cost: 1850.0,
    diagnosis: 'Thermal stress test passed: GPU core sits at 68°C under continuous 3D rendering load. Fan acoustic profile normalized.',
    service_notes: 'QA burn-in completed. Device wiped, sanitized, and stored in ESD antistatic pouch at reception desk.',
    history: [
      {
        id: 'hist-150',
        request_id: 'req-15',
        status: 'Request Created',
        notes: 'Thermal maintenance booked from Vishrambag, Sangli.',
        changed_by_name: 'Sneha Jadhav',
        changed_by_role: 'customer',
        created_at: '2026-03-11T14:20:00Z'
      },
      {
        id: 'hist-151',
        request_id: 'req-15',
        status: 'Technician Assigned',
        notes: 'Assigned to Rohan Deshmukh for bench intake.',
        changed_by_name: 'System Dispatch',
        changed_by_role: 'admin',
        created_at: '2026-03-11T14:40:00Z'
      },
      {
        id: 'hist-152',
        request_id: 'req-15',
        status: 'Technician Accepted',
        notes: 'Accepted for bench intake.',
        changed_by_name: 'Rohan Deshmukh',
        changed_by_role: 'technician',
        created_at: '2026-03-11T15:00:00Z'
      },
      {
        id: 'hist-153',
        request_id: 'req-15',
        status: 'Device Received',
        notes: 'Device checked in at Pandharpur cleanroom bench.',
        changed_by_name: 'Rohan Deshmukh',
        changed_by_role: 'technician',
        created_at: '2026-03-12T10:00:00Z'
      },
      {
        id: 'hist-154',
        request_id: 'req-15',
        status: 'Diagnosis',
        notes: 'Thermal imaging confirmed localized hotspot on GPU VRM.',
        changed_by_name: 'Rohan Deshmukh',
        changed_by_role: 'technician',
        created_at: '2026-03-12T11:30:00Z'
      },
      {
        id: 'hist-155',
        request_id: 'req-15',
        status: 'Repair In Progress',
        notes: 'Applying conformal silicone barrier and Thermal Grizzly Conductonaut liquid metal.',
        changed_by_name: 'Rohan Deshmukh',
        changed_by_role: 'technician',
        created_at: '2026-03-12T14:00:00Z'
      },
      {
        id: 'hist-156',
        request_id: 'req-15',
        status: 'Ready',
        notes: 'Quality control verified. Device staged for customer handover.',
        changed_by_name: 'Rohan Deshmukh',
        changed_by_role: 'technician',
        created_at: '2026-03-13T16:00:00Z'
      }
    ],
    created_at: '2026-03-11T14:20:00Z',
    updated_at: '2026-03-13T16:00:00Z'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    request_id: 'req-1',
    request_number: 'TC-9482',
    user_id: 'user-customer-1',
    customer_name: 'Amit Shinde',
    technician_id: 'tech-1',
    technician_name: 'Rohan Deshmukh',
    scheduled_at: '2026-03-12T10:00:00Z',
    time_slot: '10:00 AM - 12:00 PM',
    status: 'scheduled',
    location: 'TechCare Maharashtra Diagnostic Hub (Station Road, Pandharpur)',
    notes: 'In-person bench check and QA handover with technician Rohan Deshmukh.',
    service_name: 'Laptop Repair',
    device_info: 'MacBook Pro 16" (M2 Pro)'
  },
  {
    id: 'apt-2',
    request_id: 'req-2',
    request_number: 'TC-9419',
    user_id: 'user-customer-1',
    customer_name: 'Amit Shinde',
    technician_id: 'tech-3',
    technician_name: 'Vikram Shinde',
    scheduled_at: '2026-03-08T14:00:00Z',
    time_slot: '02:00 PM - 04:00 PM',
    status: 'completed',
    location: 'Client Office (Prabhat Nagar, Pandharpur)',
    notes: 'Mobile tech courier battery renewal service.',
    service_name: 'Mobile Device Repair',
    device_info: 'iPhone 15 Pro Max'
  },
  {
    id: 'apt-3',
    request_id: 'req-4',
    request_number: 'TC-8102',
    user_id: 'user-customer-2',
    customer_name: 'Amruta Sartape',
    technician_id: 'tech-1',
    technician_name: 'Rohan Deshmukh',
    scheduled_at: '2026-03-14T11:00:00Z',
    time_slot: '11:00 AM - 01:00 PM',
    status: 'scheduled',
    location: 'TechCare Pandharpur Lab Bench (Station Road)',
    notes: 'Ultrasonic board verification and post-repair quality assurance handover.',
    service_name: 'Laptop Repair',
    device_info: 'MacBook Air 13" (M2, 16GB)'
  },
  {
    id: 'apt-4',
    request_id: 'req-4',
    request_number: 'TC-8102',
    user_id: 'user-customer-2',
    customer_name: 'Amruta Sartape',
    technician_id: 'tech-1',
    technician_name: 'Rohan Deshmukh',
    scheduled_at: '2026-03-10T13:00:00Z',
    time_slot: '01:00 PM - 03:00 PM',
    status: 'completed',
    location: 'Pandharpur Cleanroom Bench Intake',
    notes: 'Initial emergency liquid damage intake and moisture isolation.',
    service_name: 'Laptop Repair',
    device_info: 'MacBook Air 13" (M2, 16GB)'
  },
  {
    id: 'apt-5',
    request_id: 'req-14',
    request_number: 'TC-8720',
    user_id: 'user-customer-3',
    customer_name: 'Rohit Deshmukh',
    technician_id: 'tech-1',
    technician_name: 'Rohan Deshmukh',
    scheduled_at: '2026-03-14T10:00:00Z',
    time_slot: '10:00 AM - 12:00 PM',
    status: 'scheduled',
    location: 'Solapur Technology Park (MIDC Solapur Hub, Server Room 2B)',
    notes: 'On-site fiber network diagnostic and enterprise gateway packet telemetry check.',
    service_name: 'Network & Wi-Fi Setup',
    device_info: 'Lenovo ThinkPad X1 Carbon'
  },
  {
    id: 'apt-6',
    request_id: 'req-15',
    request_number: 'TC-8890',
    user_id: 'user-customer-6',
    customer_name: 'Sneha Jadhav',
    technician_id: 'tech-1',
    technician_name: 'Rohan Deshmukh',
    scheduled_at: '2026-03-13T17:00:00Z',
    time_slot: '05:00 PM - 06:00 PM',
    status: 'scheduled',
    location: 'TechCare Front Reception Counter (Station Road, Pandharpur)',
    notes: 'Device pickup and post-maintenance thermal demo handover with client.',
    service_name: 'Device Maintenance',
    device_info: 'ASUS ROG Zephyrus G14'
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    request_id: 'req-1',
    sender_id: 'user-tech-1',
    sender_name: 'Rohan Deshmukh',
    sender_role: 'technician',
    receiver_id: 'user-customer-1',
    content: 'Hi Amit! I inspected your MacBook under our lab microscope. Good news: the OLED display substrate is completely unhurt. The issue was just a bent pin on the eDP ribbon header. I am realigning it now.',
    read: true,
    created_at: '2026-03-10T13:50:00Z'
  },
  {
    id: 'msg-2',
    request_id: 'req-1',
    sender_id: 'user-customer-1',
    sender_name: 'Amit Shinde',
    sender_role: 'customer',
    receiver_id: 'user-tech-1',
    content: 'That is such a relief to hear, Rohan! I was worried the whole panel needed replacement. Will the True Tone calibration be preserved?',
    read: true,
    created_at: '2026-03-10T14:02:00Z'
  },
  {
    id: 'msg-3',
    request_id: 'req-1',
    sender_id: 'user-tech-1',
    sender_name: 'Rohan Deshmukh',
    sender_role: 'technician',
    receiver_id: 'user-customer-1',
    content: 'Yes, 100%! Since we are keeping your original factory display panel, all color profiles, True Tone, and ambient sensor calibrations stay intact. I will run a 2-hour burn-in test this afternoon.',
    read: false,
    created_at: '2026-03-10T14:15:00Z'
  },
  {
    id: 'msg-4',
    request_id: 'req-2',
    sender_id: 'tech-3',
    sender_name: 'Vikram Shinde',
    sender_role: 'technician',
    receiver_id: 'user-customer-1',
    content: 'Hello Amit, the new OEM battery for your iPhone 15 Pro Max passed our IP68 seal acoustic pressurization check. Peak capacity is 100%.',
    read: true,
    created_at: '2026-03-08T15:30:00Z'
  },
  {
    id: 'msg-301',
    request_id: 'req-3',
    sender_id: 'user-customer-1',
    sender_name: 'Amit Shinde',
    sender_role: 'customer',
    receiver_id: 'user-tech-1',
    content: 'Hi Rohan, following up on the Ryzen 9 workstation liquid cooling loop flush. Are all core temperatures stable?',
    read: true,
    created_at: '2026-03-05T16:00:00Z'
  },
  {
    id: 'msg-302',
    request_id: 'req-3',
    sender_id: 'user-tech-1',
    sender_name: 'Rohan Deshmukh',
    sender_role: 'technician',
    receiver_id: 'user-customer-1',
    content: 'Yes Amit! EKWB biocide coolant flush completed and Arctic MX-6 applied. Running Cinebench at 72°C peak. Workstation is fully delivered and closed.',
    read: true,
    created_at: '2026-03-05T17:00:00Z'
  },
  {
    id: 'msg-5',
    request_id: 'req-4',
    sender_id: 'user-tech-1',
    sender_name: 'Rohan Deshmukh',
    sender_role: 'technician',
    receiver_id: 'user-customer-2',
    content: 'Hello Amruta, the Branson ultrasonic bath cycle for your MacBook Air logic board has completed. The tea residue on the 3V3_G3H rail is completely cleansed.',
    read: true,
    created_at: '2026-03-11T10:30:00Z'
  },
  {
    id: 'msg-6',
    request_id: 'req-4',
    sender_id: 'user-customer-2',
    sender_name: 'Amruta Sartape',
    sender_role: 'customer',
    receiver_id: 'user-tech-1',
    content: 'Thank you so much Rohan! Did the keyboard membrane or the trackpad controller suffer any liquid corrosion?',
    read: true,
    created_at: '2026-03-11T10:45:00Z'
  },
  {
    id: 'msg-7',
    request_id: 'req-4',
    sender_id: 'user-tech-1',
    sender_name: 'Rohan Deshmukh',
    sender_role: 'technician',
    receiver_id: 'user-customer-2',
    content: 'Both trackpad and keyboard membrane were isolated in time. We replaced two MLCC capacitors on the audio daughterboard rail. Running burn-in telemetry now.',
    read: false,
    created_at: '2026-03-11T11:15:00Z'
  },
  {
    id: 'msg-501',
    request_id: 'req-5',
    sender_id: 'user-customer-3',
    sender_name: 'Rohit Deshmukh',
    sender_role: 'customer',
    receiver_id: 'user-tech-1',
    content: 'Hi Rohan, wanted to check if the replacement top cover chassis for my ThinkPad X1 has arrived at the Pandharpur bench?',
    read: true,
    created_at: '2026-03-09T15:30:00Z'
  },
  {
    id: 'msg-502',
    request_id: 'req-5',
    sender_id: 'user-tech-1',
    sender_name: 'Rohan Deshmukh',
    sender_role: 'technician',
    receiver_id: 'user-customer-3',
    content: 'Hello Rohit! Yes, the OEM magnesium chassis sub-assembly arrived via BlueDart this morning. I have dismantled the damaged hinge anchors and am currently transplanting your motherboard and antennas.',
    read: true,
    created_at: '2026-03-09T16:00:00Z'
  },
  {
    id: 'msg-503',
    request_id: 'req-5',
    sender_id: 'user-customer-3',
    sender_name: 'Rohit Deshmukh',
    sender_role: 'customer',
    receiver_id: 'user-tech-1',
    content: 'Excellent, thank you! Could you please also verify if the keyboard backlight ribbon has any pinch marks?',
    read: true,
    created_at: '2026-03-09T16:15:00Z'
  },
  {
    id: 'msg-504',
    request_id: 'req-5',
    sender_id: 'user-tech-1',
    sender_name: 'Rohan Deshmukh',
    sender_role: 'technician',
    receiver_id: 'user-customer-3',
    content: 'Already inspected under microscope — ribbon has no tears. I will run a full key actuation test and finish assembly by 4 PM.',
    read: false,
    created_at: '2026-03-10T12:00:00Z'
  },
  {
    id: 'msg-601',
    request_id: 'req-6',
    sender_id: 'user-customer-4',
    sender_name: 'Priya Patil',
    sender_role: 'customer',
    receiver_id: 'user-tech-1',
    content: 'Good morning Rohan, any diagnosis yet on the flickering lines across the XPS OLED screen?',
    read: true,
    created_at: '2026-03-11T16:00:00Z'
  },
  {
    id: 'msg-602',
    request_id: 'req-6',
    sender_id: 'user-tech-1',
    sender_name: 'Rohan Deshmukh',
    sender_role: 'technician',
    receiver_id: 'user-customer-4',
    content: 'Namaste Priya. I tested the display lines on our Rigol oscilloscope. Good news: the OLED glass itself and touch sensors are intact! The issue is intermittent resistance on the 40-pin eDP coaxial cable at the hinge bend.',
    read: true,
    created_at: '2026-03-12T09:45:00Z'
  },
  {
    id: 'msg-603',
    request_id: 'req-6',
    sender_id: 'user-customer-4',
    sender_name: 'Priya Patil',
    sender_role: 'customer',
    receiver_id: 'user-tech-1',
    content: 'Oh that is wonderful news! Will replacing that cable take care of the entire flickering issue without needing a full panel swap?',
    read: true,
    created_at: '2026-03-12T10:10:00Z'
  },
  {
    id: 'msg-604',
    request_id: 'req-6',
    sender_id: 'user-tech-1',
    sender_name: 'Rohan Deshmukh',
    sender_role: 'technician',
    receiver_id: 'user-customer-4',
    content: 'Yes, exactly. A brand new OEM Dell eDP cable is in our cleanroom inventory. I am fitting it now and will run a 2-hour stress test.',
    read: false,
    created_at: '2026-03-12T10:30:00Z'
  },
  {
    id: 'msg-701',
    request_id: 'req-7',
    sender_id: 'user-customer-5',
    sender_name: 'Vikram Kadam',
    sender_role: 'customer',
    receiver_id: 'user-tech-1',
    content: 'Rohan bhau, were you able to recover our co-operative audit database from the dead SSD?',
    read: true,
    created_at: '2026-02-28T11:00:00Z'
  },
  {
    id: 'msg-702',
    request_id: 'req-7',
    sender_id: 'user-tech-1',
    sender_name: 'Rohan Deshmukh',
    sender_role: 'technician',
    receiver_id: 'user-customer-5',
    content: 'Yes Vikramji! 100% of your SQL database and digital signature tokens were recovered via chip-off read on our PC-3000 Flash station. We cloned everything to a new Samsung 980 Pro SSD.',
    read: true,
    created_at: '2026-03-01T14:30:00Z'
  },
  {
    id: 'msg-703',
    request_id: 'req-7',
    sender_id: 'user-customer-5',
    sender_name: 'Vikram Kadam',
    sender_role: 'customer',
    receiver_id: 'user-tech-1',
    content: 'Thank God! You saved months of agricultural audit records. Picked up the laptop from the front desk, boots up instantly. Much appreciated!',
    read: true,
    created_at: '2026-03-01T17:30:00Z'
  },
  {
    id: 'msg-801',
    request_id: 'req-8',
    sender_id: 'user-customer-6',
    sender_name: 'Sneha Jadhav',
    sender_role: 'customer',
    receiver_id: 'user-tech-1',
    content: 'Hello Rohan, I submitted request TC-8349 for thermal maintenance on my Zephyrus G14. When should I bring it to the bench?',
    read: true,
    created_at: '2026-03-11T14:30:00Z'
  },
  {
    id: 'msg-802',
    request_id: 'req-8',
    sender_id: 'user-tech-1',
    sender_name: 'Rohan Deshmukh',
    sender_role: 'technician',
    receiver_id: 'user-customer-6',
    content: 'Hello Sneha! Your ticket has been assigned to my bench. You can drop it off anytime between 3 PM and 5 PM today. We have the Arctic liquid metal barrier kit and replacement exhaust fan ready.',
    read: true,
    created_at: '2026-03-11T14:50:00Z'
  },
  {
    id: 'msg-803',
    request_id: 'req-8',
    sender_id: 'user-customer-6',
    sender_name: 'Sneha Jadhav',
    sender_role: 'customer',
    receiver_id: 'user-tech-1',
    content: 'Perfect, heading over from Sangli this afternoon. Thank you!',
    read: false,
    created_at: '2026-03-11T15:00:00Z'
  },
  {
    id: 'msg-901',
    request_id: 'req-9',
    sender_id: 'user-customer-7',
    sender_name: 'Aditya Kulkarni',
    sender_role: 'customer',
    receiver_id: 'user-tech-1',
    content: 'Hi Rohan, thanks for resolving the -1008F boot error. Did all my Docker containers and local repositories survive the restore?',
    read: true,
    created_at: '2026-02-20T17:00:00Z'
  },
  {
    id: 'msg-902',
    request_id: 'req-9',
    sender_id: 'user-tech-1',
    sender_name: 'Rohan Deshmukh',
    sender_role: 'technician',
    receiver_id: 'user-customer-7',
    content: 'Yes Aditya, DFU revive successfully revived the T2 bridgeOS without wiping the APFS data container. Everything is exactly where you left it.',
    read: true,
    created_at: '2026-02-20T17:30:00Z'
  },
  {
    id: 'msg-903',
    request_id: 'req-9',
    sender_id: 'user-customer-7',
    sender_name: 'Aditya Kulkarni',
    sender_role: 'customer',
    receiver_id: 'user-tech-1',
    content: 'Confirmed, just logged in remotely. Flawless work, 5-star review incoming.',
    read: true,
    created_at: '2026-02-20T18:00:00Z'
  },
  {
    id: 'msg-1001',
    request_id: 'req-10',
    sender_id: 'user-customer-8',
    sender_name: 'Neha Shinde',
    sender_role: 'customer',
    receiver_id: 'user-tech-1',
    content: 'Hello Rohan, is the clinic iPad USB-C port repaired? We use it for patient digital records in the outpatient department.',
    read: true,
    created_at: '2026-03-11T17:30:00Z'
  },
  {
    id: 'msg-1002',
    request_id: 'req-10',
    sender_id: 'user-tech-1',
    sender_name: 'Rohan Deshmukh',
    sender_role: 'technician',
    receiver_id: 'user-customer-8',
    content: 'Hello Dr. Neha, the replacement 24-pin USB-C receptacle has been micro-soldered under microscope. Power delivery is pulling a steady 30W on Apple fast-charger, and the Apple Pencil wireless charging coil is syncing properly.',
    read: true,
    created_at: '2026-03-12T11:15:00Z'
  },
  {
    id: 'msg-1003',
    request_id: 'req-10',
    sender_id: 'user-customer-8',
    sender_name: 'Neha Shinde',
    sender_role: 'customer',
    receiver_id: 'user-tech-1',
    content: 'That is fantastic news! Can we arrange collection tomorrow morning?',
    read: true,
    created_at: '2026-03-12T11:45:00Z'
  },
  {
    id: 'msg-1004',
    request_id: 'req-10',
    sender_id: 'user-tech-1',
    sender_name: 'Rohan Deshmukh',
    sender_role: 'technician',
    receiver_id: 'user-customer-8',
    content: 'Yes, it will be packaged in sterile antistatic bag at the Pandharpur front desk by 10 AM.',
    read: false,
    created_at: '2026-03-12T12:00:00Z'
  },
  {
    id: 'msg-1101',
    request_id: 'req-11',
    sender_id: 'user-customer-9',
    sender_name: 'Akash Pawar',
    sender_role: 'customer',
    receiver_id: 'user-tech-1',
    content: 'Rohan, is the Solapur industrial workstation stable after replacing the surge-damaged components?',
    read: true,
    created_at: '2026-03-03T16:00:00Z'
  },
  {
    id: 'msg-1102',
    request_id: 'req-11',
    sender_id: 'user-tech-1',
    sender_name: 'Rohan Deshmukh',
    sender_role: 'technician',
    receiver_id: 'user-customer-9',
    content: 'Yes Akash, the ASUS motherboard TVS protection diode sacrifice did its job. We replaced the diode and installed the Corsair RM850e Gold PSU. 4 hours of Prime95 and FurMark passed with zero errors.',
    read: true,
    created_at: '2026-03-03T18:15:00Z'
  },
  {
    id: 'msg-1103',
    request_id: 'req-11',
    sender_id: 'user-customer-9',
    sender_name: 'Akash Pawar',
    sender_role: 'customer',
    receiver_id: 'user-tech-1',
    content: 'Huge relief. We have reinstalled it in the factory control room. Running 24/7 with rock-solid voltages.',
    read: true,
    created_at: '2026-03-03T19:00:00Z'
  },
  {
    id: 'msg-1201',
    request_id: 'req-12',
    sender_id: 'user-customer-10',
    sender_name: 'Pooja More',
    sender_role: 'customer',
    receiver_id: 'user-tech-1',
    content: 'Hi Rohan, saw you accepted the ticket for my Surface Pro 9 touch screen issue. Is screen replacement necessary?',
    read: true,
    created_at: '2026-03-12T16:00:00Z'
  },
  {
    id: 'msg-1202',
    request_id: 'req-12',
    sender_id: 'user-tech-1',
    sender_name: 'Rohan Deshmukh',
    sender_role: 'technician',
    receiver_id: 'user-customer-10',
    content: 'Hello Pooja! I am inspecting the N-Trig digitizer flex under thermal imaging. If only the flex ribbon is fractured, we can re-bond it without changing the whole PixelSense display panel, saving significant cost.',
    read: true,
    created_at: '2026-03-12T16:30:00Z'
  },
  {
    id: 'msg-1203',
    request_id: 'req-12',
    sender_id: 'user-customer-10',
    sender_name: 'Pooja More',
    sender_role: 'customer',
    receiver_id: 'user-tech-1',
    content: 'Sounds great, please keep me updated once you disassemble the bezel.',
    read: false,
    created_at: '2026-03-12T16:45:00Z'
  },
  {
    id: 'msg-1301',
    request_id: 'req-13',
    sender_id: 'user-customer-11',
    sender_name: 'Rahul Chavan',
    sender_role: 'customer',
    receiver_id: 'user-tech-1',
    content: 'Rohan, we couriered the heavy Brother printer from Kolhapur logistics office. Did it arrive safely?',
    read: true,
    created_at: '2026-03-11T13:30:00Z'
  },
  {
    id: 'msg-1302',
    request_id: 'req-13',
    sender_id: 'user-tech-1',
    sender_name: 'Rohan Deshmukh',
    sender_role: 'technician',
    receiver_id: 'user-customer-11',
    content: 'Namaste Rahulji! Yes, courier delivered it 30 minutes ago. No transit damage. I already opened the fuser assembly and found the torn heat sleeve. We have OEM replacement in stock and will complete it today.',
    read: true,
    created_at: '2026-03-11T14:15:00Z'
  },
  {
    id: 'msg-1303',
    request_id: 'req-13',
    sender_id: 'user-customer-11',
    sender_name: 'Rahul Chavan',
    sender_role: 'customer',
    receiver_id: 'user-tech-1',
    content: 'Great! We need it back for printing weekend delivery manifests.',
    read: false,
    created_at: '2026-03-11T14:45:00Z'
  },
  {
    id: 'msg-1401',
    request_id: 'req-14',
    sender_id: 'user-customer-3',
    sender_name: 'Rohit Deshmukh',
    sender_role: 'customer',
    receiver_id: 'user-tech-1',
    content: 'Rohan, our core switch is dropping packets on VLAN 20. Are you on the way to our Solapur facility?',
    read: true,
    created_at: '2026-03-14T09:20:00Z'
  },
  {
    id: 'msg-1402',
    request_id: 'req-14',
    sender_id: 'user-tech-1',
    sender_name: 'Rohan Deshmukh',
    sender_role: 'technician',
    receiver_id: 'user-customer-3',
    content: 'Yes Rohit! I am on the Solapur bypass road right now with the Fluke network analyzer and optical tester kit. ETA is about 20 minutes. Please ensure server room access is cleared with security.',
    read: true,
    created_at: '2026-03-14T09:25:00Z'
  },
  {
    id: 'msg-1403',
    request_id: 'req-14',
    sender_id: 'user-customer-3',
    sender_name: 'Rohit Deshmukh',
    sender_role: 'customer',
    receiver_id: 'user-tech-1',
    content: 'Security gate pass is ready at reception. See you shortly!',
    read: false,
    created_at: '2026-03-14T09:28:00Z'
  },
  {
    id: 'msg-1501',
    request_id: 'req-15',
    sender_id: 'user-tech-1',
    sender_name: 'Rohan Deshmukh',
    sender_role: 'technician',
    receiver_id: 'user-customer-6',
    content: 'Sneha, the liquid metal repasting and dual fan overhaul on your Zephyrus G14 is finished! 3D render test ran at 68°C whisper-quiet. Your laptop is ready for pickup at our Pandharpur center.',
    read: true,
    created_at: '2026-03-13T16:15:00Z'
  },
  {
    id: 'msg-1502',
    request_id: 'req-15',
    sender_id: 'user-customer-6',
    sender_name: 'Sneha Jadhav',
    sender_role: 'customer',
    receiver_id: 'user-tech-1',
    content: 'Amazing speed! I will come by the center at 5 PM with the claim receipt to collect it.',
    read: false,
    created_at: '2026-03-13T16:30:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    user_id: 'user-customer-1',
    title: 'Status Update: TC-9482',
    message: 'Your MacBook Pro 16" has moved to "Repair In Progress". Pin realignment is currently underway.',
    type: 'status_update',
    read: false,
    link: '/requests/req-1',
    created_at: '2026-03-10T15:30:00Z'
  },
  {
    id: 'notif-2',
    user_id: 'user-customer-1',
    title: 'New Message from Rohan Deshmukh',
    message: 'Technician Rohan responded to your inquiry regarding True Tone calibration.',
    type: 'message',
    read: false,
    link: '/messages',
    created_at: '2026-03-10T14:15:00Z'
  },
  {
    id: 'notif-3',
    user_id: 'user-customer-1',
    title: 'Upcoming Appointment Reminder',
    message: 'You have a scheduled bench QA session tomorrow at 10:00 AM at the Maharashtra Lab.',
    type: 'appointment',
    read: true,
    link: '/appointments',
    created_at: '2026-03-10T09:00:00Z'
  },
  {
    id: 'notif-4',
    user_id: 'user-customer-1',
    title: 'Invoice Issued: INV-2026-0042',
    message: 'Invoice for completed iPhone battery renewal (₹2,499.00) is ready for your records.',
    type: 'invoice',
    read: true,
    link: '/invoices',
    created_at: '2026-03-08T17:00:00Z'
  },
  {
    id: 'notif-5',
    user_id: 'user-customer-2',
    title: 'Status Update: TC-8102',
    message: 'Your MacBook Air 13" has completed ultrasonic de-oxidation. Micro-soldering of capacitors is underway.',
    type: 'status_update',
    read: false,
    link: '/requests/req-4',
    created_at: '2026-03-11T10:00:00Z'
  },
  {
    id: 'notif-6',
    user_id: 'user-customer-2',
    title: 'New Message from Rohan Deshmukh',
    message: 'Technician Rohan posted an update regarding your MacBook Air logic board test telemetry.',
    type: 'message',
    read: false,
    link: '/messages',
    created_at: '2026-03-11T11:15:00Z'
  },
  {
    id: 'notif-7',
    user_id: 'user-customer-2',
    title: 'Upcoming Bench Appointment',
    message: 'QA verification session scheduled on March 14 at Pandharpur Station Road Lab.',
    type: 'appointment',
    read: true,
    link: '/appointments',
    created_at: '2026-03-11T09:00:00Z'
  },
  {
    id: 'notif-8',
    user_id: 'user-customer-2',
    title: 'Invoice Issued: INV-2026-0055',
    message: 'Provisional invoice (₹3,200.00) generated for MacBook Air liquid damage restoration.',
    type: 'invoice',
    read: false,
    link: '/invoices',
    created_at: '2026-03-10T14:00:00Z'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoice_number: 'INV-2026-0042',
    request_id: 'req-2',
    request_number: 'TC-9419',
    user_id: 'user-customer-1',
    customer_name: 'Amit Shinde',
    customer_email: 'amit.shinde@example.com',
    service_name: 'Mobile Device Repair',
    subtotal: 2499.0,
    tax: 449.82,
    total: 2948.82,
    status: 'paid',
    due_date: '2026-03-15',
    paid_at: '2026-03-08T16:45:00Z',
    items: [
      {
        id: 'item-1',
        description: 'iPhone 15 Pro Max OEM High-Capacity Battery Pack',
        quantity: 1,
        unit_price: 1899.0,
        amount: 1899.0
      },
      {
        id: 'item-2',
        description: 'Level 2 Certified Micro-Installation & IP68 Acoustic Resealing',
        quantity: 1,
        unit_price: 600.0,
        amount: 600.0
      }
    ],
    created_at: '2026-03-08T16:35:00Z'
  },
  {
    id: 'inv-2',
    invoice_number: 'INV-2026-0038',
    request_id: 'req-3',
    request_number: 'TC-9104',
    user_id: 'user-customer-1',
    customer_name: 'Amit Shinde',
    customer_email: 'amit.shinde@example.com',
    service_name: 'Device Maintenance',
    subtotal: 1499.0,
    tax: 269.82,
    total: 1768.82,
    status: 'paid',
    due_date: '2026-02-22',
    paid_at: '2026-02-15T12:30:00Z',
    items: [
      {
        id: 'item-3',
        description: 'Full Workstation De-dusting & Arctic MX-6 Thermal Compound Application',
        quantity: 1,
        unit_price: 1499.0,
        amount: 1499.0
      }
    ],
    created_at: '2026-02-15T12:05:00Z'
  },
  {
    id: 'inv-3',
    invoice_number: 'INV-2026-0049',
    request_id: 'req-1',
    request_number: 'TC-9482',
    user_id: 'user-customer-1',
    customer_name: 'Amit Shinde',
    customer_email: 'amit.shinde@example.com',
    service_name: 'Laptop Repair',
    subtotal: 3850.0,
    tax: 693.00,
    total: 4543.00,
    status: 'pending',
    due_date: '2026-03-24',
    items: [
      {
        id: 'item-4',
        description: 'eDP Display Ribbon Header Pin Realignment & Micro-soldering',
        quantity: 1,
        unit_price: 2850.0,
        amount: 2850.0
      },
      {
        id: 'item-5',
        description: 'Thermal Paste Overhaul & Ultrasonic Chassis Decontamination',
        quantity: 1,
        unit_price: 1000.0,
        amount: 1000.0
      }
    ],
    created_at: '2026-03-10T15:35:00Z'
  },
  {
    id: 'inv-4',
    invoice_number: 'INV-2026-0055',
    request_id: 'req-4',
    request_number: 'TC-8102',
    user_id: 'user-customer-2',
    customer_name: 'Amruta Sartape',
    customer_email: 'amruta.sartape@example.com',
    service_name: 'Laptop Repair',
    subtotal: 2800.0,
    tax: 504.00,
    total: 3304.00,
    status: 'pending',
    due_date: '2026-03-25',
    items: [
      {
        id: 'item-6',
        description: 'Branson Ultrasonic De-oxidation Cycle & MLCC Micro-Soldering',
        quantity: 1,
        unit_price: 2200.0,
        amount: 2200.0
      },
      {
        id: 'item-7',
        description: 'Cleanroom Moisture Evaporation & Motherboard Conformal Coating',
        quantity: 1,
        unit_price: 600.0,
        amount: 600.0
      }
    ],
    created_at: '2026-03-10T14:00:00Z'
  }
];

export const INITIAL_WARRANTIES: Warranty[] = [
  {
    id: 'warr-1',
    device_id: 'dev-1',
    device_model: 'MacBook Pro 16" (M2 Pro, 32GB RAM)',
    user_id: 'user-customer-1',
    provider: 'TechCare CareShield™ Pro',
    policy_number: 'TC-CS-2024-8841',
    start_date: '2024-04-10',
    end_date: '2027-04-10',
    status: 'active',
    covered_services: [
      'Accidental drops & liquid damage repair',
      'Logic board capacitor failure coverage',
      'Free semi-annual thermal maintenance',
      'Priority VIP dispatch SLA (< 2 hours)'
    ],
    terms: 'Covers up to 2 major hardware claims per calendar year with a flat ₹999 deductible. Zero deduction on software support and thermal servicing.'
  },
  {
    id: 'warr-2',
    device_id: 'dev-2',
    device_model: 'AMD Ryzen 9 7950X / RTX 4080 Workstation',
    user_id: 'user-customer-1',
    provider: 'TechCare Enterprise Hardware Protection',
    policy_number: 'TC-ENT-7712',
    start_date: '2023-11-20',
    end_date: '2026-11-20',
    status: 'active',
    covered_services: [
      'Workstation GPU and PSU power surge replacement',
      'On-site emergency technician dispatch',
      'Free cleanroom data recovery in case of SSD fault'
    ],
    terms: 'Full component replacement warranty with advance RMA replacement.'
  },
  {
    id: 'warr-3',
    device_id: 'dev-3',
    device_model: 'iPhone 15 Pro Max 256GB',
    user_id: 'user-customer-1',
    provider: 'TechCare Express Mobile Shield',
    policy_number: 'TC-MOB-9901',
    start_date: '2023-10-01',
    end_date: '2026-04-01',
    status: 'expiring_soon',
    covered_services: [
      'Screen replacement OEM warranty',
      'Battery performance guarantee (< 80% capacity swap)'
    ],
    terms: 'Expiring in 21 days. Eligible for 1-click renewal.'
  },
  {
    id: 'warr-4',
    device_id: 'dev-15',
    device_model: 'Galaxy S23 Ultra (256GB)',
    user_id: 'user-customer-2',
    provider: 'TechCare CareShield™ Mobile',
    policy_number: 'TC-CS-2024-9102',
    start_date: '2024-05-01',
    end_date: '2027-05-01',
    status: 'active',
    covered_services: [
      'AMOLED display & digitizer replacement',
      'Camera optical sensor calibration',
      'Motherboard micro-soldering guarantee'
    ],
    terms: 'Complete OEM parts replacement with genuine Samsung service pack assemblies.'
  },
  {
    id: 'warr-5',
    device_id: 'dev-4',
    device_model: 'MacBook Air 13" (M2, 16GB RAM)',
    user_id: 'user-customer-2',
    provider: 'TechCare Extended Mac Care',
    policy_number: 'TC-MAC-2023-5519',
    start_date: '2023-12-15',
    end_date: '2026-12-15',
    status: 'active',
    covered_services: [
      'Ultrasonic liquid wash warranty re-certification',
      'Battery health guarantee',
      'Keyboard & trackpad controller protection'
    ],
    terms: 'Covers post-repair hardware reliability with 12 months extended protection.'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    request_id: 'req-3',
    user_id: 'user-customer-1',
    customer_name: 'Amit Shinde',
    technician_id: 'tech-1',
    technician_name: 'Rohan Deshmukh',
    service_id: 'srv-8',
    service_name: 'Device Maintenance',
    rating: 5,
    review_text: 'Rohan did an extraordinary job cleaning my custom dual-loop workstation. My temperatures dropped from 89°C to 68°C under full multi-core compile load. The live status tracker kept me informed every single step of the way!',
    created_at: '2026-02-16T10:30:00Z',
    status: 'published'
  },
  {
    id: 'rev-2',
    request_id: 'req-2',
    user_id: 'user-customer-1',
    customer_name: 'Sneha Kulkarni',
    technician_id: 'tech-3',
    technician_name: 'Vikram Shinde',
    service_id: 'srv-3',
    service_name: 'Mobile Device Repair',
    rating: 5,
    review_text: 'Seamless experience. Vikram brought the battery replacement right to our office in Pandharpur. Took less than 45 minutes and my iPhone feels brand new.',
    created_at: '2026-03-09T09:15:00Z',
    status: 'published'
  },
  {
    id: 'rev-3',
    request_id: 'req-prev-1',
    user_id: 'user-customer-2',
    customer_name: 'Dr. Rajesh More',
    technician_id: 'tech-2',
    technician_name: 'Priya Patil',
    service_id: 'srv-5',
    service_name: 'Networking & Wi-Fi',
    rating: 5,
    review_text: 'Priya resolved our clinic Wi-Fi interference completely. She deployed isolated patient VLANs and Wi-Fi 7 access points without a minute of downtime.',
    created_at: '2026-02-28T16:00:00Z',
    status: 'published'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-item-1',
    part_name: 'Samsung 990 PRO NVMe SSD 2TB M.2',
    part_number: 'MZ-V9P2T0B/AM',
    category: 'Storage',
    stock_quantity: 18,
    min_stock: 5,
    cost: 9500.0,
    retail_price: 14500.0,
    supplier: 'Arrow Electronics India Pvt Ltd',
    status: 'in_stock',
    last_restocked: '2026-02-25'
  },
  {
    id: 'inv-item-2',
    part_name: 'MacBook Pro 16" Liquid Retina XDR Display Assembly',
    part_number: 'APL-MBP16-XDR-SG',
    category: 'Screens & Displays',
    stock_quantity: 3,
    min_stock: 4,
    cost: 28000.0,
    retail_price: 42000.0,
    supplier: 'Foxconn OEM Certified India Hub',
    status: 'low_stock',
    last_restocked: '2026-01-14'
  },
  {
    id: 'inv-item-3',
    part_name: 'iPhone 15 Pro Max High-Capacity Replacement Cell',
    part_number: 'IPH-15PM-BAT-4422',
    category: 'Batteries',
    stock_quantity: 24,
    min_stock: 10,
    cost: 2200.0,
    retail_price: 4500.0,
    supplier: 'Amperex Technology India Ltd',
    status: 'in_stock',
    last_restocked: '2026-03-01'
  },
  {
    id: 'inv-item-4',
    part_name: 'Ubiquiti UniFi U7 Pro Wi-Fi 7 Access Point',
    part_number: 'U7-PRO-US',
    category: 'Networking',
    stock_quantity: 12,
    min_stock: 6,
    cost: 11500.0,
    retail_price: 16500.0,
    supplier: 'Ingram Micro India Dist.',
    status: 'in_stock',
    last_restocked: '2026-02-18'
  },
  {
    id: 'inv-item-5',
    part_name: 'Brother HL-Series Pickup Roller & Separation Pad Kit',
    part_number: 'BRO-LY9048001',
    category: 'Printer Maintenance',
    stock_quantity: 2,
    min_stock: 5,
    cost: 1200.0,
    retail_price: 2800.0,
    supplier: 'Synnex Commercial Spares India',
    status: 'low_stock',
    last_restocked: '2026-01-08'
  },
  {
    id: 'inv-item-6',
    part_name: 'Arctic MX-6 Extreme High Performance Thermal Paste (8g)',
    part_number: 'ACT-MX6-8G',
    category: 'Thermal & Consumables',
    stock_quantity: 45,
    min_stock: 15,
    cost: 550.0,
    retail_price: 1200.0,
    supplier: 'Arctic Cooling Direct',
    status: 'in_stock',
    last_restocked: '2026-02-28'
  },
  {
    id: 'inv-item-7',
    part_name: 'Corsair RM850x 850W 80+ Gold Modular ATX PSU',
    part_number: 'CP-9020200-NA',
    category: 'Power Supplies',
    stock_quantity: 8,
    min_stock: 4,
    cost: 7500.0,
    retail_price: 11500.0,
    supplier: 'Corsair Component Wholesale India',
    status: 'in_stock',
    last_restocked: '2026-02-10'
  }
];
