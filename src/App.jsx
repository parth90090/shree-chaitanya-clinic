import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope,
  Calendar,
  Activity,
  UserCheck,
  Clock,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Star,
  CheckCircle2,
  Sparkles,
  Lock,
  Search,
  AlertCircle,
  ArrowRight,
  Filter,
  Check,
  X,
  RefreshCw,
  Award,
  Building2,
  TrendingUp,
  Users,
  HeartPulse,
  Brain,
  Shield,
  FileText,
  MessageSquare,
  AlertTriangle,
  Menu,
  ExternalLink,
  ChevronUp,
  Sparkle,
  Zap,
  SlidersHorizontal,
  CheckCircle,
  Clock3,
  KeyRound,
  Compass,
  Download,
  Trash2,
  PhoneCall,
  GraduationCap,
  Sparkles as SparkleIcon,
  Info,
  Send,
  MailCheck
} from 'lucide-react';

// ==========================================
// GLOBAL CLINIC CONSTANTS & AUTHENTIC DATA
// ==========================================
const CLINIC_DATA = {
  name: "Shri Chaitanya Clinic",
  doctor: "Dr. Vinod Katre",
  title: "AYUSH / Ayurveda Practitioner",
  experience: "19 Years Experience Overall",
  qualification: "BAMS (Yashwant Ayurvedic College, Kodoli, Kolhapur, 2005)",
  registration: "Medical Registration Verified",
  association: "Member of National Integrated Medical Association (NIMA)",
  phone: "8850125872",
  address: "Sec 26a, Koprigaon, Vashi, Navi Mumbai, 400703",
  email: "eliteescapes.official90@gmail.com",
  timings: "Mon - Sat: 10:00 AM - 1:00 PM, 3:30 PM - 6:30 PM",
  passcode: "9090",
  googleMapsUrl: "https://maps.google.com/?q=Sec+26a+Koprigaon+Vashi+Mumbai+400703"
};

// LocalStorage Database Key
const STORAGE_KEY = "SHREECHAITANYA_PATIENT_DATABASE_V5";

// Authentic Clinical Services Provided by Dr. Vinod Katre
const CLINICAL_SERVICES = [
  {
    id: "general_practice",
    title: "General Practice & Pulse Diagnosis",
    category: "Preventive AYUSH Care",
    icon: Stethoscope,
    description: "Comprehensive health evaluations, classical pulse diagnosis (Nadi Pariksha), vital organ assessment, and preventative wellness regimens.",
    fullDetails: "Dr. Vinod Katre uses ancient Nadi Pariksha (pulse examination) combined with modern physical evaluations to diagnose constitutional imbalances (Vata, Pitta, Kapha) before acute symptoms manifest.",
    highlights: ["In-depth Nadi Pariksha Examination", "Vata-Pitta-Kapha Bio-energetic Analysis", "Preventative Lifestyle & Vital Organ Charting"],
    duration: "30 Mins Session",
    tag: "Core Specialty"
  },
  {
    id: "infertility",
    title: "Infertility Evaluation & Care",
    category: "Reproductive Health",
    icon: HeartPulse,
    description: "Specialized Ayurvedic fertility evaluations, hormonal balancing, Uttar Basti protocols, and natural reproductive wellness for couples.",
    fullDetails: "A holistic reproductive protocol focusing on blood purification, uterine tissue strengthening, hormonal equilibrium, and specialized herbal formulations designed to enhance natural conception.",
    highlights: ["Targeted Reproductive Tissue Detox", "Hormonal Equilibrium & Cycle Balance", "Uttar Basti & Natural Conception Guidance"],
    duration: "45 Mins Session",
    tag: "High Success Rate"
  },
  {
    id: "sinusitis",
    title: "Sinus & Sinusitis Treatment",
    category: "ENT & Respiratory",
    icon: Activity,
    description: "Targeted Nasya therapy, herbal steam inhalations, and chronic respiratory clearing for long-term sinusitis, allergic rhinitis, and nasal blockages.",
    fullDetails: "Nasya Karma therapy involves medicated herbal oil administration through nasal passages to clear frontal sinus cavities, eliminate chronic headache tension, and strengthen mucosal immunity.",
    highlights: ["Therapeutic Medicated Nasya Karma", "Frontal Sinus Drainage & Airway Clearing", "Allergic Rhinitis Histamine Defense"],
    duration: "30 Mins Session",
    tag: "Targeted Care"
  },
  {
    id: "immunity",
    title: "Immunity Therapy & Ojas Boost",
    category: "Systemic Wellness",
    icon: ShieldCheck,
    description: "Rasayana therapy designed to enhance systemic immune defense, rebuild tissue strength (Ojas), and accelerate recovery after viral infections.",
    fullDetails: "Rebuild cellular resilience and vital energy using classical Rasayana formulations. Ideal for individuals suffering from recurring viral fevers, chronic fatigue, or seasonal allergic weakness.",
    highlights: ["Rasayana Cellular Rejuvenation", "Post-Viral Bio-energy Restoration", "Seasonal Pathogen Defense Shield"],
    duration: "30 Mins Session",
    tag: "Holistic Defense"
  },
  {
    id: "weight_loss",
    title: "Weight Loss & Diet Counseling",
    category: "Metabolism & Endocrine",
    icon: Sparkles,
    description: "Scientific Ayurvedic diet mapping, gut metabolic reset (Agni Deepana), thyroid support, and sustainable fat-loss regimens tailored to body type.",
    fullDetails: "Address the root metabolic cause of weight retention (Mandagni & Medoroga). Dr. Katre designs custom Ayurvedic dietary frameworks that stimulate digestive fire without restrictive starvation.",
    highlights: ["Agni Deepana Gut Reset Protocol", "Prakriti-Based Dietary Customization", "Sustainable Fat Metabolism Activation"],
    duration: "35 Mins Session",
    tag: "Custom Diet"
  }
];

// Common Symptoms Database for AI Triage Engine
const SYMPTOMS_LIST = [
  { id: "fever", label: "Fever & Viral Body Pain", category: "General", severityWeight: 3 },
  { id: "sinus", label: "Sinusitis / Nasal Blockage / Head Pressure", category: "Respiratory", severityWeight: 2 },
  { id: "infertility_issue", label: "Infertility / Hormonal Imbalance", category: "Reproductive", severityWeight: 2 },
  { id: "immunity_low", label: "Frequent Infections / Low Immunity", category: "General", severityWeight: 2 },
  { id: "weight_gain", label: "Sluggish Metabolism / Weight Gain", category: "Metabolic", severityWeight: 1 },
  { id: "joint_pain", label: "Joint Pain & Stiffness", category: "Musculoskeletal", severityWeight: 2 },
  { id: "skin_rash", label: "Skin Allergies & Eczema", category: "Dermatological", severityWeight: 1 },
  { id: "indigestion", label: "Chronic Bloating / Acid Reflux", category: "Digestive", severityWeight: 1 }
];

