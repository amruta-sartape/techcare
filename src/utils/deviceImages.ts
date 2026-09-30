/**
 * High-quality, professional dark-tech hardware, device and laboratory visuals.
 * Consistent premium dark-tech visual style with realistic 3D / product-render aesthetics.
 */

export interface DeviceVisual {
  url: string;
  alt: string;
  label?: string;
}

export const DEVICE_TYPE_IMAGES: Record<string, DeviceVisual> = {
  Laptop: {
    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    alt: 'Flagship Matte Black Laptop with High-Resolution Display',
    label: 'Precision Ultrabook'
  },
  Desktop: {
    url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800',
    alt: 'Custom Liquid-Cooled Engineering Workstation with Illuminated GPU',
    label: 'Enterprise Rig'
  },
  Mobile: {
    url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=800',
    alt: 'Titanium OLED Smartphone with Edge-Lit Precision Bezel',
    label: 'Flagship Smartphone'
  },
  Tablet: {
    url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800',
    alt: 'High-Performance Graphic Tablet with Liquid Retina Display',
    label: 'Pro Tablet'
  },
  Printer: {
    url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800',
    alt: 'Commercial High-Speed Color Laser Printer and Scanner',
    label: 'Laser Scanner'
  },
  Networking: {
    url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
    alt: 'Enterprise Multi-Gigabit Wi-Fi 7 Router and Switch Architecture',
    label: 'Network Core'
  },
  Server: {
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
    alt: 'High-Density Rackmount Server Array with Optical Fiber Patch Cables',
    label: 'Storage Array'
  }
};

export const SERVICE_VISUALS: Record<string, DeviceVisual> = {
  'srv-1': {
    url: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&q=80&w=800',
    alt: 'Microscopic inspection and soldering of laptop logic board',
    label: 'Logic Board Lab'
  },
  'srv-2': {
    url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800',
    alt: 'Custom workstation graphics processor and motherboard bench diagnostic',
    label: 'GPU Bench Station'
  },
  'srv-3': {
    url: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&q=80&w=800',
    alt: 'Precision smartphone display assembly and battery renewal',
    label: 'Mobile Cleanroom'
  },
  'srv-4': {
    url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800',
    alt: 'Commercial laser printer pickup assembly and optical scanner maintenance',
    label: 'Laser Overhaul'
  },
  'srv-5': {
    url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
    alt: 'Enterprise rack server patch panel and high-speed Wi-Fi 7 access node',
    label: 'Wi-Fi 7 Spectrum'
  },
  'srv-6': {
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    alt: 'Secure operating system deployment and software diagnostic console',
    label: 'OS Deployment'
  },
  'srv-7': {
    url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=800',
    alt: 'Class-100 cleanroom magnetic platter and SSD controller recovery',
    label: 'ISO Cleanroom'
  },
  'srv-8': {
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    alt: 'Preventative thermal repaste, port deoxidation, and ESD vacuum clean',
    label: 'Thermal Repaste'
  },
  'srv-9': {
    url: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&q=80&w=800',
    alt: 'Enterprise dual-monitor ergonomic workstation installation and cabling',
    label: 'Turnkey Rollout'
  }
};

export const HOW_IT_WORKS_VISUALS = [
  {
    step: '01',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600',
    alt: 'Digital Intake & AI Triage interface with hardware telemetry',
    title: 'Digital Intake & AI Triage'
  },
  {
    step: '02',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600',
    alt: 'ESD-safe protective logistics and white-glove transport',
    title: 'White-Glove Logistics'
  },
  {
    step: '03',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=600',
    alt: 'Oscilloscope power rail analysis and thermal camera inspection',
    title: 'Precision Bench Diagnosis'
  },
  {
    step: '04',
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600',
    alt: 'Digital inspection report with high-resolution photo proof',
    title: 'Transparent Approval'
  },
  {
    step: '05',
    url: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&q=80&w=600',
    alt: 'IPC-certified micro-soldering and OEM component replacement',
    title: 'OEM Component Micro-Repair'
  },
  {
    step: '06',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    alt: 'Burn-in stress testing and 90-day hardware shield certification',
    title: 'Hardware Shield & Delivery'
  }
];

