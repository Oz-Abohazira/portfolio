// Project data structure for the code-driven narrative portfolio
// This file centralizes all project information and makes it easy to add new projects

import { Project } from '@/types';

// Main projects data - based on professional experience
export const projects: Project[] = [
  {
    id: 'monitoring-system',
    name: 'Centralized System Monitoring Application',
    status: 'completed',
    description: 'Designed and implemented a centralized monitoring application that tracked every site and device, generated automated reports, and provided real-time system health statistics across the state.',
    technologies: ['Python', 'System Monitoring', 'Automated Reports', 'Real-time Analytics', 'Network Configuration', 'Health Statistics'],
    debugCommand: 'show --monitoring-system',
    codeSnippet: `
def validate_time_format(time_str):
    """Validate time format (HH:MM in 24-hour format) for single or comma-separated times"""
    times = [t.strip() for t in time_str.split(',')]
    pattern = r'^([01]?[0-9]|2[0-3]):([0-5][0-9])$'
    return all(bool(re.match(pattern, time)) for time in times)


def setup_scheduler():
    """Setup the daily scheduler with multiple times"""
    global SCHEDULE_ENABLED, SCHEDULE_JOBS
    if SCHEDULE_ENABLED and EMAIL_CONFIG:
        # Clear existing schedules and job tracking
        schedule.clear()
        SCHEDULE_JOBS.clear()

        # Get scheduled times from config, default to 17:30 if not set
        scheduled_times = EMAIL_CONFIG.get('scheduled_time', '17:30')

        # Split comma-separated times
        times_list = [t.strip() for t in scheduled_times.split(',')]

        # Validate and schedule each time
        valid_times = []
        for time_str in times_list:
            if validate_time_format(time_str):
                valid_times.append(time_str)
                # Create unique job identifier to prevent duplicates
                job_id = f"daily_report_{time_str.replace(':', '')}"
                if job_id not in SCHEDULE_JOBS:
                    job = schedule.every().day.at(time_str).do(generate_scheduled_report_wrapper, time_str)
                    SCHEDULE_JOBS[job_id] = job
            else:
                print(f"Invalid time format '{time_str}', skipping")

        if valid_times:
            print(f"Scheduler configured for daily reports at: {', '.join(valid_times)}")
        else:
            print("No valid times configured, using default 17:30")
            job = schedule.every().day.at('17:30').do(generate_scheduled_report_wrapper, '17:30')
            SCHEDULE_JOBS['daily_report_1730'] = job


def run_scheduler():
    """Run the scheduler in a separate thread with better control"""
    global SCHEDULE_ENABLED
    last_minute = None

    while SCHEDULE_ENABLED:
        try:
            current_minute = datetime.now().strftime('%H:%M')

            # Only run pending jobs once per minute
            if current_minute != last_minute:
                schedule.run_pending()
                last_minute = current_minute

            threading.Event().wait(30)  # Check every 30 seconds instead of 60

        except Exception as e:
            print(f"Scheduler error: {e}")
            threading.Event().wait(60)`,
    completionPercentage: 100,
    images: [
      '/monitor/monitor-1.png', // Dashboard screenshot
      '/monitor/monitor-2.png', // Reports interface
      '/monitor/monitor-3.png'  // System monitoring view
    ]
  },
  
  {
    id: 'sitekick-website-generator',
    name: 'Websites Generation and Deployment',
    status: 'completed',
    description: 'A Comprehensive backend API for generating and managing multi-page websites for local service businesses. Sitekick automatically creates professional websites with location-specific content, service pages, contact forms and admin controls with a powerful multi-template system and advanced google SEO optimizations.',
    technologies: ['Node.js', 'Express.js', 'Vercel API', 'HTML5/CSS3', 'JavaScript ES6+', 'SMTP Integration', 'Template Engine', 'SEO Optimization'],
    debugCommand: 'show --sitekick-website-generator',
    codeSnippet: `
// Initialize Vercel API client
function initializeVercelAPI() {
  const vercelConfig = getVercelConfig();
  const VERCEL_API_TOKEN = vercelConfig.VERCEL_API_TOKEN;
  const TEAM_ID = vercelConfig.TEAM_ID;
  
  if (!VERCEL_API_TOKEN || !TEAM_ID) {
    throw new Error(
      "Missing Vercel API token or Team ID. Please set VERCEL_API_TOKEN and TEAM_ID in your environment."
    );
  }
  
  vercelAPI = axios.create({
    baseURL: "https://api.vercel.com",
    headers: {
      Authorization: 'Bearer $\{VERCEL_API_TOKEN\}',
      "Content-Type": "application/json",
    },
  });
  
  return { VERCEL_API_TOKEN, TEAM_ID };
}
/**
 * Generate site configuration for a given subdomain and city
 */
function generateSiteConfig(subdomain, city, state, business_name) {
  // Get unique content variations for this site
  const uniqueContent = generateUniqueContent(city, subdomain);

  // Return the site configuration with all pages
  return {
    subdomain: subdomain,
    city: city,
    state: state,
    business_name: business_name,
    uniqueContent: uniqueContent
  };
}
  function generateSitemap(baseUrl, city, state, business_name, logoUrl) {
  const currentDate = new Date().toISOString();

  return \`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

    <!-- Homepage - Highest Priority -->
    <url>
        <loc>\${baseUrl}/</loc>
        <lastmod>\${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
        <image:image>
            <image:loc>\${logoUrl || "https:// \`
`,
    completionPercentage: 100,
    images: [
      '/sitekick/sitekick-1.png', // API dashboard screenshot
      '/sitekick/sitekick-2.png', // Template system screenshot
      '/sitekick/sitekick-3.png'  // Deployment interface screenshot
    ]
  },

  {
    id: 'mobile-crm',
    name: 'Wellnest',
    status: 'in-progress',
    description: 'A dual-interface mobile appointment management app designed for independent beauty and wellness professionals. SlotSpot enables business owners to manage clients, schedules, and automated follow-ups through an intuitive dashboard, while clients can self-book appointments via shared links with SMS verification—no app downloads or account creation required. Features smart client management, visual calendar scheduling, automated reminders, and service history tracking optimized for non-technical users',
    technologies: ['Ionic 7+', 'Angular 17+', 'TypeScript', 'Capacitor', 'SCSS/CSS3', 'PWA', 'Push Notifications'],
    debugCommand: 'show --mobile-crm',
    codeSnippet: `
  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private clientService: ClientService,
    private appointmentService: AppointmentService,
    private serviceService: ServiceService,
    private toastController: ToastController
  ) {
    addIcons({
      close,
      person,
      cut,
      calendar,
      timeOutline,
      documentText,
      checkmark,
      time,
    });

    this.appointmentForm = this.formBuilder.group({
      clientId: ['', Validators.required],
      serviceId: ['', Validators.required],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      duration: [60, [Validators.required, Validators.min(15)]],
      price: [0, [Validators.required, Validators.min(0)]],
      notes: [''],
    });
  }

  ngOnInit() {
    this.loadClients();
    this.loadServices();
    this.setupFormValidation();
    this.generateTimeSlots(); // Generate initial time slots

    if (this.appointment) {
      this.isEditMode = true;
      this.populateForm();
    } else {
      this.setInitialValues();
    }

    // Set initial focus after view is initialized
    setTimeout(() => this.setInitialFocus(), 100);

    // Add keyboard event listeners for accessibility
    this.setupKeyboardListeners();
  }

  ngAfterViewInit() {
    // Additional focus management after view is fully initialized
    setTimeout(() => {
      this.ensureModalFocus();
    }, 200);
  }

  ngOnDestroy() {
    // Clean up keyboard listeners
    this.removeKeyboardListeners();
    // Unsubscribe from internal subscriptions
    this.subscriptions.unsubscribe();
  }

  private loadClients() {
    const sub = this.clientService.clients$.subscribe((clients) => {
      this.clients = clients;
    });
    this.subscriptions.add(sub);
  }

  private loadServices() {
    const sub = this.serviceService.services$.subscribe((services) => {
      this.services = services;
    });
    this.subscriptions.add(sub);
  }

  private setupFormValidation() {
    // Update price when service changes
    const sub = this.appointmentForm
      .get('serviceId')
      ?.valueChanges.subscribe((serviceId) => {
        const service = this.services.find((s) => s.id === serviceId);
        if (service) {
          this.appointmentForm.patchValue({
            duration: service.duration,
            price: service.price,
          });
        }
      });
    if (sub) this.subscriptions.add(sub);
  }`,
    completionPercentage: 85,
    images: [
      '/crm/dashboard.png',
      '/crm/calendar.png',
      '/crm/edit-appt.png',
      '/crm/settings.png',
    ],
  }
];

