// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  clinicId: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'owner' | 'admin' | 'instructor' | 'receptionist';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  clinicName: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// ─── Clinic ──────────────────────────────────────────────────────────────────

export interface Clinic {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  phone?: string;
  email?: string;
  address?: Address;
  timezone: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// ─── Client ──────────────────────────────────────────────────────────────────

export interface Client {
  id: string;
  clinicId: string;
  name: string;
  email?: string;
  phone: string;
  cpf?: string;
  birthDate?: string;
  gender?: 'M' | 'F' | 'other';
  avatarUrl?: string;
  address?: Address;
  notes?: string;
  tags?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientStats {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalRevenue: number;
  lastAppointment?: string;
  nextAppointment?: string;
  activePackages: number;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export interface Service {
  id: string;
  clinicId: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  color: string;
  category: ServiceCategory;
  isActive: boolean;
  maxCapacity: number;
  instructorIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ServiceCategory =
  | 'martial_arts'
  | 'physiotherapy'
  | 'personal_training'
  | 'yoga'
  | 'pilates'
  | 'other';

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  martial_arts: 'Artes Marciais',
  physiotherapy: 'Fisioterapia',
  personal_training: 'Personal Training',
  yoga: 'Yoga',
  pilates: 'Pilates',
  other: 'Outros',
};

// ─── Space / Room ────────────────────────────────────────────────────────────

export interface Space {
  id: string;
  clinicId: string;
  name: string;
  description?: string;
  capacity: number;
  color: string;
  amenities?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Appointment ─────────────────────────────────────────────────────────────

export interface Appointment {
  id: string;
  clinicId: string;
  clientId: string;
  client?: Client;
  serviceId: string;
  service?: Service;
  instructorId?: string;
  instructor?: User;
  spaceId?: string;
  space?: Space;
  startTime: string; // ISO 8601
  endTime: string;   // ISO 8601
  status: AppointmentStatus;
  notes?: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  price: number;
  packageId?: string;
  recurrenceId?: string;
  recurrence?: RecurrenceRule;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'waived';

export type PaymentMethod = 'cash' | 'pix' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'package';

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  scheduled: 'Agendado',
  confirmed: 'Confirmado',
  in_progress: 'Em Andamento',
  completed: 'Concluído',
  cancelled: 'Cancelado',
  no_show: 'Faltou',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  refunded: 'Reembolsado',
  waived: 'Isento',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Dinheiro',
  pix: 'PIX',
  credit_card: 'Cartão de Crédito',
  debit_card: 'Cartão de Débito',
  bank_transfer: 'Transferência',
  package: 'Pacote',
};

export interface CreateAppointmentRequest {
  clientId: string;
  serviceId: string;
  instructorId?: string;
  spaceId?: string;
  startTime: string;
  notes?: string;
  paymentMethod?: PaymentMethod;
  recurrence?: RecurrenceRule;
}

export interface UpdateAppointmentRequest {
  startTime?: string;
  status?: AppointmentStatus;
  notes?: string;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
}

// ─── Recurrence ──────────────────────────────────────────────────────────────

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  daysOfWeek?: number[]; // 0=Sun, 1=Mon, ...
  endDate?: string;
  occurrences?: number;
}

// ─── Package ─────────────────────────────────────────────────────────────────

export interface Package {
  id: string;
  clinicId: string;
  name: string;
  description?: string;
  serviceId: string;
  service?: Service;
  totalSessions: number;
  price: number;
  validityDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientPackage {
  id: string;
  clinicId: string;
  clientId: string;
  client?: Client;
  packageId: string;
  package?: Package;
  purchaseDate: string;
  expiryDate: string;
  totalSessions: number;
  usedSessions: number;
  remainingSessions: number;
  price: number;
  paymentStatus: PaymentStatus;
  isActive: boolean;
}

// ─── Financial ───────────────────────────────────────────────────────────────

export interface Transaction {
  id: string;
  clinicId: string;
  appointmentId?: string;
  clientPackageId?: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  method?: PaymentMethod;
  date: string;
  createdAt: string;
}

export interface RevenueStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  lastMonth: number;
  growthPercent: number;
}

export interface DashboardStats {
  appointmentsToday: number;
  appointmentsTodayChange: number;
  revenueThisMonth: number;
  revenueChange: number;
  attendanceRate: number;
  attendanceRateChange: number;
  activeClients: number;
  activeClientsChange: number;
}

export interface RevenueChartData {
  month: string;
  revenue: number;
  appointments: number;
}

// ─── Business Hours ──────────────────────────────────────────────────────────

export interface BusinessHours {
  dayOfWeek: number; // 0=Sun
  isOpen: boolean;
  openTime: string;  // "HH:mm"
  closeTime: string; // "HH:mm"
}

// ─── Calendar ────────────────────────────────────────────────────────────────

export type CalendarView = 'day' | 'week' | 'month';

export interface CalendarSlot {
  date: Date;
  hour: number;
  minute: number;
}

// ─── API Pagination ──────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

// ─── Filters ─────────────────────────────────────────────────────────────────

export interface AppointmentFilters {
  startDate?: string;
  endDate?: string;
  clientId?: string;
  serviceId?: string;
  instructorId?: string;
  spaceId?: string;
  status?: AppointmentStatus;
  paymentStatus?: PaymentStatus;
}

export interface ClientFilters {
  search?: string;
  isActive?: boolean;
  tags?: string[];
  page?: number;
  limit?: number;
}
