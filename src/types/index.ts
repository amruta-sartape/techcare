export type UserRole = 'customer' | 'technician' | 'admin';

export const ADMIN_OWNER_EMAIL = 'amrutasartape27@gmail.com';

export type RequestStatus =
  | 'Request Created'
  | 'Technician Assigned'
  | 'Technician Accepted'
  | 'Technician On The Way'
  | 'Device Received'
  | 'Diagnosis'
  | 'Repair In Progress'
  | 'Ready'
  | 'Completed'
  | 'Cancelled';

export type UrgencyLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type WarrantyStatus = 'active' | 'expiring_soon' | 'expired' | 'none';

export type DeviceType =
  | 'Laptop'
  | 'Desktop'
  | 'Mobile'
  | 'Tablet'
  | 'Printer'
  | 'Networking'
  | 'Server'
  | 'Other';

export type Profile = {
  id: string;
  user_id?: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  created_at: string;
};

export type User = Profile;

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  starting_price: number;
  estimated_duration: string;
  turnaround_time?: string;
  warranty_duration_days?: number;
  common_issues: string[];
  included_items: string[];
  faqs: ServiceFAQ[];
  is_active: boolean;
  icon: string;
}

export type ServiceOffering = ServiceItem;

export interface Device {
  id: string;
  user_id: string;
  device_type: DeviceType;
  brand: string;
  model: string;
  serial_number?: string;
  purchase_date?: string;
  warranty_status: WarrantyStatus;
  notes?: string;
  image_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface Technician {
  id: string;
  profile_id: string;
  user_id?: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  specialties: string[];
  experience_years: number;
  rating: number;
  completed_jobs_count: number;
  active_status: boolean;
  current_workload: number;
  certifications: string[];
}

export interface ServiceRequestHistoryItem {
  id: string;
  request_id: string;
  status: RequestStatus;
  notes: string;
  changed_by_name: string;
  changed_by_role: UserRole;
  created_at: string;
}

export interface Attachment {
  id: string;
  request_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  uploaded_at: string;
}

export interface ServiceRequest {
  id: string;
  request_number: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  device_id: string;
  device?: Device;
  service_id: string;
  service_name: string;
  problem_description: string;
  urgency: UrgencyLevel;
  status: RequestStatus;
  preferred_date: string;
  preferred_time_slot: string;
  assigned_technician_id?: string;
  assigned_technician?: Technician;
  estimated_cost: number;
  final_cost?: number;
  diagnosis?: string;
  service_notes?: string;
  attachments?: Attachment[];
  history: ServiceRequestHistoryItem[];
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  request_id: string;
  request_number: string;
  user_id: string;
  customer_name: string;
  technician_id?: string;
  technician_name?: string;
  scheduled_at: string;
  time_slot: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  location: string;
  notes?: string;
  service_name: string;
  device_info: string;
}

export interface Message {
  id: string;
  request_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: UserRole;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'status_update' | 'technician_assigned' | 'appointment' | 'invoice' | 'warranty' | 'message';
  read: boolean;
  link?: string;
  created_at: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  request_id?: string;
  request_number?: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  service_name: string;
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  due_date: string;
  paid_at?: string;
  items: InvoiceItem[];
  created_at: string;
}

export interface Warranty {
  id: string;
  device_id: string;
  device_model: string;
  device_name?: string;
  service_request_id?: string;
  service_name?: string;
  user_id: string;
  provider: string;
  policy_number: string;
  start_date: string;
  end_date: string;
  status: WarrantyStatus;
  covered_services: string[];
  terms: string;
}

export interface Review {
  id: string;
  request_id: string;
  user_id: string;
  customer_name: string;
  technician_id?: string;
  technician_name?: string;
  service_id: string;
  service_name: string;
  rating: number; // 1 - 5
  review_text: string;
  comment?: string;
  created_at: string;
  status: 'published' | 'under_review' | 'archived';
}

export interface InventoryItem {
  id: string;
  part_name: string;
  part_number: string;
  sku?: string;
  category: string;
  stock_quantity: number;
  min_stock: number;
  reorder_threshold?: number;
  cost: number;
  unit_cost?: number;
  retail_price: number;
  selling_price?: number;
  supplier: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  last_restocked?: string;
}

export interface AIDiagnosisResult {
  issueCategory: string;
  recommendedService: string;
  urgency: UrgencyLevel;
  preliminaryAssessment: string;
  potentialCauses: string[];
  recommendedCustomerPrep: string[];
  estimatedDiagnosticTime: string;
  priceRangeEstimate: string;
}

export interface QueryExchange {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
}
