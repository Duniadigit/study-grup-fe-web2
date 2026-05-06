import { User, Group, Member, Overview, Task, ChecklistItem } from '../types';

export const DUMMY_USERS: User[] = [
  { id: 'u1', name: 'Andi Pratama', email: 'andi@mail.com' },
  { id: 'u2', name: 'Budi Santoso', email: 'budi@mail.com' },
  { id: 'u3', name: 'Citra Dewi', email: 'citra@mail.com' },
  { id: 'u4', name: 'Dina Rahma', email: 'dina@mail.com' },
];

export const CURRENT_USER: User = DUMMY_USERS[0];

export const DUMMY_GROUPS: Group[] = [
  {
    id: 'g1',
    name: 'Tugas Besar PABP',
    description: 'Membuat aplikasi multiplatform dengan React Native dan React',
    creator_id: 'u1',
    deadline: '2025-06-30',
    status: 'active',
    member_count: 4,
  },
  {
    id: 'g2',
    name: 'Proyek Basis Data',
    description: 'Desain dan implementasi database untuk sistem perpustakaan',
    creator_id: 'u2',
    deadline: '2025-06-15',
    status: 'active',
    member_count: 3,
  },
  {
    id: 'g3',
    name: 'Tugas Jaringan Komputer',
    description: 'Konfigurasi jaringan dan simulasi dengan Cisco Packet Tracer',
    creator_id: 'u1',
    deadline: '2025-05-20',
    status: 'active',
    member_count: 2,
  },
];

export const DUMMY_MEMBERS: Record<string, Member[]> = {
  g1: [
    { id: 'u1', name: 'Andi Pratama', email: 'andi@mail.com', role: 'creator' },
    { id: 'u2', name: 'Budi Santoso', email: 'budi@mail.com', role: 'member' },
    { id: 'u3', name: 'Citra Dewi', email: 'citra@mail.com', role: 'member' },
    { id: 'u4', name: 'Dina Rahma', email: 'dina@mail.com', role: 'member' },
  ],
  g2: [
    { id: 'u2', name: 'Budi Santoso', email: 'budi@mail.com', role: 'creator' },
    { id: 'u1', name: 'Andi Pratama', email: 'andi@mail.com', role: 'member' },
    { id: 'u3', name: 'Citra Dewi', email: 'citra@mail.com', role: 'member' },
  ],
  g3: [
    { id: 'u1', name: 'Andi Pratama', email: 'andi@mail.com', role: 'creator' },
    { id: 'u4', name: 'Dina Rahma', email: 'dina@mail.com', role: 'member' },
  ],
};

export const DUMMY_OVERVIEWS: Record<string, Overview> = {
  g1: {
    id: 'ov1',
    group_id: 'g1',
    content: `Tugas Besar Mata Kuliah Pengembangan Aplikasi Berbasis Platform.\n\nTujuan:\nMembuat aplikasi multiplatform yang berjalan di minimal 2 platform berbeda dengan 1 backend yang sama.\n\nKetentuan:\n- Fitur autentikasi (register & login)\n- Minimal 1 platform-specific feature per platform\n- Dokumentasi teknis lengkap\n- Video demo 5-10 menit\n\nDeadline: 30 Juni 2025`,
    attachment_url: null,
    updated_at: '2025-04-01T10:00:00Z',
  },
  g2: {
    id: 'ov2',
    group_id: 'g2',
    content: 'Merancang skema database untuk sistem perpustakaan digital.',
    attachment_url: null,
    updated_at: '2025-04-02T09:00:00Z',
  },
};

