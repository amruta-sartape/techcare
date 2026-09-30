import React, { useState } from 'react';
import {
  Laptop,
  CheckCircle2,
  Calendar,
  Clock,
  Upload,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Plus,
  FileText,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';
import { store } from '../../services/store';
import { Device, ServiceItem, UrgencyLevel } from '../../types';
import { TechCareAIAssistant } from '../ai/TechCareAIAssistant';

interface NewServiceRequestFlowProps {
  onCompleted: (requestId: string) => void;
  onCancel: () => void;
  preselectedServiceId?: string;
  prefilledProblem?: string;
}

export const NewServiceRequestFlow: React.FC<NewServiceRequestFlowProps> = ({
  onCompleted,
  onCancel,
  preselectedServiceId,
  prefilledProblem = ''
}) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [showAiHelper, setShowAiHelper] = useState(false);

  // Form State
  const devices = store.getDevices(user?.id);
  const services = store.getServices();

  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(devices[0]?.id || '');
  const [isAddingNewDevice, setIsAddingNewDevice] = useState<boolean>(devices.length === 0);
  const [newDeviceType, setNewDeviceType] = useState('Laptop');
  const [newDeviceBrand, setNewDeviceBrand] = useState('');
  const [newDeviceModel, setNewDeviceModel] = useState('');
  const [newDeviceSerial, setNewDeviceSerial] = useState('');

  const [selectedServiceId, setSelectedServiceId] = useState<string>(preselectedServiceId || services[0]?.id || '');
  const [problemDescription, setProblemDescription] = useState<string>(prefilledProblem);
  const [urgency, setUrgency] = useState<UrgencyLevel>('Medium');
  const [preferredDate, setPreferredDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<string>('09:00 AM - 12:00 PM');
  const [attachments, setAttachments] = useState<
    Array<{ fileName: string; fileUrl: string; fileSize: number; fileType: string }>
  >([]);
  const [customerPhone, setCustomerPhone] = useState<string>(user?.phone || '(415) 890-2134');
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File Upload Handling
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments = Array.from(files).map((file: File) => ({
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      fileSize: file.size,
      fileType: file.type || 'image/jpeg'
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
    success('Attachment uploaded', `${newAttachments.length} file(s) attached to intake.`);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Step 1: Device Validation & Save
  const handleStep1Next = () => {
    if (isAddingNewDevice) {
      if (!newDeviceBrand.trim() || !newDeviceModel.trim()) {
        error('Missing Information', 'Please enter brand and model for your device.');
        return;
      }
      const savedDevice = store.addDevice({
        user_id: user?.id || 'demo-user',
        device_type: newDeviceType,
        brand: newDeviceBrand.trim(),
        model: newDeviceModel.trim(),
        serial_number: newDeviceSerial.trim() || undefined,
        warranty_status: 'none'
      });
      setSelectedDeviceId(savedDevice.id);
      setIsAddingNewDevice(false);
    } else if (!selectedDeviceId) {
      error('Selection Required', 'Please choose an existing device or register a new one.');
      return;
    }
    setStep(2);
  };

  // Step 2: Service Selection Validation
  const handleStep2Next = () => {
    if (!selectedServiceId) {
      error('Service Required', 'Please select the service needed.');
      return;
    }
    setStep(3);
  };

  // Step 3: Issue Description Validation
  const handleStep3Next = () => {
    if (!problemDescription.trim() || problemDescription.length < 10) {
      error('Detailed Description Required', 'Please provide at least 10 characters describing the issue.');
      return;
    }
    setStep(4);
  };

  // Step 4: Schedule Validation
  const handleStep4Next = () => {
    if (!preferredDate) {
      error('Date Required', 'Please select a preferred service date.');
      return;
    }
    setStep(5);
  };

  // Final Submit
  const handleFinalSubmit = async () => {
    if (!agreedToTerms) {
      error('Terms Agreement Required', 'Please acknowledge the diagnostic and service authorization.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newReq = store.createServiceRequest({
        userId: user?.id || 'demo-user',
        customerName: user?.full_name || 'Valued Customer',
        customerEmail: user?.email || 'customer@example.com',
        customerPhone: customerPhone,
        deviceId: selectedDeviceId,
        serviceId: selectedServiceId,
        problemDescription: problemDescription,
        urgency: urgency,
        preferredDate: preferredDate,
        preferredTimeSlot: preferredTimeSlot,
        attachments: attachments
      });

      success('Service Request Dispatched', `Your ticket ${newReq.request_number} has been created and queued for technician dispatch.`);
      onCompleted(newReq.id);
    } catch (err) {
      console.error(err);
      error('Booking Error', 'Failed to create service request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedDevice = store.getDeviceById(selectedDeviceId);
  const selectedService = store.getServiceById(selectedServiceId);

  const stepsList = [
    { num: 1, label: 'Device Selection' },
    { num: 2, label: 'Service Category' },
    { num: 3, label: 'Issue & Attachments' },
    { num: 4, label: 'Schedule & Priority' },
    { num: 5, label: 'Review & Confirm' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Book IT &amp; Device Service</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Step {step} of 5: {stepsList[step - 1].label}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Progress Bar */}
        <div className="grid grid-cols-5 gap-2">
          {stepsList.map((s) => (
            <div key={s.num} className="space-y-1.5">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  s.num === step
                    ? 'bg-blue-600'
                    : s.num < step
                    ? 'bg-emerald-500'
                    : 'bg-slate-100'
                }`}
              />
              <span
                className={`hidden sm:block text-[11px] font-semibold truncate ${
                  s.num === step ? 'text-blue-600' : s.num < step ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: DEVICE SELECTION */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">Select or Register Device</h3>
            <p className="text-xs text-slate-500 mt-1">
              Choose an existing device from your fleet or add a new one for intake.
            </p>
          </div>

          {!isAddingNewDevice ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {devices.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDeviceId(d.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedDeviceId === d.id
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-100'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                          <Laptop className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{d.brand} {d.model}</p>
                          <p className="text-xs text-slate-500">{d.device_type} • SN: {d.serial_number || 'N/A'}</p>
                        </div>
                      </div>
                      {selectedDeviceId === d.id && (
                        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsAddingNewDevice(true)}
                className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Register Another Device
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Add New Device Profile</h4>
                {devices.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsAddingNewDevice(false)}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    Select existing instead
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Device Category *</label>
                  <select
                    value={newDeviceType}
                    onChange={(e) => setNewDeviceType(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                  >
                    <option value="Laptop">Laptop (Mac / PC / Chromebook)</option>
                    <option value="Desktop">Desktop / Workstation</option>
                    <option value="Mobile">Smartphone / iPhone / Android</option>
                    <option value="Tablet">Tablet / iPad</option>
                    <option value="Networking">Networking / Wi-Fi Router</option>
                    <option value="Server">Storage / Server</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Brand *</label>
                  <input
                    type="text"
                    placeholder="e.g. Apple, Dell, Lenovo, HP"
                    value={newDeviceBrand}
                    onChange={(e) => setNewDeviceBrand(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Model Name / Number *</label>
                  <input
                    type="text"
                    placeholder="e.g. MacBook Pro 16 M2 Max"
                    value={newDeviceModel}
                    onChange={(e) => setNewDeviceModel(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Serial Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. C02GK456MD6R"
                    value={newDeviceSerial}
                    onChange={(e) => setNewDeviceSerial(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleStep1Next}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-600/20"
            >
              Continue to Service Selection
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SERVICE SELECTION */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Select Service Required</h3>
              <p className="text-xs text-slate-500 mt-1">
                Choose the certified maintenance or repair category.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAiHelper(!showAiHelper)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{showAiHelper ? 'Hide AI Assistant' : 'Need help diagnosing?'}</span>
            </button>
          </div>

          {showAiHelper && (
            <div className="mb-4">
              <TechCareAIAssistant
                compact
                onBookRecommendedService={(srvName, prob) => {
                  const match = services.find((s) => s.name.toLowerCase().includes(srvName.toLowerCase()));
                  if (match) setSelectedServiceId(match.id);
                  if (prob) setProblemDescription(prob);
                  setShowAiHelper(false);
                  success('Service Pre-Selected', `Selected ${match?.name || srvName}`);
                }}
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedServiceId(s.id)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  selectedServiceId === s.id
                    ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-2 ring-blue-100'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {s.category}
                    </span>
                    <span className="text-xs font-bold text-slate-900">From ₹{s.starting_price.toLocaleString('en-IN')}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{s.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{s.description}</p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    Turnaround: {s.turnaround_time}
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    {s.warranty_duration_days}-day warranty
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              type="button"
              onClick={handleStep2Next}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-600/20"
            >
              Continue to Issue Description
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: ISSUE DESCRIPTION & ATTACHMENTS */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">Describe the Issue</h3>
            <p className="text-xs text-slate-500 mt-1">
              Provide symptoms, error codes, and upload diagnostic photos or video clips.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Detailed Problem Symptoms *
              </label>
              <textarea
                rows={4}
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="Please describe when the issue occurs, any error messages displayed, and any recent changes (drops, liquid spills, updates)..."
                className="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Minimum 10 characters ({problemDescription.length} entered)
              </p>
            </div>

            {/* Attachments Drag & Drop */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Diagnostic Photos, Screenshots or Videos (Optional)
              </label>
              <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/60 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-700">Click to upload or drag files here</span>
                <span className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, MP4, PDF up to 25MB each</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Uploaded items list */}
              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {attachments.map((att, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">{att.fileName}</span>
                        <span className="text-slate-400 text-[11px]">
                          ({Math.round(att.fileSize / 1024)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              type="button"
              onClick={handleStep3Next}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-600/20"
            >
              Continue to Scheduling
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SCHEDULE & URGENCY */}
      {step === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">Schedule &amp; Priority Level</h3>
            <p className="text-xs text-slate-500 mt-1">
              Select your preferred appointment window and urgency SLA.
            </p>
          </div>

          {/* Urgency Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Urgency Level</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['Low', 'Medium', 'High', 'Critical'] as UrgencyLevel[]).map((lvl) => (
                <div
                  key={lvl}
                  onClick={() => setUrgency(lvl)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer text-center transition-all ${
                    urgency === lvl
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-100'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900">{lvl}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {lvl === 'Critical'
                      ? 'Immediate Dispatch'
                      : lvl === 'High'
                      ? 'Same-Day Bench'
                      : lvl === 'Medium'
                      ? '24-Hour SLA'
                      : 'Flexible'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Date and Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preferred Service Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={preferredDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preferred Time Window
              </label>
              <select
                value={preferredTimeSlot}
                onChange={(e) => setPreferredTimeSlot(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
              >
                <option value="09:00 AM - 12:00 PM">Morning (09:00 AM - 12:00 PM)</option>
                <option value="01:00 PM - 04:00 PM">Afternoon (01:00 PM - 04:00 PM)</option>
                <option value="04:00 PM - 07:00 PM">Late Afternoon (04:00 PM - 07:00 PM)</option>
                <option value="Express Dispatch On-Demand">Express Immediate Bench Slot</option>
              </select>
            </div>
          </div>

          {/* Contact Confirmation */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Contact Phone for Technician Arrival Updates
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              type="button"
              onClick={handleStep4Next}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-600/20"
            >
              Review &amp; Confirm
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW & CONFIRM */}
      {step === 5 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">Review &amp; Confirm Intake</h3>
            <p className="text-xs text-slate-500 mt-1">
              Verify your service ticket details before dispatching to our technician queue.
            </p>
          </div>

          {/* Breakdown Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Device</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {selectedDevice?.brand} {selectedDevice?.model}
                </p>
                <p className="text-xs text-slate-500">{selectedDevice?.device_type} • SN: {selectedDevice?.serial_number || 'N/A'}</p>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Selected Service</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedService?.name}</p>
                <p className="text-xs text-slate-500">{selectedService?.turnaround_time} turnaround</p>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Appointment Window</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{preferredDate}</p>
                <p className="text-xs text-slate-500">{preferredTimeSlot}</p>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Urgency SLA</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{urgency} Priority</p>
                <p className="text-xs text-slate-500">Contact: {customerPhone}</p>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Problem Statement</span>
              <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 mt-1 leading-relaxed">
                {problemDescription}
              </p>
            </div>

            {/* Estimated Pricing and Warranty */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{selectedService?.warranty_duration_days || 90}-Day TechCare Hardware Shield Included</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Diagnostic lab baseline fee. No unexpected charges without customer pre-approval.
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs text-slate-500">Estimated Cost</span>
                <p className="text-2xl font-black text-slate-900">₹{(selectedService?.starting_price || 1499).toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* Terms checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs text-slate-600 leading-relaxed">
              I authorize TechCare certified technicians to perform diagnostic telemetry and hardware benchmarks on this device in accordance with the Service Terms and Privacy Policy.
            </span>
          </label>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              type="button"
              disabled={isSubmitting || !agreedToTerms}
              onClick={handleFinalSubmit}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs px-7 py-3.5 rounded-xl transition-all shadow-md shadow-emerald-600/20"
            >
              {isSubmitting ? 'Dispatching Request...' : 'Confirm & Dispatch Service Request'}
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