export const LAB_FACILITY_VISUALS = [
  {
    title: 'ISO Class-100 Cleanroom Chamber',
    desc: 'Laminar airflow chamber with HEPA filtration for mechanical hard drive recovery and sensitive optics alignment.',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=900',
    tag: 'Cleanroom ISO-5'
  },
  {
    title: 'BGA Micro-Soldering & Ultrasonic Wash',
    desc: 'Trinocular stereo microscopes with precision temperature-controlled hot air stations and chemical deoxidation.',
    url: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&q=80&w=900',
    tag: 'IPC-A-610 Certified'
  },
  {
    title: 'Oscilloscope & Power Rail Analyzers',
    desc: 'Multi-channel 1GHz digital storage oscilloscopes capable of detecting nanosecond voltage sags on GPU and CPU power rails.',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=900',
    tag: 'Real-Time Telemetry'
  },
  {
    title: 'Thermal Imaging & Burn-In Stability Rigs',
    desc: 'FLIR radiometric thermal imaging to immediately isolate shorted ceramic capacitors and VRM hotspot bottlenecks.',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=900',
    tag: 'FLIR Thermography'
  }
];

/**
 * Returns a fallback realistic device image based on device type or model name.
 */
export function getDeviceVisual(deviceType?: string, modelName?: string): DeviceVisual {
  const normType = (deviceType || '').toLowerCase();
  const normModel = (modelName || '').toLowerCase();

  if (normModel.includes('macbook') || normType.includes('laptop')) {
    return DEVICE_TYPE_IMAGES['Laptop'];
  }
  if (normModel.includes('iphone') || normType.includes('mobile') || normType.includes('phone')) {
    return DEVICE_TYPE_IMAGES['Mobile'];
  }
  if (normModel.includes('rtx') || normModel.includes('ryzen') || normType.includes('desktop') || normType.includes('workstation')) {
    return DEVICE_TYPE_IMAGES['Desktop'];
  }
  if (normModel.includes('brother') || normModel.includes('printer') || normType.includes('printer')) {
    return DEVICE_TYPE_IMAGES['Printer'];
  }
  if (normType.includes('server') || normModel.includes('server') || normModel.includes('raid')) {
    return DEVICE_TYPE_IMAGES['Server'];
  }
  if (normType.includes('networking') || normModel.includes('wifi') || normModel.includes('router')) {
    return DEVICE_TYPE_IMAGES['Networking'];
  }
  if (normType.includes('tablet') || normModel.includes('ipad')) {
    return DEVICE_TYPE_IMAGES['Tablet'];
  }

  return DEVICE_TYPE_IMAGES['Laptop'];
}

/**
 * Returns the relevant visual for a service by serviceId or serviceName.
 */
export function getServiceVisual(serviceId?: string, serviceName?: string): DeviceVisual {
  if (serviceId && SERVICE_VISUALS[serviceId]) {
    return SERVICE_VISUALS[serviceId];
  }

  const name = (serviceName || '').toLowerCase();
  if (name.includes('laptop')) return SERVICE_VISUALS['srv-1'];
  if (name.includes('desktop')) return SERVICE_VISUALS['srv-2'];
  if (name.includes('mobile') || name.includes('phone')) return SERVICE_VISUALS['srv-3'];
  if (name.includes('printer')) return SERVICE_VISUALS['srv-4'];
  if (name.includes('network') || name.includes('wi-fi')) return SERVICE_VISUALS['srv-5'];
  if (name.includes('software') || name.includes('os')) return SERVICE_VISUALS['srv-6'];
  if (name.includes('data') || name.includes('recovery')) return SERVICE_VISUALS['srv-7'];
  if (name.includes('maintenance')) return SERVICE_VISUALS['srv-8'];
  if (name.includes('setup') || name.includes('installation')) return SERVICE_VISUALS['srv-9'];

  return SERVICE_VISUALS['srv-1'];
}