// Available debug commands
export const debugCommands = [
  'show --commands',
  'show --help',
  'show --about',
  'show --skills',
  'show --contact',
  ...projects.map(p => p.debugCommand.replace('debug', 'show')),
  '--clear',
  'reset-progress',
  'show --history'
];

// Command descriptions for help output
export const commands = [
  { command: 'show --about', description: 'View personal information and bio' },
  { command: 'show --skills', description: 'View technical skills and expertise' },
  { command: 'show --contact', description: 'View contact information' },
  ...projects.map(p => ({ 
    command: p.debugCommand.replace('debug', 'show'), 
    description: `View ${p.name} project details` 
  })),
  { command: '--clear', description: 'Clear terminal and reset to initial state' },
  { command: 'reset-progress', description: 'Reset puzzle and contact challenge progress' },
  { command: 'show --help', description: 'Display available commands' }
];

// Personal information (easily customizable)
export const personalInfo = {
  name: 'Oz Abohazira',
  title: 'Full Stack Software Developer',
  bio: 'Results-driven software developer with 9+ years of experience delivering high-impact solutions across web, enterprise, and system environments. Skilled in full-stack development, process automation, and complex system integration, with a proven record of reducing operational timelines, optimizing workflows, and building custom tools that improve efficiency.',
  location: 'Dunwoody, GA 30338',
  phone: '470 784 9378',
  skills: {
    'Frontend Technologies': [
      'Vanilla JavaScript',
      'TypeScript',
      'React',
      'Angular',
      'HTML/CSS/SCSS',
      'Bootstrap',
      'Tailwind CSS'
    ],
    'Backend Development': [
      'REST API',
      'Serverless Applications',
      'Next.js',
      'Python',
      'C# and .NET',
      'Java',
      'Node.js'
    ],
    'Database & Storage': [
      'MongoDB',
      'Firebase',
    ],
    'Integration & Tools': [
      'System Monitoring',
      'Process Automation',
      'Networking',
      'Git',
      'Jira',
    ],
    'Leadership & Management': [
      'Project Management',
      'Team Leadership',
      'Staff Training',
      'Problem Solving'
    ]
  },
  contact: {
    email: 'ozabohaziradev@gmail.com',
    linkedin: 'https://www.linkedin.com/in/oz-abohazira-86812119a',
    github: 'https://github.com/oz-abohazira',
    portfolio: 'https://ozabohazira.dev'
  }
};