export const DUMMY_TASKS: Record<string, Task[]> = {
  g1: [
    {
      id: 't1', group_id: 'g1',
      title: 'Setup project React Native',
      description: 'Inisialisasi project Expo, install dependencies, dan buat struktur folder.',
      assigned_to: 'u1', assigned_to_name: 'Andi Pratama',
      priority: 'high', status: 'done', due_date: '2025-04-10',
    },
    {
      id: 't2', group_id: 'g1',
      title: 'Desain database schema',
      description: 'Buat ERD dan SQL schema untuk semua tabel yang dibutuhkan.',
      assigned_to: 'u2', assigned_to_name: 'Budi Santoso',
      priority: 'high', status: 'done', due_date: '2025-04-12',
    },
    {
      id: 't3', group_id: 'g1',
      title: 'Implementasi fitur autentikasi',
      description: 'Register, login, dan logout dengan JWT token.',
      assigned_to: 'u2', assigned_to_name: 'Budi Santoso',
      priority: 'high', status: 'in_progress', due_date: '2025-04-20',
    },
    {
      id: 't4', group_id: 'g1',
      title: 'Implementasi offline mode mobile',
      description: 'Integrasi SQLite untuk cache data lokal dan sync queue.',
      assigned_to: 'u1', assigned_to_name: 'Andi Pratama',
      priority: 'high', status: 'in_progress', due_date: '2025-04-25',
    },
    {
      id: 't5', group_id: 'g1',
      title: 'Integrasi kamera di mobile',
      description: 'Tambahkan fitur ambil foto dan upload sebagai bukti task.',
      assigned_to: 'u1', assigned_to_name: 'Andi Pratama',
      priority: 'medium', status: 'todo', due_date: '2025-05-05',
    },
    {
      id: 't6', group_id: 'g1',
      title: 'Testing & bug fixing',
      description: 'End-to-end testing di semua platform dan perbaikan bug.',
      assigned_to: 'u4', assigned_to_name: 'Dina Rahma',
      priority: 'medium', status: 'todo', due_date: '2025-05-15',
    },
  ],
  g2: [
    {
      id: 't7', group_id: 'g2',
      title: 'Buat ERD sistem perpustakaan',
      description: 'Entity Relationship Diagram lengkap.',
      assigned_to: 'u2', assigned_to_name: 'Budi Santoso',
      priority: 'high', status: 'done', due_date: '2025-04-08',
    },
    {
      id: 't8', group_id: 'g2',
      title: 'Implementasi stored procedure',
      description: 'Buat stored procedure untuk peminjaman dan pengembalian buku.',
      assigned_to: 'u1', assigned_to_name: 'Andi Pratama',
      priority: 'medium', status: 'in_progress', due_date: '2025-04-20',
    },
  ],
  g3: [
    {
      id: 't9', group_id: 'g3',
      title: 'Setup topologi di Packet Tracer',
      description: 'Buat topologi star dengan 1 switch dan 5 PC.',
      assigned_to: 'u1', assigned_to_name: 'Andi Pratama',
      priority: 'high', status: 'in_progress', due_date: '2025-04-15',
    },
  ],
};

export const DUMMY_CHECKLISTS: Record<string, ChecklistItem[]> = {
  t3: [
    { id: 'c1', task_id: 't3', item: 'Buat endpoint POST /auth/register', completed: true },
    { id: 'c2', task_id: 't3', item: 'Buat endpoint POST /auth/login', completed: true },
    { id: 'c3', task_id: 't3', item: 'Implementasi JWT middleware', completed: false },
    { id: 'c4', task_id: 't3', item: 'Test di Postman', completed: false },
  ],
  t4: [
    { id: 'c5', task_id: 't4', item: 'Setup expo-sqlite', completed: true },
    { id: 'c6', task_id: 't4', item: 'Buat tabel tasks lokal', completed: true },
    { id: 'c7', task_id: 't4', item: 'Implementasi sync queue', completed: false },
    { id: 'c8', task_id: 't4', item: 'Test offline mode', completed: false },
  ],
  t5: [
    { id: 'c9', task_id: 't5', item: 'Install expo-image-picker', completed: false },
    { id: 'c10', task_id: 't5', item: 'Request camera permission', completed: false },
    { id: 'c11', task_id: 't5', item: 'Upload foto ke server', completed: false },
  ],
};
