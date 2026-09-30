import {
  Profile,
  ServiceItem,
  Device,
  Technician,
  ServiceRequest,
  ServiceRequestHistoryItem,
  Appointment,
  Message,
  NotificationItem,
  Invoice,
  Warranty,
  Review,
  InventoryItem,
  RequestStatus,
  UserRole,
  UrgencyLevel,
  QueryExchange,
  ADMIN_OWNER_EMAIL
} from '../types';
import {
  INITIAL_PROFILES,
  INITIAL_SERVICES,
  INITIAL_DEVICES,
  INITIAL_TECHNICIANS,
  INITIAL_SERVICE_REQUESTS,
  INITIAL_APPOINTMENTS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_INVOICES,
  INITIAL_WARRANTIES,
  INITIAL_REVIEWS,
  INITIAL_INVENTORY
} from './mockData';

type Listener = () => void;

class TechCareStore {
  private listeners: Set<Listener> = new Set();
  private activeUser: Profile | null = null;

  constructor() {
    this.ensureLocalizedData();
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('techcare_current_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') {
            this.activeUser = parsed;
            if (parsed.role === 'technician') {
              this.associateTechnicianProfile(parsed);
            }
          }
        }
      } catch {}
    }
  }

  setActiveUser(user: Profile | null): void {
    this.activeUser = user;
    if (user && user.role === 'technician') {
      this.associateTechnicianProfile(user);
    }
    this.notifyListeners();
  }

  getActiveUser(): Profile | null {
    return this.activeUser;
  }

  /**
   * Maintains the auth.users -> profiles -> technicians relational data model.
   * Connects the authenticated technician profile with the corresponding technician entity.
   */
  public associateTechnicianProfile(profile: Profile): void {
    if (!profile || profile.role !== 'technician') return;

    try {
      const technicians = this.getStored<Technician[]>('technicians', INITIAL_TECHNICIANS);
      if (!technicians || technicians.length === 0) return;

      const trimmedEmail = (profile.email || '').toLowerCase().trim();

      // Find the technician record to associate:
      // 1. Match by profile_id
      // 2. Match by email
      // 3. Match by user_id
      // 4. Default to primary demo technician record 'tech-1'
      let targetIndex = technicians.findIndex(
        (t) =>
          t.profile_id === profile.id ||
          (t.email && t.email.toLowerCase().trim() === trimmedEmail) ||
          (t.user_id && (t.user_id === profile.user_id || t.user_id === profile.id))
      );

      if (targetIndex === -1) {
        targetIndex = technicians.findIndex((t) => t.id === 'tech-1');
        if (targetIndex === -1) targetIndex = 0;
      }

      const existingTech = technicians[targetIndex];
      const previousProfileId = existingTech.profile_id;
      const newProfileId = profile.id;
      const newUserId = profile.user_id || profile.id;

      // Update technician record to point to this profile (relational foreign key)
      const updatedTech: Technician = {
        ...existingTech,
        profile_id: newProfileId,
        user_id: newUserId,
        email: profile.email || existingTech.email,
        full_name: profile.full_name || existingTech.full_name,
        phone: profile.phone || existingTech.phone,
        avatar_url: profile.avatar_url || existingTech.avatar_url
      };

      technicians[targetIndex] = updatedTech;
      this.setStored('technicians', technicians);

      // Preserve foreign key integrity on existing messages (sender_id/receiver_id -> profiles.id)
      if (previousProfileId && previousProfileId !== newProfileId) {
        const messages = this.getStored<Message[]>('messages', INITIAL_MESSAGES);
        let messagesChanged = false;
        const updatedMessages = messages.map((m) => {
          let sId = m.sender_id;
          let rId = m.receiver_id;
          let changed = false;
          if (sId === previousProfileId || sId === 'user-tech-1') {
            sId = newProfileId;
            changed = true;
          }
          if (rId === previousProfileId || rId === 'user-tech-1') {
            rId = newProfileId;
            changed = true;
          }
          if (changed) {
            messagesChanged = true;
            return { ...m, sender_id: sId, receiver_id: rId };
          }
          return m;
        });

        if (messagesChanged) {
          this.setStored('messages', updatedMessages);
        }
      }
    } catch (e) {
      console.warn('Could not associate technician profile', e);
    }
  }

  private ensureLocalizedData() {
    try {
      const versionKey = 'techcare_data_version';
      const currentVersion = 'v7_technician_assigned_jobs_and_chat_demo_data_2026';
      if (typeof window !== 'undefined' && localStorage.getItem(versionKey) !== currentVersion) {
        // Read existing profiles if any to preserve authenticated real customer accounts
        let existingProfiles: Profile[] = [];
        try {
          const raw = localStorage.getItem('techcare_profiles');
          if (raw) existingProfiles = JSON.parse(raw);
        } catch {
          // ignore
        }

        // Cleanse existing custom profiles: no account other than ADMIN_OWNER_EMAIL can be admin
        existingProfiles = existingProfiles.map((p) => {
          if (p.role === 'admin' && p.email.toLowerCase().trim() !== ADMIN_OWNER_EMAIL) {
            return { ...p, role: 'customer' as UserRole };
          }
          return p;
        });

        // Keep real authenticated users not in default initial list
        const initialIds = new Set(INITIAL_PROFILES.map((p) => p.id));
        const initialEmails = new Set(INITIAL_PROFILES.map((p) => p.email.toLowerCase()));
        const customProfiles = existingProfiles.filter(
          (p) => !initialIds.has(p.id) && !initialEmails.has(p.email.toLowerCase())
        );

        localStorage.setItem('techcare_profiles', JSON.stringify([...INITIAL_PROFILES, ...customProfiles]));
        localStorage.setItem('techcare_devices', JSON.stringify(INITIAL_DEVICES));
        localStorage.setItem('techcare_services', JSON.stringify(INITIAL_SERVICES));
        localStorage.setItem('techcare_technicians', JSON.stringify(INITIAL_TECHNICIANS));

        // Preserve any custom service requests created by the authenticated customer
        let existingRequests: ServiceRequest[] = [];
        try {
          const rawReq = localStorage.getItem('techcare_requests') || localStorage.getItem('techcare_service_requests');
          if (rawReq) existingRequests = JSON.parse(rawReq);
        } catch {
          // ignore
        }
        const initialReqIds = new Set(INITIAL_SERVICE_REQUESTS.map((r) => r.id));
        const customRequests = existingRequests.filter((r) => !initialReqIds.has(r.id));
        const mergedRequests = [...INITIAL_SERVICE_REQUESTS, ...customRequests];
        localStorage.setItem('techcare_requests', JSON.stringify(mergedRequests));
        localStorage.setItem('techcare_service_requests', JSON.stringify(mergedRequests));

        // Preserve any custom messages created by users
        let existingMessages: Message[] = [];
        try {
          const rawMsgs = localStorage.getItem('techcare_messages');
          if (rawMsgs) existingMessages = JSON.parse(rawMsgs);
        } catch {
          // ignore
        }
        const initialMsgIds = new Set(INITIAL_MESSAGES.map((m) => m.id));
        const customMessages = existingMessages.filter((m) => !initialMsgIds.has(m.id));
        const mergedMessages = [...INITIAL_MESSAGES, ...customMessages];
        localStorage.setItem('techcare_messages', JSON.stringify(mergedMessages));

        localStorage.setItem('techcare_appointments', JSON.stringify(INITIAL_APPOINTMENTS));
        localStorage.setItem('techcare_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
        localStorage.setItem('techcare_invoices', JSON.stringify(INITIAL_INVOICES));
        localStorage.setItem('techcare_warranties', JSON.stringify(INITIAL_WARRANTIES));
        localStorage.setItem('techcare_reviews', JSON.stringify(INITIAL_REVIEWS));
        localStorage.setItem('techcare_inventory', JSON.stringify(INITIAL_INVENTORY));
        localStorage.setItem(versionKey, currentVersion);
      }
    } catch (e) {
      console.warn('Could not migrate localized store data', e);
    }
  }

  private getUserIdentifierSet(userId?: string): Set<string> {
    const idSet = new Set<string>();
    const effectiveId = userId || (this.activeUser?.role === 'customer' ? this.activeUser.id : undefined);
    if (!effectiveId) return idSet;

    idSet.add(effectiveId);

    // Identify customer email if available
    let email = (this.activeUser?.id === effectiveId ? this.activeUser?.email : '')?.toLowerCase().trim();
    if (!email) {
      const p = this.getProfiles().find((prof) => prof.id === effectiveId);
      if (p) email = p.email.toLowerCase().trim();
    }

    if (email === 'amruta.sartape@example.com' || effectiveId === 'user-customer-2') {
      idSet.add('user-customer-2');
    } else {
      // Connect customer portal accounts with the primary rich Indian demo dataset
      idSet.add('user-customer-1');
    }

    return idSet;
  }

  private getTechnicianIdentifierSet(techId?: string): Set<string> {
    const idSet = new Set<string>();
    const effectiveId = techId || (this.activeUser?.role === 'technician' ? this.activeUser.id : undefined);
    if (effectiveId) {
      idSet.add(effectiveId);
    }

    const technicians = this.getTechnicians();

    // Query relational technicians entity by profile_id, user_id, or technician id
    const matchedTechs = technicians.filter(
      (t) =>
        (effectiveId && (t.id === effectiveId || t.profile_id === effectiveId || t.user_id === effectiveId)) ||
        (this.activeUser?.role === 'technician' &&
          (t.profile_id === this.activeUser.id ||
            t.user_id === this.activeUser.user_id ||
            (this.activeUser.email && t.email && t.email.toLowerCase().trim() === this.activeUser.email.toLowerCase().trim())))
    );

    matchedTechs.forEach((t) => {
      idSet.add(t.id);
      if (t.profile_id) idSet.add(t.profile_id);
      if (t.user_id) idSet.add(t.user_id);
      if (t.id === 'tech-1') {
        idSet.add('tech-1');
        idSet.add('user-tech-1');
        idSet.add('auth-tech-1');
      }
    });

    // If active user is technician, ensure primary workbench demo technician record ('tech-1') is associated
    if (this.activeUser?.role === 'technician') {
      const primaryTech = technicians.find((t) => t.id === 'tech-1') || technicians[0];
      if (primaryTech) {
        idSet.add(primaryTech.id);
        if (primaryTech.profile_id) idSet.add(primaryTech.profile_id);
        if (primaryTech.user_id) idSet.add(primaryTech.user_id);
      }
      idSet.add('tech-1');
      idSet.add('user-tech-1');
      idSet.add('auth-tech-1');
    }

    return idSet;
  }

  private getStored<T>(key: string, fallback: T): T {
    try {
      let val = localStorage.getItem(`techcare_${key}`);
      if (!val && key === 'requests') {
        val = localStorage.getItem('techcare_service_requests');
      }
      if (!val) return fallback;
      const parsed = JSON.parse(val);
      if (Array.isArray(fallback) && !Array.isArray(parsed)) {
        return fallback;
      }
      return parsed;
    } catch {
      return fallback;
    }
  }

  private setStored<T>(key: string, data: T) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(`techcare_${key}`, JSON.stringify(data));
      }
      this.notifyListeners();
    } catch (e) {
      console.error('Storage error', e);
    }
  }

  public subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((fn) => fn());
  }

  // --- Profiles & Users ---
  getProfiles(): Profile[] {
    const raw = this.getStored('profiles', INITIAL_PROFILES);
    return raw.map((p) => {
      if (p.role === 'admin' && p.email.toLowerCase().trim() !== ADMIN_OWNER_EMAIL) {
        return { ...p, role: 'customer' as UserRole };
      }
      return p;
    });
  }

  getUsers(): Profile[] {
    return this.getProfiles();
  }

  getProfileById(id: string): Profile | undefined {
    return this.getProfiles().find((p) => p.id === id);
  }

  addUser(user: Profile): Profile {
    const profiles = this.getProfiles();
    profiles.push(user);
    this.setStored('profiles', profiles);
    return user;
  }

  updateProfile(id: string, updates: Partial<Profile>): Profile {
    const profiles = this.getProfiles().map((p) =>
      p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
    );
    this.setStored('profiles', profiles);
    return this.getProfileById(id)!;
  }

  updateUser(id: string, updates: Partial<Profile>): Profile {
    return this.updateProfile(id, updates);
  }

  syncAuthenticatedUserProfile(profile: Profile): void {
    const profiles = this.getProfiles();
    const existingIndex = profiles.findIndex(
      (p) => p.id === profile.id || p.email.toLowerCase() === profile.email.toLowerCase()
    );
    if (existingIndex >= 0) {
      profiles[existingIndex] = { ...profiles[existingIndex], ...profile };
    } else {
      profiles.push(profile);
    }
    this.setStored('profiles', profiles);

    if (profile.role === 'technician') {
      this.associateTechnicianProfile(profile);
    }
  }

  // --- Services ---
  getServices(): ServiceItem[] {
    return this.getStored('services', INITIAL_SERVICES);
  }

  getServiceById(id: string): ServiceItem | undefined {
    return this.getServices().find((s) => s.id === id);
  }

  getServiceBySlug(slug: string): ServiceItem | undefined {
    return this.getServices().find((s) => s.slug === slug);
  }

  createService(service: Omit<ServiceItem, 'id'>): ServiceItem {
    const services = this.getServices();
    const newService: ServiceItem = {
      ...service,
      id: `srv-${Date.now()}`
    };
    services.push(newService);
    this.setStored('services', services);
    return newService;
  }

  updateService(id: string, updates: Partial<ServiceItem>): ServiceItem {
    const services = this.getServices().map((s) => (s.id === id ? { ...s, ...updates } : s));
    this.setStored('services', services);
    return this.getServiceById(id)!;
  }

  addService(service: any): ServiceItem {
    return this.createService({
      slug: service.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      estimated_duration: service.turnaround_time || '24-48 Hours',
      common_issues: [],
      included_items: [],
      faqs: [],
      icon: 'Wrench',
      ...service
    });
  }

  deleteService(id: string) {
    const services = this.getServices().filter((s) => s.id !== id);
    this.setStored('services', services);
  }

  // --- Devices ---
  getDevices(userId?: string): Device[] {
    const all = this.getStored('devices', INITIAL_DEVICES);
    const targetUserId = userId || (this.activeUser?.role === 'customer' ? this.activeUser.id : undefined);
    if (targetUserId) {
      const allowedIds = this.getUserIdentifierSet(targetUserId);
      return all.filter((d) => allowedIds.has(d.user_id));
    }
    return all;
  }

  getDeviceById(id: string): Device | undefined {
    return this.getStored<Device[]>('devices', INITIAL_DEVICES).find((d) => d.id === id);
  }

  addDevice(device: Omit<Device, 'id' | 'created_at'>): Device {
    const devices = this.getStored<Device[]>('devices', INITIAL_DEVICES);
    const newDevice: Device = {
      ...device,
      id: `dev-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    devices.unshift(newDevice);
    this.setStored('devices', devices);
    return newDevice;
  }

  updateDevice(id: string, updates: Partial<Device>): Device {
    const devices = this.getStored<Device[]>('devices', INITIAL_DEVICES).map((d) =>
      d.id === id ? { ...d, ...updates, updated_at: new Date().toISOString() } : d
    );
    this.setStored('devices', devices);
    return this.getDeviceById(id)!;
  }

  deleteDevice(id: string) {
    const devices = this.getStored<Device[]>('devices', INITIAL_DEVICES).filter((d) => d.id !== id);
    this.setStored('devices', devices);
  }

  // --- Technicians ---
  getTechnicians(): Technician[] {
    return this.getStored('technicians', INITIAL_TECHNICIANS);
  }

  getTechnicianById(id: string): Technician | undefined {
    return this.getTechnicians().find((t) => t.id === id);
  }

  updateTechnician(id: string, updates: Partial<Technician>): Technician {
    const techs = this.getTechnicians().map((t) => (t.id === id ? { ...t, ...updates } : t));
    this.setStored('technicians', techs);
    return this.getTechnicianById(id)!;
  }

  addTechnician(tech: Omit<Technician, 'id'>): Technician {
    const techs = this.getTechnicians();
    const newTech: Technician = {
      ...tech,
      id: `tech-${Date.now()}`
    };
    techs.push(newTech);
    this.setStored('technicians', techs);
    return newTech;
  }

  // --- Service Requests ---
  getServiceRequests(filter?: { userId?: string; technicianId?: string; status?: RequestStatus }): ServiceRequest[] {
    let requests = this.getStored<ServiceRequest[]>('requests', INITIAL_SERVICE_REQUESTS);

    // If active user is customer or userId is provided, filter strictly to that user's requests
    const effectiveUserId = filter?.userId || (this.activeUser?.role === 'customer' ? this.activeUser.id : undefined);
    if (effectiveUserId) {
      const allowedIds = this.getUserIdentifierSet(effectiveUserId);
      requests = requests.filter((r) => allowedIds.has(r.user_id));
    }

    // If active user is technician or technicianId is provided, filter strictly to that technician's jobs
    const isTech = this.activeUser?.role === 'technician';
    const effectiveTechId = filter?.technicianId || (isTech ? this.activeUser?.id : undefined);
    if (effectiveTechId || isTech) {
      const allowedTechIds = this.getTechnicianIdentifierSet(effectiveTechId);
      requests = requests.filter(
        (r) =>
          (r.assigned_technician_id && allowedTechIds.has(r.assigned_technician_id)) ||
          (r.assigned_technician?.id && allowedTechIds.has(r.assigned_technician.id)) ||
          (r.assigned_technician?.profile_id && allowedTechIds.has(r.assigned_technician.profile_id)) ||
          (r.assigned_technician?.user_id && allowedTechIds.has(r.assigned_technician.user_id))
      );
    }

    if (filter?.status) {
      requests = requests.filter((r) => r.status === filter.status);
    }
    return requests;
  }

  getServiceRequestById(id: string): ServiceRequest | undefined {
    const requests = this.getStored<ServiceRequest[]>('requests', INITIAL_SERVICE_REQUESTS);
    return requests.find((r) => r.id === id || r.request_number === id);
  }

  createServiceRequest(data: {
    userId: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    deviceId: string;
    serviceId: string;
    problemDescription: string;
    urgency: UrgencyLevel;
    preferredDate: string;
    preferredTimeSlot: string;
    attachments?: Array<{ fileName: string; fileUrl: string; fileSize: number; fileType: string }>;
  }): ServiceRequest {
    const requests = this.getStored<ServiceRequest[]>('requests', INITIAL_SERVICE_REQUESTS);
    const device = this.getDeviceById(data.deviceId);
    const service = this.getServiceById(data.serviceId);
    const technicians = this.getTechnicians().filter((t) => t.active_status);

    // Pick best suited technician or default to first
    const autoTech = technicians.length > 0 ? technicians[0] : undefined;
    const reqNum = `TC-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newRequest: ServiceRequest = {
      id: `req-${Date.now()}`,
      request_number: reqNum,
      user_id: data.userId,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.customerPhone,
      device_id: data.deviceId,
      device: device,
      service_id: data.serviceId,
      service_name: service?.name || 'Device Service',
      problem_description: data.problemDescription,
      urgency: data.urgency,
      status: 'Request Created',
      preferred_date: data.preferredDate,
      preferred_time_slot: data.preferredTimeSlot,
      assigned_technician_id: autoTech?.id,
      assigned_technician: autoTech,
      estimated_cost: service?.starting_price || 89.0,
      final_cost: service?.starting_price || 89.0,
      attachments: (data.attachments || []).map((att, i) => ({
        id: `att-${Date.now()}-${i}`,
        request_id: `req-${Date.now()}`,
        file_name: att.fileName,
        file_url: att.fileUrl,
        file_size: att.fileSize,
        file_type: att.fileType,
        uploaded_at: now
      })),
      history: [
        {
          id: `hist-${Date.now()}`,
          request_id: `req-${Date.now()}`,
          status: 'Request Created',
          notes: 'Customer submitted new service intake request.',
          changed_by_name: data.customerName,
          changed_by_role: 'customer',
          created_at: now
        }
      ],
      created_at: now,
      updated_at: now
    };

    requests.unshift(newRequest);
    this.setStored('requests', requests);

    // Automatically create appointment
    this.addAppointment({
      request_id: newRequest.id,
      request_number: newRequest.request_number,
      user_id: newRequest.user_id,
      customer_name: newRequest.customer_name,
      technician_id: autoTech?.id,
      technician_name: autoTech?.full_name,
      scheduled_at: `${data.preferredDate}T10:00:00Z`,
      time_slot: data.preferredTimeSlot,
      status: 'scheduled',
      location: 'TechCare Service Center & Dispatch Unit',
      service_name: newRequest.service_name,
      device_info: `${device?.brand || ''} ${device?.model || ''}`.trim()
    });

    // Notify customer
    this.addNotification({
      user_id: data.userId,
      title: `Service Request Created (${reqNum})`,
      message: `Your service intake for ${device?.brand || ''} ${device?.model || ''} has been scheduled.`,
      type: 'status_update',
      link: `/requests/${newRequest.id}`
    });

    return newRequest;
  }

  updateRequestStatus(
    requestId: string,
    newStatus: RequestStatus,
    notes: string,
    changedByName: string,
    changedByRole: UserRole,
    extraUpdates?: {
      diagnosis?: string;
      serviceNotes?: string;
      finalCost?: number;
      assignedTechnicianId?: string;
    }
  ): ServiceRequest {
    const requests = this.getStored<ServiceRequest[]>('requests', INITIAL_SERVICE_REQUESTS);
    const now = new Date().toISOString();

    const updatedRequests = requests.map((req) => {
      if (req.id !== requestId && req.request_number !== requestId) return req;

      const historyItem: ServiceRequestHistoryItem = {
        id: `hist-${Date.now()}`,
        request_id: req.id,
        status: newStatus,
        notes: notes || `Status updated to ${newStatus}`,
        changed_by_name: changedByName,
        changed_by_role: changedByRole,
        created_at: now
      };

      let assignedTech = req.assigned_technician;
      if (extraUpdates?.assignedTechnicianId) {
        assignedTech = this.getTechnicianById(extraUpdates.assignedTechnicianId);
      }

      return {
        ...req,
        status: newStatus,
        diagnosis: extraUpdates?.diagnosis !== undefined ? extraUpdates.diagnosis : req.diagnosis,
        service_notes: extraUpdates?.serviceNotes !== undefined ? extraUpdates.serviceNotes : req.service_notes,
        final_cost: extraUpdates?.finalCost !== undefined ? extraUpdates.finalCost : req.final_cost,
        assigned_technician_id: extraUpdates?.assignedTechnicianId || req.assigned_technician_id,
        assigned_technician: assignedTech,
        history: [historyItem, ...req.history],
        updated_at: now
      };
    });

    this.setStored('requests', updatedRequests);
    const target = updatedRequests.find((r) => r.id === requestId || r.request_number === requestId)!;

    // Send customer notification
    this.addNotification({
      user_id: target.user_id,
      title: `${target.request_number}: ${newStatus}`,
      message: notes || `Your service request for ${target.device?.model || target.service_name} is now ${newStatus}.`,
      type: 'status_update',
      link: `/requests/${target.id}`
    });

    // If marked Completed, generate invoice if one doesn't exist
    if (newStatus === 'Completed') {
      const existingInvoice = this.getInvoices().find((inv) => inv.request_id === target.id);
      if (!existingInvoice) {
        const cost = target.final_cost || target.estimated_cost || 1499;
        const tax = Math.round(cost * 0.18 * 100) / 100;
        this.createInvoice({
          request_id: target.id,
          request_number: target.request_number,
          user_id: target.user_id,
          customer_name: target.customer_name,
          customer_email: target.customer_email,
          service_name: target.service_name,
          subtotal: cost,
          tax: tax,
          total: cost + tax,
          status: 'pending',
          due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
          items: [
            {
              id: `item-${Date.now()}`,
              description: `${target.service_name} Diagnostic & Repair Service`,
              quantity: 1,
              unit_price: cost,
              amount: cost
            }
          ]
        });
      }
    }

    return target;
  }

  // --- Appointments ---
  getAppointments(userId?: string): Appointment[] {
    const all = this.getStored<Appointment[]>('appointments', INITIAL_APPOINTMENTS);
    const targetUserId = userId || (this.activeUser?.role === 'customer' ? this.activeUser.id : undefined);
    if (targetUserId) {
      const allowedIds = this.getUserIdentifierSet(targetUserId);
      return all.filter((a) => allowedIds.has(a.user_id));
    }
    if (this.activeUser?.role === 'technician') {
      const techJobs = this.getServiceRequests();
      const techReqNumbers = new Set(techJobs.map((j) => j.request_number));
      const allowedTechIds = this.getTechnicianIdentifierSet(this.activeUser?.id);
      return all.filter(
        (a) =>
          (a.technician_id && allowedTechIds.has(a.technician_id)) ||
          (a.request_number && techReqNumbers.has(a.request_number))
      );
    }
    return all;
  }

  addAppointment(apt: Omit<Appointment, 'id'>): Appointment {
    const appointments = this.getStored<Appointment[]>('appointments', INITIAL_APPOINTMENTS);
    const newApt: Appointment = {
      ...apt,
      id: `apt-${Date.now()}`
    };
    appointments.unshift(newApt);
    this.setStored('appointments', appointments);
    return newApt;
  }

  updateAppointment(id: string, updates: Partial<Appointment>): Appointment {
    const appointments = this.getStored<Appointment[]>('appointments', INITIAL_APPOINTMENTS).map((a) =>
      a.id === id ? { ...a, ...updates } : a
    );
    this.setStored('appointments', appointments);
    return appointments.find((a) => a.id === id)!;
  }

  // --- Messages ---
  getMessages(requestId?: string): Message[] {
    let all = this.getStored<Message[]>('messages', INITIAL_MESSAGES);
    if (requestId) {
      all = all.filter((m) => m.request_id === requestId);
    }
    if (this.activeUser?.role === 'customer') {
      const allowedIds = this.getUserIdentifierSet(this.activeUser.id);
      all = all.filter(
        (m) => allowedIds.has(m.sender_id) || allowedIds.has(m.receiver_id)
      );
    } else if (this.activeUser?.role === 'technician') {
      const allowedTechIds = this.getTechnicianIdentifierSet(this.activeUser.id);
      all = all.filter(
        (m) =>
          allowedTechIds.has(m.sender_id) ||
          allowedTechIds.has(m.receiver_id)
      );
    }
    return all;
  }

  sendMessage(message: Omit<Message, 'id' | 'created_at' | 'read'>): Message {
    const messages = this.getStored<Message[]>('messages', INITIAL_MESSAGES);
    const newMsg: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      read: false,
      created_at: new Date().toISOString()
    };
    messages.push(newMsg);
    this.setStored('messages', messages);

    // Notify receiver
    this.addNotification({
      user_id: message.receiver_id,
      title: `New message from ${message.sender_name}`,
      message: message.content.length > 80 ? message.content.slice(0, 80) + '...' : message.content,
      type: 'message',
      link: '/messages'
    });

    return newMsg;
  }

  markMessagesAsRead(requestId: string, currentUserId: string) {
    const messages = this.getStored<Message[]>('messages', INITIAL_MESSAGES).map((m) =>
      m.request_id === requestId && m.receiver_id === currentUserId ? { ...m, read: true } : m
    );
    this.setStored('messages', messages);
  }

  // --- Notifications ---
  getNotifications(userId: string): NotificationItem[] {
    const allowedIds = this.getUserIdentifierSet(userId);
    return this.getStored<NotificationItem[]>('notifications', INITIAL_NOTIFICATIONS).filter(
      (n) => allowedIds.has(n.user_id)
    );
  }

  addNotification(notif: Omit<NotificationItem, 'id' | 'created_at' | 'read'>): NotificationItem {
    const all = this.getStored<NotificationItem[]>('notifications', INITIAL_NOTIFICATIONS);
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      read: false,
      created_at: new Date().toISOString()
    };
    all.unshift(newNotif);
    this.setStored('notifications', all);
    return newNotif;
  }

  markNotificationRead(id: string) {
    const all = this.getStored<NotificationItem[]>('notifications', INITIAL_NOTIFICATIONS).map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.setStored('notifications', all);
  }

  markAllNotificationsRead(userId: string) {
    const allowedIds = this.getUserIdentifierSet(userId);
    const all = this.getStored<NotificationItem[]>('notifications', INITIAL_NOTIFICATIONS).map((n) =>
      allowedIds.has(n.user_id) ? { ...n, read: true } : n
    );
    this.setStored('notifications', all);
  }

  // --- Invoices ---
  getInvoices(userId?: string): Invoice[] {
    const all = this.getStored<Invoice[]>('invoices', INITIAL_INVOICES);
    const targetUserId = userId || (this.activeUser?.role === 'customer' ? this.activeUser.id : undefined);
    if (targetUserId) {
      const allowedIds = this.getUserIdentifierSet(targetUserId);
      return all.filter((inv) => allowedIds.has(inv.user_id));
    }
    // Technicians cannot access general invoices
    if (this.activeUser?.role === 'technician') {
      return [];
    }
    return all;
  }

  getInvoiceById(id: string): Invoice | undefined {
    return this.getInvoices().find((i) => i.id === id || i.invoice_number === id);
  }

  createInvoice(inv: Omit<Invoice, 'id' | 'invoice_number' | 'created_at'>): Invoice {
    const invoices = this.getStored<Invoice[]>('invoices', INITIAL_INVOICES);
    const newInv: Invoice = {
      ...inv,
      id: `inv-${Date.now()}`,
      invoice_number: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: new Date().toISOString()
    };
    invoices.unshift(newInv);
    this.setStored('invoices', invoices);

    this.addNotification({
      user_id: inv.user_id,
      title: `Invoice Generated (${newInv.invoice_number})`,
      message: `An invoice for ₹${newInv.total.toFixed(2)} has been prepared for ${newInv.service_name}.`,
      type: 'invoice',
      link: '/invoices'
    });

    return newInv;
  }

  payInvoice(id: string): Invoice {
    const invoices = this.getStored<Invoice[]>('invoices', INITIAL_INVOICES).map((inv) =>
      inv.id === id ? { ...inv, status: 'paid' as const, paid_at: new Date().toISOString() } : inv
    );
    this.setStored('invoices', invoices);
    return this.getInvoiceById(id)!;
  }

  // --- Warranties ---
  getWarranties(userId?: string): Warranty[] {
    const all = this.getStored<Warranty[]>('warranties', INITIAL_WARRANTIES);
    const targetUserId = userId || (this.activeUser?.role === 'customer' ? this.activeUser.id : undefined);
    if (targetUserId) {
      const allowedIds = this.getUserIdentifierSet(targetUserId);
      return all.filter((w) => allowedIds.has(w.user_id));
    }
    return all;
  }

  // --- Reviews ---
  getReviews(serviceId?: string): Review[] {
    const all = this.getStored<Review[]>('reviews', INITIAL_REVIEWS);
    if (serviceId) {
      return all.filter((r) => r.service_id === serviceId);
    }
    return all;
  }

  addReview(review: Omit<Review, 'id' | 'created_at' | 'status'>): Review {
    const reviews = this.getReviews();
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString(),
      status: 'published'
    };
    reviews.unshift(newRev);
    this.setStored('reviews', reviews);
    return newRev;
  }

  updateReviewStatus(id: string, status: 'published' | 'under_review' | 'archived') {
    const reviews = this.getReviews().map((r) => (r.id === id ? { ...r, status } : r));
    this.setStored('reviews', reviews);
  }

  // --- Inventory ---
  getInventory(): InventoryItem[] {
    return this.getStored<InventoryItem[]>('inventory', INITIAL_INVENTORY);
  }

  getInventoryItemById(id: string): InventoryItem | undefined {
    return this.getInventory().find((i) => i.id === id);
  }

  addInventoryItem(item: Omit<InventoryItem, 'id' | 'status'>): InventoryItem {
    const items = this.getInventory();
    const status =
      item.stock_quantity === 0
        ? 'out_of_stock'
        : item.stock_quantity <= item.min_stock
        ? 'low_stock'
        : 'in_stock';
    const newItem: InventoryItem = {
      ...item,
      id: `inv-item-${Date.now()}`,
      status,
      last_restocked: new Date().toISOString().split('T')[0]
    };
    items.push(newItem);
    this.setStored('inventory', items);
    return newItem;
  }

  updateInventoryItem(id: string, updates: Partial<InventoryItem>): InventoryItem {
    const items = this.getInventory().map((i) => {
      if (i.id !== id) return i;
      const updated = { ...i, ...updates };
      const status =
        updated.stock_quantity === 0
          ? 'out_of_stock'
          : updated.stock_quantity <= updated.min_stock
          ? 'low_stock'
          : 'in_stock';
      return { ...updated, status };
    });
    this.setStored('inventory', items);
    return this.getInventoryItemById(id)!;
  }

  restockInventoryItem(id: string, quantityToAdd: number): InventoryItem {
    const item = this.getInventoryItemById(id);
    if (!item) throw new Error('Item not found');
    return this.updateInventoryItem(id, {
      stock_quantity: item.stock_quantity + quantityToAdd,
      last_restocked: new Date().toISOString().split('T')[0]
    });
  }

  updateInventoryStock(id: string, quantityToAdd: number): InventoryItem {
    return this.restockInventoryItem(id, quantityToAdd);
  }

  assignTechnician(requestId: string, technicianId: string, technicianName?: string) {
    const tech = this.getTechnicianById(technicianId);
    return this.updateRequestStatus(
      requestId,
      'Technician Assigned',
      `Assigned to technician ${technicianName || tech?.full_name || 'Staff Specialist'}`,
      'Admin Dispatch',
      'admin',
      { assignedTechnicianId: technicianId }
    );
  }

  // --- Executive Copilot Intelligence Queries ---
  getExecutiveQueries(): QueryExchange[] {
    const defaultQueries: QueryExchange[] = [
      {
        id: 'init-1',
        question: 'Executive Operational Briefing: Current Platform Status',
        answer: `### TechCare Executive Intelligence Briefing\n\n* **Active Pipeline:** **12 active work orders** currently in diagnostic, repair, and bench QA queues.\n* **Technician Fleet:** **6 certified specialists** on active rotation across Maharashtra service hubs.\n* **Financial Performance:** **₹3,45,850 gross revenue** with 94% client retention rate.\n* **Inventory Alert:** **3 critical hardware SKUs** flagged for restock replenishment.\n\nAll dispatch response times and service turnarounds are operating within green SLA tolerances.`,
        timestamp: 'Just now'
      }
    ];
    return this.getStored('executive_queries', defaultQueries);
  }

  addExecutiveQuery(query: QueryExchange): void {
    const list = this.getExecutiveQueries();
    this.setStored('executive_queries', [query, ...list]);
  }

  resetDemoData() {
    this.resetAllData();
  }

  resetAllData() {
    localStorage.clear();
    this.notifyListeners();
  }
}

export const store = new TechCareStore();