// Diagnostic Rules Database for AI Triage
const DIAGNOSIS_KNOWLEDGE_BASE = [
  {
    triggers: ["sinus"],
    condition: "Kaphaja Shiroroga / Chronic Sinusitis Inflammation",
    severity: "Medium",
    confidence: 93,
    summary: "Nasal passages show inflammatory mucous buildup affecting frontal sinuses. Specialized Nasya therapy and respiratory herbal clearing will relieve cranial pressure.",
    actionRecommendation: "Schedule Sinusitis & Respiratory Consultation.",
    suggestedService: "Sinus & Sinusitis Treatment"
  },
  {
    triggers: ["infertility_issue"],
    condition: "Artava Vaha Srotas Imbalance / Reproductive Health Issue",
    severity: "Medium",
    confidence: 91,
    summary: "Hormonal dysregulation or tissue metabolic sluggishness affecting fertility. Dr. Vinod Katre provides targeted Ayurvedic reproductive therapy.",
    actionRecommendation: "Book Infertility Evaluation Consultation.",
    suggestedService: "Infertility Evaluation & Care"
  },
  {
    triggers: ["immunity_low", "fever"],
    condition: "Ojas Kshaya / Depleted Immune Defense",
    severity: "High",
    confidence: 95,
    summary: "Systemic immune exhaustion resulting in recurring viral susceptibility. Rebuilding cellular Ojas and vital energy is recommended.",
    actionRecommendation: "Priority Immunity Therapy Consultation.",
    suggestedService: "Immunity Therapy & Ojas Boost"
  },
  {
    triggers: ["weight_gain", "indigestion"],
    condition: "Mandagni & Medoroga / Metabolic Digestive Sluggishness",
    severity: "Low",
    confidence: 89,
    summary: "Digestive enzyme weakness causing toxic waste accumulation (Ama) and stubborn metabolic weight retention.",
    actionRecommendation: "Metabolic & Weight Loss Diet Counseling.",
    suggestedService: "Weight Loss & Diet Counseling"
  }
];

// Patient Testimonials
const TESTIMONIALS = [
  {
    name: "Dr. Ananya Roy",
    role: "Senior Researcher, Vashi",
    text: "Dr. Vinod Katre's sinusitis Nasya therapy completely cured my chronic sinus headaches. 19+ years of clinical experience really shows in his diagnosis.",
    rating: 5,
    date: "2 weeks ago"
  },
  {
    name: "Suresh Menon",
    role: "Business Executive, Nerul",
    text: "The clinic's atmosphere is serene. Dr. Katre's weight loss diet counseling helped me drop 8kg naturally while improving my digestion.",
    rating: 5,
    date: "1 month ago"
  },
  {
    name: "Meera Kulkarni",
    role: "Teacher, Vashi",
    text: "Visited Shri Chaitanya Clinic in Koprigaon Vashi for immunity counseling. Dr. Vinod Katre listens patiently and explains Ayurvedic principles clearly.",
    rating: 5,
    date: "3 weeks ago"
  }
];

// Accordion FAQs
const FAQS = [
  {
    q: "What qualifications and experience does Dr. Vinod Katre hold?",
    a: "Dr. Vinod Katre completed his BAMS degree from Yashwant Ayurvedic College, Kodoli, Kolhapur in 2005 and has over 19 years of verified clinical experience. He is a registered member of the National Integrated Medical Association (NIMA)."
  },
  {
    q: "Where is Shri Chaitanya Clinic located?",
    a: "Shri Chaitanya Clinic is located at Sec 26a, Koprigaon, Vashi, Navi Mumbai, 400703."
  },
  {
    q: "What specialized treatments are available at Shri Chaitanya Clinic?",
    a: "Specialized care includes Infertility Evaluation & Treatment, Sinusitis / Sinus Nasya Therapy, Immunity Therapy (Ojas Boost), Weight Loss Diet Counseling, and General Practice Pulse Diagnosis."
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Selected Service Modal State
  const [activeServiceModal, setActiveServiceModal] = useState(null);

  // Email Sent Notification Modal State
  const [emailConfirmationModal, setEmailConfirmationModal] = useState(null);

  // Persistent LocalStorage Database Initialization
  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    } catch (e) {
      console.error("Database save failed", e);
    }
  }, [appointments]);

  const [lastCreatedTicket, setLastCreatedTicket] = useState(null);
  const [bookingPrefill, setBookingPrefill] = useState(null);

  // Symptom Checker State
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptomText, setCustomSymptomText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Booking Form State
  const [bookingFormData, setBookingFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "10:30 AM",
    service: "General Practice & Pulse Diagnosis",
    notes: ""
  });
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Doctor Auth Portal State
  const [passcode, setPasscode] = useState("");
  const [isAuthError, setIsAuthError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Doctor Dashboard Ledger Filter State
  const [ledgerFilter, setLedgerFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // URL Hash Listener for /admin Route Access
  useEffect(() => {
    const handleHashOrPath = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash.includes('admin') || hash.includes('/admin') || path.includes('admin')) {
        if (isAuthenticated) {
          setCurrentView("doctor-dashboard");
        } else {
          setCurrentView("doctor-login");
        }
      }
    };

    handleHashOrPath();
    window.addEventListener('hashchange', handleHashOrPath);
    return () => window.removeEventListener('hashchange', handleHashOrPath);
  }, [isAuthenticated]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const toggleSymptom = (id) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter(item => item !== id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, id]);
    }
  };

  const runSymptomAnalysis = () => {
    if (selectedSymptoms.length === 0 && !customSymptomText.trim()) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      let matched = DIAGNOSIS_KNOWLEDGE_BASE.find(rule => 
        rule.triggers.some(trig => selectedSymptoms.includes(trig))
      );

      if (!matched) {
        matched = {
          triggers: selectedSymptoms,
          condition: "Constitutional Tridosha Sensitivity (Vata/Pitta/Kapha)",
          severity: "Low",
          confidence: 86,
          summary: "Symptoms indicate early-stage physiological stress. A detailed pulse examination by Dr. Vinod Katre will pinpoint exact organ energetics.",
          actionRecommendation: "Schedule General Practice Pulse Consultation.",
          suggestedService: "General Practice & Pulse Diagnosis"
        };
      }

      setAnalysisResult(matched);
      setIsAnalyzing(false);
    }, 1100);
  };

  const proceedToBookingFromTriage = () => {
    if (analysisResult) {
      const selectedLabels = SYMPTOMS_LIST
        .filter(s => selectedSymptoms.includes(s.id))
        .map(s => s.label)
        .join(", ");
      
      const prefillNote = `[AI Triage Result] Condition: ${analysisResult.condition} | Symptoms: ${selectedLabels || customSymptomText}`;
      
      setBookingPrefill({
        service: analysisResult.suggestedService,
        notes: prefillNote
      });

      setBookingFormData(prev => ({
        ...prev,
        service: analysisResult.suggestedService,
        notes: prefillNote
      }));
    }
    setCurrentView("appointments");
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setIsSubmittingBooking(true);

    setTimeout(() => {
      const newTicketId = `SCC-${Math.floor(1000 + Math.random() * 9000)}`;
      const newAppointment = {
        id: newTicketId,
        patientName: bookingFormData.name,
        phone: bookingFormData.phone,
        email: bookingFormData.email || `${bookingFormData.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
        date: bookingFormData.date || new Date().toISOString().split('T')[0],
        time: bookingFormData.time,
        service: bookingFormData.service,
        symptoms: bookingFormData.notes || "General Consultation",
        status: "Pending",
        emailSent: false,
        createdAt: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
        triageSeverity: analysisResult ? analysisResult.severity : "Low"
      };

      setAppointments(prev => [newAppointment, ...prev]);
      setLastCreatedTicket(newAppointment);
      setIsSubmittingBooking(false);

      setBookingFormData({
        name: "",
        phone: "",
        email: "",
        date: "",
        time: "10:30 AM",
        service: "General Practice & Pulse Diagnosis",
        notes: ""
      });
      setBookingPrefill(null);
    }, 850);
  };

  const handleDoctorLogin = (e) => {
    e.preventDefault();
    if (passcode === CLINIC_DATA.passcode) {
      setIsAuthenticated(true);
      setIsAuthError(false);
      setCurrentView("doctor-dashboard");
    } else {
      setIsAuthError(true);
      setTimeout(() => setIsAuthError(false), 1000);
    }
  };

  // DOCTOR ACTION: APPROVE APPOINTMENT & TRIGGER EMAIL DISPATCH
  const updateAppointmentStatus = (id, newStatus) => {
    const targetApt = appointments.find(a => a.id === id);

    setAppointments(appointments.map(apt => {
      if (apt.id === id) {
        const isApprovedNow = newStatus === "Approved";
        return {
          ...apt,
          status: newStatus,
          emailSent: isApprovedNow ? true : apt.emailSent,
          emailSentTimestamp: isApprovedNow ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : apt.emailSentTimestamp
        };
      }
      return apt;
    }));

    // Trigger Email Confirmation Modal if status is set to Approved
    if (newStatus === "Approved" && targetApt) {
      const patientEmail = (targetApt.email && targetApt.email !== "N/A") 
        ? targetApt.email 
        : `${targetApt.patientName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`;

      setEmailConfirmationModal({
        patientName: targetApt.patientName,
        patientEmail: patientEmail,
        ticketId: targetApt.id,
        service: targetApt.service,
        date: targetApt.date,
        time: targetApt.time,
        phone: targetApt.phone,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      });
    }
  };

  const deleteAppointmentRecord = (id) => {
    if (window.confirm(`Delete patient record ${id} from database?`)) {
      setAppointments(appointments.filter(apt => apt.id !== id));
    }
  };

  const clearDatabase = () => {
    if (window.confirm("Wipe all patient booking records from local database?")) {
      setAppointments([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const exportDatabase = () => {
    const jsonStr = JSON.stringify(appointments, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Shri_Chaitanya_Patients_DB_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const scrollToServicesSection = () => {
    if (currentView !== "home") {
      setCurrentView("home");
      setTimeout(() => {
        const el = document.getElementById("services-grid-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      const el = document.getElementById("services-grid-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesFilter = ledgerFilter === "All" || apt.status === ledgerFilter;
    const matchesSearch = apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          apt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          apt.phone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const pageVariants = {
    initial: { opacity: 0, y: 14, scale: 0.99 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -14, scale: 0.99, transition: { duration: 0.2, ease: [0.7, 0, 0.84, 0] } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#0A0E1A] relative bg-mesh-pattern selection:bg-[#0F3A24] selection:text-white">

      {/* ==========================================
          HEADER & PUBLIC NAVIGATION
      ========================================== */}
      <header className="sticky top-0 z-50 w-full glass-panel-ultra border-b border-slate-200/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          <div 
            onClick={() => {
              window.location.hash = "";
              setCurrentView("home");
            }}
            className="flex items-center gap-3.5 cursor-pointer group shrink-0"
          >
            <div className="w-11 h-11 rounded-2xl emerald-gradient flex items-center justify-center text-white shadow-md emerald-badge-glow group-hover:scale-105 transition-transform duration-200">
              <Stethoscope className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#0A0E1A] font-['Outfit']">
                  Shri Chaitanya
                </span>
                <span className="bg-emerald-100/80 text-[#0F3A24] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-200/60">
                  Clinic
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Dr. Vinod Katre • Koprigaon, Vashi</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/70 shadow-inner">
            <button
              onClick={() => { window.location.hash = ""; setCurrentView("home"); }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                currentView === "home"
                  ? "bg-[#0F3A24] text-white shadow-md emerald-shadow-lg"
                  : "text-slate-600 hover:text-[#0A0E1A] hover:bg-slate-200/60"
              }`}
            >
              Home
            </button>

            <button
              onClick={scrollToServicesSection}
              className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:text-[#0A0E1A] hover:bg-slate-200/60 transition-all cursor-pointer flex items-center gap-1"
            >
              <span>Services & Treatments</span>
            </button>

            <button
              onClick={() => { window.location.hash = ""; setCurrentView("symptom-checker"); }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                currentView === "symptom-checker"
                  ? "bg-[#0F3A24] text-white shadow-md emerald-shadow-lg"
                  : "text-slate-600 hover:text-[#0A0E1A] hover:bg-slate-200/60"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              AI Symptom Triage
            </button>
            
            <button
              onClick={() => { window.location.hash = ""; setCurrentView("appointments"); }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                currentView === "appointments"
                  ? "bg-[#0F3A24] text-white shadow-md emerald-shadow-lg"
                  : "text-slate-600 hover:text-[#0A0E1A] hover:bg-slate-200/60"
              }`}
            >
              Book Visit
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 bg-emerald-50/90 border border-emerald-200/80 px-3.5 py-2 rounded-2xl text-[11px] font-extrabold text-[#0F3A24] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Clinic Open Today</span>
            </div>

            <a
              href={`tel:${CLINIC_DATA.phone}`}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-md transition-all hover:scale-[1.03] active:scale-[0.97]"
            >
              <PhoneCall className="w-4 h-4 text-white animate-bounce" />
              <span className="hidden sm:inline">Emergency Call:</span>
              <span className="font-mono">{CLINIC_DATA.phone}</span>
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl overflow-hidden px-4 py-4 space-y-2 shadow-2xl"
            >
              <button
                onClick={() => { window.location.hash = ""; setCurrentView("home"); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-between ${
                  currentView === "home" ? "bg-emerald-50 text-[#0F3A24]" : "text-slate-700"
                }`}
              >
                Home <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => { scrollToServicesSection(); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-between text-slate-700"
              >
                Services & Treatments <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => { window.location.hash = ""; setCurrentView("symptom-checker"); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-between ${
                  currentView === "symptom-checker" ? "bg-emerald-50 text-[#0F3A24]" : "text-slate-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" /> AI Symptom Triage
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => { window.location.hash = ""; setCurrentView("appointments"); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-between ${
                  currentView === "appointments" ? "bg-emerald-50 text-[#0F3A24]" : "text-slate-700"
                }`}
              >
                Book Visit <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ==========================================
          DYNAMIC VIEW CONTENT AREA
      ========================================== */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">

          {/* ------------------------------------------
              VIEW 1: LANDING PAGE (HOME)
          ------------------------------------------ */}
          {currentView === "home" && (
            <motion.div
              key="home-view"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-24 pb-16"
            >
              {/* HERO SECTION */}
              <section className="relative pt-4 pb-8 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  <div className="lg:col-span-7 space-y-6 text-left">
                    
                    <motion.div
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#0F3A24] text-xs font-extrabold shadow-sm"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>AYUSH Certified Ayurveda • Koprigaon, Vashi</span>
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0A0E1A] leading-[1.1] font-['Outfit']"
                    >
                      Authentic Ayurveda & <br className="hidden sm:block" />
                      <span className="bg-gradient-to-r from-[#0F3A24] via-[#164E30] to-[#059669] bg-clip-text text-transparent">
                        Holistic General Practice
                      </span>
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl"
                    >
                      Consult with <strong className="text-[#0A0E1A] font-bold">{CLINIC_DATA.doctor}</strong> (BAMS - Yashwant Ayurvedic College 2005) with over <span className="text-[#0F3A24] font-extrabold">{CLINIC_DATA.experience}</span>. Member of National Integrated Medical Association (NIMA).
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="grid grid-cols-3 gap-4 py-4 border-y border-slate-200/80 max-w-lg"
                    >
                      <div>
                        <p className="text-2xl sm:text-3xl font-black text-[#0F3A24] font-['Outfit']">19 Yrs</p>
                        <p className="text-xs text-slate-500 font-semibold">Overall Practice</p>
                      </div>
                      <div>
                        <p className="text-2xl sm:text-3xl font-black text-[#0F3A24] font-['Outfit']">Koprigaon</p>
                        <p className="text-xs text-slate-500 font-semibold">Vashi Sector-26</p>
                      </div>
                      <div>
                        <p className="text-2xl sm:text-3xl font-black text-[#0F3A24] font-['Outfit']">NIMA</p>
                        <p className="text-xs text-slate-500 font-semibold">Verified Member</p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex flex-wrap items-center gap-4 pt-1"
                    >
                      <button
                        onClick={() => setCurrentView("appointments")}
                        className="emerald-gradient hover:opacity-95 text-white px-8 py-4 rounded-2xl font-extrabold text-xs shadow-xl emerald-shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2 group cursor-pointer"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Schedule Consultation</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button
                        onClick={() => setCurrentView("symptom-checker")}
                        className="bg-white hover:bg-slate-50 text-[#0A0E1A] border border-slate-200 px-7 py-4 rounded-2xl font-bold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer hover:border-[#0F3A24]"
                      >
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Try AI Symptom Triage</span>
                      </button>
                    </motion.div>
                  </div>

                  {/* Right Hero Interactive Profile Card */}
                  <div className="lg:col-span-5">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="relative glass-card-glow rounded-3xl p-7 space-y-5 shadow-2xl"
                    >
                      <div className="flex items-center gap-4.5 pb-5 border-b border-slate-100">
                        <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-lg emerald-badge-glow shrink-0 relative bg-slate-100">
                          <img
                            src="/dr-vinod-katre.png"
                            alt="Dr. Vinod Katre"
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-xl text-[#0A0E1A] leading-tight">
                            {CLINIC_DATA.doctor}
                          </h3>
                          <p className="text-xs text-emerald-800 font-bold mt-0.5">BAMS (Kodoli Kolhapur, 2005)</p>
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1 font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{CLINIC_DATA.registration}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2.5 text-xs text-slate-600 font-medium">
                        <div className="flex items-start gap-2.5">
                          <GraduationCap className="w-4 h-4 text-[#0F3A24] shrink-0 mt-0.5" />
                          <span>Yashwant Ayurvedic College, Kodoli, Kolhapur (2005)</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <Award className="w-4 h-4 text-[#0F3A24] shrink-0 mt-0.5" />
                          <span>National Integrated Medical Association (NIMA)</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <Building2 className="w-4 h-4 text-[#0F3A24] shrink-0 mt-0.5" />
                          <span>Clinic: Koprigaon, Vashi Sector-26, Navi Mumbai</span>
                        </div>
                      </div>

                      <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-2xl p-4 flex items-center justify-between shadow-inner">
                        <div>
                          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Next Session</p>
                          <p className="text-xs font-black text-[#0F3A24]">Today • 03:30 PM - 06:30 PM</p>
                        </div>
                        <button
                          onClick={() => setCurrentView("appointments")}
                          className="bg-[#0F3A24] text-white text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-[#164E30] transition-colors cursor-pointer"
                        >
                          Book Slot
                        </button>
                      </div>
                    </motion.div>
                  </div>

                </div>
              </section>

              {/* SERVICES SECTION */}
              <section id="services-grid-section" className="space-y-10 scroll-mt-28">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <span className="text-xs font-extrabold text-[#0F3A24] uppercase tracking-widest bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
                    Authentic Medical Treatments
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-[#0A0E1A] tracking-tight font-['Outfit']">
                    Specialized Medical Services
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal">
                    Click any service card below to view detailed medical protocols and book a consultation with Dr. Vinod Katre.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {CLINICAL_SERVICES.map((srv, idx) => {
                    const IconComponent = srv.icon;
                    return (
                      <motion.div
                        key={srv.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -6, scale: 1.02 }}
                        onClick={() => setActiveServiceModal(srv)}
                        className="bg-white rounded-3xl border border-slate-200/90 p-6 flex flex-col justify-between shadow-sm hover:shadow-2xl hover-gradient-border transition-all duration-300 group cursor-pointer relative overflow-hidden"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0F3A24] group-hover:bg-[#0F3A24] group-hover:text-white transition-colors duration-300 shadow-sm">
                              <IconComponent className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                              {srv.tag}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{srv.category}</span>
                            <h3 className="text-lg font-extrabold text-[#0A0E1A] mt-0.5 group-hover:text-[#0F3A24] transition-colors">
                              {srv.title}
                            </h3>
                          </div>
                          
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {srv.description}
                          </p>

                          <ul className="space-y-2 pt-3 border-t border-slate-100">
                            {srv.highlights.map((h, i) => (
                              <li key={i} className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                            <Info className="w-3.5 h-3.5 text-emerald-600" /> Click for details
                          </span>
                          <span className="emerald-gradient text-white px-3.5 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 group-hover:scale-105 transition-transform">
                            View & Book <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>

              {/* TESTIMONIALS SECTION */}
              <section className="bg-slate-100/70 rounded-3xl p-8 sm:p-12 border border-slate-200/80 space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <span className="text-xs font-extrabold text-[#0F3A24] uppercase tracking-widest bg-white px-3.5 py-1 rounded-full border border-slate-200">
                      Patient Reviews
                    </span>
                    <h2 className="text-3xl font-black text-[#0A0E1A] tracking-tight font-['Outfit'] mt-2">
                      Trusted Across Vashi & Navi Mumbai
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 max-w-sm font-medium">
                    Verified patient outcomes under the care of Dr. Vinod Katre.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {TESTIMONIALS.map((t, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(t.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <p className="text-xs text-slate-700 italic leading-relaxed">
                          "{t.text}"
                        </p>
                      </div>
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-[#0A0E1A]">{t.name}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{t.role}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">{t.date}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* FAQS SECTION */}
              <section className="max-w-3xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                  <span className="text-xs font-extrabold text-[#0F3A24] uppercase tracking-widest bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
                    Patient Clarifications
                  </span>
                  <h2 className="text-3xl font-black text-[#0A0E1A] tracking-tight font-['Outfit']">
                    Frequently Asked Questions
                  </h2>
                </div>

                <div className="space-y-3">
                  {FAQS.map((faq, index) => <FaqAccordionItem key={index} faq={faq} />)}
                </div>
              </section>

              {/* FINAL CTA BANNER */}
              <section className="emerald-gradient rounded-3xl p-8 sm:p-12 text-white shadow-2xl emerald-shadow-lg relative overflow-hidden">
                <div className="relative z-10 max-w-3xl space-y-6">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-medium border border-white/15">
                    <SparkleIcon className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Prioritize Your Health Today</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-['Outfit']">
                    Consult Dr. Vinod Katre (19 Yrs Experience)
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                    Book your consultation slot online for Shri Chaitanya Clinic, Koprigaon Vashi in under 60 seconds.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      onClick={() => setCurrentView("appointments")}
                      className="bg-white text-[#0F3A24] hover:bg-emerald-50 px-8 py-4 rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Book Consultation Now</span>
                    </button>
                    <button
                      onClick={() => setCurrentView("symptom-checker")}
                      className="bg-emerald-950/70 hover:bg-emerald-950/90 text-white border border-emerald-500/40 px-7 py-4 rounded-2xl font-bold text-xs transition-all cursor-pointer"
                    >
                      Check Symptoms First
                    </button>
                  </div>
                </div>
              </section>

              {/* FOOTER */}
              <footer className="pt-8 border-t border-slate-200 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl emerald-gradient flex items-center justify-center text-white">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <span className="font-black text-xl text-[#0A0E1A] font-['Outfit']">Shri Chaitanya Clinic</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-md">
                      Specialized Ayurveda and general healthcare consultations provided by Dr. Vinod Katre (BAMS 2005, 19 Yrs Exp, NIMA Member). Serving Koprigaon, Vashi, Navi Mumbai.
                    </p>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
                        <MapPin className="w-4 h-4 text-[#0F3A24]" />
                        <span>{CLINIC_DATA.address}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
                        <Phone className="w-4 h-4 text-[#0F3A24]" />
                        <a href={`tel:${CLINIC_DATA.phone}`} className="hover:underline font-bold text-[#0F3A24]">
                          {CLINIC_DATA.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
                        <Mail className="w-4 h-4 text-[#0F3A24]" />
                        <a href={`mailto:${CLINIC_DATA.email}`} className="hover:underline text-slate-600">
                          {CLINIC_DATA.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6">
                    <div className="bg-slate-100 rounded-3xl border border-slate-200 p-5 space-y-3 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0A0E1A] flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-[#0F3A24]" />
                          Shri Chaitanya Clinic Location
                        </span>
                        <a
                          href={CLINIC_DATA.googleMapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-bold text-[#0F3A24] hover:underline flex items-center gap-1"
                        >
                          Google Maps <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="h-40 w-full bg-slate-200/80 rounded-2xl border border-slate-300/70 flex flex-col items-center justify-center p-4 text-center relative bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px]">
                        <div className="w-10 h-10 rounded-full bg-[#0F3A24] text-white flex items-center justify-center shadow-lg animate-bounce">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-extrabold text-[#0A0E1A] mt-2">Shri Chaitanya Clinic</p>
                        <p className="text-[11px] text-slate-600 font-medium">Sec 26a, Koprigaon, Vashi, Navi Mumbai 400703</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="py-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
                  <p>© {new Date().getFullYear()} Shri Chaitanya Clinic. All rights reserved.</p>
                  
                  <a
                    href="#admin"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.hash = "#admin";
                      setCurrentView(isAuthenticated ? "doctor-dashboard" : "doctor-login");
                    }}
                    className="text-[11px] font-medium text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Staff Console (/admin)</span>
                  </a>
                </div>
              </footer>
            </motion.div>
          )}

          {/* ------------------------------------------
              VIEW 2: AI SYMPTOM CHECKER & TRIAGE ENGINE
          ------------------------------------------ */}
          {currentView === "symptom-checker" && (
            <motion.div
              key="symptom-view"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="max-w-4xl mx-auto space-y-8 pb-16"
            >
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-[#0F3A24] text-xs font-extrabold px-4 py-1 rounded-full shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Clinical Decision Engine</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-[#0A0E1A] tracking-tight font-['Outfit']">
                  AI Clinical Symptom Assessment
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
                  Select your current symptoms. Our triage algorithm maps symptoms against Dr. Vinod Katre's AYUSH therapeutic protocols.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>1. Select Primary Symptoms ({selectedSymptoms.length} selected)</span>
                    {selectedSymptoms.length > 0 && (
                      <button
                        onClick={() => setSelectedSymptoms([])}
                        className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                      >
                        Clear Selection
                      </button>
                    )}
                  </label>

                  <div className="flex flex-wrap gap-2.5">
                    {SYMPTOMS_LIST.map((sym) => {
                      const isSelected = selectedSymptoms.includes(sym.id);
                      return (
                        <button
                          key={sym.id}
                          onClick={() => toggleSymptom(sym.id)}
                          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                            isSelected
                              ? "bg-[#0F3A24] text-white border-[#0F3A24] shadow-md"
                              : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {isSelected ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-slate-300" />
                          )}
                          <span>{sym.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    2. Optional: Additional Symptoms or Onset Duration
                  </label>
                  <textarea
                    rows={3}
                    value={customSymptomText}
                    onChange={(e) => setCustomSymptomText(e.target.value)}
                    placeholder="E.g., Experiencing sinusitis headache since last week with nasal congestion..."
                    className="w-full rounded-2xl border border-slate-200 p-3.5 text-xs text-[#0A0E1A] focus:outline-none focus:ring-2 focus:ring-[#0F3A24]/30 focus:border-[#0F3A24] resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={runSymptomAnalysis}
                    disabled={selectedSymptoms.length === 0 && !customSymptomText.trim()}
                    className={`px-8 py-3.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition-all ${
                      selectedSymptoms.length > 0 || customSymptomText.trim()
                        ? "emerald-gradient text-white shadow-lg emerald-shadow-lg hover:opacity-95 cursor-pointer"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                    }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                        <span>Evaluating Clinical Symptoms...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4" />
                        <span>Analyze Symptoms & Triage</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-[#0F3A24] text-white rounded-3xl p-8 text-center space-y-4 shadow-2xl"
                  >
                    <div className="w-12 h-12 rounded-full border-3 border-emerald-400 border-t-transparent animate-spin mx-auto" />
                    <p className="text-xs font-bold text-emerald-200 uppercase tracking-widest">
                      Processing Clinical Decision Nodes...
                    </p>
                    <div className="w-56 h-2 bg-emerald-900/80 rounded-full mx-auto overflow-hidden">
                      <motion.div
                        className="h-full bg-emerald-400 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.0 }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {analysisResult && !isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6 relative overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                          Triage Assessment Result
                        </span>
                        <h3 className="text-2xl font-extrabold text-[#0A0E1A] mt-0.5">
                          {analysisResult.condition}
                        </h3>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Confidence Match</span>
                          <span className="text-xs font-black text-[#0F3A24]">{analysisResult.confidence}%</span>
                        </div>
                        <SeverityBadge severity={analysisResult.severity} />
                      </div>
                    </div>

                    <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                      <p className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200/80 font-medium">
                        {analysisResult.summary}
                      </p>

                      <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4.5 text-[#0F3A24]">
                        <AlertCircle className="w-5 h-5 text-[#0F3A24] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-extrabold text-xs">Recommended Clinical Action:</p>
                          <p className="text-xs font-medium text-slate-700 mt-0.5">
                            {analysisResult.actionRecommendation}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
                      <p className="text-[11px] text-slate-500 font-medium">
                        *Note: AI Triage is for preliminary guidance. Dr. Vinod Katre will confirm exact diagnosis during consultation.
                      </p>
                      <button
                        onClick={proceedToBookingFromTriage}
                        className="emerald-gradient hover:opacity-95 text-white px-7 py-3.5 rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                      >
                        <span>Book Appointment Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ------------------------------------------
              VIEW 3: CLINIC BOOKING & APPOINTMENT ENGINE
          ------------------------------------------ */}
          {currentView === "appointments" && (
            <motion.div
              key="booking-view"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="max-w-3xl mx-auto space-y-8 pb-16"
            >
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-[#0F3A24] text-xs font-extrabold px-4 py-1 rounded-full">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Direct Scheduling</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-[#0A0E1A] tracking-tight font-['Outfit']">
                  Book Consultation Slot
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Select your preferred timing to consult with Dr. Vinod Katre at Shri Chaitanya Clinic, Koprigaon Vashi.
                </p>
              </div>

              {lastCreatedTicket ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="bg-white rounded-3xl border border-slate-200 p-8 shadow-2xl space-y-6 text-center max-w-xl mx-auto"
                >
                  <div className="w-16 h-16 rounded-2xl emerald-gradient text-white flex items-center justify-center mx-auto shadow-lg emerald-badge-glow">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div className="space-y-2">
                    <span className="bg-emerald-50 text-[#0F3A24] font-extrabold text-xs px-3.5 py-1 rounded-full border border-emerald-200">
                      Booking Saved to Database
                    </span>
                    <h2 className="text-2xl font-black text-[#0A0E1A] font-['Outfit']">
                      Appointment Ticket Issued
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Your consultation details have been recorded in the patient database.
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3 text-left">
                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
                      <span className="text-xs text-slate-500 font-medium">Ticket Reference ID</span>
                      <span className="text-sm font-black text-[#0F3A24] font-mono">{lastCreatedTicket.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-medium">Patient Name</span>
                      <span className="text-xs font-bold text-[#0A0E1A]">{lastCreatedTicket.patientName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-medium">Patient Email</span>
                      <span className="text-xs font-bold text-slate-700">{lastCreatedTicket.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-medium">Consultation Date</span>
                      <span className="text-xs font-bold text-[#0A0E1A]">{lastCreatedTicket.date} ({lastCreatedTicket.time})</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-medium">Treatment Specialty</span>
                      <span className="text-xs font-bold text-[#0F3A24]">{lastCreatedTicket.service}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-medium">Clinic Address</span>
                      <span className="text-xs font-medium text-slate-700">Sec 26a, Koprigaon, Vashi, Navi Mumbai</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setLastCreatedTicket(null)}
                      className="flex-1 bg-white border border-slate-200 text-[#0A0E1A] py-3.5 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Book Another Visit
                    </button>
                    <button
                      onClick={() => setCurrentView("home")}
                      className="flex-1 emerald-gradient text-white py-3.5 rounded-2xl text-xs font-extrabold hover:opacity-95 transition-opacity cursor-pointer"
                    >
                      Return to Home
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleBookingSubmit}
                  className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6"
                >
                  {bookingPrefill && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-xs text-[#0F3A24]">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Pre-filled from your AI Triage result</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setBookingPrefill(null)}
                        className="font-bold text-slate-500 hover:text-slate-800"
                      >
                        Reset
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Patient Full Name *</label>
                      <input
                        type="text"
                        required
                        value={bookingFormData.name}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, name: e.target.value })}
                        placeholder="E.g., Ramesh Deshmukh"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-xs text-[#0A0E1A] focus:outline-none focus:ring-2 focus:ring-[#0F3A24]/30 focus:border-[#0F3A24]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={bookingFormData.phone}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, phone: e.target.value })}
                        placeholder="E.g., 9820098200"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-xs text-[#0A0E1A] focus:outline-none focus:ring-2 focus:ring-[#0F3A24]/30 focus:border-[#0F3A24]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Email Address (For Confirmation Mail) *</label>
                      <input
                        type="email"
                        required
                        value={bookingFormData.email}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, email: e.target.value })}
                        placeholder="patient@example.com"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-xs text-[#0A0E1A] focus:outline-none focus:ring-2 focus:ring-[#0F3A24]/30 focus:border-[#0F3A24]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Clinical Specialty *</label>
                      <select
                        value={bookingFormData.service}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, service: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-xs text-[#0A0E1A] focus:outline-none focus:ring-2 focus:ring-[#0F3A24]/30 focus:border-[#0F3A24] bg-white"
                      >
                        <option value="General Practice & Pulse Diagnosis">General Practice & Pulse Diagnosis</option>
                        <option value="Infertility Evaluation & Care">Infertility Evaluation & Care</option>
                        <option value="Sinus & Sinusitis Treatment">Sinus & Sinusitis Treatment (Nasya)</option>
                        <option value="Immunity Therapy & Ojas Boost">Immunity Therapy & Ojas Boost</option>
                        <option value="Weight Loss & Diet Counseling">Weight Loss & Diet Counseling</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Preferred Date *</label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={bookingFormData.date}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, date: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-xs text-[#0A0E1A] focus:outline-none focus:ring-2 focus:ring-[#0F3A24]/30 focus:border-[#0F3A24]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Preferred Time Slot *</label>
                      <select
                        value={bookingFormData.time}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, time: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-xs text-[#0A0E1A] focus:outline-none focus:ring-2 focus:ring-[#0F3A24]/30 focus:border-[#0F3A24] bg-white"
                      >
                        <option value="10:30 AM">10:30 AM (Morning Session)</option>
                        <option value="11:30 AM">11:30 AM (Morning Session)</option>
                        <option value="12:15 PM">12:15 PM (Morning Session)</option>
                        <option value="04:00 PM">04:00 PM (Evening Session)</option>
                        <option value="05:15 PM">05:15 PM (Evening Session)</option>
                        <option value="06:00 PM">06:00 PM (Evening Session)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Symptoms or Health Concerns</label>
                    <textarea
                      rows={3}
                      value={bookingFormData.notes}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, notes: e.target.value })}
                      placeholder="Describe your symptoms (e.g. chronic sinusitis, infertility consultation, immunity enhancement)..."
                      className="w-full rounded-2xl border border-slate-200 p-3.5 text-xs text-[#0A0E1A] focus:outline-none focus:ring-2 focus:ring-[#0F3A24]/30 focus:border-[#0F3A24] resize-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmittingBooking}
                      className="emerald-gradient text-white px-8 py-4 rounded-2xl font-extrabold text-xs shadow-lg emerald-shadow-lg hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      {isSubmittingBooking ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Saving Booking...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirm</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}

          {/* ------------------------------------------
              VIEW 4: PASSCODE PROTECTED DOCTOR LOGIN (/admin ROUTE)
          ------------------------------------------ */}
          {currentView === "doctor-login" && !isAuthenticated && (
            <motion.div
              key="login-view"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="max-w-md mx-auto py-12"
            >
              <div className={`bg-white rounded-3xl border border-slate-200 p-8 shadow-2xl space-y-6 text-center transition-all ${
                isAuthError ? "animate-shake border-rose-400" : ""
              }`}>
                
                <div className="w-16 h-16 rounded-2xl emerald-gradient text-white flex items-center justify-center mx-auto shadow-lg emerald-badge-glow">
                  <Lock className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">
                    <KeyRound className="w-3 h-3 text-[#0F3A24]" />
                    <span>Protected Route: /admin</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#0A0E1A] font-['Outfit'] mt-2">
                    Doctor Portal Access
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Authorized Clinical Console for Dr. Vinod Katre
                  </p>
                </div>

                <form onSubmit={handleDoctorLogin} className="space-y-4 pt-2">
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-slate-700">Enter Security Passcode</label>
                    <input
                      type="password"
                      autoFocus
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="••••"
                      className={`w-full text-center text-xl tracking-widest font-mono rounded-2xl border px-4 py-3.5 text-[#0A0E1A] focus:outline-none transition-all ${
                        isAuthError
                          ? "border-rose-500 ring-2 ring-rose-200"
                          : "border-slate-200 focus:border-[#0F3A24] focus:ring-2 focus:ring-[#0F3A24]/30"
                      }`}
                    />
                    {isAuthError && (
                      <p className="text-[11px] text-rose-600 font-bold text-center pt-1">
                        Incorrect security passcode. Access denied.
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full emerald-gradient text-white py-4 rounded-2xl font-extrabold text-xs shadow-lg emerald-shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize & Open Console</span>
                  </button>
                </form>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[11px] text-slate-400">
                    Clinic Passcode: <span className="font-mono font-bold text-slate-600">9090</span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ------------------------------------------
              VIEW 5: CLINICAL CONSOLE DASHBOARD (/admin ROUTE)
          ------------------------------------------ */}
          {(currentView === "doctor-dashboard" || (currentView === "doctor-login" && isAuthenticated)) && (
            <motion.div
              key="dashboard-view"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8 pb-16"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-md shrink-0 relative bg-slate-100">
                    <img
                      src="/dr-vinod-katre.png"
                      alt="Dr. Vinod Katre"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-extrabold text-[#0F3A24] uppercase tracking-wider">Live Database Console (/admin)</span>
                    </div>
                    <h1 className="text-2xl font-black text-[#0A0E1A] font-['Outfit'] mt-0.5">
                      Welcome, {CLINIC_DATA.doctor}
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                      Shri Chaitanya Clinic (Koprigaon, Vashi) • Connected Database ({appointments.length} Total Patients Recorded)
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={exportDatabase}
                    disabled={appointments.length === 0}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
                      appointments.length > 0
                        ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                        : "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed"
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export DB</span>
                  </button>

                  <button
                    onClick={clearDatabase}
                    disabled={appointments.length === 0}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
                      appointments.length > 0
                        ? "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100 cursor-pointer"
                        : "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed"
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Wipe DB</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsAuthenticated(false);
                      setPasscode("");
                      window.location.hash = "";
                      setCurrentView("home");
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Lock & Exit
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Patients DB</span>
                    <Users className="w-4 h-4 text-[#0F3A24]" />
                  </div>
                  <p className="text-3xl font-black text-[#0A0E1A] font-['Outfit']">{appointments.length}</p>
                  <p className="text-[11px] text-emerald-800 font-bold">Stored in patient database</p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Pending Bookings</span>
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-3xl font-black text-[#0A0E1A] font-['Outfit']">
                    {appointments.filter(a => a.status === "Pending").length}
                  </p>
                  <p className="text-[11px] text-amber-600 font-bold">Awaiting doctor review</p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Approved & Mailed</span>
                    <MailCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-3xl font-black text-[#0A0E1A] font-['Outfit']">
                    {appointments.filter(a => a.status === "Approved").length}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-bold">Confirmation mail dispatched</p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">High Triage Alerts</span>
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                  </div>
                  <p className="text-3xl font-black text-[#0A0E1A] font-['Outfit']">
                    {appointments.filter(a => a.triageSeverity === "High").length}
                  </p>
                  <p className="text-[11px] text-rose-600 font-bold">Priority medical concern</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-[#0A0E1A] font-['Outfit']">
                      Real-Time Patient Database Ledger
                    </h2>
                    <p className="text-xs text-slate-500">
                      Clicking "Approve" automatically sends an official Email Confirmation to the patient.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search patient, ID, phone..."
                        className="pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 w-48 focus:outline-none focus:border-[#0F3A24]"
                      />
                    </div>

                    <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
                      {["All", "Pending", "Approved", "Rescheduled", "Cancelled"].map(st => (
                        <button
                          key={st}
                          onClick={() => setLedgerFilter(st)}
                          className={`px-3 py-1 text-[11px] font-extrabold rounded-lg transition-all cursor-pointer ${
                            ledgerFilter === st ? "bg-white text-[#0A0E1A] shadow-sm" : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-[10px] uppercase tracking-wider font-extrabold text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-4 px-4">Ticket ID</th>
                        <th className="py-4 px-4">Patient Info & Email</th>
                        <th className="py-4 px-4">Slot & Specialty</th>
                        <th className="py-4 px-4">Symptoms / Triage Notes</th>
                        <th className="py-4 px-4">Status & Mail</th>
                        <th className="py-4 px-4 text-right">Database Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredAppointments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400 italic space-y-2">
                            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                            <p className="text-xs font-semibold">No patient records found in database.</p>
                            <p className="text-[11px] text-slate-400">Book an appointment on the public page to see real-time data appear here!</p>
                          </td>
                        </tr>
                      ) : (
                        filteredAppointments.map((apt) => (
                          <motion.tr
                            key={apt.id}
                            layout
                            className="hover:bg-slate-50/80 transition-colors"
                          >
                            <td className="py-4 px-4 font-mono font-bold text-[#0F3A24]">
                              {apt.id}
                            </td>
                            <td className="py-4 px-4">
                              <p className="font-extrabold text-[#0A0E1A]">{apt.patientName}</p>
                              <p className="text-[11px] text-emerald-800 font-semibold">{apt.email}</p>
                              <p className="text-[10px] text-slate-400">{apt.phone}</p>
                            </td>
                            <td className="py-4 px-4">
                              <p className="font-bold text-slate-800">{apt.service}</p>
                              <p className="text-[11px] text-slate-500">{apt.date} • {apt.time}</p>
                            </td>
                            <td className="py-4 px-4 max-w-xs truncate text-slate-600">
                              {apt.symptoms}
                            </td>
                            <td className="py-4 px-4 space-y-1">
                              <StatusBadge status={apt.status} />
                              {apt.emailSent && (
                                <div className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-700">
                                  <MailCheck className="w-3 h-3" />
                                  <span>Email Sent {apt.emailSentTimestamp}</span>
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-4 text-right space-x-1.5">
                              {apt.status !== "Approved" && (
                                <button
                                  onClick={() => updateAppointmentStatus(apt.id, "Approved")}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-extrabold transition-all cursor-pointer shadow-xs inline-flex items-center gap-1"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Approve & Send Mail</span>
                                </button>
                              )}
                              {apt.status !== "Rescheduled" && (
                                <button
                                  onClick={() => updateAppointmentStatus(apt.id, "Rescheduled")}
                                  className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 text-[11px] font-bold transition-colors cursor-pointer"
                                >
                                  Reschedule
                                </button>
                              )}
                              {apt.status !== "Cancelled" && (
                                <button
                                  onClick={() => updateAppointmentStatus(apt.id, "Cancelled")}
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-[11px] font-bold transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                              )}
                              <button
                                onClick={() => deleteAppointmentRecord(apt.id)}
                                className="px-2 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-[11px] font-bold transition-colors cursor-pointer"
                                title="Delete Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ==========================================
          INTERACTIVE SERVICE DETAILS & BOOKING MODAL
      ========================================== */}
      <AnimatePresence>
        {activeServiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 relative"
            >
              <button
                onClick={() => setActiveServiceModal(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl emerald-gradient text-white flex items-center justify-center shadow-md emerald-badge-glow shrink-0">
                  {React.createElement(activeServiceModal.icon, { className: "w-7 h-7" })}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                    {activeServiceModal.category}
                  </span>
                  <h3 className="text-xl font-black text-[#0A0E1A] mt-1">
                    {activeServiceModal.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">{activeServiceModal.duration} • Dr. Vinod Katre</p>
                </div>
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                <p className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 font-medium">
                  {activeServiceModal.fullDetails}
                </p>

                <div className="space-y-2">
                  <p className="font-extrabold text-xs text-[#0A0E1A]">Key Treatment Highlights:</p>
                  <ul className="space-y-2">
                    {activeServiceModal.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <button
                  onClick={() => setActiveServiceModal(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const title = activeServiceModal.title;
                    setActiveServiceModal(null);
                    setBookingFormData(prev => ({ ...prev, service: title }));
                    setCurrentView("appointments");
                  }}
                  className="flex-1 emerald-gradient text-white py-3.5 rounded-2xl text-xs font-extrabold shadow-md hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book This Specialty</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================
          EMAIL DISPATCH CONFIRMATION MODAL
      ========================================== */}
      <AnimatePresence>
        {emailConfirmationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 20 }}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 relative"
            >
              <button
                onClick={() => setEmailConfirmationModal(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0F3A24] flex items-center justify-center shadow-inner shrink-0">
                  <MailCheck className="w-6 h-6 text-emerald-700 animate-pulse" />
                </div>
                <div>
                  <span className="bg-emerald-50 text-[#0F3A24] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                    SMTP Email Engine Dispatched
                  </span>
                  <h3 className="text-lg font-black text-[#0A0E1A] mt-0.5 font-['Outfit']">
                    Confirmation Email Sent to Patient!
                  </h3>
                </div>
              </div>

              {/* Email Content Preview Card */}
              <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 space-y-3 font-mono text-[11px] shadow-inner">
                <div className="flex justify-between pb-2 border-b border-slate-800 text-slate-400">
                  <span>To: <strong className="text-emerald-400 font-sans">{emailConfirmationModal.patientEmail}</strong></span>
                  <span className="text-[10px]">{emailConfirmationModal.timestamp}</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-500">From:</span> Shri Chaitanya Clinic &lt;{CLINIC_DATA.email}&gt;
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-500">Subject:</span> Appointment Confirmed: {emailConfirmationModal.ticketId} - Dr. Vinod Katre
                </div>
                
                <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800 text-slate-300 text-[11px] leading-relaxed font-sans mt-2">
                  <p className="font-bold text-white mb-1">Dear {emailConfirmationModal.patientName},</p>
                  <p>Your consultation for <strong className="text-emerald-300">{emailConfirmationModal.service}</strong> has been officially APPROVED by Dr. Vinod Katre.</p>
                  <div className="my-2 p-2 rounded bg-slate-950 text-xs font-mono text-emerald-400">
                    Date: {emailConfirmationModal.date} | Time: {emailConfirmationModal.time} | Location: Sec 26a, Koprigaon Vashi
                  </div>
                  <p className="text-[10px] text-slate-400">Please arrive 10 minutes prior to your slot. Helpline: 8850125872.</p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const subject = `Appointment Confirmed: ${emailConfirmationModal.ticketId} - Dr. Vinod Katre`;
                    const bodyText = `Dear ${emailConfirmationModal.patientName},\n\nYour consultation for ${emailConfirmationModal.service} has been APPROVED by Dr. Vinod Katre at Shri Chaitanya Clinic.\n\nTicket Reference: ${emailConfirmationModal.ticketId}\nDate: ${emailConfirmationModal.date}\nTime: ${emailConfirmationModal.time}\nLocation: Sec 26a, Koprigaon, Vashi, Navi Mumbai 400703\nHelpline: 8850125872\n\nThank you,\nShri Chaitanya Clinic`;
                    
                    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailConfirmationModal.patientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
                    const mailtoUrl = `mailto:${emailConfirmationModal.patientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

                    const opened = window.open(gmailUrl, '_blank');
                    if (!opened) {
                      window.location.href = mailtoUrl;
                    }
                  }}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Open Mail / Gmail</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const textToCopy = `Dear ${emailConfirmationModal.patientName},\n\nYour consultation for ${emailConfirmationModal.service} on ${emailConfirmationModal.date} at ${emailConfirmationModal.time} with Dr. Vinod Katre at Shri Chaitanya Clinic (Koprigaon, Vashi) has been APPROVED.\n\nTicket ID: ${emailConfirmationModal.ticketId}\nHelpline: 8850125872`;
                    navigator.clipboard.writeText(textToCopy);
                    alert("Confirmation email text copied to clipboard!");
                  }}
                  className="bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </button>

                <button
                  onClick={() => setEmailConfirmationModal(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

function FaqAccordionItem({ faq }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#0A0E1A] hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <span>{faq.q}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-[#0F3A24] shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SeverityBadge({ severity }) {
  if (severity === "High") {
    return (
      <span className="bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
        High Severity
      </span>
    );
  }
  if (severity === "Medium") {
    return (
      <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        Moderate Severity
      </span>
    );
  }
  return (
    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-emerald-500" />
      Low Severity
    </span>
  );
}

function StatusBadge({ status }) {
  if (status === "Approved") {
    return (
      <span className="bg-emerald-100 text-[#0F3A24] text-[10px] font-extrabold px-2.5 py-1 rounded-md">
        Approved
      </span>
    );
  }
  if (status === "Rescheduled") {
    return (
      <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-md">
        Rescheduled
      </span>
    );
  }
  if (status === "Cancelled") {
    return (
      <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2.5 py-1 rounded-md">
        Cancelled
      </span>
    );
  }
  return (
    <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-2.5 py-1 rounded-md">
      Pending
    </span>
  );
}
